import { Eap } from './eap';

/**
 * Modelo de dados para a tabela eap_fator_conversao
 * Representa o fator de conversão entre EAP Comercial e Operacional
 * 
 * REGRA: Cada item da EAP Comercial pode ter um ou mais itens da EAP Operacional
 * através de fatores de conversão que definem a relação quantidade/valor
 */
export interface EapFatorConversao {
  id: string;
  eap_comercial_id: string; // Item da EAP Comercial
  eap_operacional_id: string; // Item da EAP Operacional
  fator_quantidade: number; // Fator de conversão de quantidade (ex: 1 item comercial = 2.5 itens operacionais)
  fator_valor?: number; // Fator de conversão de valor (opcional)
  observacoes?: string;
  is_ativo: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/**
 * DTO para criação de fator de conversão
 */
export interface CreateEapFatorConversaoDto {
  eap_comercial_id: string;
  eap_operacional_id: string;
  fator_quantidade: number;
  fator_valor?: number;
  observacoes?: string;
  is_ativo?: boolean;
}

/**
 * DTO para atualização de fator de conversão
 */
export interface UpdateEapFatorConversaoDto {
  fator_quantidade?: number;
  fator_valor?: number;
  observacoes?: string;
  is_ativo?: boolean;
}

/**
 * Fator de conversão com informações das EAPs relacionadas
 */
export interface EapFatorConversaoCompleto extends EapFatorConversao {
  eap_comercial: Eap;
  eap_operacional: Eap;
}

