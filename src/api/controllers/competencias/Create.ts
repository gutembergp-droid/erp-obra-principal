import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../../libs/prisma';
import { CompetenciaService } from '../../../services/CompetenciaService';
import { AuditService } from '../../../services/AuditService';
import { created, fail } from '../../utils/apiResponse';
import { getObraAtivaFromUser } from '../../middlewares/validateObra';
import { AbrirCompetenciaSchema, IAbrirCompetenciaSchema } from './schemas_zod';
import { validation } from '../../../shared/middlewares/Validation';

/**
 * Validator para abertura de competência
 */
export const abrirValidator = validation(AbrirCompetenciaSchema);

/**
 * Abre uma nova competência mensal e cria os 9 gates automaticamente
 * POST /api/competencias/abrir
 */
export const abrir = async (
  req: Request<{}, {}, IAbrirCompetenciaSchema>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const competenciaService = new CompetenciaService(prisma);
    const auditService = new AuditService(prisma);

    let obraId = req.body.obra_id;

    // Se não fornecido, usa obra ativa
    if (!obraId) {
      const obraAtivaId = await getObraAtivaFromUser(req, res);
      if (!obraAtivaId) {
        return;
      }
      obraId = obraAtivaId;
    }

    const competencia = await competenciaService.abrirCompetencia(obraId, req.body.periodo);

    // Registra evento de auditoria
    const usuarioId = (req as any).user?.id || '';
    if (usuarioId) {
      auditService
        .registrarEvento({
          obra_id: obraId,
          usuario_id: usuarioId,
          entity_type: 'CompetenciaMensal',
          entity_id: competencia.id,
          action: 'OPEN',
          payload: {
            periodo: req.body.periodo,
            gates_criados: 9,
          },
        })
        .catch((err) => console.error('Erro ao registrar evento de auditoria:', err));
    }

    created(res, competencia);
  } catch (error: any) {
    if (error.code === 'PERIODO_DUPLICADO' || error.code === 'COMPETENCIA_ABERTA_EXISTENTE') {
      fail(res, error.message, StatusCodes.CONFLICT);
    } else {
      next(error);
    }
  }
};

