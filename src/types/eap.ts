import { EapFatorConversao } from './eap-fator-conversao';

/**
 * Modelo de dados para a tabela eap
 * Representa a Estrutura Analítica do Projeto (EAP)
 * Pode ser comercial ou operacional
 */
export interface Eap {
  id: string;
  baseline_comercial_id: string;
  codigo: string; // Código hierárquico (ex: 1.1.2.3)
  descricao: string;
  tipo: 'comercial' | 'operacional';
  nivel: number; // Nível hierárquico na árvore
  eap_pai_id?: string; // Referência ao item pai (self-reference)
  unidade_medida?: string;
  quantidade?: number;
  valor_unitario?: number;
  valor_total?: number;
  ordem: number; // Ordem de exibição
  is_folha: boolean; // Se é um item folha (sem filhos)
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/**
 * DTO para criação de EAP
 */
export interface CreateEapDto {
  baseline_comercial_id: string;
  codigo: string;
  descricao: string;
  tipo: 'comercial' | 'operacional';
  nivel: number;
  eap_pai_id?: string;
  unidade_medida?: string;
  quantidade?: number;
  valor_unitario?: number;
  valor_total?: number;
  ordem: number;
  is_folha?: boolean;
}

/**
 * DTO para atualização de EAP
 */
export interface UpdateEapDto {
  codigo?: string;
  descricao?: string;
  tipo?: 'comercial' | 'operacional';
  nivel?: number;
  eap_pai_id?: string;
  unidade_medida?: string;
  quantidade?: number;
  valor_unitario?: number;
  valor_total?: number;
  ordem?: number;
  is_folha?: boolean;
}

/**
 * EAP com relação ao fator de conversão
 */
export interface EapComFatorConversao extends Eap {
  fator_conversao?: EapFatorConversao;
  eap_relacionada?: Eap; // EAP comercial ou operacional relacionada
}

