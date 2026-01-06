import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../../libs/prisma';
import { SuprimentosService } from '../../../services/SuprimentosService';
import { AuditService } from '../../../services/AuditService';
import { ok, notFound, fail } from '../../utils/apiResponse';
import { UpdateInsumoSchema, IUpdateInsumoSchema } from './schemas_zod';
import { validation } from '../../../shared/middlewares/Validation';

/**
 * Validator para atualização de insumo
 */
export const updateValidator = validation(UpdateInsumoSchema);

/**
 * Atualiza um insumo existente
 * PUT /api/suprimentos/insumos/:id
 */
export const update = async (
  req: Request<{ id: string }, {}, IUpdateInsumoSchema>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const suprimentosService = new SuprimentosService(prisma);
    const auditService = new AuditService(prisma);

    // Busca insumo antes de atualizar para auditoria
    const insumoAntes = await suprimentosService.getInsumoById(req.params.id);
    if (!insumoAntes) {
      notFound(res, `Insumo com ID ${req.params.id} não encontrado`);
      return;
    }

    const insumo = await suprimentosService.updateInsumo(req.params.id, req.body);

    // Registra evento de auditoria
    const usuarioId = (req as any).user?.id;
    if (usuarioId) {
      auditService
        .registrarEvento({
          obra_id: null,
          usuario_id: usuarioId,
          entity_type: 'Insumo',
          entity_id: insumo.id,
          action: 'UPDATE',
          payload: {
            codigo: insumo.codigo,
            campos_alterados: Object.keys(req.body),
          },
        })
        .catch((err) =>
          console.error('Erro ao registrar evento de auditoria:', err)
        );
    }

    ok(res, insumo);
  } catch (error: any) {
    if (error.message?.includes('não encontrado')) {
      notFound(res, error.message);
      return;
    }

    next(error);
  }
};

