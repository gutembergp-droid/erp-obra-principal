import { PrismaClient, Eap, EapFatorConversao, Prisma } from '@prisma/client';
import { CreateEapDto, UpdateEapDto } from '../types/eap';
import { CreateEapFatorConversaoDto, UpdateEapFatorConversaoDto } from '../types/eap-fator-conversao';

/**
 * Service Layer para EAP (Estrutura Analítica do Projeto)
 * 
 * Responsabilidades:
 * - CRUD de EAP (Comercial e Operacional)
 * - Cálculo de fatores de conversão
 * - Atualização de quantidades e valores operacionais baseados em fatores
 * - Validações de regras de negócio
 */
export class EapService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria uma nova EAP
   * Registra automaticamente o usuario_id se fornecido (auditoria)
   */
  async createEap(data: CreateEapDto, usuarioId?: string): Promise<Eap> {
    // Valida se a baseline existe
    const baseline = await this.prisma.baselineComercial.findUnique({
      where: { id: data.baseline_comercial_id },
    });

    if (!baseline) {
      throw new Error(`Baseline com ID ${data.baseline_comercial_id} não encontrada`);
    }

    // Valida código único na baseline
    const existingEap = await this.prisma.eap.findUnique({
      where: {
        baseline_comercial_id_codigo: {
          baseline_comercial_id: data.baseline_comercial_id,
          codigo: data.codigo,
        },
      },
    });

    if (existingEap) {
      throw new Error(`EAP com código ${data.codigo} já existe nesta baseline`);
    }

    // Calcula valor_total se quantidade e valor_unitario estiverem presentes
    let valorTotal: Prisma.Decimal | undefined = undefined;
    if (data.quantidade && data.valor_unitario) {
      valorTotal = new Prisma.Decimal(data.quantidade).mul(new Prisma.Decimal(data.valor_unitario));
    }

    // Valida usuário se fornecido (auditoria)
    if (usuarioId) {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: usuarioId },
      });

      if (!usuario) {
        throw new Error(`Usuário com ID ${usuarioId} não encontrado`);
      }
    }

    // Cria a EAP
    const eap = await this.prisma.eap.create({
      data: {
        ...data,
        quantidade: data.quantidade ? new Prisma.Decimal(data.quantidade) : null,
        valor_unitario: data.valor_unitario ? new Prisma.Decimal(data.valor_unitario) : null,
        valor_total: valorTotal,
        usuario_id: usuarioId || null, // Registra usuário criador (auditoria)
      },
    });

    // Se for EAP Comercial, recalcula EAPs Operacionais relacionadas
    if (data.tipo === 'comercial' && data.quantidade && data.valor_unitario) {
      await this.recalcularEapOperacional(eap.id);
    }

    return eap;
  }

  /**
   * Atualiza uma EAP existente
   */
  async updateEap(id: string, data: UpdateEapDto): Promise<Eap> {
    const eap = await this.prisma.eap.findUnique({
      where: { id },
    });

    if (!eap) {
      throw new Error(`EAP com ID ${id} não encontrada`);
    }

    // Calcula novo valor_total se necessário
    let valorTotal: Prisma.Decimal | undefined = undefined;
    const quantidade = data.quantidade !== undefined 
      ? new Prisma.Decimal(data.quantidade) 
      : eap.quantidade;
    const valorUnitario = data.valor_unitario !== undefined 
      ? new Prisma.Decimal(data.valor_unitario) 
      : eap.valor_unitario;

    if (quantidade && valorUnitario) {
      valorTotal = quantidade.mul(valorUnitario);
    }

    // Atualiza a EAP
    const updatedEap = await this.prisma.eap.update({
      where: { id },
      data: {
        ...data,
        quantidade: data.quantidade !== undefined ? new Prisma.Decimal(data.quantidade) : undefined,
        valor_unitario: data.valor_unitario !== undefined ? new Prisma.Decimal(data.valor_unitario) : undefined,
        valor_total: valorTotal !== undefined ? valorTotal : undefined,
      },
    });

    // Se for EAP Comercial e valores foram alterados, recalcula EAPs Operacionais
    if (eap.tipo === 'comercial' && (data.quantidade !== undefined || data.valor_unitario !== undefined)) {
      await this.recalcularEapOperacional(id);
    }

    return updatedEap;
  }

  /**
   * Busca EAP por ID
   */
  async getEapById(id: string): Promise<Eap | null> {
    return this.prisma.eap.findUnique({
      where: { id },
      include: {
        fatores_como_comercial: {
          where: { is_ativo: true, deleted_at: null },
          include: {
            eap_operacional: true,
          },
        },
        fatores_como_operacional: {
          where: { is_ativo: true, deleted_at: null },
          include: {
            eap_comercial: true,
          },
        },
      },
    });
  }

  /**
   * Lista EAPs por baseline e tipo
   */
  async listEapByBaseline(
    baselineId: string,
    tipo?: 'comercial' | 'operacional',
    includeDeleted: boolean = false
  ): Promise<Eap[]> {
    const where: Prisma.EapWhereInput = {
      baseline_comercial_id: baselineId,
      deleted_at: includeDeleted ? undefined : null,
    };

    if (tipo) {
      where.tipo = tipo;
    }

    return this.prisma.eap.findMany({
      where,
      orderBy: [
        { ordem: 'asc' },
        { codigo: 'asc' },
      ],
    });
  }

  /**
   * Lista apenas EAPs folha (sem filhos)
   */
  async listEapFolha(
    baselineId: string,
    tipo?: 'comercial' | 'operacional'
  ): Promise<Eap[]> {
    const where: Prisma.EapWhereInput = {
      baseline_comercial_id: baselineId,
      is_folha: true,
      deleted_at: null,
    };

    if (tipo) {
      where.tipo = tipo;
    }

    return this.prisma.eap.findMany({
      where,
      orderBy: [
        { ordem: 'asc' },
        { codigo: 'asc' },
      ],
    });
  }

  /**
   * Cria um fator de conversão
   */
  async createFatorConversao(data: CreateEapFatorConversaoDto): Promise<EapFatorConversao> {
    // Valida se as EAPs existem e são dos tipos corretos
    const eapComercial = await this.prisma.eap.findUnique({
      where: { id: data.eap_comercial_id },
    });

    const eapOperacional = await this.prisma.eap.findUnique({
      where: { id: data.eap_operacional_id },
    });

    if (!eapComercial) {
      throw new Error(`EAP Comercial com ID ${data.eap_comercial_id} não encontrada`);
    }

    if (!eapOperacional) {
      throw new Error(`EAP Operacional com ID ${data.eap_operacional_id} não encontrada`);
    }

    if (eapComercial.tipo !== 'comercial') {
      throw new Error(`EAP ${data.eap_comercial_id} não é do tipo comercial`);
    }

    if (eapOperacional.tipo !== 'operacional') {
      throw new Error(`EAP ${data.eap_operacional_id} não é do tipo operacional`);
    }

    // Valida se já existe fator de conversão para este par
    const existingFator = await this.prisma.eapFatorConversao.findUnique({
      where: {
        eap_comercial_id_eap_operacional_id: {
          eap_comercial_id: data.eap_comercial_id,
          eap_operacional_id: data.eap_operacional_id,
        },
      },
    });

    if (existingFator) {
      throw new Error(
        `Fator de conversão já existe para EAP Comercial ${data.eap_comercial_id} e EAP Operacional ${data.eap_operacional_id}`
      );
    }

    // Cria o fator de conversão
    const fator = await this.prisma.eapFatorConversao.create({
      data: {
        ...data,
        fator_quantidade: new Prisma.Decimal(data.fator_quantidade),
        fator_valor: data.fator_valor ? new Prisma.Decimal(data.fator_valor) : null,
      },
    });

    // Recalcula a EAP Operacional baseada no fator
    await this.recalcularEapOperacional(data.eap_comercial_id);

    return fator;
  }

  /**
   * Atualiza um fator de conversão
   */
  async updateFatorConversao(
    id: string,
    data: UpdateEapFatorConversaoDto
  ): Promise<EapFatorConversao> {
    const fator = await this.prisma.eapFatorConversao.findUnique({
      where: { id },
    });

    if (!fator) {
      throw new Error(`Fator de conversão com ID ${id} não encontrado`);
    }

    const updatedFator = await this.prisma.eapFatorConversao.update({
      where: { id },
      data: {
        ...data,
        fator_quantidade: data.fator_quantidade !== undefined 
          ? new Prisma.Decimal(data.fator_quantidade) 
          : undefined,
        fator_valor: data.fator_valor !== undefined 
          ? new Prisma.Decimal(data.fator_valor) 
          : undefined,
      },
    });

    // Recalcula a EAP Operacional se o fator foi alterado
    if (data.fator_quantidade !== undefined || data.fator_valor !== undefined || data.is_ativo !== undefined) {
      await this.recalcularEapOperacional(fator.eap_comercial_id);
    }

    return updatedFator;
  }

  /**
   * Lista fatores de conversão por EAP Comercial
   */
  async listFatoresConversaoByEapComercial(
    eapComercialId: string,
    apenasAtivos: boolean = true
  ): Promise<EapFatorConversao[]> {
    const where: Prisma.EapFatorConversaoWhereInput = {
      eap_comercial_id: eapComercialId,
      deleted_at: null,
    };

    if (apenasAtivos) {
      where.is_ativo = true;
    }

    return this.prisma.eapFatorConversao.findMany({
      where,
      include: {
        eap_operacional: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
  }

  /**
   * Calcula quantidade operacional baseada no fator de conversão
   * 
   * Fórmula: Quantidade Operacional = Quantidade Comercial × Fator Quantidade
   */
  calcularQuantidadeOperacional(
    quantidadeComercial: Prisma.Decimal,
    fatorQuantidade: Prisma.Decimal
  ): Prisma.Decimal {
    return quantidadeComercial.mul(fatorQuantidade);
  }

  /**
   * Calcula valor operacional baseado no fator de conversão
   * 
   * Fórmula: Valor Operacional = Valor Comercial × Fator Valor
   * Se fator_valor não estiver definido, usa fator_quantidade
   */
  calcularValorOperacional(
    valorComercial: Prisma.Decimal,
    fatorValor: Prisma.Decimal | null,
    fatorQuantidade: Prisma.Decimal
  ): Prisma.Decimal {
    const fator = fatorValor || fatorQuantidade;
    return valorComercial.mul(fator);
  }

  /**
   * Recalcula todas as EAPs Operacionais relacionadas a uma EAP Comercial
   * através dos fatores de conversão ativos
   * 
   * Esta é a função CRÍTICA que implementa a regra de negócio do fator de conversão
   */
  async recalcularEapOperacional(eapComercialId: string): Promise<void> {
    // Busca a EAP Comercial
    const eapComercial = await this.prisma.eap.findUnique({
      where: { id: eapComercialId },
    });

    if (!eapComercial || eapComercial.tipo !== 'comercial') {
      throw new Error(`EAP Comercial com ID ${eapComercialId} não encontrada`);
    }

    // Se não tiver quantidade ou valor, não há o que recalcular
    if (!eapComercial.quantidade || !eapComercial.valor_unitario) {
      return;
    }

    // Busca todos os fatores de conversão ativos para esta EAP Comercial
    const fatores = await this.prisma.eapFatorConversao.findMany({
      where: {
        eap_comercial_id: eapComercialId,
        is_ativo: true,
        deleted_at: null,
      },
      include: {
        eap_operacional: true,
      },
    });

    // Para cada fator, recalcula a EAP Operacional
    for (const fator of fatores) {
      const eapOperacional = fator.eap_operacional;

      // Calcula nova quantidade operacional
      const novaQuantidade = this.calcularQuantidadeOperacional(
        eapComercial.quantidade!,
        fator.fator_quantidade
      );

      // Calcula novo valor unitário operacional
      const novoValorUnitario = this.calcularValorOperacional(
        eapComercial.valor_unitario!,
        fator.fator_valor,
        fator.fator_quantidade
      );

      // Calcula novo valor total
      const novoValorTotal = novaQuantidade.mul(novoValorUnitario);

      // Atualiza a EAP Operacional
      await this.prisma.eap.update({
        where: { id: eapOperacional.id },
        data: {
          quantidade: novaQuantidade,
          valor_unitario: novoValorUnitario,
          valor_total: novoValorTotal,
        },
      });
    }
  }

  /**
   * Busca EAP Comercial com suas EAPs Operacionais relacionadas
   * (usado pela interface de estruturação)
   */
  async getEapComercialComOperacional(baselineId: string): Promise<{
    eapComercial: Eap[];
    eapOperacional: Eap[];
    fatoresConversao: EapFatorConversao[];
  }> {
    const eapComercial = await this.listEapFolha(baselineId, 'comercial');
    const eapOperacional = await this.listEapFolha(baselineId, 'operacional');

    // Busca todos os fatores de conversão para as EAPs comerciais
    const fatoresConversao: EapFatorConversao[] = [];
    for (const eap of eapComercial) {
      const fatores = await this.listFatoresConversaoByEapComercial(eap.id, true);
      fatoresConversao.push(...fatores);
    }

    return {
      eapComercial,
      eapOperacional,
      fatoresConversao,
    };
  }

  /**
   * Lista EAPs por obra_id (filtro para multi-obra)
   * Busca através das baselines da obra
   */
  async listEapByObra(
    obraId: string,
    tipo?: 'comercial' | 'operacional',
    includeDeleted: boolean = false
  ): Promise<Eap[]> {
    // Busca todas as baselines ativas da obra
    const baselines = await this.prisma.baselineComercial.findMany({
      where: {
        obra_id: obraId,
        is_ativo: true,
        deleted_at: null,
      },
    });

    if (baselines.length === 0) {
      return [];
    }

    // Busca EAPs de todas as baselines ativas
    const baselineIds = baselines.map(b => b.id);
    const where: Prisma.EapWhereInput = {
      baseline_comercial_id: { in: baselineIds },
      deleted_at: includeDeleted ? undefined : null,
    };

    if (tipo) {
      where.tipo = tipo;
    }

    return this.prisma.eap.findMany({
      where,
      orderBy: [
        { ordem: 'asc' },
        { codigo: 'asc' },
      ],
    });
  }

  /**
   * Lista EAPs folha por obra_id (filtro para multi-obra)
   */
  async listEapFolhaByObra(
    obraId: string,
    tipo?: 'comercial' | 'operacional'
  ): Promise<Eap[]> {
    // Busca todas as baselines ativas da obra
    const baselines = await this.prisma.baselineComercial.findMany({
      where: {
        obra_id: obraId,
        is_ativo: true,
        deleted_at: null,
      },
    });

    if (baselines.length === 0) {
      return [];
    }

    // Busca EAPs folha de todas as baselines ativas
    const baselineIds = baselines.map(b => b.id);
    const where: Prisma.EapWhereInput = {
      baseline_comercial_id: { in: baselineIds },
      is_folha: true,
      deleted_at: null,
    };

    if (tipo) {
      where.tipo = tipo;
    }

    return this.prisma.eap.findMany({
      where,
      orderBy: [
        { ordem: 'asc' },
        { codigo: 'asc' },
      ],
    });
  }

  /**
   * Soft delete de uma EAP
   */
  async deleteEap(id: string): Promise<void> {
    await this.prisma.eap.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  /**
   * Soft delete de um fator de conversão
   */
  async deleteFatorConversao(id: string): Promise<void> {
    const fator = await this.prisma.eapFatorConversao.findUnique({
      where: { id },
    });

    if (fator) {
      await this.prisma.eapFatorConversao.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      });

      // Recalcula EAPs Operacionais após remover fator
      await this.recalcularEapOperacional(fator.eap_comercial_id);
    }
  }
}

