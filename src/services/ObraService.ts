import { PrismaClient, Obra, Prisma } from '@prisma/client';
import { CreateObraDto, UpdateObraDto } from '../types/obras';

/**
 * Service Layer para Obras
 * 
 * Responsabilidades:
 * - CRUD de Obras
 * - Validações de regras de negócio
 * - Filtros e consultas
 */
export class ObraService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria uma nova Obra
   */
  async createObra(data: CreateObraDto): Promise<Obra> {
    // Valida código único
    const existingObra = await this.prisma.obra.findUnique({
      where: { codigo: data.codigo },
    });

    if (existingObra) {
      throw new Error(`Obra com código ${data.codigo} já existe`);
    }

    // Cria a obra
    const obra = await this.prisma.obra.create({
      data: {
        codigo: data.codigo,
        nome: data.nome,
        descricao: data.descricao,
        cliente: data.cliente,
        data_inicio: data.data_inicio,
        data_fim_prevista: data.data_fim_prevista,
        orcamento_total: data.orcamento_total ? new Prisma.Decimal(data.orcamento_total) : null,
        status: data.status || 'planejamento',
      },
    });

    return obra;
  }

  /**
   * Atualiza uma Obra existente
   */
  async updateObra(id: string, data: UpdateObraDto): Promise<Obra> {
    const obra = await this.prisma.obra.findUnique({
      where: { id },
    });

    if (!obra) {
      throw new Error(`Obra com ID ${id} não encontrada`);
    }

    // Valida código único se estiver sendo alterado
    if (data.codigo && data.codigo !== obra.codigo) {
      const existingObra = await this.prisma.obra.findUnique({
        where: { codigo: data.codigo },
      });

      if (existingObra) {
        throw new Error(`Obra com código ${data.codigo} já existe`);
      }
    }

    // Atualiza a obra
    const updatedObra = await this.prisma.obra.update({
      where: { id },
      data: {
        ...data,
        orcamento_total: data.orcamento_total !== undefined
          ? new Prisma.Decimal(data.orcamento_total)
          : undefined,
      },
    });

    return updatedObra;
  }

  /**
   * Busca Obra por ID
   */
  async getObraById(id: string): Promise<Obra | null> {
    return this.prisma.obra.findUnique({
      where: { id },
      include: {
        baseline_comercial: {
          where: { deleted_at: null },
          orderBy: { versao: 'desc' },
        },
        gates: {
          where: { deleted_at: null },
          orderBy: { ordem: 'asc' },
        },
        medicoes: {
          where: { deleted_at: null },
          orderBy: { data_medicao: 'desc' },
          take: 10, // Últimas 10 medições
        },
      },
    });
  }

  /**
   * Lista todas as Obras
   * 
   * IMPORTANTE: Se usuarioId for fornecido, retorna apenas as obras que o usuário tem permissão.
   * Admin tem acesso a todas as obras.
   * 
   * @param filters Filtros opcionais
   * @param usuarioId ID do usuário logado (opcional, mas recomendado para segurança)
   */
  async listObras(
    filters?: {
      status?: string;
      cliente?: string;
      includeDeleted?: boolean;
    },
    usuarioId?: string
  ): Promise<Obra[]> {
    const where: Prisma.ObraWhereInput = {
      deleted_at: filters?.includeDeleted ? undefined : null,
    };

    // Se usuarioId foi fornecido, filtra por permissões
    if (usuarioId) {
      // Busca o usuário para verificar perfil
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: usuarioId },
      });

      if (!usuario || !usuario.is_ativo) {
        // Usuário não encontrado ou inativo - retorna array vazio
        return [];
      }

      // Admin tem acesso a todas as obras
      if (usuario.perfil !== 'admin') {
        // Usuário não-admin: filtra apenas obras com permissão
        where.usuarios_permitidos = {
          some: {
            usuario_id: usuarioId,
            is_ativo: true,
            deleted_at: null,
          },
        };
      }
      // Se for admin, não adiciona filtro de permissão (acesso total)
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.cliente) {
      where.cliente = { contains: filters.cliente, mode: 'insensitive' };
    }

    return this.prisma.obra.findMany({
      where,
      orderBy: [
        { created_at: 'desc' },
        { nome: 'asc' },
      ],
    });
  }

  /**
   * Soft delete de uma Obra
   */
  async deleteObra(id: string): Promise<void> {
    await this.prisma.obra.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}

