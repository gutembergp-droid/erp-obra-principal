/**
 * FASE 1: Códigos dos Gates Oficiais (fixos)
 */
export type GateCodigo = 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7' | 'G8' | 'G9';

/**
 * FASE 1: Nomes dos Gates Oficiais
 */
export const GATE_NAMES: Record<GateCodigo, string> = {
  G1: 'Liberação da Obra (Corporativo)',
  G2: 'Fechamento de Produção',
  G3: 'Fechamento de Custos',
  G4: 'Fechamento Comercial',
  G5: 'Qualidade OK (TRAVA)',
  G6: 'SST OK (TRAVA)',
  G7: 'Financeiro OK',
  G8: 'Gerencial OK',
  G9: 'Competência Concluída',
};

/**
 * FASE 1: Ordem dos Gates (imutável)
 */
export const GATE_ORDER: Record<GateCodigo, number> = {
  G1: 1,
  G2: 2,
  G3: 3,
  G4: 4,
  G5: 5,
  G6: 6,
  G7: 7,
  G8: 8,
  G9: 9,
};

/**
 * Modelo de dados para a tabela gates
 * FASE 1: Gates fixos (G1-G9) conforme conceito oficial
 * Representa os portões/marcos do projeto (gates de aprovação)
 */
export interface Gate {
  id: string;
  obra_id: string;
  codigo: GateCodigo; // FASE 1: Enum fixo G1-G9
  nome: string;
  descricao?: string;
  ordem: number; // FASE 1: Ordem imutável 1-9
  data_prevista?: Date;
  data_real?: Date;
  status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';
  usuario_id?: string; // Usuário que criou/executou a ação
  aprovado_por?: string; // Mantido para compatibilidade
  usuario_aprovador_id?: string; // Usuário que aprovou
  data_aprovacao?: Date;
  observacoes?: string;
  criterios_aprovacao?: string; // JSON ou texto com critérios
  competencia_mensal_id?: string; // FASE 1: Vinculado a competência mensal
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/**
 * DTO para criação de gate
 * FASE 1: Código deve ser um dos 9 oficiais
 */
export interface CreateGateDto {
  obra_id: string;
  codigo: GateCodigo; // FASE 1: Enum fixo G1-G9
  nome: string;
  descricao?: string;
  ordem: number; // FASE 1: Ordem imutável 1-9
  data_prevista?: Date;
  criterios_aprovacao?: string;
  usuario_id?: string; // Usuário que está criando o gate
  competencia_mensal_id?: string; // FASE 1: Vinculado a competência mensal
}

/**
 * DTO para atualização de gate
 */
export interface UpdateGateDto {
  codigo?: string;
  nome?: string;
  descricao?: string;
  tipo?: 'inicio' | 'meio' | 'fim' | 'customizado';
  ordem?: number;
  data_prevista?: Date;
  data_real?: Date;
  status?: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';
  usuario_id?: string; // Usuário que está atualizando
  aprovado_por?: string; // Mantido para compatibilidade
  usuario_aprovador_id?: string; // Usuário que está aprovando
  data_aprovacao?: Date;
  observacoes?: string;
  criterios_aprovacao?: string;
}

