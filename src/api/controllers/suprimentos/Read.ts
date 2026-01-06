import type { Request, Response, NextFunction } from 'express';
import prisma from '../../../libs/prisma';
import { SuprimentosService } from '../../../services/SuprimentosService';
import { ok, notFound } from '../../utils/apiResponse';
import { ListInsumosQuerySchema, IListInsumosQuerySchema } from './schemas_zod';
import { validation } from '../../../shared/middlewares/Validation';

/**
 * Validator para query params de listagem
 */
export const listQueryValidator = validation(ListInsumosQuerySchema, 'query');

/**
 * Lista todos os insumos (com filtros opcionais)
 * GET /api/suprimentos/insumos
 */
export const list = async (
  req: Request<{}, {}, {}, IListInsumosQuerySchema>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const suprimentosService = new SuprimentosService(prisma);

    const filters = {
      categoria: req.query.categoria,
      busca: req.query.busca,
      includeDeleted: req.query.includeDeleted,
      page: req.query.page,
      pageSize: req.query.pageSize,
    };

    const result = await suprimentosService.listInsumos(filters);

    // Formato canônico com meta de paginação
    const meta = {
      page: filters.page || 1,
      pageSize: filters.pageSize || 100,
      total: result.total,
    };

    ok(res, result.insumos, meta);
  } catch (error) {
    next(error);
  }
};

/**
 * Busca um insumo por ID
 * GET /api/suprimentos/insumos/:id
 */
export const getById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const suprimentosService = new SuprimentosService(prisma);

    const insumo = await suprimentosService.getInsumoById(req.params.id);

    if (!insumo) {
      notFound(res, `Insumo com ID ${req.params.id} não encontrado`);
      return;
    }

    ok(res, insumo);
  } catch (error) {
    next(error);
  }
};

