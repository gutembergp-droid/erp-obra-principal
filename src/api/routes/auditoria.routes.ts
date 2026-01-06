import { Router } from 'express';
import prisma from '../../libs/prisma';
import { AuditoriaController } from '../controllers/AuditoriaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const auditoriaController = new AuditoriaController(prisma);

/**
 * GET /api/auditoria/eventos
 * Lista eventos de auditoria com filtros
 * Query params: obra_id (opcional, usa obra ativa), periodo_inicio, periodo_fim, entity_type, action, usuario_id, limit, offset
 */
router.get('/eventos', authMiddleware, (req, res, next) => {
  auditoriaController.listarEventos(req, res, next);
});

export default router;
