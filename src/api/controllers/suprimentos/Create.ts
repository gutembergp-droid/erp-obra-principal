import type { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../../libs/prisma';
import { SuprimentosService } from '../../../services/SuprimentosService';
import { AuditService } from '../../../services/AuditService';
import { created, fail } from '../../utils/apiResponse';
import { CreateInsumoSchema, ICreateInsumoSchema } from './schemas_zod';
import { validation } from '../../../shared/middlewares/Validation';

/**
 * Validator para criação de insumo
 */
export const createValidator = validation(CreateInsumoSchema);

/**
 * Cria um novo insumo
 * POST /api/suprimentos/insumos
 */
export const create = async (
  req: Request<{}, {}, ICreateInsumoSchema>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const suprimentosService = new SuprimentosService(prisma);
    const auditService = new AuditService(prisma);

    const insumo = await suprimentosService.createInsumo(req.body);

    // Registra evento de auditoria
    const usuarioId = (req as any).user?.id;
    if (usuarioId) {
      auditService
        .registrarEvento({
          obra_id: null,
          usuario_id: usuarioId,
          entity_type: 'Insumo',
          entity_id: insumo.id,
          action: 'CREATE',
          payload: {
            codigo: insumo.codigo,
            nome: insumo.nome,
            categoria: insumo.categoria,
          },
        })
        .catch((err) =>
          console.error('Erro ao registrar evento de auditoria:', err)
        );
    }

    created(res, insumo);
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        fail(res, `Já existe um insumo com o código ${req.body.codigo}`, StatusCodes.CONFLICT);
        return;
      }
    }

    if (error.message?.includes('já existe')) {
      fail(res, error.message, StatusCodes.CONFLICT);
      return;
    }

    next(error);
  }
};

