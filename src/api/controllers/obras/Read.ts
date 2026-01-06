import type { Request, Response, NextFunction } from 'express';
import prisma from '../../../libs/prisma';
import { ObraService } from '../../../services/ObraService';
import { ok, notFound } from '../../utils/apiResponse';
import { ListObrasQuerySchema, IListObrasQuerySchema } from './schemas_zod';
import { validation } from '../../../shared/middlewares/Validation';

/**
 * Validator para query params de listagem
 */
export const listQueryValidator = validation(ListObrasQuerySchema, 'query');

/**
 * Lista todas as obras (com filtros opcionais)
 * GET /api/obras
 */
export const list = async (
  req: Request<{}, {}, {}, IListObrasQuerySchema>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const obraService = new ObraService(prisma);
    const usuarioId = (req as any).user?.id;

    const filters = {
      status: req.query.status,
      cliente: req.query.cliente,
      includeDeleted: req.query.includeDeleted,
    };

    const obras = await obraService.listObras(filters, usuarioId);
    ok(res, obras);
  } catch (error) {
    next(error);
  }
};

/**
 * Busca uma obra por ID
 * GET /api/obras/:id
 */
export const getById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const obraService = new ObraService(prisma);
    const obra = await obraService.getObraById(req.params.id);

    if (!obra) {
      notFound(res, `Obra com ID ${req.params.id} não encontrada`);
      return;
    }

    ok(res, obra);
  } catch (error) {
    next(error);
  }
};

