import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CompetenciaService } from '../../services/CompetenciaService';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateObraAccess } from '../middleware/validateObra';

const router = Router();
const prisma = new PrismaClient();
const competenciaService = new CompetenciaService(prisma);

/**
 * Backend Mínimo: Rotas de Competências e Gates
 * Todas as rotas requerem autenticação e validação de obra
 */

/**
 * GET /api/obras/:obraId/competencias/ativa
 * Busca competência ativa (aberta) de uma obra
 */
router.get(
  '/obras/:obraId/competencias/ativa',
  authMiddleware,
  validateObraAccess,
  async (req: Request, res: Response) => {
    try {
      const obraId = req.params.obraId || (req as any).obraId;

      if (!obraId) {
        return res.status(400).json({
          error: 'INVALID_REQUEST',
          message: 'obraId é obrigatório',
        });
      }

      const competencia = await competenciaService.getCompetenciaAtiva(obraId);

      if (!competencia) {
        return res.status(404).json({
          error: 'NOT_FOUND',
          message: 'Nenhuma competência ativa encontrada para esta obra',
        });
      }

      return res.json({
        id: competencia.id,
        obra_id: competencia.obra_id,
        periodo: competencia.periodo,
        status: competencia.status,
        aberta_em: competencia.aberta_em,
        fechada_em: competencia.fechada_em,
      });
    } catch (error) {
      console.error('Erro ao buscar competência ativa:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Erro ao buscar competência ativa',
        details: (error as Error).message,
      });
    }
  }
);

/**
 * POST /api/obras/:obraId/competencias/abrir
 * Abre uma nova competência mensal e cria os 9 gates automaticamente
 */
router.post(
  '/obras/:obraId/competencias/abrir',
  authMiddleware,
  validateObraAccess,
  async (req: Request, res: Response) => {
    try {
      const obraId = req.params.obraId || (req as any).obraId;
      const { periodo } = req.body;

      if (!periodo) {
        return res.status(400).json({
          error: 'INVALID_REQUEST',
          message: 'Campo "periodo" é obrigatório (formato: YYYY-MM)',
        });
      }

      const competencia = await competenciaService.abrirCompetencia(obraId, periodo);

      return res.status(201).json({
        id: competencia.id,
        obra_id: competencia.obra_id,
        periodo: competencia.periodo,
        status: competencia.status,
        aberta_em: competencia.aberta_em,
      });
    } catch (error: any) {
      console.error('Erro ao abrir competência:', error);

      if (error.code === 'PERIODO_DUPLICADO') {
        return res.status(409).json({
          error: 'PERIODO_DUPLICADO',
          message: error.message || 'Já existe uma competência para este período',
        });
      }

      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Erro ao abrir competência',
        details: error.message,
      });
    }
  }
);

/**
 * GET /api/obras/:obraId/competencias/:competenciaId
 * Busca competência por ID
 */
router.get(
  '/obras/:obraId/competencias/:competenciaId',
  authMiddleware,
  validateObraAccess,
  async (req: Request, res: Response) => {
    try {
      const { competenciaId } = req.params;

      const competencia = await competenciaService.getCompetenciaById(competenciaId);

      if (!competencia) {
        return res.status(404).json({
          error: 'NOT_FOUND',
          message: 'Competência não encontrada',
        });
      }

      return res.json({
        id: competencia.id,
        obra_id: competencia.obra_id,
        periodo: competencia.periodo,
        status: competencia.status,
        aberta_em: competencia.aberta_em,
        fechada_em: competencia.fechada_em,
      });
    } catch (error) {
      console.error('Erro ao buscar competência:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Erro ao buscar competência',
        details: (error as Error).message,
      });
    }
  }
);

/**
 * GET /api/obras/:obraId/competencias/:competenciaId/gates
 * Lista gates de uma competência com informações de travas
 */
router.get(
  '/obras/:obraId/competencias/:competenciaId/gates',
  authMiddleware,
  validateObraAccess,
  async (req: Request, res: Response) => {
    try {
      const { competenciaId } = req.params;

      const dados = await competenciaService.listarGatesComTravas(competenciaId);

      return res.json({
        competencia: {
          id: dados.competencia.id,
          obra_id: dados.competencia.obra_id,
          periodo: dados.competencia.periodo,
          status: dados.competencia.status,
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
    } catch (error) {
      console.error('Erro ao listar gates:', error);
      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Erro ao listar gates',
        details: (error as Error).message,
      });
    }
  }
);

/**
 * POST /api/obras/:obraId/competencias/:competenciaId/gates/:numero/aprovar
 * Aprova um gate
 */
router.post(
  '/obras/:obraId/competencias/:competenciaId/gates/:numero/aprovar',
  authMiddleware,
  validateObraAccess,
  async (req: Request, res: Response) => {
    try {
      const { competenciaId, numero } = req.params;
      const { observacoes } = req.body;
      const usuarioId = (req as any).user?.id;

      if (!usuarioId) {
        return res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
      }

      const numeroGate = parseInt(numero, 10);
      if (isNaN(numeroGate) || numeroGate < 1 || numeroGate > 9) {
        return res.status(400).json({
          error: 'INVALID_REQUEST',
          message: 'Número do gate deve ser entre 1 e 9',
        });
      }

      const gate = await competenciaService.aprovarGate(
        competenciaId,
        numeroGate,
        usuarioId,
        observacoes
      );

      return res.json({
        numero: gate.numero,
        status: gate.status,
        aprovado_em: gate.aprovado_em,
        aprovado_por_id: gate.aprovado_por_id,
      });
    } catch (error: any) {
      console.error('Erro ao aprovar gate:', error);

      if (error.code === 'GATE_DEPENDENCY' || error.code === 'COMPETENCIA_FECHADA') {
        return res.status(409).json({
          error: error.code,
          message: error.message || 'Não é possível aprovar este gate',
        });
      }

      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Erro ao aprovar gate',
        details: error.message,
      });
    }
  }
);

/**
 * POST /api/obras/:obraId/competencias/:competenciaId/gates/:numero/rejeitar
 * Rejeita um gate
 */
router.post(
  '/obras/:obraId/competencias/:competenciaId/gates/:numero/rejeitar',
  authMiddleware,
  validateObraAccess,
  async (req: Request, res: Response) => {
    try {
      const { competenciaId, numero } = req.params;
      const { motivo } = req.body;
      const usuarioId = (req as any).user?.id;

      if (!usuarioId) {
        return res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
      }

      if (!motivo) {
        return res.status(400).json({
          error: 'INVALID_REQUEST',
          message: 'Campo "motivo" é obrigatório',
        });
      }

      const numeroGate = parseInt(numero, 10);
      if (isNaN(numeroGate) || numeroGate < 1 || numeroGate > 9) {
        return res.status(400).json({
          error: 'INVALID_REQUEST',
          message: 'Número do gate deve ser entre 1 e 9',
        });
      }

      const gate = await competenciaService.rejeitarGate(
        competenciaId,
        numeroGate,
        usuarioId,
        motivo
      );

      return res.json({
        numero: gate.numero,
        status: gate.status,
        rejeitado_em: gate.rejeitado_em,
        rejeitado_por_id: gate.rejeitado_por_id,
        motivo: gate.motivo_rejeicao,
      });
    } catch (error: any) {
      console.error('Erro ao rejeitar gate:', error);

      if (error.code === 'COMPETENCIA_FECHADA') {
        return res.status(409).json({
          error: error.code,
          message: error.message || 'Competência já está fechada',
        });
      }

      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Erro ao rejeitar gate',
        details: error.message,
      });
    }
  }
);

/**
 * POST /api/obras/:obraId/competencias/:competenciaId/concluir
 * Conclui competência (equivale a aprovar Gate 9)
 */
router.post(
  '/obras/:obraId/competencias/:competenciaId/concluir',
  authMiddleware,
  validateObraAccess,
  async (req: Request, res: Response) => {
    try {
      const { competenciaId } = req.params;
      const usuarioId = (req as any).user?.id;

      if (!usuarioId) {
        return res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
      }

      const resultado = await competenciaService.concluirCompetencia(competenciaId, usuarioId);

      return res.json(resultado);
    } catch (error: any) {
      console.error('Erro ao concluir competência:', error);

      if (error.code === 'GATE_DEPENDENCY' || error.code === 'COMPETENCIA_FECHADA') {
        return res.status(409).json({
          error: error.code,
          message: error.message || 'Não é possível concluir a competência',
        });
      }

      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Erro ao concluir competência',
        details: error.message,
      });
    }
  }
);

export default router;

