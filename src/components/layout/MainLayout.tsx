'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useTheme } from '@/contexts/ThemeContext';

interface ObraAtiva {
  id: string;
  codigo: string;
  nome: string;
  cliente: string;
  status: string;
  orcamento_total?: number;
}

interface Usuario {
  nome: string;
  perfil: string;
  status?: 'online' | 'ausente' | 'ocupado' | 'offline';
}

// Margens ajustadas conforme especificação
const ESPACAMENTO_LATERAL = '25px';
const MARGEM_SUPERIOR = '20px';
const MARGEM_INFERIOR = '38px';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { colors } = useTheme();
  
  // Estados para dados globais
  const [obraAtiva, setObraAtiva] = useState<ObraAtiva | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Marca que estamos no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Carrega dados do usuário do localStorage
  useEffect(() => {
    if (!isClient) return;
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUsuario({
          nome: userData.nome || 'Usuário',
          perfil: userData.perfil || 'usuario',
          status: 'online',
        });
      } catch (e) {
        console.error('Erro ao parsear dados do usuário:', e);
      }
    }
  }, [isClient]);

  // Carrega obra ativa do localStorage ou contexto
  useEffect(() => {
    if (!isClient) return;
    
    const storedObra = localStorage.getItem('obraAtiva');
    if (storedObra) {
      try {
        setObraAtiva(JSON.parse(storedObra));
      } catch (e) {
        console.error('Erro ao parsear obra ativa:', e);
      }
    }
  }, [isClient]);

  // Não exibe o layout na página de login
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div 
      className="flex h-screen transition-colors duration-200"
      style={{ backgroundColor: colors.bgPrimary }}
    >
      {/* Sidebar */}
      <Sidebar 
        obraAtiva={obraAtiva ? {
          id: obraAtiva.id,
          codigo: obraAtiva.codigo,
          nome: obraAtiva.nome,
          cliente: obraAtiva.cliente || '-',
          status: obraAtiva.status,
        } : undefined}
      />

      {/* Área Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar com estrutura de 3 partes */}
        <Topbar
          usuario={usuario || undefined}
          notificacoes={3}
        />

        {/* Conteúdo com margens ajustadas */}
        <main 
          className="flex-1 overflow-y-auto transition-colors duration-200"
          style={{ 
            backgroundColor: colors.bgPrimary,
            paddingTop: MARGEM_SUPERIOR,
            paddingBottom: MARGEM_INFERIOR,
            paddingLeft: ESPACAMENTO_LATERAL,
            paddingRight: ESPACAMENTO_LATERAL,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
