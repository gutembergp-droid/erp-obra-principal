import { PrismaClient, CompetenciaMensal, CompetenciaGate } from '@prisma/client';
import { CreateCompetenciaMensalDto, FecharCompetenciaMensalDto } from '../types/competencia-mensal';
import { GateService } from './GateService';

/**
 * FASE 1: Service Layer para Fechamento Mensal
 * 
 * Responsabilidades:
 * - Criar competências mensais
 * - Validar gates antes de fechar
 * - Fechar competências
 * - Verificar bloqueios (Gate 5 e Gate 6)
 */
export class FechamentoService {
  constructor(
    private prisma: PrismaClient,
    private gateService: GateService
  ) {}

  /**
   * Cria uma nova competência mensal
   */
  async criarCompetencia(data: CreateCompetenciaMensalDto): Promise<CompetenciaMensal> {
    // Valida se a obra existe
    const obra = await this.prisma.obra.findUnique({
      where: { id: data.obra_id },
    });

    if (!obra) {
      throw new Error(`Obra com ID ${data.obra_id} não encontrada`);
    }

    // Valida formato do período (YYYY-MM)
    const periodoRegex = /^\d{4}-\d{2}$/;
    if (!periodoRegex.test(data.periodo)) {
      throw new Error('Período deve estar no formato YYYY-MM (ex: 2026-01)');
    }

    // Verifica se já existe competência para este período
    const existing = await this.prisma.competenciaMensal.findUnique({
      where: {
        obra_id_periodo: {
          obra_id: data.obra_id,
          periodo: data.periodo,
        },
      },
    });

    if (existing) {
      throw new Error(`Competência para o período ${data.periodo} já existe`);
    }

    // Cria a competência
    const competencia = await this.prisma.competenciaMensal.create({
      data: {
        obra_id: data.obra_id,
        periodo: data.periodo,
        status: 'aberta',
        observacoes: data.observacoes,
      },
    });

    // Inicializa os 9 gates para esta competência
    await this.gateService.inicializarGatesOficiais(data.obra_id, undefined, competencia.id);

    return competencia;
  }

  /**
   * Valida se todos os gates estão aprovados
   */
  async validarGates(obraId: string, periodo: string): Promise<{
    valido: boolean;
    gatesPendentes: CompetenciaGate[];
    mensagem?: string;
  }> {
    const competencia = await this.prisma.competenciaMensal.findUnique({
      where: {
        obra_id_periodo: {
          obra_id: obraId,
          periodo,
        },
      },
      include: {
        gates: {
          where: {
            deleted_at: null,
          },
          orderBy: {
            ordem: 'asc',
          },
        },
      },
    });

    if (!competencia) {
      throw new Error(`Competência para o período ${periodo} não encontrada`);
    }

    const gatesPendentes = competencia.gates.filter(g => g.status !== 'aprovado');

    if (gatesPendentes.length > 0) {
      return {
        valido: false,
        gatesPendentes,
        mensagem: `${gatesPendentes.length} gate(s) ainda não aprovado(s)`,
      };
    }

    return {
      valido: true,
      gatesPendentes: [],
    };
  }

  /**
   * Verifica bloqueios (Gate 5 e Gate 6 devem estar aprovados)
   */
  async verificarBloqueios(obraId: string, periodo: string): Promise<{
    podeFechar: boolean;
    motivo?: string;
  }> {
    const competencia = await this.prisma.competenciaMensal.findUnique({
      where: {
        obra_id_periodo: {
          obra_id: obraId,
          periodo,
        },
      },
    });

    if (!competencia) {
      throw new Error(`Competência para o período ${periodo} não encontrada`);
    }

    // Verifica bloqueio do Gate 9 (que depende de Gate 5 e Gate 6)
    const bloqueio = await this.gateService.validarBloqueioGate9(obraId);

    return {
      podeFechar: bloqueio.podeAprovar,
      motivo: bloqueio.motivo,
    };
  }

  /**
   * Verifica se pode fechar a competência
   */
  async podeFechar(obraId: string, periodo: string): Promise<{
    podeFechar: boolean;
    motivo?: string;
    detalhes?: {
      gatesValidos: boolean;
      bloqueiosOk: boolean;
    };
  }> {
    // Valida gates
    const validacaoGates = await this.validarGates(obraId, periodo);
    
    // Verifica bloqueios
    const bloqueios = await this.verificarBloqueios(obraId, periodo);

    const podeFechar = validacaoGates.valido && bloqueios.podeFechar;

    let motivo: string | undefined;
    if (!validacaoGates.valido) {
      motivo = validacaoGates.mensagem;
    } else if (!bloqueios.podeFechar) {
      motivo = bloqueios.motivo;
    }

    return {
      podeFechar,
      motivo,
      detalhes: {
        gatesValidos: validacaoGates.valido,
        bloqueiosOk: bloqueios.podeFechar,
      },
    };
  }

  /**
   * Fecha uma competência mensal
   */
  async fecharCompetencia(
    obraId: string,
    periodo: string,
    data: FecharCompetenciaMensalDto
  ): Promise<CompetenciaMensal> {
    // Verifica se pode fechar
    const validacao = await this.podeFechar(obraId, periodo);

    if (!validacao.podeFechar) {
      throw new Error(validacao.motivo || 'Não é possível fechar a competência');
    }

    // Valida usuário
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: data.fechada_por },
    });

    if (!usuario) {
      throw new Error(`Usuário com ID ${data.fechada_por} não encontrado`);
    }

    // Atualiza a competência
    const competencia = await this.prisma.competenciaMensal.update({
      where: {
        obra_id_periodo: {
          obra_id: obraId,
          periodo,
        },
      },
      data: {
        status: 'fechada',
        fechada_em: new Date(),
        observacoes: data.observacoes,
      },
    });

    return competencia;
  }

  /**
   * Busca competência por obra e período
   */
  async getCompetencia(obraId: string, periodo: string): Promise<CompetenciaMensal | null> {
    return this.prisma.competenciaMensal.findUnique({
      where: {
        obra_id_periodo: {
          obra_id: obraId,
          periodo,
        },
      },
      include: {
        gates: {
          where: {
            deleted_at: null,
          },
          orderBy: {
            ordem: 'asc',
          },
        },
      },
    });
  }

  /**
   * Lista competências de uma obra
   */
  async listCompetencias(obraId: string): Promise<CompetenciaMensal[]> {
    return this.prisma.competenciaMensal.findMany({
      where: {
        obra_id: obraId,
        deleted_at: null,
      },
      orderBy: {
        periodo: 'desc',
      },
      include: {
        gates: {
          where: {
            deleted_at: null,
          },
          orderBy: {
            ordem: 'asc',
          },
        },
      },
    });
  }
}

