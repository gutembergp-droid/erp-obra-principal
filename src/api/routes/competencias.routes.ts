import { Router } from 'express';
import prisma from '../../libs/prisma';
import { CompetenciasControl } from '../controllers/competencias';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateObraAccess } from '../middlewares/validateObra';

const router = Router();

/**
 * GET /api/competencias
 * Lista competências por obra (usa obra ativa ou obra_id)
 * Query params: obra_id (opcional, usa obra ativa se não fornecido)
 */
router.get(
  '/',
  authMiddleware,
  CompetenciasControl.listQueryValidator,
  CompetenciasControl.list
);

/**
 * GET /api/competencias/atual
 * Busca competência atual (aberta) da obra ativa
 */
router.get('/atual', authMiddleware, CompetenciasControl.getAtual);

/**
 * GET /api/competencias/:id
 * Busca competência por ID
 */
router.get('/:id', authMiddleware, CompetenciasControl.getById);

/**
 * GET /api/competencias/:id/status
 * Status consolidado: gates + pendências de bloqueio
 */
router.get('/:id/status', authMiddleware, CompetenciasControl.getStatus);

/**
 * POST /api/competencias/abrir
 * Abre uma nova competência mensal e cria os 9 gates automaticamente
 * Body: { periodo: "YYYY-MM", obra_id? (opcional, usa obra ativa) }
 */
router.post(
  '/abrir',
  authMiddleware,
  CompetenciasControl.abrirValidator,
  CompetenciasControl.abrir
);

/**
 * POST /api/competencias/:id/fechar
 * Fecha uma competência (valida gates obrigatórios)
 */
router.post('/:id/fechar', authMiddleware, CompetenciasControl.fechar);

/**
 * GET /api/competencias/:id/gates
 * Lista gates de uma competência
 */
router.get('/:id/gates', authMiddleware, CompetenciasControl.listGates);

/**
 * POST /api/competencias/:id/gates/:gateId/approve
 * Aprova um gate
 * Body: { observacoes? }
 */
router.post(
  '/:id/gates/:gateId/approve',
  authMiddleware,
  CompetenciasControl.approveGateValidator,
  CompetenciasControl.approveGate
);

/**
 * POST /api/competencias/:id/gates/:gateId/reject
 * Rejeita um gate (com motivo)
 * Body: { motivo: string }
 */
router.post(
  '/:id/gates/:gateId/reject',
  authMiddleware,
  CompetenciasControl.rejectGateValidator,
  CompetenciasControl.rejectGate
);

/**
 * ============================================
 * ROTAS LEGADAS (MANTIDAS PARA COMPATIBILIDADE)
 * ============================================
 */

/**
 * GET /api/obras/:obraId/competencias/ativa
 * Busca competência ativa (aberta) de uma obra
 * @deprecated Use GET /api/competencias/atual
 */
router.get(
  '/obras/:obraId/competencias/ativa',
  authMiddleware,
  validateObraAccess,
  async (req, res, next) => {
    try {
      const obraId = req.params.obraId;
      const competencia = await prisma.competenciaMensal.findFirst({
        where: {
          obra_id: obraId,
          status: 'aberta',
          deleted_at: null,
        },
        orderBy: { aberta_em: 'desc' },
      });

      if (!competencia) {
        return res.status(404).json({
          error: 'NOT_FOUND',
          message: 'Nenhuma competência ativa encontrada para esta obra',
        });
      }

      return res.json({
        id: competencia.id,
        obra_id: competencia.obra_id,
        periodo: competencia.periodo,
        status: competencia.status,
        aberta_em: competencia.aberta_em,
        fechada_em: competencia.fechada_em,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/obras/:obraId/competencias/abrir
 * Abre uma nova competência mensal
 * @deprecated Use POST /api/competencias/abrir
 */
router.post(
  '/obras/:obraId/competencias/abrir',
  authMiddleware,
  validateObraAccess,
  async (req, res, next) => {
    try {
      const obraId = req.params.obraId;
      const { periodo } = req.body;

      if (!periodo) {
        return res.status(400).json({
          error: 'INVALID_REQUEST',
          message: 'Campo "periodo" é obrigatório (formato: YYYY-MM)',
        });
      }

      const competencia = await prisma.competenciaMensal.create({
        data: {
          obra_id: obraId,
          periodo,
          status: 'aberta',
          aberta_em: new Date(),
        },
      });

      return res.status(201).json(competencia);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'PERIODO_DUPLICADO',
          message: 'Já existe uma competência para este período',
        });
      }
      next(error);
    }
  }
);

export default router;
