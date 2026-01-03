import { Router, Request, Response } from 'express';
import { comunicadoService } from '../../services/ComunicadoService';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

/**
 * GET /api/comunicados
 * Lista comunicados com filtros
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { escopo, status, obra_id, categoria, apenas_publicados, apenas_fixados } = req.query;
    
    const comunicados = await comunicadoService.listar({
      escopo: escopo as any,
      status: status as any,
      obra_id: obra_id as string,
      categoria: categoria as string,
      apenas_publicados: apenas_publicados === 'true',
      apenas_fixados: apenas_fixados === 'true'
    });

    res.json(comunicados);
  } catch (error) {
    console.error('Erro ao listar comunicados:', error);
    res.status(500).json({ error: 'Erro ao listar comunicados' });
  }
});

/**
 * GET /api/comunicados/intranet
 * Lista comunicados para exibição na Intranet (agrupados por escopo)
 */
router.get('/intranet', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { obra_id } = req.query;
    const usuario_id = req.user?.id;

    const comunicados = await comunicadoService.listarParaIntranet(
      obra_id as string,
      usuario_id
    );

    res.json(comunicados);
  } catch (error) {
    console.error('Erro ao listar comunicados para intranet:', error);
    res.status(500).json({ error: 'Erro ao listar comunicados' });
  }
});

/**
 * GET /api/comunicados/historico
 * Lista histórico de comunicados para auditoria
 */
router.get('/historico', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data_inicio, data_fim, categoria, setor_origem, status, autor_id } = req.query;

    const historico = await comunicadoService.listarHistorico({
      data_inicio: data_inicio ? new Date(data_inicio as string) : undefined,
      data_fim: data_fim ? new Date(data_fim as string) : undefined,
      categoria: categoria as string,
      setor_origem: setor_origem as string,
      status: status as any,
      autor_id: autor_id as string
    });

    res.json(historico);
  } catch (error) {
    console.error('Erro ao listar histórico:', error);
    res.status(500).json({ error: 'Erro ao listar histórico' });
  }
});

/**
 * GET /api/comunicados/:id
 * Busca um comunicado por ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comunicado = await comunicadoService.buscarPorId(id);

    if (!comunicado) {
      return res.status(404).json({ error: 'Comunicado não encontrado' });
    }

    res.json(comunicado);
  } catch (error) {
    console.error('Erro ao buscar comunicado:', error);
    res.status(500).json({ error: 'Erro ao buscar comunicado' });
  }
});

/**
 * POST /api/comunicados
 * Cria um novo comunicado
 */
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const autor_id = req.user?.id;
    if (!autor_id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const comunicado = await comunicadoService.criar(req.body, autor_id);
    res.status(201).json(comunicado);
  } catch (error) {
    console.error('Erro ao criar comunicado:', error);
    res.status(500).json({ error: 'Erro ao criar comunicado' });
  }
});

/**
 * POST /api/comunicados/:id/submeter
 * Submete comunicado para validação do setor
 */
router.post('/:id/submeter', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const comunicado = await comunicadoService.submeterParaValidacao(id);
    res.json(comunicado);
  } catch (error) {
    console.error('Erro ao submeter comunicado:', error);
    res.status(500).json({ error: 'Erro ao submeter comunicado' });
  }
});

/**
 * POST /api/comunicados/:id/validar
 * Valida comunicado (Chefe do Setor)
 */
router.post('/:id/validar', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validador_id = req.user?.id;
    
    if (!validador_id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const comunicado = await comunicadoService.validarPeloSetor(id, validador_id);
    res.json(comunicado);
  } catch (error) {
    console.error('Erro ao validar comunicado:', error);
    res.status(500).json({ error: 'Erro ao validar comunicado' });
  }
});

/**
 * POST /api/comunicados/:id/devolver
 * Devolve comunicado para ajustes
 */
router.post('/:id/devolver', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const comunicado = await comunicadoService.devolverParaAjustes(id);
    res.json(comunicado);
  } catch (error) {
    console.error('Erro ao devolver comunicado:', error);
    res.status(500).json({ error: 'Erro ao devolver comunicado' });
  }
});

/**
 * POST /api/comunicados/:id/publicar
 * Publica comunicado
 */
router.post('/:id/publicar', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const publicador_id = req.user?.id;
    
    if (!publicador_id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const comunicado = await comunicadoService.publicar(id, publicador_id);
    res.json(comunicado);
  } catch (error) {
    console.error('Erro ao publicar comunicado:', error);
    res.status(500).json({ error: 'Erro ao publicar comunicado' });
  }
});

/**
 * POST /api/comunicados/:id/aprovar-corporativo
 * Aprova comunicado global (Corporativo)
 */
router.post('/:id/aprovar-corporativo', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const aprovador_id = req.user?.id;
    
    if (!aprovador_id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const comunicado = await comunicadoService.aprovarCorporativo(id, aprovador_id);
    res.json(comunicado);
  } catch (error) {
    console.error('Erro ao aprovar comunicado:', error);
    res.status(500).json({ error: 'Erro ao aprovar comunicado' });
  }
});

/**
 * POST /api/comunicados/:id/fixar
 * Fixa/desfixa comunicado no topo
 */
router.post('/:id/fixar', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const comunicado = await comunicadoService.toggleFixado(id);
    res.json(comunicado);
  } catch (error) {
    console.error('Erro ao fixar comunicado:', error);
    res.status(500).json({ error: 'Erro ao fixar comunicado' });
  }
});

/**
 * POST /api/comunicados/:id/confirmar-leitura
 * Confirma leitura de um comunicado
 */
router.post('/:id/confirmar-leitura', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user?.id;
    
    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const confirmacao = await comunicadoService.confirmarLeitura(id, usuario_id);
    res.json(confirmacao);
  } catch (error) {
    console.error('Erro ao confirmar leitura:', error);
    res.status(500).json({ error: 'Erro ao confirmar leitura' });
  }
});

/**
 * POST /api/comunicados/:id/errata
 * Cria uma errata vinculada a um comunicado
 */
router.post('/:id/errata', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const autor_id = req.user?.id;
    
    if (!autor_id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const errata = await comunicadoService.criarErrata(id, req.body, autor_id);
    res.status(201).json(errata);
  } catch (error) {
    console.error('Erro ao criar errata:', error);
    res.status(500).json({ error: 'Erro ao criar errata' });
  }
});

export default router;
