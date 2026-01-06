import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ReadModelService } from '../../services/ReadModelService';
import { ok, notFound, fail } from '../utils/apiResponse';
import { getObraAtivaFromUser } from '../middlewares/validateObra';

export class ReadModelController {
  private readModelService: ReadModelService;

  constructor(prisma: PrismaClient) {
    this.readModelService = new ReadModelService(prisma);
  }

  /**
   * GET /read/obra/resumo
   * KPIs mínimos da obra
   */
  async getObraResumo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let obraId = req.query.obra_id as string | undefined;

      // Se não fornecido, usa obra ativa
      if (!obraId) {
        const obraAtivaId = await getObraAtivaFromUser(req, res);
        if (!obraAtivaId) {
          return;
        }
        obraId = obraAtivaId;
      }

      const periodo = req.query.periodo as string | undefined;

      const resumo = await this.readModelService.getObraResumo(obraId, periodo);
      ok(res, resumo);
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  }

  /**
   * GET /read/competencia/status
   * Status consolidado da competência atual
   */
  async getCompetenciaStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let obraId = req.query.obra_id as string | undefined;

      // Se não fornecido, usa obra ativa
      if (!obraId) {
        const obraAtivaId = await getObraAtivaFromUser(req, res);
        if (!obraAtivaId) {
          return;
        }
        obraId = obraAtivaId;
      }

      const status = await this.readModelService.getCompetenciaStatus(obraId);
      ok(res, status);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /read/medicoes/resumo
   * Resumo de medições
   */
  async getMedicoesResumo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let obraId = req.query.obra_id as string | undefined;

      // Se não fornecido, usa obra ativa
      if (!obraId) {
        const obraAtivaId = await getObraAtivaFromUser(req, res);
        if (!obraAtivaId) {
          return;
        }
        obraId = obraAtivaId;
      }

      const periodo = req.query.periodo as string | undefined;

      const resumo = await this.readModelService.getMedicoesResumo(obraId, periodo);
      ok(res, resumo);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /read/suprimentos/resumo
   * Resumo de suprimentos
   */
  async getSuprimentosResumo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const obraId = req.query.obra_id as string | undefined;

      const resumo = await this.readModelService.getSuprimentosResumo(obraId);
      ok(res, resumo);
    } catch (error) {
      next(error);
    }
  }
}

