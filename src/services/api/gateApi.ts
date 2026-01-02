/**
 * Serviço de API para Gates
 * Comunica com o backend através do cliente HTTP
 */

import { api } from '../../lib/api';
import { Gate } from '../../types/gates';

/**
 * Lista gates por obra
 */
export async function listGatesByObra(obraId: string, filters?: {
  status?: string;
  tipo?: string;
}): Promise<Gate[]> {
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.tipo) queryParams.append('tipo', filters.tipo);

  const queryString = queryParams.toString();
  const endpoint = `/gates/obra/${obraId}${queryString ? `?${queryString}` : ''}`;

  return api.get<Gate[]>(endpoint);
}

/**
 * Busca um gate por ID
 */
export async function getGateById(id: string): Promise<Gate> {
  return api.get<Gate>(`/gates/${id}`);
}



