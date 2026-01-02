/**
 * Modelo de dados para a tabela usuarios
 * Representa um usuário do sistema
 */
export interface Usuario {
  id: string;
  email: string;
  nome: string;
  senha_hash: string;
  perfil: 'admin' | 'gestor' | 'engenheiro' | 'usuario';
  is_ativo: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/**
 * DTO para criação de usuário
 */
export interface CreateUsuarioDto {
  email: string;
  nome: string;
  senha: string; // Será hashado no backend
  perfil?: 'admin' | 'gestor' | 'engenheiro' | 'usuario';
  is_ativo?: boolean;
}

/**
 * DTO para atualização de usuário
 */
export interface UpdateUsuarioDto {
  email?: string;
  nome?: string;
  senha?: string; // Será hashado no backend
  perfil?: 'admin' | 'gestor' | 'engenheiro' | 'usuario';
  is_ativo?: boolean;
}

/**
 * DTO para login
 */
export interface LoginDto {
  email: string;
  senha: string;
}

/**
 * DTO de resposta de autenticação
 */
export interface AuthResponseDto {
  usuario: Omit<Usuario, 'senha_hash'>;
  token: string;
}

