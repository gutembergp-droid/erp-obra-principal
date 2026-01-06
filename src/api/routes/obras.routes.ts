import { Router } from 'express';
import { ObrasControl } from '../controllers/obras';
import { validateObraAccess } from '../middlewares/validateObra';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * GET /api/obras
 * Lista todas as obras (com filtros opcionais)
 * 
 * IMPORTANTE: Retorna apenas as obras que o usuário logado tem permissão para ver.
 * Admin vê todas as obras.
 * Requer autenticação.
 */
router.get(
  '/',
  authMiddleware,
  ObrasControl.listQueryValidator,
  ObrasControl.list
);

/**
 * GET /api/obras/:id
 * Busca uma obra por ID
 */
router.get('/:id', ObrasControl.getById);

/**
 * POST /api/obras
 * Cria uma nova obra
 */
router.post(
  '/',
  authMiddleware,
  ObrasControl.createValidator,
  ObrasControl.create
);

/**
 * PUT /api/obras/:id
 * Atualiza uma obra existente
 */
router.put(
  '/:id',
  authMiddleware,
  ObrasControl.updateValidator,
  ObrasControl.update
);

/**
 * DELETE /api/obras/:id
 * Soft delete de uma obra
 */
router.delete('/:id', authMiddleware, ObrasControl.deletar);

export default router;
