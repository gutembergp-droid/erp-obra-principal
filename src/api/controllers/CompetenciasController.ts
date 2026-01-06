import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { CompetenciaService } from '../../services/CompetenciaService';
import { AuditService } from '../../services/AuditService';
import { ok, created, notFound, fail } from '../utils/apiResponse';
import { getObraAtivaFromUser } from '../middlewares/validateObra';

export class CompetenciasController {
  private competenciaService: CompetenciaService;
  private auditService: AuditService;

  constructor(prisma: PrismaClient) {
    this.competenciaService = new CompetenciaService(prisma);
    this.auditService = new AuditService(prisma);
  }

  /**
   * GET /api/competencias
   * Lista competências por obra (usa obra ativa ou obra_id)
   */
  async listCompetencias(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let obraId = req.query.obra_id as string | undefined;

      // Se não fornecido, usa obra ativa
      if (!obraId) {
        const obraAtivaId = await getObraAtivaFromUser(req, res);
        if (!obraAtivaId) {
          return; // getObraAtivaFromUser já enviou resposta
        }
        obraId = obraAtivaId;
      }

      const competencias = await this.competenciaService.listCompetenciasByObra(obraId);
      ok(res, competencias);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/competencias/atual
   * Busca competência atual (aberta) da obra ativa
   */
  async getCompetenciaAtual(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const obraId = await getObraAtivaFromUser(req, res);
      if (!obraId) {
        return;
      }

      const competencia = await this.competenciaService.getCompetenciaAtiva(obraId);

      if (!competencia) {
        notFound(res, 'Nenhuma competência aberta encontrada para esta obra');
        return;
      }

      ok(res, competencia);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/competencias/:id
   * Busca competência por ID
   */
  async getCompetenciaById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const competencia = await this.competenciaService.getCompetenciaById(req.params.id);

      if (!competencia) {
        notFound(res, `Competência com ID ${req.params.id} não encontrada`);
        return;
      }

      ok(res, competencia);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/competencias/:id/status
   * Status consolidado: gates + pendências de bloqueio
   */
  async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dados = await this.competenciaService.listarGatesComTravas(req.params.id);

      ok(res, {
        competencia: {
          id: dados.competencia.id,
          obra_id: dados.competencia.obra_id,
          periodo: dados.competencia.periodo,
          status: dados.competencia.status,
          aberta_em: dados.competencia.aberta_em,
          fechada_em: dados.competencia.fechada_em,
        },
        gates: dados.gates.map(gate => ({
          numero: gate.numero,
          nome: gate.nome,
          status: gate.status,
          trava: gate.trava,
          aprovado_em: gate.aprovado_em,
          rejeitado_em: gate.rejeitado_em,
          motivo_rejeicao: gate.motivo_rejeicao,
          observacoes: gate.observacoes,
        })),
        travas: dados.travas,
        pode_concluir: dados.pode_concluir,
      });
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  }

  /**
   * POST /api/competencias/abrir
   * Abre uma nova competência mensal e cria os 9 gates automaticamente
   */
  async abrirCompetencia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let obraId = req.body.obra_id as string | undefined;

      // Se não fornecido, usa obra ativa
      if (!obraId) {
        const obraAtivaId = await getObraAtivaFromUser(req, res);
        if (!obraAtivaId) {
          return;
        }
        obraId = obraAtivaId;
      }

      const { periodo } = req.body;

      if (!periodo) {
        fail(res, 'Campo "periodo" é obrigatório (formato: YYYY-MM)', 400);
        return;
      }

      const usuarioId = (req as any).user?.id || '';

      const competencia = await this.competenciaService.abrirCompetencia(obraId, periodo);
      
      // Registra evento de auditoria
      if (usuarioId) {
        this.auditService.registrarEvento({
          obra_id: obraId,
          usuario_id: usuarioId,
          entity_type: 'CompetenciaMensal',
          entity_id: competencia.id,
          action: 'OPEN',
          payload: {
            periodo,
            gates_criados: 9,
          },
        }).catch(err => console.error('Erro ao registrar evento de auditoria:', err));
      }

      created(res, competencia);
    } catch (error: any) {
      if (error.code === 'PERIODO_DUPLICADO' || error.code === 'COMPETENCIA_ABERTA_EXISTENTE') {
        fail(res, error.message, 409);
      } else {
        next(error);
      }
    }
  }

  /**
   * POST /api/competencias/:id/fechar
   * Fecha uma competência (valida gates obrigatórios)
   */
  async fecharCompetencia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = (req as any).user?.id;

      if (!usuarioId) {
        fail(res, 'Não autenticado', 401);
        return;
      }

      const resultado = await this.competenciaService.concluirCompetencia(req.params.id, usuarioId);
      
      // Registra evento de auditoria (o service já registra, mas garantimos aqui também)
      this.auditService.registrarEvento({
        obra_id: null, // Será preenchido pelo service
        usuario_id: usuarioId,
        entity_type: 'CompetenciaMensal',
        entity_id: req.params.id,
        action: 'CLOSE',
        payload: {
          fechada_em: resultado.fechada_em,
        },
      }).catch(err => console.error('Erro ao registrar evento de auditoria:', err));

      ok(res, resultado);
    } catch (error: any) {
      if (error.code === 'GATE_DEPENDENCY' || error.code === 'COMPETENCIA_FECHADA') {
        fail(res, error.message, 409, error.details);
      } else if (error.message.includes('não encontrada')) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  }

  /**
   * GET /api/competencias/:id/gates
   * Lista gates de uma competência
   */
  async listGates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dados = await this.competenciaService.listarGatesComTravas(req.params.id);

      ok(res, dados.gates.map(gate => ({
        id: gate.id,
        numero: gate.numero,
        nome: gate.nome,
        status: gate.status,
        trava: gate.trava,
        aprovado_em: gate.aprovado_em,
        rejeitado_em: gate.rejeitado_em,
        motivo_rejeicao: gate.motivo_rejeicao,
        observacoes: gate.observacoes,
      })));
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  }

  /**
   * POST /api/competencias/:id/gates/:gateId/approve
   * Aprova um gate
   */
  async approveGate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = (req as any).user?.id;

      if (!usuarioId) {
        fail(res, 'Não autenticado', 401);
        return;
      }

      const numero = parseInt(req.params.gateId, 10);
      if (isNaN(numero) || numero < 1 || numero > 9) {
        fail(res, 'Número do gate deve ser entre 1 e 9', 400);
        return;
      }

      const { observacoes } = req.body;

      const gate = await this.competenciaService.aprovarGate(
        req.params.id,
        numero,
        usuarioId,
        observacoes
      );

      // Registra evento de auditoria (o service já registra, mas garantimos aqui também)
      this.auditService.registrarEvento({
        obra_id: null, // Será preenchido pelo service
        usuario_id: usuarioId,
        entity_type: 'CompetenciaGate',
        entity_id: gate.id,
        action: 'APPROVE',
        payload: {
          competencia_id: req.params.id,
          gate_numero: numero,
          observacoes,
        },
      }).catch(err => console.error('Erro ao registrar evento de auditoria:', err));

      ok(res, gate);
    } catch (error: any) {
      if (error.code === 'GATE_DEPENDENCY' || error.code === 'COMPETENCIA_FECHADA') {
        fail(res, error.message, 409);
      } else if (error.message.includes('não encontrado')) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  }

  /**
   * POST /api/competencias/:id/gates/:gateId/reject
   * Rejeita um gate (com motivo)
   */
  async rejectGate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = (req as any).user?.id;

      if (!usuarioId) {
        fail(res, 'Não autenticado', 401);
        return;
      }

      const { motivo } = req.body;

      if (!motivo || motivo.trim().length === 0) {
        fail(res, 'Campo "motivo" é obrigatório', 400);
        return;
      }

      const numero = parseInt(req.params.gateId, 10);
      if (isNaN(numero) || numero < 1 || numero > 9) {
        fail(res, 'Número do gate deve ser entre 1 e 9', 400);
        return;
      }

      const gate = await this.competenciaService.rejeitarGate(
        req.params.id,
        numero,
        usuarioId,
        motivo.trim()
      );

      // Registra evento de auditoria (o service já registra, mas garantimos aqui também)
      this.auditService.registrarEvento({
        obra_id: null, // Será preenchido pelo service
        usuario_id: usuarioId,
        entity_type: 'CompetenciaGate',
        entity_id: gate.id,
        action: 'REJECT',
        payload: {
          competencia_id: req.params.id,
          gate_numero: numero,
          motivo: motivo.trim(),
        },
      }).catch(err => console.error('Erro ao registrar evento de auditoria:', err));

      ok(res, gate);
    } catch (error: any) {
      if (error.code === 'COMPETENCIA_FECHADA') {
        fail(res, error.message, 409);
      } else if (error.message.includes('não encontrado')) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  }
}

