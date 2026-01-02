/**
 * Serviço de API para Dashboard
 * Comunica com o backend através do cliente HTTP
 * Agrega dados de Medições e EAP para relatórios
 */

import { api } from '../../lib/api';

export interface DashboardKPI {
  valorTotalContratado: number;
  valorTotalMedido: number;
  percentualAvanco: number;
}

export interface EvolucaoData {
  data: string; // ISO date string
  acumulado: number;
}

export interface ComposicaoGrupo {
  grupo: string; // Primeiro nível da EAP (ex: "1", "2", "3")
  descricao: string; // Descrição do grupo
  valorMedido: number;
  percentual: number;
}

export interface DashboardData {
  kpi: DashboardKPI;
  evolucao: EvolucaoData[];
  composicao: ComposicaoGrupo[];
}

/**
 * Busca dados do dashboard para uma obra
 * @param obraId ID da obra
 * @param periodoFiltro Filtro de período: '30' (últimos 30 dias), '90' (últimos 90 dias), 'todos' (todos os dados)
 */
export async function getDashboardData(
  obraId: string,
  periodoFiltro: '30' | '90' | 'todos' = 'todos'
): Promise<DashboardData> {
  const queryParams = new URLSearchParams();
  queryParams.append('periodo', periodoFiltro);

  const endpoint = `/dashboard/obra/${obraId}?${queryParams.toString()}`;

  return api.get<DashboardData>(endpoint);
}



