import { BaselineComercial } from './baseline-comercial';

/**
 * Modelo de dados para a tabela obras
 * Representa uma obra/projeto no sistema
 */
export interface Obra {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  cliente?: string;
  data_inicio?: Date;
  data_fim_prevista?: Date;
  data_fim_real?: Date;
  status: 'planejamento' | 'em_andamento' | 'pausada' | 'concluida' | 'cancelada';
  orcamento_total?: number;
  baseline_comercial?: BaselineComercial[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/**
 * DTO para criação de obra
 */
export interface CreateObraDto {
  codigo: string;
  nome: string;
  descricao?: string;
  cliente?: string;
  data_inicio?: Date;
  data_fim_prevista?: Date;
  orcamento_total?: number;
  status?: 'planejamento' | 'em_andamento' | 'pausada' | 'concluida' | 'cancelada';
}

/**
 * DTO para atualização de obra
 */
export interface UpdateObraDto {
  codigo?: string;
  nome?: string;
  descricao?: string;
  cliente?: string;
  data_inicio?: Date;
  data_fim_prevista?: Date;
  data_fim_real?: Date;
  status?: 'planejamento' | 'em_andamento' | 'pausada' | 'concluida' | 'cancelada';
  orcamento_total?: number;
}

