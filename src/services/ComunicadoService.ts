import { PrismaClient, ComunicadoEscopo, ComunicadoPrioridade, ComunicadoStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CriarComunicadoDTO {
  titulo: string;
  conteudo: string;
  escopo: ComunicadoEscopo;
  prioridade?: ComunicadoPrioridade;
  categoria?: string;
  setor_origem?: string;
  obra_id?: string;
  exige_confirmacao?: boolean;
  data_publicacao?: Date;
  data_expiracao?: Date;
}

export interface FiltrosComunicado {
  escopo?: ComunicadoEscopo;
  status?: ComunicadoStatus;
  obra_id?: string;
  categoria?: string;
  apenas_publicados?: boolean;
  apenas_fixados?: boolean;
}

export class ComunicadoService {
  
  /**
   * Lista comunicados com filtros
   */
  async listar(filtros: FiltrosComunicado = {}) {
    const where: any = {
      deleted_at: null,
    };

    if (filtros.escopo) {
      where.escopo = filtros.escopo;
    }

    if (filtros.status) {
      where.status = filtros.status;
    }

    if (filtros.obra_id) {
      where.OR = [
        { obra_id: filtros.obra_id },
        { escopo: 'global' }
      ];
    }

    if (filtros.categoria) {
      where.categoria = filtros.categoria;
    }

    if (filtros.apenas_publicados) {
      where.status = 'publicado';
      where.OR = [
        { data_expiracao: null },
        { data_expiracao: { gte: new Date() } }
      ];
    }

    if (filtros.apenas_fixados) {
      where.fixado = true;
    }

    return prisma.comunicado.findMany({
      where,
      include: {
        autor: {
          select: { id: true, nome: true, email: true }
        },
        validador_setor: {
          select: { id: true, nome: true }
        },
        publicador: {
          select: { id: true, nome: true }
        },
        _count: {
          select: { confirmacoes_leitura: true }
        }
      },
      orderBy: [
        { fixado: 'desc' },
        { prioridade: 'desc' },
        { publicado_em: 'desc' }
      ]
    });
  }

  /**
   * Lista comunicados publicados para a Intranet
   */
  async listarParaIntranet(obra_id?: string, usuario_id?: string) {
    const agora = new Date();
    
    const comunicados = await prisma.comunicado.findMany({
      where: {
        deleted_at: null,
        status: 'publicado',
        OR: [
          { data_publicacao: null },
          { data_publicacao: { lte: agora } }
        ],
        AND: [
          {
            OR: [
              { data_expiracao: null },
              { data_expiracao: { gte: agora } }
            ]
          },
          {
            OR: [
              { escopo: 'global' },
              { obra_id: obra_id || undefined }
            ]
          }
        ]
      },
      include: {
        autor: {
          select: { id: true, nome: true }
        },
        _count: {
          select: { confirmacoes_leitura: true }
        },
        confirmacoes_leitura: usuario_id ? {
          where: { usuario_id }
        } : false
      },
      orderBy: [
        { fixado: 'desc' },
        { prioridade: 'desc' },
        { publicado_em: 'desc' }
      ]
    });

    // Separar por escopo
    return {
      corporativos: comunicados.filter(c => c.escopo === 'global'),
      obra: comunicados.filter(c => c.escopo === 'obra'),
      setor: comunicados.filter(c => c.escopo === 'setor'),
      todos: comunicados
    };
  }

  /**
   * Busca um comunicado por ID
   */
  async buscarPorId(id: string) {
    return prisma.comunicado.findUnique({
      where: { id },
      include: {
        autor: {
          select: { id: true, nome: true, email: true }
        },
        validador_setor: {
          select: { id: true, nome: true }
        },
        publicador: {
          select: { id: true, nome: true }
        },
        aprovador_corporativo: {
          select: { id: true, nome: true }
        },
        erratas: true,
        comunicado_original: true,
        confirmacoes_leitura: {
          include: {
            usuario: {
              select: { id: true, nome: true }
            }
          }
        }
      }
    });
  }

  /**
   * Cria um novo comunicado (rascunho)
   */
  async criar(dados: CriarComunicadoDTO, autor_id: string) {
    return prisma.comunicado.create({
      data: {
        titulo: dados.titulo,
        conteudo: dados.conteudo,
        escopo: dados.escopo,
        prioridade: dados.prioridade || 'normal',
        categoria: dados.categoria,
        setor_origem: dados.setor_origem,
        obra_id: dados.obra_id,
        exige_confirmacao: dados.exige_confirmacao || false,
        data_publicacao: dados.data_publicacao,
        data_expiracao: dados.data_expiracao,
        autor_id,
        status: 'rascunho'
      },
      include: {
        autor: {
          select: { id: true, nome: true }
        }
      }
    });
  }

  /**
   * Submete comunicado para validação do setor
   */
  async submeterParaValidacao(id: string) {
    return prisma.comunicado.update({
      where: { id },
      data: {
        status: 'aguardando_validacao_setor'
      }
    });
  }

  /**
   * Valida comunicado (Chefe do Setor)
   */
  async validarPeloSetor(id: string, validador_id: string) {
    return prisma.comunicado.update({
      where: { id },
      data: {
        status: 'aguardando_publicacao',
        validador_setor_id: validador_id,
        validado_setor_em: new Date()
      }
    });
  }

  /**
   * Devolve comunicado para ajustes
   */
  async devolverParaAjustes(id: string) {
    return prisma.comunicado.update({
      where: { id },
      data: {
        status: 'devolvido_para_ajustes'
      }
    });
  }

  /**
   * Publica comunicado (Setor de Comunicação)
   * Se for global, precisa de aprovação corporativa primeiro
   */
  async publicar(id: string, publicador_id: string) {
    const comunicado = await prisma.comunicado.findUnique({
      where: { id }
    });

    if (!comunicado) {
      throw new Error('Comunicado não encontrado');
    }

    // Se for global e não tiver aprovação corporativa, enviar para aprovação
    if (comunicado.escopo === 'global' && !comunicado.aprovado_corporativo_em) {
      return prisma.comunicado.update({
        where: { id },
        data: {
          status: 'aguardando_aprovacao_corporativa'
        }
      });
    }

    // Publicar
    return prisma.comunicado.update({
      where: { id },
      data: {
        status: 'publicado',
        publicador_id,
        publicado_em: new Date(),
        data_publicacao: comunicado.data_publicacao || new Date()
      }
    });
  }

  /**
   * Aprova comunicado global (Corporativo)
   */
  async aprovarCorporativo(id: string, aprovador_id: string) {
    return prisma.comunicado.update({
      where: { id },
      data: {
        aprovador_corporativo_id: aprovador_id,
        aprovado_corporativo_em: new Date(),
        status: 'aguardando_publicacao'
      }
    });
  }

  /**
   * Fixa/desfixa comunicado no topo
   */
  async toggleFixado(id: string) {
    const comunicado = await prisma.comunicado.findUnique({
      where: { id }
    });

    if (!comunicado) {
      throw new Error('Comunicado não encontrado');
    }

    return prisma.comunicado.update({
      where: { id },
      data: {
        fixado: !comunicado.fixado
      }
    });
  }

  /**
   * Confirma leitura de um comunicado
   */
  async confirmarLeitura(comunicado_id: string, usuario_id: string) {
    return prisma.confirmacaoLeitura.upsert({
      where: {
        comunicado_id_usuario_id: {
          comunicado_id,
          usuario_id
        }
      },
      create: {
        comunicado_id,
        usuario_id
      },
      update: {}
    });
  }

  /**
   * Cria uma errata vinculada a um comunicado
   */
  async criarErrata(comunicado_original_id: string, dados: CriarComunicadoDTO, autor_id: string) {
    const original = await prisma.comunicado.findUnique({
      where: { id: comunicado_original_id }
    });

    if (!original) {
      throw new Error('Comunicado original não encontrado');
    }

    return prisma.comunicado.create({
      data: {
        titulo: `[ERRATA] ${dados.titulo}`,
        conteudo: dados.conteudo,
        escopo: original.escopo,
        prioridade: 'urgente',
        categoria: original.categoria,
        setor_origem: original.setor_origem,
        obra_id: original.obra_id,
        autor_id,
        comunicado_original_id,
        is_errata: true,
        status: 'rascunho'
      }
    });
  }

  /**
   * Lista histórico de comunicados (para auditoria)
   */
  async listarHistorico(filtros: {
    data_inicio?: Date;
    data_fim?: Date;
    categoria?: string;
    setor_origem?: string;
    status?: ComunicadoStatus;
    autor_id?: string;
  } = {}) {
    const where: any = {};

    if (filtros.data_inicio || filtros.data_fim) {
      where.publicado_em = {};
      if (filtros.data_inicio) {
        where.publicado_em.gte = filtros.data_inicio;
      }
      if (filtros.data_fim) {
        where.publicado_em.lte = filtros.data_fim;
      }
    }

    if (filtros.categoria) {
      where.categoria = filtros.categoria;
    }

    if (filtros.setor_origem) {
      where.setor_origem = filtros.setor_origem;
    }

    if (filtros.status) {
      where.status = filtros.status;
    }

    if (filtros.autor_id) {
      where.autor_id = filtros.autor_id;
    }

    return prisma.comunicado.findMany({
      where,
      include: {
        autor: {
          select: { id: true, nome: true }
        },
        validador_setor: {
          select: { id: true, nome: true }
        },
        publicador: {
          select: { id: true, nome: true }
        },
        aprovador_corporativo: {
          select: { id: true, nome: true }
        },
        _count: {
          select: { 
            confirmacoes_leitura: true,
            erratas: true
          }
        }
      },
      orderBy: { publicado_em: 'desc' }
    });
  }
}

export const comunicadoService = new ComunicadoService();
