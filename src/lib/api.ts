/**
 * Cliente HTTP para comunicação com a API
 * Inclui interceptor para adicionar token JWT automaticamente
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Obtém o token de acesso do localStorage
 */
function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('access_token');
}

/**
 * Obtém o refresh token do localStorage
 */
function getRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('refresh_token');
}

/**
 * Salva tokens no localStorage
 */
export function saveTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
}

/**
 * Remove tokens do localStorage
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

/**
 * Renova o access token usando o refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      return data.access_token;
    }

    return null;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return null;
  }
}

/**
 * Faz uma requisição HTTP com interceptor de autenticação
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  // Prepara headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Adiciona token JWT se disponível
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  // Faz a requisição
  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Se token expirou, tenta renovar
  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Tenta novamente com o novo token
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } else {
      // Se não conseguiu renovar, limpa tokens e redireciona para login
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Sessão expirada. Faça login novamente.');
    }
  }

  // Verifica se a resposta é OK
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
  }

  // Retorna dados JSON
  return response.json();
}

/**
 * Cliente API com métodos HTTP
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return apiRequest<T>(endpoint, { ...options, method: 'GET' });
  },

  /**
   * POST request
   */
  post: <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    return apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    return apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
  },
};



