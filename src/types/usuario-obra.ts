/**
 * Modelo de dados para a tabela usuario_obra
 * Representa a permissão de um usuário para acessar uma obra
 */
export interface UsuarioObra {
  id: string;
  usuario_id: string;
  obra_id: string;
  permissao: 'leitura' | 'escrita' | 'administrador';
  is_ativo: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/**
 * DTO para criação de permissão
 */
export interface CreateUsuarioObraDto {
  usuario_id: string;
  obra_id: string;
  permissao?: 'leitura' | 'escrita' | 'administrador';
  is_ativo?: boolean;
}

/**
 * DTO para atualização de permissão
 */
export interface UpdateUsuarioObraDto {
  permissao?: 'leitura' | 'escrita' | 'administrador';
  is_ativo?: boolean;
}



