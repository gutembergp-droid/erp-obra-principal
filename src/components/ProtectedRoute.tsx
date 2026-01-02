'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';

/**
 * Componente de Proteção de Rota
 * 
 * Redireciona para /login se usuário não estiver autenticado
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Verifica autenticação
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setIsChecking(false);

      if (!authenticated) {
        // Redireciona para login, salvando a rota atual
        const returnUrl = pathname !== '/login' ? pathname : '/obras';
        router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Mostra loading enquanto verifica
  if (isChecking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        color: '#e5e5e5'
      }}>
        <div>Verificando autenticação...</div>
      </div>
    );
  }

  // Se não autenticado, não renderiza children (já redirecionou)
  if (!isAuth) {
    return null;
  }

  // Se autenticado, renderiza children
  return <>{children}</>;
}



