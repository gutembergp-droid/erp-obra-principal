import { PrismaClient, Gate, Prisma, GateCodigo } from '@prisma/client';
import { CreateGateDto, UpdateGateDto, GateCodigo as GateCodigoType, GATE_NAMES, GATE_ORDER } from '../types/gates';

/**
 * Service Layer para Gates (Portões/Marcos do Projeto)
 * FASE 1: Gates fixos (G1-G9) conforme conceito oficial
 * 
 * Responsabilidades:
 * - CRUD de Gates (apenas os 9 oficiais)
 * - Filtro por obra_id (multi-obra)
 * - Registro de usuario_id em todas as ações
 * - Validações de regras de negócio
 * - Validação de sequência (Gate N só após Gate N-1)
 * - Validação de bloqueio (Gate 9 só se Gate 5 e Gate 6 OK)
 */
export class GateService {
  constructor(private prisma: PrismaClient) {}

  /**
   * FASE 1: Valida se o código do gate é um dos 9 oficiais
   */
  private validarCodigoGate(codigo: string): codigo is GateCodigoType {
    return ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9'].includes(codigo);
  }

  /**
   * FASE 1: Inicializa os 9 gates oficiais para uma obra
   */
  async inicializarGatesOficiais(obraId: string, usuarioId?: string, competenciaMensalId?: string): Promise<Gate[]> {
    const obra = await this.prisma.obra.findUnique({
      where: { id: obraId },
    });

    if (!obra) {
      throw new Error(`Obra com ID ${obraId} não encontrada`);
    }

    // Verifica se já existem gates para esta obra
    const existingGates = await this.prisma.gate.findMany({
      where: {
        obra_id: obraId,
        deleted_at: null,
      },
    });

    if (existingGates.length > 0) {
      throw new Error(`Gates já inicializados para esta obra`);
    }

    // Cria os 9 gates oficiais
    const gates: Gate[] = [];
    for (const codigo of ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9'] as GateCodigoType[]) {
      const gate = await this.prisma.gate.create({
        data: {
          obra_id: obraId,
          codigo: codigo as GateCodigo,
          nome: GATE_NAMES[codigo],
          ordem: GATE_ORDER[codigo],
          status: 'pendente',
          usuario_id: usuarioId,
          // competencia_mensal_id removido - usar CompetenciaGate agora
        },
      });
      gates.push(gate);
    }

    return gates;
  }

  /**
   * Cria um novo Gate
   * FASE 1: Apenas os 9 gates oficiais são permitidos
   * Registra automaticamente o usuario_id se fornecido
   */
  async createGate(data: CreateGateDto): Promise<Gate> {
    // FASE 1: Valida se o código é um dos 9 oficiais
    if (!this.validarCodigoGate(data.codigo)) {
      throw new Error(`Código de gate inválido. Apenas G1 a G9 são permitidos.`);
    }

    // Valida se a obra existe
    const obra = await this.prisma.obra.findUnique({
      where: { id: data.obra_id },
    });

    if (!obra) {
      throw new Error(`Obra com ID ${data.obra_id} não encontrada`);
    }

    // Valida código único na obra/competência
    const whereClause: any = {
      obra_id: data.obra_id,
      codigo: data.codigo as GateCodigo,
      deleted_at: null,
    };

    // competencia_mensal_id removido - usar CompetenciaGate agora

    const existingGate = await this.prisma.gate.findFirst({
      where: whereClause,
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

    // FASE 1: Valida ordem (deve corresponder ao código)
    const ordemEsperada = GATE_ORDER[data.codigo];
    if (data.ordem !== ordemEsperada) {
      throw new Error(`Ordem inválida para gate ${data.codigo}. Ordem esperada: ${ordemEsperada}`);
    }

    // Cria o gate
    const gate = await this.prisma.gate.create({
      data: {
        obra_id: data.obra_id,
        codigo: data.codigo as GateCodigo,
        nome: data.nome || GATE_NAMES[data.codigo],
        descricao: data.descricao,
        ordem: data.ordem,
        data_prevista: data.data_prevista,
        criterios_aprovacao: data.criterios_aprovacao,
        usuario_id: data.usuario_id,
        // competencia_mensal_id removido - usar CompetenciaGate agora
      },
    });

    return gate;
  }

  /**
   * FASE 1: Valida sequência de gates (Gate N só após Gate N-1)
   */
  async validarSequencia(gateId: string): Promise<boolean> {
    const gate = await this.prisma.gate.findUnique({
      where: { id: gateId },
    });

    if (!gate) {
      throw new Error(`Gate com ID ${gateId} não encontrado`);
    }

    // Gate 1 não tem pré-requisito
    if (gate.codigo === 'G1') {
      return true;
    }

    // Busca o gate anterior
    const ordemAnterior = GATE_ORDER[gate.codigo] - 1;
    const codigoAnterior = Object.entries(GATE_ORDER).find(([_, ordem]) => ordem === ordemAnterior)?.[0] as GateCodigoType | undefined;

    if (!codigoAnterior) {
      return false;
    }

    // Verifica se o gate anterior está aprovado
    const gateAnterior = await this.prisma.gate.findFirst({
      where: {
        obra_id: gate.obra_id,
        codigo: codigoAnterior as GateCodigo,
        // competencia_mensal_id removido - usar CompetenciaGate agora
        status: 'aprovado',
        deleted_at: null,
      },
    });

    return !!gateAnterior;
  }

  /**
   * FASE 1: Valida bloqueio do Gate 9 (requer Gate 5 e Gate 6 aprovados)
   */
  async validarBloqueioGate9(obraId: string): Promise<{ podeAprovar: boolean; motivo?: string }> {
    const gate5 = await this.prisma.gate.findFirst({
      where: {
        obra_id: obraId,
        codigo: 'G5',
        // competencia_mensal_id removido - usar CompetenciaGate agora
        deleted_at: null,
      },
    });

    const gate6 = await this.prisma.gate.findFirst({
      where: {
        obra_id: obraId,
        codigo: 'G6',
        // competencia_mensal_id removido - usar CompetenciaGate agora
        deleted_at: null,
      },
    });

    if (!gate5 || gate5.status !== 'aprovado') {
      return {
        podeAprovar: false,
        motivo: 'Gate 5 (Qualidade OK) deve estar aprovado antes de aprovar Gate 9',
      };
    }

    if (!gate6 || gate6.status !== 'aprovado') {
      return {
        podeAprovar: false,
        motivo: 'Gate 6 (SST OK) deve estar aprovado antes de aprovar Gate 9',
      };
    }

    return { podeAprovar: true };
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

    // Atualiza o gate (apenas campos permitidos)
    const updateData: any = {};
    
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.ordem !== undefined) updateData.ordem = data.ordem;
    if (data.data_prevista !== undefined) updateData.data_prevista = data.data_prevista;
    if (data.data_real !== undefined) updateData.data_real = data.data_real;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.usuario_id !== undefined) updateData.usuario_id = data.usuario_id;
    if (data.usuario_aprovador_id !== undefined) updateData.usuario_aprovador_id = data.usuario_aprovador_id;
    if (data.observacoes !== undefined) updateData.observacoes = data.observacoes;
    if (data.criterios_aprovacao !== undefined) updateData.criterios_aprovacao = data.criterios_aprovacao;
    
    // Se status mudou para aprovado, registra data de aprovação
    if (data.status === 'aprovado' && !gate.data_aprovacao) {
      updateData.data_aprovacao = new Date();
    } else if (data.data_aprovacao !== undefined) {
      updateData.data_aprovacao = data.data_aprovacao;
    }

    const updatedGate = await this.prisma.gate.update({
      where: { id },
      data: updateData,
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

    // Campo 'tipo' removido do modelo Gate

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

    // Campo 'tipo' removido do modelo Gate

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
   * FASE 1: Valida sequência e bloqueios antes de aprovar
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

    // FASE 1: Valida sequência (Gate N só após Gate N-1)
    const sequenciaValida = await this.validarSequencia(id);
    if (!sequenciaValida) {
      throw new Error(`Gate ${gate.codigo} não pode ser aprovado. Gate anterior deve estar aprovado primeiro.`);
    }

    // FASE 1: Valida bloqueio do Gate 9
    if (gate.codigo === 'G9') {
      const bloqueio = await this.validarBloqueioGate9(gate.obra_id);
      if (!bloqueio.podeAprovar) {
        throw new Error(bloqueio.motivo || 'Gate 9 não pode ser aprovado');
      }
    }

    // Atualiza o gate
    return this.prisma.gate.update({
      where: { id },
      data: {
        status: 'aprovado',
        usuario_aprovador_id: usuarioAprovadorId,
        data_aprovacao: new Date(),
        data_real: new Date(),
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

