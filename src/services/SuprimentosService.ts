import { PrismaClient, Insumo, Prisma } from '@prisma/client';
import { AuditService } from './AuditService';

/**
 * Service Layer para Suprimentos/Insumos
 * 
 * Responsabilidades:
 * - CRUD completo de Insumos
 * - Soft delete (deleted_at)
 * - Validações de regras de negócio
 */
export class SuprimentosService {
  private auditService: AuditService;

  constructor(private prisma: PrismaClient) {
    this.auditService = new AuditService(prisma);
  }

  /**
   * Lista todos os insumos (com filtros opcionais)
   */
  async listInsumos(filters?: {
    categoria?: string;
    busca?: string;
    includeDeleted?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<{ insumos: Insumo[]; total: number }> {
    const where: Prisma.InsumoWhereInput = {};

    // Filtro de soft delete
    if (!filters?.includeDeleted) {
      where.deleted_at = null;
    }

    // Filtro por categoria
    if (filters?.categoria) {
      where.categoria = filters.categoria;
    }

    // Busca por nome ou código
    if (filters?.busca) {
      where.OR = [
        { nome: { contains: filters.busca, mode: 'insensitive' } },
        { codigo: { contains: filters.busca, mode: 'insensitive' } },
      ];
    }

    // Paginação
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 100;
    const skip = (page - 1) * pageSize;

    // Conta total
    const total = await this.prisma.insumo.count({ where });

    // Busca insumos
    const insumos = await this.prisma.insumo.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip,
      take: pageSize,
    });

    return { insumos, total };
  }

  /**
   * Busca um insumo por ID
   */
  async getInsumoById(id: string, includeDeleted: boolean = false): Promise<Insumo | null> {
    const where: Prisma.InsumoWhereInput = { id };

    if (!includeDeleted) {
      where.deleted_at = null;
    }

    return this.prisma.insumo.findFirst({ where });
  }

  /**
   * Cria um novo insumo
   */
  async createInsumo(data: {
    codigo: string;
    nome: string;
    unidade: string;
    categoria: string;
    preco_estimado: number;
    estoque?: number;
  }): Promise<Insumo> {
    // Valida se código já existe (não deletado)
    const existente = await this.prisma.insumo.findUnique({
      where: { codigo: data.codigo },
    });

    if (existente && !existente.deleted_at) {
      throw new Error(`Já existe um insumo com o código ${data.codigo}`);
    }

    // Cria o insumo
    const insumo = await this.prisma.insumo.create({
      data: {
        codigo: data.codigo,
        nome: data.nome,
        unidade: data.unidade,
        categoria: data.categoria,
        preco_estimado: new Prisma.Decimal(data.preco_estimado),
        estoque: data.estoque ? new Prisma.Decimal(data.estoque) : new Prisma.Decimal(0),
      },
    });

    // Registra evento de auditoria
    await this.auditService.registrarEvento({
      obra_id: null, // Insumos não são vinculados a obra
      usuario_id: '', // Será preenchido pelo controller se necessário
      entity_type: 'Insumo',
      entity_id: insumo.id,
      action: 'CREATE',
      payload: {
        codigo: data.codigo,
        nome: data.nome,
        categoria: data.categoria,
      },
    });

    return insumo;
  }

  /**
   * Atualiza um insumo existente
   */
  async updateInsumo(id: string, data: {
    nome?: string;
    unidade?: string;
    categoria?: string;
    preco_estimado?: number;
    estoque?: number;
  }): Promise<Insumo> {
    // Verifica se existe
    const insumo = await this.prisma.insumo.findFirst({
      where: { id, deleted_at: null },
    });

    if (!insumo) {
      throw new Error(`Insumo com ID ${id} não encontrado`);
    }

    // Prepara dados de atualização
    const updateData: Prisma.InsumoUpdateInput = {};

    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.unidade !== undefined) updateData.unidade = data.unidade;
    if (data.categoria !== undefined) updateData.categoria = data.categoria;
    if (data.preco_estimado !== undefined) {
      updateData.preco_estimado = new Prisma.Decimal(data.preco_estimado);
    }
    if (data.estoque !== undefined) {
      updateData.estoque = new Prisma.Decimal(data.estoque);
    }

    // Atualiza
    const insumoAtualizado = await this.prisma.insumo.update({
      where: { id },
      data: updateData,
    });

    // Registra evento de auditoria
    await this.auditService.registrarEvento({
      obra_id: null,
      usuario_id: '', // Será preenchido pelo controller se necessário
      entity_type: 'Insumo',
      entity_id: id,
      action: 'UPDATE',
      payload: {
        codigo: insumo.codigo,
        nome: insumo.nome,
        alteracoes: Object.keys(updateData),
      },
    });

    return insumoAtualizado;
  }

  /**
   * Soft delete de um insumo
   */
  async deleteInsumo(id: string): Promise<void> {
    const insumo = await this.prisma.insumo.findFirst({
      where: { id, deleted_at: null },
    });

    if (!insumo) {
      throw new Error(`Insumo com ID ${id} não encontrado`);
    }

    await this.prisma.insumo.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    // Registra evento de auditoria
    await this.auditService.registrarEvento({
      obra_id: null,
      usuario_id: '', // Será preenchido pelo controller se necessário
      entity_type: 'Insumo',
      entity_id: id,
      action: 'DELETE',
      payload: {
        codigo: insumo.codigo,
        nome: insumo.nome,
      },
    });
  }
}

