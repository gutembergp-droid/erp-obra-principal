/**
 * Serviço de API para Autenticação
 */

import { api, saveTokens, clearTokens } from '../../lib/api';
import { LoginDto, LoginResponse, RefreshTokenResponse } from '../../types/auth';

/**
 * Faz login e salva tokens automaticamente
 */
export async function login(credentials: LoginDto): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  
  // Salva tokens automaticamente
  saveTokens(response.access_token, response.refresh_token);
  
  return response;
}

/**
 * Faz logout e remove tokens
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  } finally {
    // Sempre remove tokens, mesmo se a requisição falhar
    clearTokens();
  }
}

/**
 * Renova o access token
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
    refresh_token: refreshToken,
  });
  
  // Atualiza access token no localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', response.access_token);
  }
  
  return response;
}

/**
 * Obtém informações do usuário autenticado
 */
export async function getMe(): Promise<any> {
  return api.get('/auth/me');
}

