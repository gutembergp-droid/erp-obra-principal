import { PrismaClient, CompetenciaStatus, MedicaoStatus, TipoMedicao } from '@prisma/client';

/**
 * Service para leituras consolidadas (Read Models)
 * 
 * Fornece dados agregados para dashboards e visualizações tático/gerenciais
 */
export class ReadModelService {
  constructor(private prisma: PrismaClient) {}

  /**
   * GET /read/obra/resumo
   * KPIs mínimos: total EAP, total medido (MP/MC), desvios, status competência atual, gates pendentes
   */
  async getObraResumo(obraId: string, periodo?: string): Promise<{
    obra: {
      id: string;
      nome: string;
      status: string;
    };
    kpis: {
      total_eap: number;
      total_medido_mp: number;
      total_medido_mc: number;
      desvio_mp_mc: number;
      percentual_desvio: number;
    };
    competencia_atual: {
      id: string | null;
      periodo: string | null;
      status: 'aberta' | 'fechada' | null;
      gates_pendentes: number;
      gates_aprovados: number;
      gates_rejeitados: number;
    };
    periodo: string;
  }> {
    // Busca obra
    const obra = await this.prisma.obra.findUnique({
      where: { id: obraId },
      select: {
        id: true,
        nome: true,
        status: true,
      },
    });

    if (!obra) {
      throw new Error(`Obra com ID ${obraId} não encontrada`);
    }

    // Determina período (mês atual se não fornecido)
    const periodoAtual = periodo || this.getMesAtual();

    // Busca baseline comercial ativa
    const baselineAtiva = await this.prisma.baselineComercial.findFirst({
      where: {
        obra_id: obraId,
        status: 'homologada',
        is_ativo: true,
        deleted_at: null,
      },
      orderBy: { created_at: 'desc' },
      take: 1,
    });

    // Total EAP (soma de todas as EAPs comerciais da baseline ativa)
    let totalEap = 0;
    if (baselineAtiva) {
      const eaps = await this.prisma.eap.findMany({
        where: {
          baseline_comercial_id: baselineAtiva.id,
          tipo: 'comercial',
          deleted_at: null,
        },
      });
      totalEap = eaps.reduce((sum, eap) => sum + Number(eap.valor_total || 0), 0);
    }

    // Total medido MP e MC (aprovadas no período)
    const medicoes = await this.prisma.medicao.findMany({
      where: {
        obra_id: obraId,
        periodo_referencia: periodoAtual,
        status: 'APPROVED',
        deleted_at: null,
      },
    });

    const totalMedidoMP = medicoes
      .filter(m => m.tipo === 'MP')
      .reduce((sum, m) => sum + Number(m.valor_medido || 0), 0);

    const totalMedidoMC = medicoes
      .filter(m => m.tipo === 'MC')
      .reduce((sum, m) => sum + Number(m.valor_medido || 0), 0);

    const desvioMPMC = totalMedidoMC - totalMedidoMP;
    const percentualDesvio = totalMedidoMP > 0
      ? (desvioMPMC / totalMedidoMP) * 100
      : 0;

    // Competência atual
    const competenciaAtual = await this.prisma.competenciaMensal.findFirst({
      where: {
        obra_id: obraId,
        status: CompetenciaStatus.aberta,
        deleted_at: null,
      },
      orderBy: { aberta_em: 'desc' },
      include: {
        gates: {
          where: { deleted_at: null },
        },
      },
    });

    const competenciaInfo = competenciaAtual
      ? {
          id: competenciaAtual.id,
          periodo: competenciaAtual.periodo,
          status: competenciaAtual.status as 'aberta' | 'fechada',
          gates_pendentes: competenciaAtual.gates.filter(g => g.status === 'pendente').length,
          gates_aprovados: competenciaAtual.gates.filter(g => g.status === 'aprovado').length,
          gates_rejeitados: competenciaAtual.gates.filter(g => g.status === 'rejeitado').length,
        }
      : {
          id: null,
          periodo: null,
          status: null,
          gates_pendentes: 0,
          gates_aprovados: 0,
          gates_rejeitados: 0,
        };

    return {
      obra: {
        id: obra.id,
        nome: obra.nome,
        status: obra.status,
      },
      kpis: {
        total_eap: totalEap,
        total_medido_mp: totalMedidoMP,
        total_medido_mc: totalMedidoMC,
        desvio_mp_mc: desvioMPMC,
        percentual_desvio: percentualDesvio,
      },
      competencia_atual: competenciaInfo,
      periodo: periodoAtual,
    };
  }

  /**
   * GET /read/competencia/status
   * Status consolidado da competência atual
   */
  async getCompetenciaStatus(obraId: string): Promise<{
    competencia: {
      id: string;
      periodo: string;
      status: 'aberta' | 'fechada';
      aberta_em: Date;
      fechada_em: Date | null;
    } | null;
    gates: Array<{
      numero: number;
      nome: string;
      status: string;
      trava: boolean;
      aprovado_em: Date | null;
      rejeitado_em: Date | null;
      motivo_rejeicao: string | null;
    }>;
    pendencias: {
      ativas: boolean;
      motivos: string[];
    };
    pode_fechar: boolean;
  }> {
    const competencia = await this.prisma.competenciaMensal.findFirst({
      where: {
        obra_id: obraId,
        status: CompetenciaStatus.aberta,
        deleted_at: null,
      },
      orderBy: { aberta_em: 'desc' },
      include: {
        gates: {
          where: { deleted_at: null },
          orderBy: { ordem: 'asc' },
        },
      },
    });

    if (!competencia) {
      return {
        competencia: null,
        gates: [],
        pendencias: {
          ativas: false,
          motivos: [],
        },
        pode_fechar: false,
      };
    }

    const gates = competencia.gates.map(gate => ({
      numero: gate.numero,
      nome: gate.nome,
      status: gate.status,
      trava: gate.trava,
      aprovado_em: gate.aprovado_em,
      rejeitado_em: gate.rejeitado_em,
      motivo_rejeicao: gate.motivo_rejeicao,
    }));

    // Verifica pendências
    const gate5 = competencia.gates.find(g => g.numero === 5);
    const gate6 = competencia.gates.find(g => g.numero === 6);
    const gates2a8 = competencia.gates.filter(g => g.numero >= 2 && g.numero <= 8);

    const motivos: string[] = [];
    if (gate5?.status !== 'aprovado') {
      motivos.push('Gate 5 (Qualidade) não aprovado');
    }
    if (gate6?.status !== 'aprovado') {
      motivos.push('Gate 6 (SSMA) não aprovado');
    }
    const todosGates2a8Aprovados = gates2a8.every(g => g.status === 'aprovado');
    if (!todosGates2a8Aprovados) {
      motivos.push('Gates 2 a 8 devem estar todos aprovados');
    }

    const podeFechar = todosGates2a8Aprovados && gate5?.status === 'aprovado' && gate6?.status === 'aprovado';

    return {
      competencia: {
        id: competencia.id,
        periodo: competencia.periodo,
        status: competencia.status as 'aberta' | 'fechada',
        aberta_em: competencia.aberta_em,
        fechada_em: competencia.fechada_em,
      },
      gates,
      pendencias: {
        ativas: motivos.length > 0,
        motivos,
      },
      pode_fechar: podeFechar,
    };
  }

  /**
   * GET /read/medicoes/resumo
   * Contagens e totais por status, por tipo (MP/MC), e lista resumida recente
   */
  async getMedicoesResumo(obraId: string, periodo?: string): Promise<{
    contagens: {
      por_status: Record<string, number>;
      por_tipo: Record<string, number>;
      total: number;
    };
    totais: {
      mp: number;
      mc: number;
      desvio: number;
    };
    recentes: Array<{
      id: string;
      tipo: string;
      periodo: string;
      quantidade: number;
      valor: number;
      status: string;
      data_medicao: Date;
    }>;
  }> {
    const periodoAtual = periodo || this.getMesAtual();

    const where: any = {
      obra_id: obraId,
      deleted_at: null,
    };

    if (periodoAtual) {
      where.periodo_referencia = periodoAtual;
    }

    const medicoes = await this.prisma.medicao.findMany({
      where,
      orderBy: { data_medicao: 'desc' },
      take: 10, // Últimas 10
    });

    // Contagens por status
    const porStatus: Record<string, number> = {};
    medicoes.forEach(m => {
      porStatus[m.status] = (porStatus[m.status] || 0) + 1;
    });

    // Contagens por tipo
    const porTipo: Record<string, number> = {};
    medicoes.forEach(m => {
      porTipo[m.tipo] = (porTipo[m.tipo] || 0) + 1;
    });

    // Totais MP e MC (aprovadas)
    const medicoesAprovadas = medicoes.filter(m => m.status === 'APPROVED');
    const totalMP = medicoesAprovadas
      .filter(m => m.tipo === 'MP')
      .reduce((sum, m) => sum + Number(m.valor_medido || 0), 0);
    const totalMC = medicoesAprovadas
      .filter(m => m.tipo === 'MC')
      .reduce((sum, m) => sum + Number(m.valor_medido || 0), 0);

    const recentes = medicoes.slice(0, 10).map(m => ({
      id: m.id,
      tipo: m.tipo,
      periodo: m.periodo_referencia,
      quantidade: Number(m.quantidade_medida),
      valor: Number(m.valor_medido || 0),
      status: m.status,
      data_medicao: m.data_medicao,
    }));

    return {
      contagens: {
        por_status: porStatus,
        por_tipo: porTipo,
        total: medicoes.length,
      },
      totais: {
        mp: totalMP,
        mc: totalMC,
        desvio: totalMC - totalMP,
      },
      recentes,
    };
  }

  /**
   * GET /read/suprimentos/resumo
   * Total de insumos cadastrados, últimos criados/alterados
   */
  async getSuprimentosResumo(obraId?: string): Promise<{
    total_insumos: number;
    recentes: Array<{
      id: string;
      codigo: string;
      nome: string;
      categoria: string;
      created_at: Date;
      updated_at: Date;
    }>;
  }> {
    const where: any = {
      deleted_at: null,
    };

    const [total, recentes] = await Promise.all([
      this.prisma.insumo.count({ where }),
      this.prisma.insumo.findMany({
        where,
        orderBy: { updated_at: 'desc' },
        take: 10,
        select: {
          id: true,
          codigo: true,
          nome: true,
          categoria: true,
          created_at: true,
          updated_at: true,
        },
      }),
    ]);

    return {
      total_insumos: total,
      recentes: recentes.map(i => ({
        id: i.id,
        codigo: i.codigo,
        nome: i.nome,
        categoria: i.categoria,
        created_at: i.created_at,
        updated_at: i.updated_at,
      })),
    };
  }

  /**
   * Helper: retorna mês atual no formato YYYY-MM
   */
  private getMesAtual(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}

