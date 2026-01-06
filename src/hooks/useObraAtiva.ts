'use client';

import { useState, useEffect, useCallback } from 'react';
import { getObraAtiva, setObraAtiva } from '@/services/api/contextoApi';
import { Obra } from '@/types/obras';

interface UseObraAtivaReturn {
  obraAtiva: Obra | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  update: (obraId: string) => Promise<void>;
  clear: () => Promise<void>;
}

/**
 * Hook customizado para gerenciar obra ativa do contexto
 */
export function useObraAtiva(): UseObraAtivaReturn {
  const [obraAtiva, setObraAtivaState] = useState<Obra | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega obra ativa
   */
  const loadObraAtiva = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const obra = await getObraAtiva();
      setObraAtivaState(obra);
    } catch (err: any) {
      console.error('Erro ao carregar obra ativa:', err);
      setError(err.message || 'Erro ao carregar obra ativa');
      setObraAtivaState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Atualiza obra ativa
   */
  const updateObraAtiva = useCallback(async (obraId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await setObraAtiva(obraId);
      await loadObraAtiva();
    } catch (err: any) {
      console.error('Erro ao atualizar obra ativa:', err);
      setError(err.message || 'Erro ao atualizar obra ativa');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadObraAtiva]);

  /**
   * Limpa obra ativa
   */
  const clearObraAtiva = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await setObraAtiva(null);
      setObraAtivaState(null);
    } catch (err: any) {
      console.error('Erro ao limpar obra ativa:', err);
      setError(err.message || 'Erro ao limpar obra ativa');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carrega obra ativa ao montar
  useEffect(() => {
    loadObraAtiva();
  }, [loadObraAtiva]);

  return {
    obraAtiva,
    isLoading,
    error,
    refresh: loadObraAtiva,
    update: updateObraAtiva,
    clear: clearObraAtiva,
  };
}

