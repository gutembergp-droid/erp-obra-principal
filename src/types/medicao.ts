/**
 * Modelo de dados para a tabela medicoes
 * Representa uma medição realizada em uma obra
 */
export interface Medicao {
  id: string;
  obra_id: string;
  eap_id?: string; // EAP relacionada (opcional)
  usuario_id: string; // Usuário que realizou a medição
  periodo_referencia: string; // Ex: "2026-01", "2026-Q1"
  data_medicao: Date;
  quantidade_medida: number;
  valor_medido?: number;
  observacoes?: string;
  status: 'rascunho' | 'enviada' | 'aprovada' | 'rejeitada';
  aprovado_por_id?: string;
  data_aprovacao?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/**
 * DTO para criação de medição
 */
export interface CreateMedicaoDto {
  obra_id: string;
  eap_id?: string;
  periodo_referencia: string;
  data_medicao: Date;
  quantidade_medida: number;
  valor_medido?: number;
  observacoes?: string;
  status?: 'rascunho' | 'enviada' | 'aprovada' | 'rejeitada';
}

/**
 * DTO para atualização de medição
 */
export interface UpdateMedicaoDto {
  eap_id?: string;
  periodo_referencia?: string;
  data_medicao?: Date;
  quantidade_medida?: number;
  valor_medido?: number;
  observacoes?: string;
  status?: 'rascunho' | 'enviada' | 'aprovada' | 'rejeitada';
  aprovado_por_id?: string;
  data_aprovacao?: Date;
}

/**
 * DTO para aprovação de medição
 */
export interface AprovarMedicaoDto {
  aprovado_por_id: string;
  observacoes?: string;
}

