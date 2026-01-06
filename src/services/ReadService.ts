import { PrismaClient, Prisma } from '@prisma/client';

/**
 * Service para Read Models (leituras consolidadas)
 * Fornece dados agregados para dashboards e visualizações tático/gerenciais
 */
export class ReadService {
  constructor(private prisma: PrismaClient) {}

  /**
   * GET /read/obra/resumo
   * KPIs mínimos: total EAP, total medido (MP/MC), desvios, status competência atual, gates pendentes
   */
  async getObraResumo(obraId: string, periodo?: string): Promise<{
    obra: {
      id: string;
      nome: string;
      cliente: string | null;
      orcamento_total: number;
    };
    kpis: {
      total_eap: number;
      total_medido_mp: number;
      total_medido_mc: number;
      desvio_quantidade: number;
      desvio_valor: number;
      percentual_avanco: number;
    };
    competencia_atual: {
      id: string | null;
      periodo: string | null;
      status: 'aberta' | 'fechada' | null;
      gates_pendentes: number;
      gates_aprovados: number;
      gates_rejeitados: number;
    };
  }> {
    // Busca obra
    const obra = await this.prisma.obra.findUnique({
      where: { id: obraId },
      include: {
        baseline_comercial: {
          where: {
            status: 'homologada',
            is_ativo: true,
            deleted_at: null,
          },
          take: 1,
        },
      },
    });

    if (!obra) {
      throw new Error(`Obra com ID ${obraId} não encontrada`);
    }

    // Total EAP (soma de todas as EAPs comerciais da baseline ativa)
    const baselineAtiva = obra.baseline_comercial[0];
    let totalEap = 0;

    if (baselineAtiva) {
      const eapsComerciais = await this.prisma.eap.findMany({
        where: {
          baseline_comercial_id: baselineAtiva.id,
          tipo: 'comercial',
          deleted_at: null,
        },
      });

      totalEap = eapsComerciais.reduce((sum, eap) => {
        return sum + Number(eap.valor_total || 0);
      }, 0);
    }

    // Filtro de período para medições
    const whereMedicoes: Prisma.MedicaoWhereInput = {
      obra_id: obraId,
      deleted_at: null,
    };

    if (periodo) {
      whereMedicoes.periodo_referencia = periodo;
    }

    // Medições de Produção (MP)
    const medicoesMP = await this.prisma.medicao.findMany({
      where: {
        ...whereMedicoes,
        tipo: 'MP',
        status: 'APPROVED',
      },
    });

    // Medições do Cliente (MC)
    const medicoesMC = await this.prisma.medicao.findMany({
      where: {
        ...whereMedicoes,
        tipo: 'MC',
        status: 'APPROVED',
      },
    });

    const totalMedidoMP = medicoesMP.reduce((sum, m) => sum + Number(m.valor_medido || 0), 0);
    const totalMedidoMC = medicoesMC.reduce((sum, m) => sum + Number(m.valor_medido || 0), 0);

    // Desvios (MC - MP)
    const desvioQuantidade = medicoesMC.reduce((sum, m) => sum + Number(m.quantidade_medida), 0) -
      medicoesMP.reduce((sum, m) => sum + Number(m.quantidade_medida), 0);
    const desvioValor = totalMedidoMC - totalMedidoMP;

    // Percentual de avanço
    const percentualAvanco = totalEap > 0 ? Math.round((totalMedidoMP / totalEap) * 100) : 0;

    // Competência atual
    const competenciaAtual = await this.prisma.competenciaMensal.findFirst({
      where: {
        obra_id: obraId,
        status: 'aberta',
        deleted_at: null,
      },
      include: {
        gates: {
          where: { deleted_at: null },
        },
      },
      orderBy: {
        aberta_em: 'desc',
      },
    });

    let competenciaData = {
      id: null as string | null,
      periodo: null as string | null,
      status: null as 'aberta' | 'fechada' | null,
      gates_pendentes: 0,
      gates_aprovados: 0,
      gates_rejeitados: 0,
    };

    if (competenciaAtual) {
      const gates = competenciaAtual.gates;
      competenciaData = {
        id: competenciaAtual.id,
        periodo: competenciaAtual.periodo,
        status: competenciaAtual.status,
        gates_pendentes: gates.filter(g => g.status === 'pendente').length,
        gates_aprovados: gates.filter(g => g.status === 'aprovado').length,
        gates_rejeitados: gates.filter(g => g.status === 'rejeitado').length,
      };
    }

    return {
      obra: {
        id: obra.id,
        nome: obra.nome,
        cliente: obra.cliente,
        orcamento_total: Number(obra.orcamento_total),
      },
      kpis: {
        total_eap: totalEap,
        total_medido_mp: totalMedidoMP,
        total_medido_mc: totalMedidoMC,
        desvio_quantidade: desvioQuantidade,
        desvio_valor: desvioValor,
        percentual_avanco: percentualAvanco,
      },
      competencia_atual: competenciaData,
    };
  }

  /**
   * GET /read/competencia/status
   * Competência atual: status (OPEN/CLOSED), gates (PENDING/APPROVED/REJECTED), motivos, pendências
   */
  async getCompetenciaStatus(obraId: string): Promise<{
    competencia: {
      id: string | null;
      periodo: string | null;
      status: 'aberta' | 'fechada' | null;
      aberta_em: Date | null;
      fechada_em: Date | null;
    };
    gates: Array<{
      numero: number;
      nome: string;
      status: string;
      trava: boolean;
      aprovado_em: Date | null;
      rejeitado_em: Date | null;
      motivo_rejeicao: string | null;
    }>;
    travas: {
      ativas: boolean;
      motivos: string[];
    };
    pode_concluir: boolean;
  }> {
    const competencia = await this.prisma.competenciaMensal.findFirst({
      where: {
        obra_id: obraId,
        status: 'aberta',
        deleted_at: null,
      },
      include: {
        gates: {
          where: { deleted_at: null },
          orderBy: { ordem: 'asc' },
        },
      },
      orderBy: {
        aberta_em: 'desc',
      },
    });

    if (!competencia) {
      return {
        competencia: {
          id: null,
          periodo: null,
          status: null,
          aberta_em: null,
          fechada_em: null,
        },
        gates: [],
        travas: {
          ativas: false,
          motivos: [],
        },
        pode_concluir: false,
      };
    }

    const gates = competencia.gates;
    const gate5 = gates.find(g => g.numero === 5);
    const gate6 = gates.find(g => g.numero === 6);

    // Verifica travas
    const travasAtivas = gate5?.status !== 'aprovado' || gate6?.status !== 'aprovado';
    const motivos: string[] = [];

    if (gate5?.status !== 'aprovado') {
      motivos.push('Gate 5 (Qualidade) não aprovado');
    }
    if (gate6?.status !== 'aprovado') {
      motivos.push('Gate 6 (SSMA) não aprovado');
    }

    // Verifica se pode concluir
    const gates2a8 = gates.filter(g => g.numero >= 2 && g.numero <= 8);
    const todosGates2a8Aprovados = gates2a8.every(g => g.status === 'aprovado');
    const podeConcluir = todosGates2a8Aprovados && !travasAtivas;

    return {
      competencia: {
        id: competencia.id,
        periodo: competencia.periodo,
        status: competencia.status,
        aberta_em: competencia.aberta_em,
        fechada_em: competencia.fechada_em,
      },
      gates: gates.map(gate => ({
        numero: gate.numero,
        nome: gate.nome,
        status: gate.status,
        trava: gate.trava,
        aprovado_em: gate.aprovado_em,
        rejeitado_em: gate.rejeitado_em,
        motivo_rejeicao: gate.motivo_rejeicao,
      })),
      travas: {
        ativas: travasAtivas,
        motivos,
      },
      pode_concluir: podeConcluir,
    };
  }

  /**
   * GET /read/medicoes/resumo
   * Contagens e totais por status, por tipo (MP/MC), e lista resumida recente
   */
  async getMedicoesResumo(obraId: string, periodo?: string): Promise<{
    contagens: {
      por_status: {
        DRAFT: number;
        SUBMITTED: number;
        APPROVED: number;
        REJECTED: number;
      };
      por_tipo: {
        MP: number;
        MC: number;
      };
    };
    totais: {
      mp_quantidade: number;
      mp_valor: number;
      mc_quantidade: number;
      mc_valor: number;
    };
    recentes: Array<{
      id: string;
      tipo: string;
      periodo_referencia: string;
      quantidade_medida: number;
      valor_medido: number | null;
      status: string;
      data_medicao: Date;
    }>;
  }> {
    const where: Prisma.MedicaoWhereInput = {
      obra_id: obraId,
      deleted_at: null,
    };

    if (periodo) {
      where.periodo_referencia = periodo;
    }

    const medicoes = await this.prisma.medicao.findMany({
      where,
      orderBy: {
        data_medicao: 'desc',
      },
      take: 10, // Últimas 10 medições
    });

    // Contagens por status
    const porStatus = {
      DRAFT: 0,
      SUBMITTED: 0,
      APPROVED: 0,
      REJECTED: 0,
    };

    // Contagens por tipo
    const porTipo = {
      MP: 0,
      MC: 0,
    };

    // Totais
    let mpQuantidade = 0;
    let mpValor = 0;
    let mcQuantidade = 0;
    let mcValor = 0;

    medicoes.forEach(m => {
      // Por status
      if (m.status === 'DRAFT') porStatus.DRAFT++;
      else if (m.status === 'SUBMITTED') porStatus.SUBMITTED++;
      else if (m.status === 'APPROVED') porStatus.APPROVED++;
      else if (m.status === 'REJECTED') porStatus.REJECTED++;

      // Por tipo
      if (m.tipo === 'MP') {
        porTipo.MP++;
        mpQuantidade += Number(m.quantidade_medida);
        mpValor += Number(m.valor_medido || 0);
      } else if (m.tipo === 'MC') {
        porTipo.MC++;
        mcQuantidade += Number(m.quantidade_medida);
        mcValor += Number(m.valor_medido || 0);
      }
    });

    return {
      contagens: {
        por_status: porStatus,
        por_tipo: porTipo,
      },
      totais: {
        mp_quantidade: mpQuantidade,
        mp_valor: mpValor,
        mc_quantidade: mcQuantidade,
        mc_valor: mcValor,
      },
      recentes: medicoes.map(m => ({
        id: m.id,
        tipo: m.tipo,
        periodo_referencia: m.periodo_referencia,
        quantidade_medida: Number(m.quantidade_medida),
        valor_medido: m.valor_medido ? Number(m.valor_medido) : null,
        status: m.status,
        data_medicao: m.data_medicao,
      })),
    };
  }

  /**
   * GET /read/suprimentos/resumo
   * Total de insumos cadastrados, últimos criados/alterados
   */
  async getSuprimentosResumo(): Promise<{
    total_insumos: number;
    total_categorias: number;
    recentes: Array<{
      id: string;
      codigo: string;
      nome: string;
      categoria: string;
      unidade: string;
      created_at: Date;
      updated_at: Date;
    }>;
  }> {
    const insumos = await this.prisma.insumo.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        updated_at: 'desc',
      },
      take: 10, // Últimos 10 insumos
    });

    // Total de insumos
    const totalInsumos = await this.prisma.insumo.count({
      where: {
        deleted_at: null,
      },
    });

    // Total de categorias únicas
    const categorias = await this.prisma.insumo.findMany({
      where: {
        deleted_at: null,
      },
      select: {
        categoria: true,
      },
      distinct: ['categoria'],
    });

    return {
      total_insumos: totalInsumos,
      total_categorias: categorias.length,
      recentes: insumos.map(i => ({
        id: i.id,
        codigo: i.codigo,
        nome: i.nome,
        categoria: i.categoria,
        unidade: i.unidade,
        created_at: i.created_at,
        updated_at: i.updated_at,
      })),
    };
  }
}
