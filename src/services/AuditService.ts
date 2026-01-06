import { PrismaClient, Prisma } from '@prisma/client';

/**
 * Service para Auditoria por Eventos
 * Registra eventos críticos do sistema para rastreabilidade
 */
export class AuditService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Registra um evento de auditoria
   */
  async registrarEvento(data: {
    obra_id: string | null;
    usuario_id: string;
    entity_type: string;
    entity_id: string;
    action: string;
    payload?: any;
  }): Promise<void> {
    try {
      await this.prisma.auditEvent.create({
        data: {
          obra_id: data.obra_id,
          usuario_id: data.usuario_id,
          entity_type: data.entity_type,
          entity_id: data.entity_id,
          action: data.action,
          payload_json: data.payload ? (data.payload as any) : null,
        },
      });
    } catch (error) {
      // Não bloqueia a operação principal se a auditoria falhar
      console.error('Erro ao registrar evento de auditoria:', error);
    }
  }

  /**
   * Lista eventos de auditoria com filtros
   */
  async listarEventos(filters?: {
    obra_id?: string;
    periodo_inicio?: Date;
    periodo_fim?: Date;
    entity_type?: string;
    action?: string;
    usuario_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    eventos: Array<{
      id: string;
      obra_id: string | null;
      usuario_id: string | null;
      entity_type: string;
      entity_id: string | null;
      action: string;
      payload_json: any;
      created_at: Date;
    }>;
    total: number;
  }> {
    const where: Prisma.AuditEventWhereInput = {};

    if (filters?.obra_id) {
      where.obra_id = filters.obra_id;
    }

    if (filters?.periodo_inicio || filters?.periodo_fim) {
      where.created_at = {};
      if (filters.periodo_inicio) {
        where.created_at.gte = filters.periodo_inicio;
      }
      if (filters.periodo_fim) {
        where.created_at.lte = filters.periodo_fim;
      }
    }

    if (filters?.entity_type) {
      where.entity_type = filters.entity_type;
    }

    if (filters?.action) {
      where.action = filters.action;
    }

    if (filters?.usuario_id) {
      where.usuario_id = filters.usuario_id;
    }

    const [eventos, total] = await Promise.all([
      this.prisma.auditEvent.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
        take: filters?.limit || 100,
        skip: filters?.offset || 0,
      }),
      this.prisma.auditEvent.count({ where }),
    ]);

    return {
      eventos: eventos.map(e => ({
        id: e.id,
        obra_id: e.obra_id,
        usuario_id: e.usuario_id,
        entity_type: e.entity_type,
        entity_id: e.entity_id,
        action: e.action,
        payload_json: e.payload_json,
        created_at: e.created_at,
      })),
      total,
    };
  }
}
