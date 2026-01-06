import { apiClient } from '@/lib/api';

export interface Insumo {
  id: string;
  codigo: string;
  nome: string;
  unidade: string;
  categoria: string;
  preco_estimado: number;
  estoque: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateInsumoDto {
  codigo: string;
  nome: string;
  unidade: string;
  categoria: string;
  preco_estimado: number;
  estoque?: number;
}

export interface UpdateInsumoDto {
  nome?: string;
  unidade?: string;
  categoria?: string;
  preco_estimado?: number;
  estoque?: number;
}

export interface ListInsumosParams {
  categoria?: string;
  busca?: string;
  page?: number;
  pageSize?: number;
  includeDeleted?: boolean;
}

export interface CanonicalResponse<T> {
  data: T | null;
  meta: {
    page?: number;
    pageSize?: number;
    total?: number;
    [k: string]: any;
  } | null;
  error: {
    message: string;
    details?: any;
  } | null;
}

/**
 * Lista todos os insumos
 */
export async function listInsumos(params?: ListInsumosParams): Promise<Insumo[]> {
  const queryParams = new URLSearchParams();
  if (params?.categoria) queryParams.append('categoria', params.categoria);
  if (params?.busca) queryParams.append('busca', params.busca);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params?.includeDeleted) queryParams.append('includeDeleted', 'true');

  const url = `/suprimentos/insumos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await apiClient.get<CanonicalResponse<Insumo[]>>(url);
  
  if (response.error) {
    throw new Error(response.error.message);
  }
  
  return response.data || [];
}

/**
 * Busca um insumo por ID
 */
export async function getInsumoById(id: string): Promise<Insumo> {
  const response = await apiClient.get<CanonicalResponse<Insumo>>(`/suprimentos/insumos/${id}`);
  
  if (response.error) {
    throw new Error(response.error.message);
  }
  
  if (!response.data) {
    throw new Error('Insumo não encontrado');
  }
  
  return response.data;
}

/**
 * Cria um novo insumo
 */
export async function createInsumo(data: CreateInsumoDto): Promise<Insumo> {
  const response = await apiClient.post<CanonicalResponse<Insumo>>('/suprimentos/insumos', data);
  
  if (response.error) {
    throw new Error(response.error.message);
  }
  
  if (!response.data) {
    throw new Error('Erro ao criar insumo');
  }
  
  return response.data;
}

/**
 * Atualiza um insumo existente
 */
export async function updateInsumo(id: string, data: UpdateInsumoDto): Promise<Insumo> {
  const response = await apiClient.put<CanonicalResponse<Insumo>>(`/suprimentos/insumos/${id}`, data);
  
  if (response.error) {
    throw new Error(response.error.message);
  }
  
  if (!response.data) {
    throw new Error('Erro ao atualizar insumo');
  }
  
  return response.data;
}

/**
 * Deleta um insumo (soft delete)
 */
export async function deleteInsumo(id: string): Promise<void> {
  const response = await apiClient.delete<CanonicalResponse<{ message: string }>>(`/suprimentos/insumos/${id}`);
  
  if (response.error) {
    throw new Error(response.error.message);
  }
}



