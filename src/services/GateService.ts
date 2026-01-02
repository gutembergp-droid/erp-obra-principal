import { PrismaClient, Gate, Prisma } from '@prisma/client';
import { CreateGateDto, UpdateGateDto } from '../types/gates';

/**
 * Service Layer para Gates (Portões/Marcos do Projeto)
 * 
 * Responsabilidades:
 * - CRUD de Gates
 * - Filtro por obra_id (multi-obra)
 * - Registro de usuario_id em todas as ações
 * - Validações de regras de negócio
 */
export class GateService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria um novo Gate
   * Registra automaticamente o usuario_id se fornecido
   */
  async createGate(data: CreateGateDto): Promise<Gate> {
    // Valida se a obra existe
    const obra = await this.prisma.obra.findUnique({
      where: { id: data.obra_id },
    });

    if (!obra) {
      throw new Error(`Obra com ID ${data.obra_id} não encontrada`);
    }

    // Valida código único na obra
    const existingGate = await this.prisma.gate.findUnique({
      where: {
        obra_id_codigo: {
          obra_id: data.obra_id,
          codigo: data.codigo,
        },
      },
    });

    if (existingGate) {
      throw new Error(`Gate com código ${data.codigo} já existe nesta obra`);
    }

    // Valida usuário se fornecido
    if (data.usuario_id) {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: data.usuario_id },
      });

      if (!usuario) {
        throw new Error(`Usuário com ID ${data.usuario_id} não encontrado`);
      }
    }

    // Cria o gate
    const gate = await this.prisma.gate.create({
      data: {
        obra_id: data.obra_id,
        codigo: data.codigo,
        nome: data.nome,
        descricao: data.descricao,
        tipo: data.tipo,
        ordem: data.ordem,
        data_prevista: data.data_prevista,
        criterios_aprovacao: data.criterios_aprovacao,
        usuario_id: data.usuario_id,
      },
    });

    return gate;
  }

  /**
   * Atualiza um Gate existente
   * Registra o usuario_id da ação
   */
  async updateGate(id: string, data: UpdateGateDto): Promise<Gate> {
    const gate = await this.prisma.gate.findUnique({
      where: { id },
    });

    if (!gate) {
      throw new Error(`Gate com ID ${id} não encontrado`);
    }

    // Valida usuário se fornecido
    if (data.usuario_id) {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: data.usuario_id },
      });

      if (!usuario) {
        throw new Error(`Usuário com ID ${data.usuario_id} não encontrado`);
      }
    }

    // Valida usuário aprovador se fornecido
    if (data.usuario_aprovador_id) {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: data.usuario_aprovador_id },
      });

      if (!usuario) {
        throw new Error(`Usuário aprovador com ID ${data.usuario_aprovador_id} não encontrado`);
      }
    }

    // Atualiza o gate
    const updatedGate = await this.prisma.gate.update({
      where: { id },
      data: {
        ...data,
        // Se status mudou para aprovado, registra data de aprovação
        data_aprovacao: data.status === 'aprovado' && !gate.data_aprovacao
          ? new Date()
          : data.data_aprovacao,
      },
    });

    return updatedGate;
  }

  /**
   * Busca Gate por ID
   */
  async getGateById(id: string): Promise<Gate | null> {
    return this.prisma.gate.findUnique({
      where: { id },
      include: {
        obra: true,
        usuario_criador: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        usuario_aprovador: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Lista Gates por obra_id (filtro obrigatório para multi-obra)
   */
  async listGatesByObra(
    obraId: string,
    filters?: {
      status?: string;
      tipo?: string;
      usuario_id?: string;
      includeDeleted?: boolean;
    }
  ): Promise<Gate[]> {
    const where: Prisma.GateWhereInput = {
      obra_id: obraId, // Filtro obrigatório por obra
      deleted_at: filters?.includeDeleted ? undefined : null,
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.tipo) {
      where.tipo = filters.tipo;
    }

    if (filters?.usuario_id) {
      where.usuario_id = filters.usuario_id;
    }

    return this.prisma.gate.findMany({
      where,
      orderBy: [
        { ordem: 'asc' },
        { codigo: 'asc' },
      ],
      include: {
        usuario_criador: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        usuario_aprovador: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Lista todos os Gates (com filtro opcional por obra_id)
   * Para uso administrativo - sempre filtrar por obra_id quando possível
   */
  async listAllGates(filters?: {
    obra_id?: string;
    status?: string;
    tipo?: string;
    usuario_id?: string;
    includeDeleted?: boolean;
  }): Promise<Gate[]> {
    const where: Prisma.GateWhereInput = {
      deleted_at: filters?.includeDeleted ? undefined : null,
    };

    if (filters?.obra_id) {
      where.obra_id = filters.obra_id;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.tipo) {
      where.tipo = filters.tipo;
    }

    if (filters?.usuario_id) {
      where.usuario_id = filters.usuario_id;
    }

    return this.prisma.gate.findMany({
      where,
      orderBy: [
        { obra_id: 'asc' },
        { ordem: 'asc' },
        { codigo: 'asc' },
      ],
    });
  }

  /**
   * Aprova um Gate
   * Registra usuario_aprovador_id e data_aprovacao
   */
  async aprovarGate(id: string, usuarioAprovadorId: string): Promise<Gate> {
    const gate = await this.prisma.gate.findUnique({
      where: { id },
    });

    if (!gate) {
      throw new Error(`Gate com ID ${id} não encontrado`);
    }

    // Valida usuário aprovador
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioAprovadorId },
    });

    if (!usuario) {
      throw new Error(`Usuário com ID ${usuarioAprovadorId} não encontrado`);
    }

    // Atualiza o gate
    return this.prisma.gate.update({
      where: { id },
      data: {
        status: 'aprovado',
        usuario_aprovador_id: usuarioAprovadorId,
        data_aprovacao: new Date(),
      },
    });
  }

  /**
   * Soft delete de um Gate
   */
  async deleteGate(id: string): Promise<void> {
    await this.prisma.gate.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}

