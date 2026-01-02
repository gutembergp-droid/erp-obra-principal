/**
 * Modelo de dados para a tabela baseline_comercial
 * Representa a baseline comercial de uma obra
 * Versão 2.1: Inclui campos de homologação
 */
export type BaselineStatus = 'proposta' | 'homologada' | 'rejeitada';

export interface BaselineComercial {
  id: string;
  obra_id: string;
  versao: number;
  descricao?: string;
  valor_total: number;
  is_ativo: boolean;
  
  // Status e Homologação (v2.1)
  status: BaselineStatus;
  proposta_por?: string; // usuario_id que propôs
  proposta_em?: Date;
  homologada_por?: string; // usuario_id que homologou
  homologada_em?: Date;
  rejeitada_por?: string;
  rejeitada_em?: Date;
  motivo_rejeicao?: string;
  
  // Campos legados (mantidos para compatibilidade)
  data_aprovacao?: Date; // Deprecated: usar homologada_em
  aprovado_por?: string; // Deprecated: usar homologada_por
  
  // Timestamps
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

/**
 * DTO para propor baseline (v2.1)
 * Usado quando o Comercial cria a EAP e propõe para homologação
 */
export interface ProporBaselineDto {
  obra_id: string;
  versao: number;
  descricao?: string;
  valor_total: number;
  // EAP será criada separadamente e vinculada a esta baseline
}

/**
 * DTO para homologar baseline (v2.1)
 * Usado pelo Corporativo para homologar uma baseline proposta
 */
export interface HomologarBaselineDto {
  // Não precisa de campos, apenas confirma a homologação
  // O sistema registra automaticamente quem homologou e quando
}

/**
 * DTO para rejeitar baseline (v2.1)
 * Usado pelo Corporativo para rejeitar uma baseline proposta
 */
export interface RejeitarBaselineDto {
  motivo_rejeicao: string; // Obrigatório: motivo da rejeição
}

