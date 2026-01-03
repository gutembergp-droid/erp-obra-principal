'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface ObraAtiva {
  id: string;
  codigo: string;
  nome: string;
  cliente: string;
  status: string;
  orcamento_total?: number;
}

interface CompetenciaAtiva {
  mes: number;
  ano: number;
}

interface Usuario {
  nome: string;
  perfil: string;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Estados para dados globais
  const [obraAtiva, setObraAtiva] = useState<ObraAtiva | null>(null);
  const [competencia, setCompetencia] = useState<CompetenciaAtiva>({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
  });
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [gateStatus, setGateStatus] = useState({ numero: 1, status: 'pendente' as const });
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

  // Dados para a Topbar
  const contratoInfo = obraAtiva?.orcamento_total 
    ? { valor: Number(obraAtiva.orcamento_total), prazo: 36 }
    : { valor: 0, prazo: 0 };

  return (
    <div className="flex h-screen bg-gray-950">
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
        {/* Topbar */}
        <Topbar
          competencia={competencia}
          contrato={contratoInfo}
          gateStatus={gateStatus}
          usuario={usuario || undefined}
          notificacoes={3}
        />

        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
