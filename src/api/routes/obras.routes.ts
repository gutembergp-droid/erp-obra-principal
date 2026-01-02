import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ObraService } from '../../services/ObraService';
import { CreateObraDto, UpdateObraDto } from '../../types/obras';
import { validateObraAccess } from '../middleware/validateObra';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();
const obraService = new ObraService(prisma);

/**
 * GET /api/obras
 * Lista todas as obras (com filtros opcionais)
 * 
 * IMPORTANTE: Retorna apenas as obras que o usuário logado tem permissão para ver.
 * Admin vê todas as obras.
 * Requer autenticação.
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status as string | undefined,
      cliente: req.query.cliente as string | undefined,
      includeDeleted: req.query.includeDeleted === 'true',
    };

    // Extrai usuarioId do request (populado por authMiddleware)
    const usuarioId = (req as any).user?.id;

    const obras = await obraService.listObras(filters, usuarioId);
    res.json(obras);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/obras/:id
 * Busca uma obra por ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const obra = await obraService.getObraById(req.params.id);

    if (!obra) {
      return res.status(404).json({
        error: 'Obra não encontrada',
        message: `Obra com ID ${req.params.id} não existe`,
      });
    }

    res.json(obra);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/obras
 * Cria uma nova obra
 */
router.post('/', async (req, res, next) => {
  try {
    const data: CreateObraDto = req.body;
    const obra = await obraService.createObra(data);
    res.status(201).json(obra);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/obras/:id
 * Atualiza uma obra existente
 */
router.put('/:id', async (req, res, next) => {
  try {
    const data: UpdateObraDto = req.body;
    const obra = await obraService.updateObra(req.params.id, data);
    res.json(obra);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/obras/:id
 * Soft delete de uma obra
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await obraService.deleteObra(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

