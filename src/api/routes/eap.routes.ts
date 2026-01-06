import { Router } from 'express';
import prisma from '../../libs/prisma';
import { EapService } from '../../services/EapService';
import { CreateEapDto, UpdateEapDto } from '../../types/eap';
import { CreateEapFatorConversaoDto, UpdateEapFatorConversaoDto } from '../../types/eap-fator-conversao';
import { validateObraAccess } from '../middlewares/validateObra';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const eapService = new EapService(prisma);

/**
 * GET /api/eap
 * Lista EAPs por baseline (filtro obrigatório)
 * Query params: baseline_id, tipo (opcional), includeDeleted (opcional)
 */
router.get('/', async (req, res, next) => {
  try {
    const baselineId = req.query.baseline_id as string;

    if (!baselineId) {
      return res.status(400).json({
        error: 'baseline_id obrigatório',
        message: 'O parâmetro baseline_id é obrigatório para listar EAPs',
      });
    }

    const tipo = req.query.tipo as 'comercial' | 'operacional' | undefined;
    const includeDeleted = req.query.includeDeleted === 'true';

    const eaps = await eapService.listEapByBaseline(baselineId, tipo, includeDeleted);
    res.json(eaps);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/eap/obra/:obra_id
 * Lista EAPs por obra (filtro multi-obra)
 * Query params: tipo (opcional), includeDeleted (opcional)
 */
router.get('/obra/:obra_id', validateObraAccess, async (req, res, next) => {
  try {
    const obraId = req.params.obra_id;
    const tipo = req.query.tipo as 'comercial' | 'operacional' | undefined;
    const includeDeleted = req.query.includeDeleted === 'true';

    const eaps = await eapService.listEapByObra(obraId, tipo, includeDeleted);
    res.json(eaps);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/eap/obra/:obra_id/folha
 * Lista apenas EAPs folha por obra
 */
router.get('/obra/:obra_id/folha', validateObraAccess, async (req, res, next) => {
  try {
    const obraId = req.params.obra_id;
    const tipo = req.query.tipo as 'comercial' | 'operacional' | undefined;

    const eaps = await eapService.listEapFolhaByObra(obraId, tipo);
    res.json(eaps);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/eap/comercial-operacional/:baseline_id
 * Busca EAP Comercial com suas EAPs Operacionais relacionadas
 * (usado pela interface de estruturação)
 */
router.get('/comercial-operacional/:baseline_id', async (req, res, next) => {
  try {
    const baselineId = req.params.baseline_id;
    const data = await eapService.getEapComercialComOperacional(baselineId);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/eap/:id
 * Busca uma EAP por ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const eap = await eapService.getEapById(req.params.id);

    if (!eap) {
      return res.status(404).json({
        error: 'EAP não encontrada',
        message: `EAP com ID ${req.params.id} não existe`,
      });
    }

    res.json(eap);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/eap
 * Cria uma nova EAP
 * 
 * IMPORTANTE: Ao criar/atualizar EAP Comercial, os itens operacionais
 * são recalculados automaticamente pelo EapService
 */
router.post('/', async (req, res, next) => {
  try {
    const data: CreateEapDto = req.body;
    // Extrai usuarioId do request (populado por authMiddleware)
    const usuarioId = (req as any).user?.id;
    const eap = await eapService.createEap(data, usuarioId);
    
    // O EapService já recalcula automaticamente as EAPs Operacionais
    // se a EAP criada for do tipo comercial
    
    res.status(201).json(eap);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/eap/:id
 * Atualiza uma EAP existente
 * 
 * IMPORTANTE: Ao atualizar EAP Comercial, os itens operacionais
 * são recalculados automaticamente pelo EapService
 */
router.put('/:id', async (req, res, next) => {
  try {
    const data: UpdateEapDto = req.body;
    const eap = await eapService.updateEap(req.params.id, data);
    
    // O EapService já recalcula automaticamente as EAPs Operacionais
    // se a EAP atualizada for do tipo comercial e tiver alterações em
    // quantidade ou valor_unitario
    
    res.json(eap);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/eap/:id
 * Soft delete de uma EAP
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await eapService.deleteEap(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// ============================================
// ROTAS DE FATORES DE CONVERSÃO
// ============================================

/**
 * GET /api/eap/:eap_comercial_id/fatores
 * Lista fatores de conversão de uma EAP Comercial
 */
router.get('/:eap_comercial_id/fatores', async (req, res, next) => {
  try {
    const eapComercialId = req.params.eap_comercial_id;
    const apenasAtivos = req.query.apenasAtivos !== 'false'; // default: true

    const fatores = await eapService.listFatoresConversaoByEapComercial(
      eapComercialId,
      apenasAtivos
    );
    res.json(fatores);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/eap/fatores
 * Cria um novo fator de conversão
 * 
 * IMPORTANTE: Ao criar fator de conversão, a EAP Operacional
 * é recalculada automaticamente pelo EapService
 */
router.post('/fatores', async (req, res, next) => {
  try {
    const data: CreateEapFatorConversaoDto = req.body;
    const fator = await eapService.createFatorConversao(data);
    
    // O EapService já recalcula automaticamente a EAP Operacional
    // relacionada quando um fator de conversão é criado
    
    res.status(201).json(fator);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/eap/fatores/:id
 * Atualiza um fator de conversão
 * 
 * IMPORTANTE: Ao atualizar fator de conversão, a EAP Operacional
 * é recalculada automaticamente pelo EapService
 */
router.put('/fatores/:id', async (req, res, next) => {
  try {
    const data: UpdateEapFatorConversaoDto = req.body;
    const fator = await eapService.updateFatorConversao(req.params.id, data);
    
    // O EapService já recalcula automaticamente a EAP Operacional
    // relacionada quando um fator de conversão é atualizado
    
    res.json(fator);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/eap/fatores/:id
 * Soft delete de um fator de conversão
 * 
 * IMPORTANTE: Ao deletar fator de conversão, a EAP Operacional
 * é recalculada automaticamente pelo EapService
 */
router.delete('/fatores/:id', async (req, res, next) => {
  try {
    await eapService.deleteFatorConversao(req.params.id);
    
    // O EapService já recalcula automaticamente a EAP Operacional
    // relacionada quando um fator de conversão é deletado
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

