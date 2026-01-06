import type { Request, Response, NextFunction } from 'express';
import prisma from '../../../libs/prisma';
import { ObraService } from '../../../services/ObraService';
import { ok, notFound } from '../../utils/apiResponse';

/**
 * Soft delete de uma obra
 * DELETE /api/obras/:id
 */
export const deletar = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const obraService = new ObraService(prisma);
    await obraService.deleteObra(req.params.id);
    ok(res, { message: 'Obra deletada com sucesso' });
  } catch (error: any) {
    if (error.message?.includes('não encontrada')) {
      notFound(res, error.message);
      return;
    }

    next(error);
  }
};

