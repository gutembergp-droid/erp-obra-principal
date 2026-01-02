/**
 * Serviço de API para Medições
 * Comunica com o backend através do cliente HTTP
 */

import { api } from '../../lib/api';
import { Medicao, CreateMedicaoDto, UpdateMedicaoDto } from '../../types/medicao';

/**
 * Lista medições por obra
 */
export async function listMedicoesByObra(obraId: string, filters?: {
  eap_id?: string;
  periodo_referencia?: string;
  status?: string;
}): Promise<Medicao[]> {
  const queryParams = new URLSearchParams();
  if (filters?.eap_id) queryParams.append('eap_id', filters.eap_id);
  if (filters?.periodo_referencia) queryParams.append('periodo_referencia', filters.periodo_referencia);
  if (filters?.status) queryParams.append('status', filters.status);

  const queryString = queryParams.toString();
  const endpoint = `/medicoes/obra/${obraId}${queryString ? `?${queryString}` : ''}`;

  return api.get<Medicao[]>(endpoint);
}

/**
 * Busca uma medição por ID
 */
export async function getMedicaoById(id: string): Promise<Medicao> {
  return api.get<Medicao>(`/medicoes/${id}`);
}

/**
 * Cria uma nova medição
 */
export async function createMedicao(data: CreateMedicaoDto): Promise<Medicao> {
  return api.post<Medicao>('/medicoes', data);
}

/**
 * Atualiza uma medição existente
 */
export async function updateMedicao(id: string, data: UpdateMedicaoDto): Promise<Medicao> {
  return api.put<Medicao>(`/medicoes/${id}`, data);
}

/**
 * Deleta uma medição (soft delete)
 */
export async function deleteMedicao(id: string): Promise<void> {
  return api.delete<void>(`/medicoes/${id}`);
}



