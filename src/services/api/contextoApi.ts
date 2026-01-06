/**
 * Serviço de API para Contexto (obra ativa)
 */

import { api } from '../../lib/api';
import { Obra } from '../../types';

export interface ContextoObraAtiva {
  obraAtiva: Obra | null;
}

/**
 * Obtém a obra ativa do usuário
 */
export async function getObraAtiva(): Promise<Obra | null> {
  const response = await api.get<{ data: ContextoObraAtiva }>('/contexto/obra-ativa');
  // Formato canônico: response.data.data
  return response.data?.obraAtiva || null;
}

/**
 * Define a obra ativa do usuário
 */
export async function setObraAtiva(obraId: string | null): Promise<Obra | null> {
  const response = await api.put<{ data: ContextoObraAtiva }>('/contexto/obra-ativa', { obraId });
  // Formato canônico: response.data.data
  return response.data?.obraAtiva || null;
}




