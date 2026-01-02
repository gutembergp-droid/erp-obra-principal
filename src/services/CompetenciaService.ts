import { PrismaClient, CompetenciaMensal, CompetenciaGate, CompetenciaStatus, GateStatus, Prisma } from '@prisma/client';

/**
 * Backend Mínimo: Service para Competência Mensal
 * Gerencia abertura, fechamento e consulta de competências
 */
export class CompetenciaService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Nomes oficiais dos 9 Gates
   */
  private readonly GATE_NAMES = [
    'Liberação da Obra',
    'Fechamento Mensal de Custos',
    'Fechamento de Produção',
    'Fechamento Comercial',
    'Qualidade OK',
    'SSMA OK',
    'Financeiro OK',
    'Gerencial OK',
    'Competência Concluída',
  ];

  /**
   * Abre uma nova competência mensal e cria os 9 gates automaticamente
   */
  async abrirCompetencia(obraId: string, periodo: string): Promise<CompetenciaMensal> {
    // Valida formato do período
    const periodoRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!periodoRegex.test(periodo)) {
      throw new Error('Período deve estar no formato YYYY-MM (ex: 2026-01)');
    }

    // Verifica se já existe competência para este período
    const existing = await this.prisma.competenciaMensal.findUnique({
      where: {
        obra_id_periodo: {
          obra_id: obraId,
          periodo,
        },
      },
    });

    if (existing) {
      const error: any = new Error('Já existe uma competência para este período');
      error.code = 'PERIODO_DUPLICADO';
      throw error;
    }

    // Valida se a obra existe
    const obra = await this.prisma.obra.findUnique({
      where: { id: obraId },
    });

    if (!obra) {
      throw new Error(`Obra com ID ${obraId} não encontrada`);
    }

    // Cria competência e gates em transação
    return this.prisma.$transaction(async (tx) => {
      // Cria competência
      const competencia = await tx.competenciaMensal.create({
        data: {
          obra_id: obraId,
          periodo,
          status: 'aberta',
          aberta_em: new Date(),
        },
      });

      // Cria os 9 gates
      const gatesData = this.GATE_NAMES.map((nome, index) => ({
        competencia_id: competencia.id,
        obra_id: obraId,
        numero: index + 1,
        nome,
        status: index === 8 ? ('bloqueado' as GateStatus) : ('pendente' as GateStatus), // Gate 9 inicia bloqueado
        trava: index === 4 || index === 5, // Gates 5 e 6 são travas
        ordem: index + 1,
      }));

      await tx.competenciaGate.createMany({
        data: gatesData,
      });

      return competencia;
    });
  }

  /**
   * Busca competência ativa (aberta) de uma obra
   */
  async getCompetenciaAtiva(obraId: string): Promise<CompetenciaMensal | null> {
    return this.prisma.competenciaMensal.findFirst({
      where: {
        obra_id: obraId,
        status: 'aberta',
        deleted_at: null,
      },
      orderBy: {
        aberta_em: 'desc',
      },
    });
  }

  /**
   * Busca competência por ID
   */
  async getCompetenciaById(competenciaId: string): Promise<CompetenciaMensal | null> {
    return this.prisma.competenciaMensal.findUnique({
      where: { id: competenciaId },
    });
  }

  /**
   * Lista gates de uma competência com informações de travas
   */
  async listarGatesComTravas(competenciaId: string): Promise<{
    competencia: CompetenciaMensal;
    gates: CompetenciaGate[];
    travas: {
      ativas: boolean;
      motivos: string[];
    };
    pode_concluir: boolean;
  }> {
    const competencia = await this.prisma.competenciaMensal.findUnique({
      where: { id: competenciaId },
      include: {
        gates: {
          where: { deleted_at: null },
          orderBy: { ordem: 'asc' },
        },
      },
    });

    if (!competencia) {
      throw new Error(`Competência com ID ${competenciaId} não encontrada`);
    }

    const gates = competencia.gates;
    const gate5 = gates.find(g => g.numero === 5);
    const gate6 = gates.find(g => g.numero === 6);
    const gate9 = gates.find(g => g.numero === 9);

    // Verifica travas
    const travasAtivas = gate5?.status !== 'aprovado' || gate6?.status !== 'aprovado';
    const motivos: string[] = [];
    
    if (gate5?.status !== 'aprovado') {
      motivos.push('Gate 5 (Qualidade) não aprovado');
    }
    if (gate6?.status !== 'aprovado') {
      motivos.push('Gate 6 (SSMA) não aprovado');
    }

    // Verifica se pode concluir (gates 2-8 aprovados E gates 5 e 6 aprovados)
    const gates2a8 = gates.filter(g => g.numero >= 2 && g.numero <= 8);
    const todosGates2a8Aprovados = gates2a8.every(g => g.status === 'aprovado');
    const podeConcluir = todosGates2a8Aprovados && !travasAtivas;

    // Atualiza status do Gate 9 se necessário
    if (gate9) {
      if (!podeConcluir && gate9.status !== 'bloqueado') {
        await this.prisma.competenciaGate.update({
          where: { id: gate9.id },
          data: { status: 'bloqueado' },
        });
        gate9.status = 'bloqueado';
      } else if (podeConcluir && gate9.status === 'bloqueado') {
        await this.prisma.competenciaGate.update({
          where: { id: gate9.id },
          data: { status: 'pendente' },
        });
        gate9.status = 'pendente';
      }
    }

    return {
      competencia,
      gates,
      travas: {
        ativas: travasAtivas,
        motivos,
      },
      pode_concluir: podeConcluir,
    };
  }

  /**
   * Valida se pode aprovar um gate (sequência e dependências)
   */
  async validarAprovacaoGate(
    competenciaId: string,
    numero: number
  ): Promise<{ podeAprovar: boolean; motivo?: string }> {
    const competencia = await this.prisma.competenciaMensal.findUnique({
      where: { id: competenciaId },
      include: {
        gates: {
          where: { deleted_at: null },
          orderBy: { ordem: 'asc' },
        },
      },
    });

    if (!competencia) {
      throw new Error(`Competência com ID ${competenciaId} não encontrada`);
    }

    if (competencia.status === 'fechada') {
      const error: any = new Error('Competência já está fechada');
      error.code = 'COMPETENCIA_FECHADA';
      throw error;
    }

    const gates = competencia.gates;
    const gateAtual = gates.find(g => g.numero === numero);

    if (!gateAtual) {
      throw new Error(`Gate ${numero} não encontrado`);
    }

    // Gate 1 pode ser aprovado direto
    if (numero === 1) {
      return { podeAprovar: true };
    }

    // Para gates 2-8: gate anterior deve estar aprovado
    if (numero >= 2 && numero <= 8) {
      const gateAnterior = gates.find(g => g.numero === numero - 1);
      if (!gateAnterior || gateAnterior.status !== 'aprovado') {
        const error: any = new Error(`Gate ${numero - 1} deve estar aprovado antes de aprovar Gate ${numero}`);
        error.code = 'GATE_DEPENDENCY';
        throw error;
      }
      return { podeAprovar: true };
    }

    // Para gate 9: gates 2-8 devem estar aprovados E gates 5 e 6 aprovados
    if (numero === 9) {
      const gates2a8 = gates.filter(g => g.numero >= 2 && g.numero <= 8);
      const todosAprovados = gates2a8.every(g => g.status === 'aprovado');
      
      if (!todosAprovados) {
        const error: any = new Error('Gates 2 a 8 devem estar aprovados antes de aprovar Gate 9');
        error.code = 'GATE_DEPENDENCY';
        throw error;
      }

      const gate5 = gates.find(g => g.numero === 5);
      const gate6 = gates.find(g => g.numero === 6);

      if (gate5?.status !== 'aprovado') {
        const error: any = new Error('Gate 5 (Qualidade) deve estar aprovado antes de aprovar Gate 9');
        error.code = 'GATE_DEPENDENCY';
        throw error;
      }

      if (gate6?.status !== 'aprovado') {
        const error: any = new Error('Gate 6 (SSMA) deve estar aprovado antes de aprovar Gate 9');
        error.code = 'GATE_DEPENDENCY';
        throw error;
      }

      return { podeAprovar: true };
    }

    return { podeAprovar: false, motivo: 'Gate inválido' };
  }

  /**
   * Aprova um gate
   */
  async aprovarGate(
    competenciaId: string,
    numero: number,
    usuarioId: string,
    observacoes?: string
  ): Promise<CompetenciaGate> {
    // Valida aprovação
    await this.validarAprovacaoGate(competenciaId, numero);

    const gate = await this.prisma.competenciaGate.findFirst({
      where: {
        competencia_id: competenciaId,
        numero,
        deleted_at: null,
      },
    });

    if (!gate) {
      throw new Error(`Gate ${numero} não encontrado`);
    }

    // Atualiza gate
    const gateAtualizado = await this.prisma.competenciaGate.update({
      where: { id: gate.id },
      data: {
        status: 'aprovado',
        aprovado_por_id: usuarioId,
        aprovado_em: new Date(),
        observacoes: observacoes || gate.observacoes,
      },
    });

    // Se aprovar gate 9, fecha a competência
    if (numero === 9) {
      await this.prisma.competenciaMensal.update({
        where: { id: competenciaId },
        data: {
          status: 'fechada',
          fechada_em: new Date(),
        },
      });
    }

    return gateAtualizado;
  }

  /**
   * Rejeita um gate
   */
  async rejeitarGate(
    competenciaId: string,
    numero: number,
    usuarioId: string,
    motivo: string
  ): Promise<CompetenciaGate> {
    const competencia = await this.prisma.competenciaMensal.findUnique({
      where: { id: competenciaId },
    });

    if (!competencia) {
      throw new Error(`Competência com ID ${competenciaId} não encontrada`);
    }

    if (competencia.status === 'fechada') {
      const error: any = new Error('Competência já está fechada');
      error.code = 'COMPETENCIA_FECHADA';
      throw error;
    }

    const gate = await this.prisma.competenciaGate.findFirst({
      where: {
        competencia_id: competenciaId,
        numero,
        deleted_at: null,
      },
    });

    if (!gate) {
      throw new Error(`Gate ${numero} não encontrado`);
    }

    return this.prisma.competenciaGate.update({
      where: { id: gate.id },
      data: {
        status: 'rejeitado',
        rejeitado_por_id: usuarioId,
        rejeitado_em: new Date(),
        motivo_rejeicao: motivo,
      },
    });
  }

  /**
   * Conclui competência (equivale a aprovar Gate 9)
   */
  async concluirCompetencia(
    competenciaId: string,
    usuarioId: string
  ): Promise<{ competencia_id: string; status: string; fechada_em: Date }> {
    const dados = await this.listarGatesComTravas(competenciaId);

    if (!dados.pode_concluir) {
      const error: any = new Error('Não é possível concluir. Verifique as travas e dependências.');
      error.code = 'GATE_DEPENDENCY';
      throw error;
    }

    // Aprova gate 9 (que automaticamente fecha a competência)
    await this.aprovarGate(competenciaId, 9, usuarioId);

    const competencia = await this.prisma.competenciaMensal.findUnique({
      where: { id: competenciaId },
    });

    if (!competencia || !competencia.fechada_em) {
      throw new Error('Erro ao fechar competência');
    }

    return {
      competencia_id: competenciaId,
      status: 'fechada',
      fechada_em: competencia.fechada_em,
    };
  }
}

