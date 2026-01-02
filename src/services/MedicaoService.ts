import { PrismaClient, Medicao, Prisma, TipoMedicao } from '@prisma/client';
import { CreateMedicaoDto, UpdateMedicaoDto, AprovarMedicaoDto, CreateMedicaoProducaoDto, CreateMedicaoClienteDto, TipoMedicao as TipoMedicaoType } from '../types/medicao';

/**
 * Service Layer para Medições
 * FASE 1: Separação MP/MC conforme conceito oficial
 * 
 * Responsabilidades:
 * - CRUD de Medições (MP e MC separadas)
 * - Filtro por obra_id (multi-obra)
 * - Registro obrigatório de usuario_id em todas as ações
 * - Aprovação de medições
 * - Comparativo MP x MC
 * - Validações de regras de negócio
 */
export class MedicaoService {
  constructor(private prisma: PrismaClient) {}

  /**
   * FASE 1: Cria uma Medição de Produção (MP)
   * Representa o que foi realmente executado
   */
  async createMedicaoProducao(data: CreateMedicaoProducaoDto, usuarioId: string): Promise<Medicao> {
    return this.createMedicao({ ...data, tipo: 'MP' }, usuarioId);
  }

  /**
   * Cria uma nova Medição
   * FASE 1: Tipo é OBRIGATÓRIO (MP ou MC)
   * usuario_id é OBRIGATÓRIO
   */
  async createMedicao(data: CreateMedicaoDto, usuarioId: string): Promise<Medicao> {
    // Valida se a obra existe
    const obra = await this.prisma.obra.findUnique({
      where: { id: data.obra_id },
    });

    if (!obra) {
      throw new Error(`Obra com ID ${data.obra_id} não encontrada`);
    }

    // Valida usuário (obrigatório)
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new Error(`Usuário com ID ${usuarioId} não encontrado`);
    }

    // Valida EAP se fornecida
    if (data.eap_id) {
      const eap = await this.prisma.eap.findUnique({
        where: { id: data.eap_id },
      });

      if (!eap) {
        throw new Error(`EAP com ID ${data.eap_id} não encontrada`);
      }
    }

    // FASE 1: Valida tipo obrigatório
    if (!data.tipo || (data.tipo !== 'MP' && data.tipo !== 'MC')) {
      throw new Error('Tipo de medição é obrigatório e deve ser MP ou MC');
    }

    // Cria a medição
    const medicao = await this.prisma.medicao.create({
      data: {
        obra_id: data.obra_id,
        eap_id: data.eap_id,
        usuario_id: usuarioId, // OBRIGATÓRIO
        tipo: data.tipo as TipoMedicao,
        periodo_referencia: data.periodo_referencia,
        data_medicao: data.data_medicao,
        quantidade_medida: new Prisma.Decimal(data.quantidade_medida),
        valor_medido: data.valor_medido ? new Prisma.Decimal(data.valor_medido) : null,
        observacoes: data.observacoes,
        status: data.status || 'rascunho',
      },
    });

    return medicao;
  }

  /**
   * FASE 1: Cria uma Medição do Cliente (MC)
   * Representa o que será faturado
   */
  async createMedicaoCliente(data: CreateMedicaoClienteDto, usuarioId: string): Promise<Medicao> {
    return this.createMedicao({ ...data, tipo: 'MC' }, usuarioId);
  }

  /**
   * FASE 1: Lista Medições de Produção (MP) por obra e período
   */
  async listMedicoesProducao(obraId: string, periodo?: string): Promise<Medicao[]> {
    const where: Prisma.MedicaoWhereInput = {
      obra_id: obraId,
      tipo: 'MP',
      deleted_at: null,
    };

    if (periodo) {
      where.periodo_referencia = periodo;
    }

    return this.prisma.medicao.findMany({
      where,
      orderBy: { data_medicao: 'desc' },
    });
  }

  /**
   * FASE 1: Lista Medições do Cliente (MC) por obra e período
   */
  async listMedicoesCliente(obraId: string, periodo?: string): Promise<Medicao[]> {
    const where: Prisma.MedicaoWhereInput = {
      obra_id: obraId,
      tipo: 'MC',
      deleted_at: null,
    };

    if (periodo) {
      where.periodo_referencia = periodo;
    }

    return this.prisma.medicao.findMany({
      where,
      orderBy: { data_medicao: 'desc' },
    });
  }

  /**
   * FASE 1: Comparativo MP x MC
   * Retorna divergências entre Medição de Produção e Medição do Cliente
   */
  async getComparativo(obraId: string, periodo: string): Promise<{
    eap_id?: string;
    mp_quantidade: number;
    mp_valor?: number;
    mc_quantidade: number;
    mc_valor?: number;
    divergencia_quantidade: number;
    divergencia_valor?: number;
    percentual_divergencia: number;
  }[]> {
    // Busca todas as MP do período
    const mp = await this.prisma.medicao.findMany({
      where: {
        obra_id: obraId,
        tipo: 'MP',
        periodo_referencia: periodo,
        status: 'aprovada',
        deleted_at: null,
      },
    });

    // Busca todas as MC do período
    const mc = await this.prisma.medicao.findMany({
      where: {
        obra_id: obraId,
        tipo: 'MC',
        periodo_referencia: periodo,
        status: 'aprovada',
        deleted_at: null,
      },
    });

    // Agrupa por EAP
    const comparativo: Map<string, {
      eap_id?: string;
      mp_quantidade: number;
      mp_valor: number;
      mc_quantidade: number;
      mc_valor: number;
    }> = new Map();

    // Processa MP
    mp.forEach(m => {
      const key = m.eap_id || 'sem_eap';
      const atual = comparativo.get(key) || {
        eap_id: m.eap_id || undefined,
        mp_quantidade: 0,
        mp_valor: 0,
        mc_quantidade: 0,
        mc_valor: 0,
      };
      atual.mp_quantidade += Number(m.quantidade_medida);
      atual.mp_valor += Number(m.valor_medido || 0);
      comparativo.set(key, atual);
    });

    // Processa MC
    mc.forEach(m => {
      const key = m.eap_id || 'sem_eap';
      const atual = comparativo.get(key) || {
        eap_id: m.eap_id || undefined,
        mp_quantidade: 0,
        mp_valor: 0,
        mc_quantidade: 0,
        mc_valor: 0,
      };
      atual.mc_quantidade += Number(m.quantidade_medida);
      atual.mc_valor += Number(m.valor_medido || 0);
      comparativo.set(key, atual);
    });

    // Calcula divergências
    return Array.from(comparativo.values()).map(item => {
      const divergencia_quantidade = item.mc_quantidade - item.mp_quantidade;
      const divergencia_valor = item.mc_valor - item.mp_valor;
      const percentual_divergencia = item.mp_quantidade > 0
        ? (divergencia_quantidade / item.mp_quantidade) * 100
        : 0;

      return {
        eap_id: item.eap_id,
        mp_quantidade: item.mp_quantidade,
        mp_valor: item.mp_valor,
        mc_quantidade: item.mc_quantidade,
        mc_valor: item.mc_valor,
        divergencia_quantidade,
        divergencia_valor,
        percentual_divergencia,
      };
    });
  }

  /**
   * Atualiza uma Medição existente
   * Mantém o usuario_id original (não pode ser alterado)
   */
  async updateMedicao(id: string, data: UpdateMedicaoDto): Promise<Medicao> {
    const medicao = await this.prisma.medicao.findUnique({
      where: { id },
    });

    if (!medicao) {
      throw new Error(`Medição com ID ${id} não encontrada`);
    }

    // Valida EAP se fornecida
    if (data.eap_id) {
      const eap = await this.prisma.eap.findUnique({
        where: { id: data.eap_id },
      });

      if (!eap) {
        throw new Error(`EAP com ID ${data.eap_id} não encontrada`);
      }
    }

    // Atualiza a medição
    const updatedMedicao = await this.prisma.medicao.update({
      where: { id },
      data: {
        ...data,
        quantidade_medida: data.quantidade_medida !== undefined
          ? new Prisma.Decimal(data.quantidade_medida)
          : undefined,
        valor_medido: data.valor_medido !== undefined
          ? new Prisma.Decimal(data.valor_medido)
          : undefined,
        // usuario_id não pode ser alterado
      },
    });

    return updatedMedicao;
  }

  /**
   * Busca Medição por ID
   */
  async getMedicaoById(id: string): Promise<Medicao | null> {
    return this.prisma.medicao.findUnique({
      where: { id },
      include: {
        obra: true,
        eap: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        aprovado_por: {
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
   * Lista Medições por obra_id (filtro obrigatório para multi-obra)
   */
  async listMedicoesByObra(
    obraId: string,
    filters?: {
      eap_id?: string;
      usuario_id?: string;
      periodo_referencia?: string;
      status?: string;
      includeDeleted?: boolean;
    }
  ): Promise<Medicao[]> {
    const where: Prisma.MedicaoWhereInput = {
      obra_id: obraId, // Filtro obrigatório por obra
      deleted_at: filters?.includeDeleted ? undefined : null,
    };

    if (filters?.eap_id) {
      where.eap_id = filters.eap_id;
    }

    if (filters?.usuario_id) {
      where.usuario_id = filters.usuario_id;
    }

    if (filters?.periodo_referencia) {
      where.periodo_referencia = filters.periodo_referencia;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.medicao.findMany({
      where,
      orderBy: [
        { data_medicao: 'desc' },
        { created_at: 'desc' },
      ],
      include: {
        eap: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        aprovado_por: {
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
   * Lista todas as Medições (com filtro opcional por obra_id)
   * Para uso administrativo - sempre filtrar por obra_id quando possível
   */
  async listAllMedicoes(filters?: {
    obra_id?: string;
    eap_id?: string;
    usuario_id?: string;
    periodo_referencia?: string;
    status?: string;
    includeDeleted?: boolean;
  }): Promise<Medicao[]> {
    const where: Prisma.MedicaoWhereInput = {
      deleted_at: filters?.includeDeleted ? undefined : null,
    };

    if (filters?.obra_id) {
      where.obra_id = filters.obra_id;
    }

    if (filters?.eap_id) {
      where.eap_id = filters.eap_id;
    }

    if (filters?.usuario_id) {
      where.usuario_id = filters.usuario_id;
    }

    if (filters?.periodo_referencia) {
      where.periodo_referencia = filters.periodo_referencia;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.medicao.findMany({
      where,
      orderBy: [
        { obra_id: 'asc' },
        { data_medicao: 'desc' },
        { created_at: 'desc' },
      ],
    });
  }

  /**
   * Aprova uma Medição
   * Registra aprovado_por_id e data_aprovacao
   */
  async aprovarMedicao(id: string, data: AprovarMedicaoDto): Promise<Medicao> {
    const medicao = await this.prisma.medicao.findUnique({
      where: { id },
    });

    if (!medicao) {
      throw new Error(`Medição com ID ${id} não encontrada`);
    }

    // Valida usuário aprovador
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: data.aprovado_por_id },
    });

    if (!usuario) {
      throw new Error(`Usuário aprovador com ID ${data.aprovado_por_id} não encontrado`);
    }

    // Atualiza a medição
    return this.prisma.medicao.update({
      where: { id },
      data: {
        status: 'aprovada',
        aprovado_por_id: data.aprovado_por_id,
        data_aprovacao: new Date(),
        observacoes: data.observacoes || medicao.observacoes,
      },
    });
  }

  /**
   * Rejeita uma Medição
   */
  async rejeitarMedicao(id: string, observacoes?: string): Promise<Medicao> {
    const medicao = await this.prisma.medicao.findUnique({
      where: { id },
    });

    if (!medicao) {
      throw new Error(`Medição com ID ${id} não encontrada`);
    }

    return this.prisma.medicao.update({
      where: { id },
      data: {
        status: 'rejeitada',
        observacoes: observacoes || medicao.observacoes,
      },
    });
  }

  /**
   * Soft delete de uma Medição
   */
  async deleteMedicao(id: string): Promise<void> {
    await this.prisma.medicao.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}

