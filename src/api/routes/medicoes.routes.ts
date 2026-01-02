import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { MedicaoService } from '../../services/MedicaoService';
import { CreateMedicaoDto, UpdateMedicaoDto, AprovarMedicaoDto } from '../../types/medicao';
import { validateObraAccess, requireObraId } from '../middleware/validateObra';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();
const medicaoService = new MedicaoService(prisma);

/**
 * GET /api/medicoes/obra/:obra_id
 * Lista medições por obra (filtro obrigatório - multi-obra)
 * Query params: eap_id, usuario_id, periodo_referencia, status, includeDeleted
 */
router.get('/obra/:obra_id', validateObraAccess, async (req, res, next) => {
  try {
    const obraId = req.params.obra_id;
    const filters = {
      eap_id: req.query.eap_id as string | undefined,
      usuario_id: req.query.usuario_id as string | undefined,
      periodo_referencia: req.query.periodo_referencia as string | undefined,
      status: req.query.status as string | undefined,
      includeDeleted: req.query.includeDeleted === 'true',
    };

    const medicoes = await medicaoService.listMedicoesByObra(obraId, filters);
    res.json(medicoes);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/medicoes
 * Lista todas as medições (uso administrativo)
 * Query params: obra_id (opcional), eap_id, usuario_id, periodo_referencia, status
 */
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      obra_id: req.query.obra_id as string | undefined,
      eap_id: req.query.eap_id as string | undefined,
      usuario_id: req.query.usuario_id as string | undefined,
      periodo_referencia: req.query.periodo_referencia as string | undefined,
      status: req.query.status as string | undefined,
      includeDeleted: req.query.includeDeleted === 'true',
    };

    const medicoes = await medicaoService.listAllMedicoes(filters);
    res.json(medicoes);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/medicoes/:id
 * Busca uma medição por ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const medicao = await medicaoService.getMedicaoById(req.params.id);

    if (!medicao) {
      return res.status(404).json({
        error: 'Medição não encontrada',
        message: `Medição com ID ${req.params.id} não existe`,
      });
    }

    res.json(medicao);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/medicoes
 * Cria uma nova medição
 * 
 * IMPORTANTE: usuario_id é extraído automaticamente do token JWT via authMiddleware
 * Requer autenticação.
 */
router.post('/', authMiddleware, requireObraId, validateObraAccess, async (req, res, next) => {
  try {
    const data: CreateMedicaoDto = req.body;
    
    // Extrai usuarioId do request (populado por authMiddleware)
    const usuarioId = (req as any).user?.id;

    if (!usuarioId) {
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'Usuário não autenticado',
      });
    }

    const medicao = await medicaoService.createMedicao(data, usuarioId);
    res.status(201).json(medicao);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/medicoes/:id
 * Atualiza uma medição existente
 */
router.put('/:id', async (req, res, next) => {
  try {
    const data: UpdateMedicaoDto = req.body;
    const medicao = await medicaoService.updateMedicao(req.params.id, data);
    res.json(medicao);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/medicoes/:id/aprovar
 * Aprova uma medição
 */
router.post('/:id/aprovar', async (req, res, next) => {
  try {
    const data: AprovarMedicaoDto = req.body;
    
    // TODO: Em produção, obter do token JWT
    if (!data.aprovado_por_id) {
      return res.status(400).json({
        error: 'aprovado_por_id obrigatório',
        message: 'O campo aprovado_por_id é obrigatório para aprovar uma medição',
      });
    }

    const medicao = await medicaoService.aprovarMedicao(req.params.id, data);
    res.json(medicao);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/medicoes/:id/rejeitar
 * Rejeita uma medição
 */
router.post('/:id/rejeitar', async (req, res, next) => {
  try {
    const observacoes = req.body.observacoes;
    const medicao = await medicaoService.rejeitarMedicao(req.params.id, observacoes);
    res.json(medicao);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/medicoes/:id
 * Soft delete de uma medição
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await medicaoService.deleteMedicao(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

