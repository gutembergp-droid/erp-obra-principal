import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { SuprimentosService } from '../../services/SuprimentosService';
import { AuditService } from '../../services/AuditService';
import { ok, created, notFound, fail, internalError } from '../utils/apiResponse';

export class SuprimentosController {
  private suprimentosService: SuprimentosService;
  private auditService: AuditService;

  constructor(prisma: PrismaClient) {
    this.suprimentosService = new SuprimentosService(prisma);
    this.auditService = new AuditService(prisma);
  }

  /**
   * GET /api/suprimentos/insumos
   * Lista todos os insumos (com paginação opcional)
   */
  async listInsumos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        categoria: req.query.categoria as string | undefined,
        busca: req.query.busca as string | undefined,
        includeDeleted: req.query.includeDeleted === 'true',
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined,
      };

      const result = await this.suprimentosService.listInsumos(filters);

      // Formato canônico com meta de paginação
      const meta = {
        page: filters.page || 1,
        pageSize: filters.pageSize || 100,
        total: result.total,
      };

      ok(res, result.insumos, meta);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/suprimentos/insumos/:id
   * Busca um insumo por ID
   */
  async getInsumoById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const insumo = await this.suprimentosService.getInsumoById(req.params.id);

      if (!insumo) {
        notFound(res, `Insumo com ID ${req.params.id} não encontrado`);
        return;
      }

      ok(res, insumo);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/suprimentos/insumos
   * Cria um novo insumo
   */
  async createInsumo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { codigo, nome, unidade, categoria, preco_estimado, estoque } = req.body;

      // Validação de campos obrigatórios
      if (!codigo || !nome || !unidade || !categoria || preco_estimado === undefined) {
        fail(res, 'Campos obrigatórios faltando: codigo, nome, unidade, categoria e preco_estimado são obrigatórios', 400);
        return;
      }

      // Validação de preço
      if (parseFloat(preco_estimado) <= 0) {
        fail(res, 'Preço deve ser maior que zero', 400);
        return;
      }

      const insumo = await this.suprimentosService.createInsumo({
        codigo,
        nome,
        unidade,
        categoria,
        preco_estimado: parseFloat(preco_estimado),
        estoque: estoque ? parseFloat(estoque) : undefined,
      });

      // Registra evento de auditoria
      const usuarioId = (req as any).user?.id;
      if (usuarioId) {
        this.auditService.registrarEvento({
          obra_id: null, // Insumos não são vinculados a obra específica
          usuario_id: usuarioId,
          entity_type: 'Insumo',
          entity_id: insumo.id,
          action: 'CREATE',
          payload: {
            codigo: insumo.codigo,
            nome: insumo.nome,
            categoria: insumo.categoria,
          },
        }).catch(err => console.error('Erro ao registrar evento de auditoria:', err));
      }

      created(res, insumo);
    } catch (error: any) {
      if (error.message.includes('já existe')) {
        fail(res, error.message, 409);
      } else {
        next(error);
      }
    }
  }

  /**
   * PUT /api/suprimentos/insumos/:id
   * Atualiza um insumo existente
   */
  async updateInsumo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nome, unidade, categoria, preco_estimado, estoque } = req.body;

      const updateData: any = {};
      if (nome !== undefined) updateData.nome = nome;
      if (unidade !== undefined) updateData.unidade = unidade;
      if (categoria !== undefined) updateData.categoria = categoria;
      if (preco_estimado !== undefined) {
        if (parseFloat(preco_estimado) <= 0) {
          fail(res, 'Preço deve ser maior que zero', 400);
          return;
        }
        updateData.preco_estimado = parseFloat(preco_estimado);
      }
      if (estoque !== undefined) updateData.estoque = parseFloat(estoque);

      const insumo = await this.suprimentosService.updateInsumo(req.params.id, updateData);
      
      // Registra evento de auditoria
      const usuarioId = (req as any).user?.id;
      if (usuarioId) {
        this.auditService.registrarEvento({
          obra_id: null,
          usuario_id: usuarioId,
          entity_type: 'Insumo',
          entity_id: insumo.id,
          action: 'UPDATE',
          payload: {
            codigo: insumo.codigo,
            campos_alterados: Object.keys(updateData),
          },
        }).catch(err => console.error('Erro ao registrar evento de auditoria:', err));
      }

      ok(res, insumo);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  }

  /**
   * DELETE /api/suprimentos/insumos/:id
   * Soft delete de um insumo
   */
  async deleteInsumo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Busca insumo antes de deletar para auditoria
      const insumo = await this.suprimentosService.getInsumoById(req.params.id);
      
      await this.suprimentosService.deleteInsumo(req.params.id);
      
      // Registra evento de auditoria
      const usuarioId = (req as any).user?.id;
      if (usuarioId && insumo) {
        this.auditService.registrarEvento({
          obra_id: null,
          usuario_id: usuarioId,
          entity_type: 'Insumo',
          entity_id: req.params.id,
          action: 'DELETE',
          payload: {
            codigo: insumo.codigo,
            nome: insumo.nome,
          },
        }).catch(err => console.error('Erro ao registrar evento de auditoria:', err));
      }

      ok(res, { message: 'Insumo deletado com sucesso' });
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        notFound(res, error.message);
      } else {
        next(error);
      }
    }
  }
}

