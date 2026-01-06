import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../../libs/prisma';
import { CompetenciaService } from '../../../services/CompetenciaService';
import { AuditService } from '../../../services/AuditService';
import { ok, notFound, fail } from '../../utils/apiResponse';
import { ApproveGateSchema, RejectGateSchema, IApproveGateSchema, IRejectGateSchema } from './schemas_zod';
import { validation } from '../../../shared/middlewares/Validation';

/**
 * Validator para aprovação de gate
 */
export const approveGateValidator = validation(ApproveGateSchema);

/**
 * Validator para rejeição de gate
 */
export const rejectGateValidator = validation(RejectGateSchema);

/**
 * Fecha uma competência (valida gates obrigatórios)
 * POST /api/competencias/:id/fechar
 */
export const fechar = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const competenciaService = new CompetenciaService(prisma);
    const auditService = new AuditService(prisma);
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      fail(res, 'Não autenticado', StatusCodes.UNAUTHORIZED);
      return;
    }

    const resultado = await competenciaService.concluirCompetencia(req.params.id, usuarioId);

    // Registra evento de auditoria
    auditService
      .registrarEvento({
        obra_id: null,
        usuario_id: usuarioId,
        entity_type: 'CompetenciaMensal',
        entity_id: req.params.id,
        action: 'CLOSE',
        payload: {
          fechada_em: resultado.fechada_em,
        },
      })
      .catch((err) => console.error('Erro ao registrar evento de auditoria:', err));

    ok(res, resultado);
  } catch (error: any) {
    if (error.code === 'GATE_DEPENDENCY' || error.code === 'COMPETENCIA_FECHADA') {
      fail(res, error.message, StatusCodes.CONFLICT, error.details);
    } else if (error.message?.includes('não encontrada')) {
      notFound(res, error.message);
    } else {
      next(error);
    }
  }
};

/**
 * Aprova um gate
 * POST /api/competencias/:id/gates/:gateId/approve
 */
export const approveGate = async (
  req: Request<{ id: string; gateId: string }, {}, IApproveGateSchema>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const competenciaService = new CompetenciaService(prisma);
    const auditService = new AuditService(prisma);
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      fail(res, 'Não autenticado', StatusCodes.UNAUTHORIZED);
      return;
    }

    const numero = parseInt(req.params.gateId, 10);
    if (isNaN(numero) || numero < 1 || numero > 9) {
      fail(res, 'Número do gate deve ser entre 1 e 9', StatusCodes.BAD_REQUEST);
      return;
    }

    const gate = await competenciaService.aprovarGate(
      req.params.id,
      numero,
      usuarioId,
      req.body.observacoes
    );

    // Registra evento de auditoria
    auditService
      .registrarEvento({
        obra_id: null,
        usuario_id: usuarioId,
        entity_type: 'CompetenciaGate',
        entity_id: gate.id,
        action: 'APPROVE',
        payload: {
          competencia_id: req.params.id,
          gate_numero: numero,
          observacoes: req.body.observacoes,
        },
      })
      .catch((err) => console.error('Erro ao registrar evento de auditoria:', err));

    ok(res, gate);
  } catch (error: any) {
    if (error.code === 'GATE_DEPENDENCY' || error.code === 'COMPETENCIA_FECHADA') {
      fail(res, error.message, StatusCodes.CONFLICT);
    } else if (error.message?.includes('não encontrado')) {
      notFound(res, error.message);
    } else {
      next(error);
    }
  }
};

/**
 * Rejeita um gate (com motivo)
 * POST /api/competencias/:id/gates/:gateId/reject
 */
export const rejectGate = async (
  req: Request<{ id: string; gateId: string }, {}, IRejectGateSchema>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const competenciaService = new CompetenciaService(prisma);
    const auditService = new AuditService(prisma);
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      fail(res, 'Não autenticado', StatusCodes.UNAUTHORIZED);
      return;
    }

    const numero = parseInt(req.params.gateId, 10);
    if (isNaN(numero) || numero < 1 || numero > 9) {
      fail(res, 'Número do gate deve ser entre 1 e 9', StatusCodes.BAD_REQUEST);
      return;
    }

    const gate = await competenciaService.rejeitarGate(
      req.params.id,
      numero,
      usuarioId,
      req.body.motivo.trim()
    );

    // Registra evento de auditoria
    auditService
      .registrarEvento({
        obra_id: null,
        usuario_id: usuarioId,
        entity_type: 'CompetenciaGate',
        entity_id: gate.id,
        action: 'REJECT',
        payload: {
          competencia_id: req.params.id,
          gate_numero: numero,
          motivo: req.body.motivo.trim(),
        },
      })
      .catch((err) => console.error('Erro ao registrar evento de auditoria:', err));

    ok(res, gate);
  } catch (error: any) {
    if (error.code === 'COMPETENCIA_FECHADA') {
      fail(res, error.message, StatusCodes.CONFLICT);
    } else if (error.message?.includes('não encontrado')) {
      notFound(res, error.message);
    } else {
      next(error);
    }
  }
};

