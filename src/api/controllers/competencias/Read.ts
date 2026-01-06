import type { Request, Response, NextFunction } from 'express';
import prisma from '../../../libs/prisma';
import { CompetenciaService } from '../../../services/CompetenciaService';
import { ok, notFound } from '../../utils/apiResponse';
import { getObraAtivaFromUser } from '../../middlewares/validateObra';
import { ListCompetenciasQuerySchema, IListCompetenciasQuerySchema } from './schemas_zod';
import { validation } from '../../../shared/middlewares/Validation';

/**
 * Validator para query params de listagem
 */
export const listQueryValidator = validation(ListCompetenciasQuerySchema, 'query');

/**
 * Lista competências por obra (usa obra ativa ou obra_id)
 * GET /api/competencias
 */
export const list = async (
  req: Request<{}, {}, {}, IListCompetenciasQuerySchema>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const competenciaService = new CompetenciaService(prisma);
    let obraId = req.query.obra_id;

    // Se não fornecido, usa obra ativa
    if (!obraId) {
      const obraAtivaId = await getObraAtivaFromUser(req, res);
      if (!obraAtivaId) {
        return; // getObraAtivaFromUser já enviou resposta
      }
      obraId = obraAtivaId;
    }

    const competencias = await competenciaService.listCompetenciasByObra(obraId);
    ok(res, competencias);
  } catch (error) {
    next(error);
  }
};

/**
 * Busca competência atual (aberta) da obra ativa
 * GET /api/competencias/atual
 */
export const getAtual = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const competenciaService = new CompetenciaService(prisma);
    const obraId = await getObraAtivaFromUser(req, res);
    if (!obraId) {
      return;
    }

    const competencia = await competenciaService.getCompetenciaAtiva(obraId);

    if (!competencia) {
      notFound(res, 'Nenhuma competência aberta encontrada para esta obra');
      return;
    }

    ok(res, competencia);
  } catch (error) {
    next(error);
  }
};

/**
 * Busca competência por ID
 * GET /api/competencias/:id
 */
export const getById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const competenciaService = new CompetenciaService(prisma);
    const competencia = await competenciaService.getCompetenciaById(req.params.id);

    if (!competencia) {
      notFound(res, `Competência com ID ${req.params.id} não encontrada`);
      return;
    }

    ok(res, competencia);
  } catch (error) {
    next(error);
  }
};

/**
 * Status consolidado: gates + pendências de bloqueio
 * GET /api/competencias/:id/status
 */
export const getStatus = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const competenciaService = new CompetenciaService(prisma);
    const dados = await competenciaService.listarGatesComTravas(req.params.id);

    ok(res, {
      competencia: {
        id: dados.competencia.id,
        obra_id: dados.competencia.obra_id,
        periodo: dados.competencia.periodo,
        status: dados.competencia.status,
        aberta_em: dados.competencia.aberta_em,
        fechada_em: dados.competencia.fechada_em,
      },
      gates: dados.gates.map((gate) => ({
        numero: gate.numero,
        nome: gate.nome,
        status: gate.status,
        trava: gate.trava,
        aprovado_em: gate.aprovado_em,
        rejeitado_em: gate.rejeitado_em,
        motivo_rejeicao: gate.motivo_rejeicao,
        observacoes: gate.observacoes,
      })),
      travas: dados.travas,
      pode_concluir: dados.pode_concluir,
    });
  } catch (error: any) {
    if (error.message?.includes('não encontrada')) {
      notFound(res, error.message);
    } else {
      next(error);
    }
  }
};

/**
 * Lista gates de uma competência
 * GET /api/competencias/:id/gates
 */
export const listGates = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const competenciaService = new CompetenciaService(prisma);
    const dados = await competenciaService.listarGatesComTravas(req.params.id);

    ok(
      res,
      dados.gates.map((gate) => ({
        id: gate.id,
        numero: gate.numero,
        nome: gate.nome,
        status: gate.status,
        trava: gate.trava,
        aprovado_em: gate.aprovado_em,
        rejeitado_em: gate.rejeitado_em,
        motivo_rejeicao: gate.motivo_rejeicao,
        observacoes: gate.observacoes,
      }))
    );
  } catch (error: any) {
    if (error.message?.includes('não encontrada')) {
      notFound(res, error.message);
    } else {
      next(error);
    }
  }
};

