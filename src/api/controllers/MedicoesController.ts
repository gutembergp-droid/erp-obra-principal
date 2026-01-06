import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { MedicaoService } from '../../services/MedicaoService';
import { AuditService } from '../../services/AuditService';
import { CreateMedicaoDto, UpdateMedicaoDto, AprovarMedicaoDto, RejeitarMedicaoDto } from '../../types/medicao';
import { getObraAtivaFromUser } from '../middlewares/validateObra';
import { ok, created, notFound, fail } from '../utils/apiResponse';

export class MedicoesController {
  private medicaoService: MedicaoService;
  private auditService: AuditService;

  constructor(prisma: PrismaClient) {
    this.medicaoService = new MedicaoService(prisma);
    this.auditService = new AuditService(prisma);
  }

  /**
   * GET /api/medicoes/producao
   * Lista Medições de Produção (MP) da obra ativa do usuário
   */
  async getProducao(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Valida que não foi passado obra_id por query ou params
      if (req.query.obra_id || req.params.obra_id) {
        fail(res, 'Este endpoint não aceita obra_id. Use a obra ativa do contexto do usuário.', 400);
        return;
      }

      // Extrai obra_ativa_id do usuário autenticado
      const obraAtivaId = await getObraAtivaFromUser(req, res);
      if (!obraAtivaId) {
        return; // getObraAtivaFromUser já enviou a resposta de erro
      }

      // Extrai período opcional da query
      const periodo = req.query.periodo as string | undefined;

      // Busca medições de produção
      const medicoes = await this.medicaoService.listMedicoesProducao(obraAtivaId, periodo);

      // Retorna no formato canônico
      ok(res, medicoes, null);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/medicoes/cliente
   * Lista Medições do Cliente (MC) da obra ativa do usuário
   */
  async getCliente(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Valida que não foi passado obra_id por query ou params
      if (req.query.obra_id || req.params.obra_id) {
        fail(res, 'Este endpoint não aceita obra_id. Use a obra ativa do contexto do usuário.', 400);
        return;
      }

      // Extrai obra_ativa_id do usuário autenticado
      const obraAtivaId = await getObraAtivaFromUser(req, res);
      if (!obraAtivaId) {
        return; // getObraAtivaFromUser já enviou a resposta de erro
      }

      // Extrai período opcional da query
      const periodo = req.query.periodo as string | undefined;

      // Busca medições do cliente
      const medicoes = await this.medicaoService.listMedicoesCliente(obraAtivaId, periodo);

      // Retorna no formato canônico
      ok(res, medicoes, null);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/medicoes/comparativo
   * Comparativo MP x MC da obra ativa do usuário
   */
  async getComparativo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Valida que não foi passado obra_id por query ou params
      if (req.query.obra_id || req.params.obra_id) {
        fail(res, 'Este endpoint não aceita obra_id. Use a obra ativa do contexto do usuário.', 400);
        return;
      }

      // Valida que período foi fornecido (obrigatório para comparativo)
      const periodo = req.query.periodo as string | undefined;
      if (!periodo) {
        fail(res, 'Parâmetro período é obrigatório', 400);
        return;
      }

      // Extrai obra_ativa_id do usuário autenticado
      const obraAtivaId = await getObraAtivaFromUser(req, res);
      if (!obraAtivaId) {
        return; // getObraAtivaFromUser já enviou a resposta de erro
      }

      // Busca comparativo
      const comparativo = await this.medicaoService.getComparativo(obraAtivaId, periodo);

      // Retorna no formato canônico
      ok(res, comparativo, null);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/medicoes/obra/:obra_id
   * Lista medições por obra (filtro obrigatório - multi-obra)
   */
  async getByObra(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const obraId = req.params.obra_id;
      const filters = {
        eap_id: req.query.eap_id as string | undefined,
        usuario_id: req.query.usuario_id as string | undefined,
        periodo_referencia: req.query.periodo_referencia as string | undefined,
        status: req.query.status as string | undefined,
        includeDeleted: req.query.includeDeleted === 'true',
      };

      const medicoes = await this.medicaoService.listMedicoesByObra(obraId, filters);
      ok(res, medicoes);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/medicoes
   * Lista todas as medições (uso administrativo)
   * Query params: obra_id, eap_id, usuario_id, periodo_referencia, status, includeDeleted
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        obra_id: req.query.obra_id as string | undefined,
        eap_id: req.query.eap_id as string | undefined,
        usuario_id: req.query.usuario_id as string | undefined,
        periodo_referencia: req.query.periodo_referencia as string | undefined,
        status: req.query.status as string | undefined,
        includeDeleted: req.query.includeDeleted === 'true',
      };

      const medicoes = await this.medicaoService.listAllMedicoes(filters);
      ok(res, medicoes);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/medicoes/:id
   * Busca uma medição por ID
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const medicao = await this.medicaoService.getMedicaoById(req.params.id);

      if (!medicao) {
        notFound(res, `Medição com ID ${req.params.id} não encontrada`);
        return;
      }

      ok(res, medicao);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/medicoes
   * Cria uma nova medição (sempre como DRAFT)
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateMedicaoDto = req.body;
      
      // Extrai usuarioId do request (populado por authMiddleware)
      const usuarioId = (req as any).user?.id;

      if (!usuarioId) {
        fail(res, 'Não autenticado', 401);
        return;
      }

      const medicao = await this.medicaoService.createMedicao(data, usuarioId);
      
      // Registra evento de auditoria
      this.auditService.registrarEvento({
        obra_id: data.obra_id,
        usuario_id: usuarioId,
        entity_type: 'Medicao',
        entity_id: medicao.id,
        action: 'CREATE',
        payload: {
          tipo: medicao.tipo,
          periodo_referencia: medicao.periodo_referencia,
        },
      }).catch(err => console.error('Erro ao registrar evento de auditoria:', err));

      created(res, medicao);
    } catch (error: any) {
      if (error.message.includes('não encontrada') || error.message.includes('não encontrado')) {
        fail(res, error.message, 404);
      } else if (error.message.includes('Competência está fechada')) {
        fail(res, error.message, 403);
      } else {
        next(error);
      }
    }
  }

  /**
   * PUT /api/medicoes/:id
   * Atualiza uma medição existente (apenas se DRAFT ou REJECTED)
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: UpdateMedicaoDto = req.body;
      const usuarioId = (req as any).user?.id;
      const medicao = await this.medicaoService.updateMedicao(req.params.id, data, usuarioId);
      ok(res, medicao);
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        notFound(res, error.message);
      } else if (error.message.includes('não pode ser editada') || error.message.includes('Competência está fechada')) {
        fail(res, error.message, 403);
      } else {
        next(error);
      }
    }
  }

  /**
   * POST /api/medicoes/:id/submit
   * Submete uma medição (DRAFT -> SUBMITTED)
   */
  async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const usuarioId = (req as any).user?.id;
      const medicao = await this.medicaoService.submitMedicao(req.params.id);
      
      // Registra evento de auditoria
      if (usuarioId) {
        this.auditService.registrarEvento({
          obra_id: medicao.obra_id,
          usuario_id: usuarioId,
          entity_type: 'Medicao',
          entity_id: medicao.id,
          action: 'SUBMIT',
          payload: {
            tipo: medicao.tipo,
            periodo_referencia: medicao.periodo_referencia,
          },
        }).catch(err => console.error('Erro ao registrar evento de auditoria:', err));
      }

      ok(res, medicao);
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        notFound(res, error.message);
      } else if (error.message.includes('Transição de status inválida') || error.message.includes('Competência está fechada')) {
        fail(res, error.message, 400);
      } else {
        next(error);
      }
    }
  }

  /**
   * POST /api/medicoes/:id/aprovar
   * Aprova uma medição (SUBMITTED -> APPROVED)
   */
  async aprovar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extrai usuarioId do request (populado por authMiddleware)
      const usuarioId = (req as any).user?.id;

      if (!usuarioId) {
        fail(res, 'Não autenticado', 401);
        return;
      }

      const data: AprovarMedicaoDto = {
        aprovado_por_id: usuarioId,
        observacoes: req.body.observacoes,
      };

      const medicao = await this.medicaoService.aprovarMedicao(req.params.id, data);
      
      // Registra evento de auditoria
      this.auditService.registrarEvento({
        obra_id: medicao.obra_id,
        usuario_id: usuarioId,
        entity_type: 'Medicao',
        entity_id: medicao.id,
        action: 'APPROVE',
        payload: {
          tipo: medicao.tipo,
          periodo_referencia: medicao.periodo_referencia,
          observacoes: data.observacoes,
        },
      }).catch(err => console.error('Erro ao registrar evento de auditoria:', err));

      ok(res, medicao);
    } catch (error: any) {
      if (error.message.includes('não encontrada') || error.message.includes('não encontrado')) {
        notFound(res, error.message);
      } else if (error.message.includes('Transição de status inválida')) {
        fail(res, error.message, 400);
      } else {
        next(error);
      }
    }
  }

  /**
   * POST /api/medicoes/:id/rejeitar
   * Rejeita uma medição (SUBMITTED -> REJECTED)
   */
  async rejeitar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extrai usuarioId do request (populado por authMiddleware)
      const usuarioId = (req as any).user?.id;

      if (!usuarioId) {
        fail(res, 'Não autenticado', 401);
        return;
      }

      const motivo_rejeicao = req.body.motivo_rejeicao;

      if (!motivo_rejeicao || motivo_rejeicao.trim().length === 0) {
        fail(res, 'Motivo de rejeição é obrigatório', 400);
        return;
      }

      const data: RejeitarMedicaoDto = {
        rejeitado_por_id: usuarioId,
        motivo_rejeicao: motivo_rejeicao.trim(),
      };

      const medicao = await this.medicaoService.rejeitarMedicao(req.params.id, data);
      
      // Registra evento de auditoria
      this.auditService.registrarEvento({
        obra_id: medicao.obra_id,
        usuario_id: usuarioId,
        entity_type: 'Medicao',
        entity_id: medicao.id,
        action: 'REJECT',
        payload: {
          tipo: medicao.tipo,
          periodo_referencia: medicao.periodo_referencia,
          motivo_rejeicao: data.motivo_rejeicao,
        },
      }).catch(err => console.error('Erro ao registrar evento de auditoria:', err));

      ok(res, medicao);
    } catch (error: any) {
      if (error.message.includes('não encontrada') || error.message.includes('não encontrado')) {
        notFound(res, error.message);
      } else if (error.message.includes('Transição de status inválida') || error.message.includes('Motivo de rejeição')) {
        fail(res, error.message, 400);
      } else {
        next(error);
      }
    }
  }

  /**
   * DELETE /api/medicoes/:id
   * Soft delete de uma medição
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.medicaoService.deleteMedicao(req.params.id);
      ok(res, { message: 'Medição deletada com sucesso' });
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  }
}

