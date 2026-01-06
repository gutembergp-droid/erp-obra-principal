'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useObraAtiva } from '@/hooks/useObraAtiva';
import { Obra } from '@/types/obras';

interface ObraAtivaContextType {
  obraAtiva: Obra | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  update: (obraId: string) => Promise<void>;
  clear: () => Promise<void>;
}

const ObraAtivaContext = createContext<ObraAtivaContextType | undefined>(undefined);

interface ObraAtivaProviderProps {
  children: ReactNode;
}

/**
 * Provider de obra ativa
 * Disponibiliza contexto de obra ativa para toda a aplicação
 */
export function ObraAtivaProvider({ children }: ObraAtivaProviderProps) {
  const obraAtiva = useObraAtiva();

  return (
    <ObraAtivaContext.Provider value={obraAtiva}>
      {children}
    </ObraAtivaContext.Provider>
  );
}

/**
 * Hook para usar o contexto de obra ativa
 */
export function useObraAtivaContext(): ObraAtivaContextType {
  const context = useContext(ObraAtivaContext);
  if (context === undefined) {
    throw new Error('useObraAtivaContext deve ser usado dentro de ObraAtivaProvider');
  }
  return context;
}

