import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ObraService } from '../../services/ObraService';
import { CreateObraDto, UpdateObraDto } from '../../types/obras';
import { ok, created, notFound, fail } from '../utils/apiResponse';

export class ObrasController {
  private obraService: ObraService;

  constructor(prisma: PrismaClient) {
    this.obraService = new ObraService(prisma);
  }

  /**
   * GET /api/obras
   * Lista todas as obras (com filtros opcionais)
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        cliente: req.query.cliente as string | undefined,
        includeDeleted: req.query.includeDeleted === 'true',
      };

      // Extrai usuarioId do request (populado por authMiddleware)
      const usuarioId = (req as any).user?.id;

      const obras = await this.obraService.listObras(filters, usuarioId);
      ok(res, obras);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/obras/:id
   * Busca uma obra por ID
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const obra = await this.obraService.getObraById(req.params.id);

      if (!obra) {
        notFound(res, `Obra com ID ${req.params.id} não encontrada`);
        return;
      }

      ok(res, obra);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/obras
   * Cria uma nova obra
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateObraDto = req.body;
      const obra = await this.obraService.createObra(data);
      created(res, obra);
    } catch (error: any) {
      if (error.message.includes('já existe')) {
        fail(res, error.message, 409);
      } else {
        next(error);
      }
    }
  }

  /**
   * PUT /api/obras/:id
   * Atualiza uma obra existente
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: UpdateObraDto = req.body;
      const obra = await this.obraService.updateObra(req.params.id, data);
      ok(res, obra);
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  }

  /**
   * DELETE /api/obras/:id
   * Soft delete de uma obra
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.obraService.deleteObra(req.params.id);
      ok(res, { message: 'Obra deletada com sucesso' });
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  }
}

