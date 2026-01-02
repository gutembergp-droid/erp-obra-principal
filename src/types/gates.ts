/**
 * Modelo de dados para a tabela gates
 * Representa os portões/marcos do projeto (gates de aprovação)
 */
export interface Gate {
  id: string;
  obra_id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  tipo: 'inicio' | 'meio' | 'fim' | 'customizado';
  ordem: number; // Ordem sequencial dos gates
  data_prevista?: Date;
  data_real?: Date;
  status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';
  usuario_id?: string; // Usuário que criou/executou a ação
  aprovado_por?: string; // Mantido para compatibilidade
  usuario_aprovador_id?: string; // Usuário que aprovou
  data_aprovacao?: Date;
  observacoes?: string;
  criterios_aprovacao?: string; // JSON ou texto com critérios
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/**
 * DTO para criação de gate
 */
export interface CreateGateDto {
  obra_id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  tipo: 'inicio' | 'meio' | 'fim' | 'customizado';
  ordem: number;
  data_prevista?: Date;
  criterios_aprovacao?: string;
  usuario_id?: string; // Usuário que está criando o gate
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

