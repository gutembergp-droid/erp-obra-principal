import { Router } from 'express';
import prisma from '../../libs/prisma';
import { ReadController } from '../controllers/ReadController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const readController = new ReadController(prisma);

/**
 * GET /api/read/obra/resumo
 * KPIs mínimos: total EAP, total medido (MP/MC), desvios, status competência atual, gates pendentes
 * Query params: obra_id (opcional, usa obra ativa), periodo (opcional, default mês atual)
 */
router.get('/obra/resumo', authMiddleware, (req, res, next) => {
  readController.getObraResumo(req, res, next);
});

/**
 * GET /api/read/competencia/status
 * Competência atual: status (OPEN/CLOSED), gates (PENDING/APPROVED/REJECTED), motivos, pendências
 * Query params: obra_id (opcional, usa obra ativa)
 */
router.get('/competencia/status', authMiddleware, (req, res, next) => {
  readController.getCompetenciaStatus(req, res, next);
});

/**
 * GET /api/read/medicoes/resumo
 * Contagens e totais por status, por tipo (MP/MC), e lista resumida recente
 * Query params: obra_id (opcional, usa obra ativa), periodo (opcional)
 */
router.get('/medicoes/resumo', authMiddleware, (req, res, next) => {
  readController.getMedicoesResumo(req, res, next);
});

/**
 * GET /api/read/suprimentos/resumo
 * Total de insumos cadastrados, últimos criados/alterados
 */
router.get('/suprimentos/resumo', authMiddleware, (req, res, next) => {
  readController.getSuprimentosResumo(req, res, next);
});

export default router;
