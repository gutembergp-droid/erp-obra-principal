/**
 * Serviço de API para Obras
 * Comunica com o backend através do cliente HTTP
 */

import { api } from '../../lib/api';
import { Obra, CreateObraDto, UpdateObraDto } from '../../types/obras';

/**
 * Lista todas as obras
 */
export async function listObras(filters?: {
  status?: string;
  cliente?: string;
  includeDeleted?: boolean;
}): Promise<Obra[]> {
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.cliente) queryParams.append('cliente', filters.cliente);
  if (filters?.includeDeleted) queryParams.append('includeDeleted', 'true');

  const queryString = queryParams.toString();
  const endpoint = `/obras${queryString ? `?${queryString}` : ''}`;

  return api.get<Obra[]>(endpoint);
}

/**
 * Busca uma obra por ID
 */
export async function getObraById(id: string): Promise<Obra> {
  return api.get<Obra>(`/obras/${id}`);
}

/**
 * Cria uma nova obra
 */
export async function createObra(data: CreateObraDto): Promise<Obra> {
  return api.post<Obra>('/obras', data);
}

/**
 * Atualiza uma obra existente
 */
export async function updateObra(id: string, data: UpdateObraDto): Promise<Obra> {
  return api.put<Obra>(`/obras/${id}`, data);
}

/**
 * Deleta uma obra (soft delete)
 */
export async function deleteObra(id: string): Promise<void> {
  return api.delete<void>(`/obras/${id}`);
}



