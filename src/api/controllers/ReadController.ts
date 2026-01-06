import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ReadService } from '../../services/ReadService';
import { ok, notFound, fail } from '../utils/apiResponse';
import { getObraAtivaFromUser } from '../middlewares/validateObra';

export class ReadController {
  private readService: ReadService;

  constructor(prisma: PrismaClient) {
    this.readService = new ReadService(prisma);
  }

  /**
   * GET /api/read/obra/resumo
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
      // Se não fornecido, usa mês atual
      if (!periodo) {
        const now = new Date();
        const mesAtual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const resumo = await this.readService.getObraResumo(obraId, mesAtual);
        ok(res, resumo);
        return;
      }

      const resumo = await this.readService.getObraResumo(obraId, periodo);
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
   * GET /api/read/competencia/status
   * Status da competência atual
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

      const status = await this.readService.getCompetenciaStatus(obraId);
      ok(res, status);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/read/medicoes/resumo
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
      const resumo = await this.readService.getMedicoesResumo(obraId, periodo);
      ok(res, resumo);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/read/suprimentos/resumo
   * Resumo de suprimentos
   */
  async getSuprimentosResumo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resumo = await this.readService.getSuprimentosResumo();
      ok(res, resumo);
    } catch (error) {
      next(error);
    }
  }
}



