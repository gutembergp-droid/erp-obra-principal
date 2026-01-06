import { Router } from 'express';
import { SuprimentosControl } from '../controllers/suprimentos';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireCompetenciaAberta } from '../middlewares/competenciaAbertaMiddleware';

const router = Router();

/**
 * GET /api/suprimentos/insumos
 * Lista todos os insumos (com paginação opcional)
 * Query params: categoria, busca, page, pageSize, includeDeleted
 */
router.get(
  '/insumos',
  authMiddleware,
  SuprimentosControl.listQueryValidator,
  SuprimentosControl.list
);

/**
 * GET /api/suprimentos/insumos/:id
 * Busca um insumo por ID
 */
router.get('/insumos/:id', authMiddleware, SuprimentosControl.getById);

/**
 * POST /api/suprimentos/insumos
 * Cria um novo insumo
 * Requer competência aberta (para movimentos/consumo).
 */
router.post(
  '/insumos',
  authMiddleware,
  requireCompetenciaAberta,
  SuprimentosControl.createValidator,
  SuprimentosControl.create
);

/**
 * PUT /api/suprimentos/insumos/:id
 * Atualiza um insumo existente
 * Requer competência aberta (para movimentos/consumo).
 */
router.put(
  '/insumos/:id',
  authMiddleware,
  requireCompetenciaAberta,
  SuprimentosControl.updateValidator,
  SuprimentosControl.update
);

/**
 * DELETE /api/suprimentos/insumos/:id
 * Soft delete de um insumo
 * Requer competência aberta.
 */
router.delete('/insumos/:id', authMiddleware, requireCompetenciaAberta, SuprimentosControl.deletar);

export default router;

