/**
 * FASE 1: Modelo de dados para Competência Mensal
 * Representa um período mensal de fechamento de uma obra
 */

export type CompetenciaStatus = 'aberta' | 'fechada' | 'reaberta';

export interface CompetenciaMensal {
  id: string;
  obra_id: string;
  periodo: string; // Formato: "2026-01" (YYYY-MM)
  status: CompetenciaStatus;
  data_abertura: Date;
  data_fechamento?: Date;
  fechada_por?: string; // usuario_id que fechou
  observacoes?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/**
 * DTO para criação de competência mensal
 */
export interface CreateCompetenciaMensalDto {
  obra_id: string;
  periodo: string; // Formato: "2026-01" (YYYY-MM)
  observacoes?: string;
}

/**
 * DTO para fechamento de competência mensal
 */
export interface FecharCompetenciaMensalDto {
  fechada_por: string; // usuario_id
  observacoes?: string;
}

