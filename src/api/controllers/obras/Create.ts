import type { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../../libs/prisma';
import { ObraService } from '../../../services/ObraService';
import { created, fail } from '../../utils/apiResponse';
import { CreateObraSchema, ICreateObraSchema } from './schemas_zod';
import { validation } from '../../../shared/middlewares/Validation';

/**
 * Validator para criação de obra
 */
export const createValidator = validation(CreateObraSchema);

/**
 * Cria uma nova obra
 * POST /api/obras
 */
export const create = async (
  req: Request<{}, {}, ICreateObraSchema>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const obraService = new ObraService(prisma);
    const obra = await obraService.createObra(req.body);
    created(res, obra);
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        fail(res, `Já existe uma obra com o código ${req.body.codigo}`, StatusCodes.CONFLICT);
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

