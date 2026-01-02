/**
 * Modelo de dados para a tabela baseline_comercial
 * Representa a baseline comercial de uma obra
 */
export interface BaselineComercial {
  id: string;
  obra_id: string;
  versao: number;
  descricao?: string;
  data_aprovacao?: Date;
  aprovado_por?: string;
  valor_total: number;
  is_ativo: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/**
 * DTO para criação de baseline comercial
 */
export interface CreateBaselineComercialDto {
  obra_id: string;
  versao: number;
  descricao?: string;
  data_aprovacao?: Date;
  aprovado_por?: string;
  valor_total: number;
  is_ativo?: boolean;
}

/**
 * DTO para atualização de baseline comercial
 */
export interface UpdateBaselineComercialDto {
  versao?: number;
  descricao?: string;
  data_aprovacao?: Date;
  aprovado_por?: string;
  valor_total?: number;
  is_ativo?: boolean;
}

