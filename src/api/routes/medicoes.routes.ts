import { Router } from 'express';
import prisma from '../../libs/prisma';
import { MedicoesController } from '../controllers/MedicoesController';
import { validateObraAccess, requireObraId } from '../middlewares/validateObra';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireCompetenciaAberta } from '../middlewares/competenciaAbertaMiddleware';

const router = Router();
const medicoesController = new MedicoesController(prisma);

/**
 * ============================================
 * NOVOS ENDPOINTS COM OBRA ATIVA AUTOMÁTICA
 * ============================================
 * 
 * Estes endpoints usam automaticamente a obra ativa do contexto do usuário autenticado.
 * Não aceitam obra_id por query ou params.
 */

/**
 * GET /api/medicoes/producao
 * Lista Medições de Produção (MP) da obra ativa do usuário
 * Query params: periodo (opcional, ex: "2026-01")
 * 
 * Usa automaticamente obra_ativa_id do contexto do usuário autenticado.
 * Formato canônico: { "data": [...], "meta": null }
 */
router.get('/producao', authMiddleware, (req, res, next) => {
  medicoesController.getProducao(req, res, next);
});

/**
 * GET /api/medicoes/cliente
 * Lista Medições do Cliente (MC) da obra ativa do usuário
 * Query params: periodo (opcional, ex: "2026-01")
 * 
 * Usa automaticamente obra_ativa_id do contexto do usuário autenticado.
 * Formato canônico: { "data": [...], "meta": null }
 */
router.get('/cliente', authMiddleware, (req, res, next) => {
  medicoesController.getCliente(req, res, next);
});

/**
 * GET /api/medicoes/comparativo
 * Comparativo MP x MC da obra ativa do usuário
 * Query params: periodo (obrigatório, ex: "2026-01")
 * 
 * Usa automaticamente obra_ativa_id do contexto do usuário autenticado.
 * Formato canônico: { "data": [...], "meta": null }
 */
router.get('/comparativo', authMiddleware, (req, res, next) => {
  medicoesController.getComparativo(req, res, next);
});

/**
 * ============================================
 * ENDPOINTS EXISTENTES (MANTIDOS PARA COMPATIBILIDADE)
 * ============================================
 */

/**
 * GET /api/medicoes/obra/:obra_id
 * Lista medições por obra (filtro obrigatório - multi-obra)
 * Query params: eap_id, usuario_id, periodo_referencia, status, includeDeleted
 */
router.get('/obra/:obra_id', validateObraAccess, (req, res, next) => {
  medicoesController.getByObra(req, res, next);
});

/**
 * GET /api/medicoes
 * Lista todas as medições (uso administrativo)
 * Query params: obra_id (opcional), eap_id, usuario_id, periodo_referencia, status
 */
router.get('/', authMiddleware, (req, res, next) => {
  medicoesController.getAll(req, res, next);
});

/**
 * GET /api/medicoes/:id
 * Busca uma medição por ID
 */
router.get('/:id', authMiddleware, (req, res, next) => {
  medicoesController.getById(req, res, next);
});

/**
 * POST /api/medicoes
 * Cria uma nova medição
 * 
 * IMPORTANTE: usuario_id é extraído automaticamente do token JWT via authMiddleware
 * Requer autenticação e competência aberta.
 */
router.post('/', authMiddleware, requireObraId, validateObraAccess, requireCompetenciaAberta, (req, res, next) => {
  medicoesController.create(req, res, next);
});

/**
 * PUT /api/medicoes/:id
 * Atualiza uma medição existente (apenas se DRAFT ou REJECTED)
 * Requer competência aberta.
 */
router.put('/:id', authMiddleware, requireCompetenciaAberta, (req, res, next) => {
  medicoesController.update(req, res, next);
});

/**
 * POST /api/medicoes/:id/submit
 * Submete uma medição (DRAFT -> SUBMITTED)
 * Requer competência aberta.
 */
router.post('/:id/submit', authMiddleware, requireCompetenciaAberta, (req, res, next) => {
  medicoesController.submit(req, res, next);
});

/**
 * POST /api/medicoes/:id/aprovar
 * Aprova uma medição (SUBMITTED -> APPROVED)
 */
router.post('/:id/aprovar', authMiddleware, (req, res, next) => {
  medicoesController.aprovar(req, res, next);
});

/**
 * POST /api/medicoes/:id/rejeitar
 * Rejeita uma medição (SUBMITTED -> REJECTED)
 * Body: { motivo_rejeicao: string }
 */
router.post('/:id/rejeitar', authMiddleware, (req, res, next) => {
  medicoesController.rejeitar(req, res, next);
});

/**
 * DELETE /api/medicoes/:id
 * Soft delete de uma medição
 */
router.delete('/:id', authMiddleware, (req, res, next) => {
  medicoesController.delete(req, res, next);
});

export default router;
