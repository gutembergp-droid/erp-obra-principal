/**
 * Serviço de API para EAP
 * Comunica com o backend através do cliente HTTP
 */

import { api } from '../../lib/api';
import { Eap, EapFatorConversao } from '../../types';

/**
 * Lista EAPs por obra
 */
export async function listEapByObra(obraId: string, tipo?: 'comercial' | 'operacional'): Promise<Eap[]> {
  const queryParams = new URLSearchParams();
  if (tipo) queryParams.append('tipo', tipo);

  const queryString = queryParams.toString();
  const endpoint = `/eap/obra/${obraId}${queryString ? `?${queryString}` : ''}`;

  return api.get<Eap[]>(endpoint);
}

/**
 * Lista EAPs folha por obra
 */
export async function listEapFolhaByObra(obraId: string, tipo?: 'comercial' | 'operacional'): Promise<Eap[]> {
  const queryParams = new URLSearchParams();
  if (tipo) queryParams.append('tipo', tipo);

  const queryString = queryParams.toString();
  const endpoint = `/eap/obra/${obraId}/folha${queryString ? `?${queryString}` : ''}`;

  return api.get<Eap[]>(endpoint);
}

/**
 * Busca EAP Comercial com suas EAPs Operacionais relacionadas
 */
export async function getEapComercialComOperacional(baselineId: string): Promise<{
  eapComercial: Eap[];
  eapOperacional: Eap[];
  fatoresConversao: EapFatorConversao[];
}> {
  return api.get(`/eap/comercial-operacional/${baselineId}`);
}

/**
 * Lista fatores de conversão de uma EAP Comercial
 */
export async function listFatoresConversao(eapComercialId: string, apenasAtivos: boolean = true): Promise<EapFatorConversao[]> {
  const queryParams = new URLSearchParams();
  if (!apenasAtivos) queryParams.append('apenasAtivos', 'false');

  const queryString = queryParams.toString();
  const endpoint = `/eap/${eapComercialId}/fatores${queryString ? `?${queryString}` : ''}`;

  return api.get<EapFatorConversao[]>(endpoint);
}



