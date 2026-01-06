import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../../libs/prisma';
import { ObraService } from '../../../services/ObraService';
import { ok, notFound } from '../../utils/apiResponse';
import { UpdateObraSchema, IUpdateObraSchema } from './schemas_zod';
import { validation } from '../../../shared/middlewares/Validation';

/**
 * Validator para atualização de obra
 */
export const updateValidator = validation(UpdateObraSchema);

/**
 * Atualiza uma obra existente
 * PUT /api/obras/:id
 */
export const update = async (
  req: Request<{ id: string }, {}, IUpdateObraSchema>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const obraService = new ObraService(prisma);
    const obra = await obraService.updateObra(req.params.id, req.body);
    ok(res, obra);
  } catch (error: any) {
    if (error.message?.includes('não encontrada')) {
      notFound(res, error.message);
      return;
    }

    next(error);
  }
};

