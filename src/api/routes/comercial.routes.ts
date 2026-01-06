import { Router, Request, Response } from 'express';
import prisma from '../../libs/prisma';
import { MedicaoService } from '../../services/MedicaoService';
import { CreateMedicaoProducaoDto, CreateMedicaoClienteDto } from '../../types/medicao';

const router = Router();
const medicaoService = new MedicaoService(prisma);

/**
 * FASE 1: Rotas do Comercial
 * Separação MP/MC conforme conceito oficial
 */

/**
 * GET /api/comercial/medicao-producao/obra/:obra_id
 * Lista Medições de Produção (MP) de uma obra
 */
router.get('/medicao-producao/obra/:obra_id', async (req: Request, res: Response) => {
  try {
    const { obra_id } = req.params;
    const { periodo } = req.query;

    const medicoes = await medicaoService.listMedicoesProducao(
      obra_id,
      periodo as string | undefined
    );

    return res.json(medicoes);
  } catch (error) {
    console.error('Erro ao listar medições de produção:', error);
    return res.status(500).json({
      message: 'Erro ao listar medições de produção',
      error: (error as Error).message,
    });
  }
});

/**
 * POST /api/comercial/medicao-producao
 * Cria uma Medição de Produção (MP)
 */
router.post('/medicao-producao', async (req: Request, res: Response) => {
  try {
    const data: CreateMedicaoProducaoDto = req.body;
    const usuarioId = (req as any).user?.id; // Assumindo autenticação via middleware

    if (!usuarioId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const medicao = await medicaoService.createMedicaoProducao(data, usuarioId);

    return res.status(201).json(medicao);
  } catch (error) {
    console.error('Erro ao criar medição de produção:', error);
    return res.status(500).json({
      message: 'Erro ao criar medição de produção',
      error: (error as Error).message,
    });
  }
});

/**
 * GET /api/comercial/medicao-cliente/obra/:obra_id
 * Lista Medições do Cliente (MC) de uma obra
 */
router.get('/medicao-cliente/obra/:obra_id', async (req: Request, res: Response) => {
  try {
    const { obra_id } = req.params;
    const { periodo } = req.query;

    const medicoes = await medicaoService.listMedicoesCliente(
      obra_id,
      periodo as string | undefined
    );

    return res.json(medicoes);
  } catch (error) {
    console.error('Erro ao listar medições do cliente:', error);
    return res.status(500).json({
      message: 'Erro ao listar medições do cliente',
      error: (error as Error).message,
    });
  }
});

/**
 * POST /api/comercial/medicao-cliente
 * Cria uma Medição do Cliente (MC)
 */
router.post('/medicao-cliente', async (req: Request, res: Response) => {
  try {
    const data: CreateMedicaoClienteDto = req.body;
    const usuarioId = (req as any).user?.id; // Assumindo autenticação via middleware

    if (!usuarioId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const medicao = await medicaoService.createMedicaoCliente(data, usuarioId);

    return res.status(201).json(medicao);
  } catch (error) {
    console.error('Erro ao criar medição do cliente:', error);
    return res.status(500).json({
      message: 'Erro ao criar medição do cliente',
      error: (error as Error).message,
    });
  }
});

/**
 * GET /api/comercial/comparativo/obra/:obra_id
 * Comparativo MP x MC (acesso restrito - sigiloso)
 */
router.get('/comparativo/obra/:obra_id', async (req: Request, res: Response) => {
  try {
    const { obra_id } = req.params;
    const { periodo } = req.query;

    if (!periodo) {
      return res.status(400).json({ message: 'Parâmetro período é obrigatório' });
    }

    const comparativo = await medicaoService.getComparativo(obra_id, periodo as string);

    return res.json(comparativo);
  } catch (error) {
    console.error('Erro ao gerar comparativo:', error);
    return res.status(500).json({
      message: 'Erro ao gerar comparativo',
      error: (error as Error).message,
    });
  }
});

export default router;






