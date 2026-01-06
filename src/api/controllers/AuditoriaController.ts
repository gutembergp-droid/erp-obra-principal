import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuditService } from '../../services/AuditService';
import { ok, fail } from '../utils/apiResponse';
import { getObraAtivaFromUser } from '../middlewares/validateObra';

export class AuditoriaController {
  private auditService: AuditService;

  constructor(prisma: PrismaClient) {
    this.auditService = new AuditService(prisma);
  }

  /**
   * GET /api/auditoria/eventos
   * Lista eventos de auditoria com filtros
   * Query params: obra_id, periodo_inicio, periodo_fim, entity_type, action, usuario_id, limit, offset
   */
  async listarEventos(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const filters: any = {
        obra_id: obraId,
      };

      if (req.query.periodo_inicio) {
        filters.periodo_inicio = new Date(req.query.periodo_inicio as string);
      }

      if (req.query.periodo_fim) {
        filters.periodo_fim = new Date(req.query.periodo_fim as string);
      }

      if (req.query.entity_type) {
        filters.entity_type = req.query.entity_type as string;
      }

      if (req.query.action) {
        filters.action = req.query.action as string;
      }

      if (req.query.usuario_id) {
        filters.usuario_id = req.query.usuario_id as string;
      }

      if (req.query.limit) {
        filters.limit = parseInt(req.query.limit as string, 10);
      }

      if (req.query.offset) {
        filters.offset = parseInt(req.query.offset as string, 10);
      }

      const resultado = await this.auditService.listarEventos(filters);
      ok(res, resultado);
    } catch (error) {
      next(error);
    }
  }
}



