'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated as checkAuth } from '@/lib/auth';
import { login as apiLogin, logout as apiLogout } from '@/services/api/authApi';
import { clearTokens } from '@/lib/api';

interface User {
  id: string;
  email: string;
  nome: string;
  perfil: string;
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

/**
 * Hook customizado para gerenciar autenticação
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Carrega dados do usuário do token
   */
  const loadUser = useCallback(async () => {
    try {
      const authenticated = checkAuth();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        // Decodifica token para obter dados do usuário
        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({
              id: payload.usuario_id,
              email: payload.email,
              nome: payload.nome || payload.email,
              perfil: payload.perfil || 'usuario',
            });
          } catch (e) {
            console.error('Erro ao decodificar token:', e);
            clearTokens();
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Faz login
   */
  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // A função login do authApi já salva os tokens automaticamente
      await apiLogin({ email, senha: password });
      await loadUser();
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  }, [loadUser]);

  /**
   * Faz logout
   */
  const handleLogout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    }
  }, [router]);

  /**
   * Atualiza dados do usuário
   */
  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  // Carrega usuário ao montar
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    refreshUser,
  };
}

