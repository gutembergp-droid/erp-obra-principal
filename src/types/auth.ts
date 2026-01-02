/**
 * Tipos relacionados à autenticação
 */

/**
 * DTO para login
 */
export interface LoginDto {
  email: string;
  senha: string;
}

/**
 * DTO para refresh token
 */
export interface RefreshTokenDto {
  refresh_token: string;
}

/**
 * Resposta de login
 */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  usuario: {
    id: string;
    email: string;
    nome: string;
    perfil: string;
    is_ativo: boolean;
  };
}

/**
 * Resposta de refresh token
 */
export interface RefreshTokenResponse {
  access_token: string;
}

/**
 * Usuário autenticado (populado em req.user pelo authMiddleware)
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  nome: string;
  perfil: string;
  is_ativo: boolean;
}



