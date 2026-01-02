import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { GateService } from '../../services/GateService';
import { CreateGateDto, UpdateGateDto } from '../../types/gates';
import { validateObraAccess } from '../middleware/validateObra';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();
const gateService = new GateService(prisma);

/**
 * GET /api/gates/obra/:obra_id
 * Lista gates por obra (filtro obrigatório para multi-obra)
 * Query params: status (opcional), tipo (opcional)
 */
router.get('/obra/:obra_id', authMiddleware, validateObraAccess, async (req, res, next) => {
  try {
    const obraId = req.params.obra_id;
    const status = req.query.status as string | undefined;
    const tipo = req.query.tipo as string | undefined;

    const gates = await gateService.listGatesByObra(obraId, {
      status,
      tipo,
    });

    res.json(gates);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/gates/:id
 * Busca um gate por ID
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const gate = await gateService.getGateById(req.params.id);

    if (!gate) {
      return res.status(404).json({
        error: 'Gate não encontrado',
        message: `Gate com ID ${req.params.id} não existe`,
      });
    }

    res.json(gate);
  } catch (error) {
    next(error);
  }
});

export default router;



