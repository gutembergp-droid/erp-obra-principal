'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { EapEstruturacaoTable } from '@/components/EapEstruturacao';
import { Eap, EapFatorConversao } from '@/types';
import { listEapByObra, listFatoresConversao } from '@/services/api/eapApi';
import { getObraAtiva } from '@/services/api/contextoApi';

/**
 * Página principal de Estruturação da EAP
 * 
 * Esta página exibe a tabela de alta densidade com a visão dual
 * (Comercial e Operacional) e permite configuração detalhada via Drawers.
 * Conectada à API real com suporte a obra ativa.
 */
export default function EstruturacaoPage() {
  const [obraAtivaId, setObraAtivaId] = useState<string | null>(null);
  const [eapComercial, setEapComercial] = useState<Eap[]>([]);
  const [eapOperacional, setEapOperacional] = useState<Eap[]>([]);
  const [fatoresConversao, setFatoresConversao] = useState<EapFatorConversao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [baselineId, setBaselineId] = useState<string>('');

  /**
   * Carrega a obra ativa do contexto
   */
  const loadObraAtiva = useCallback(async () => {
    try {
      const obraAtiva = await getObraAtiva();
      if (obraAtiva) {
        setObraAtivaId(obraAtiva.id);
        // Baseline será determinado quando carregar a EAP
        // Por enquanto, não precisamos do baselineId para listar EAPs por obra
        setBaselineId('');
      } else {
        setObraAtivaId(null);
        setError('Nenhuma obra ativa selecionada. Selecione uma obra para visualizar a EAP.');
      }
    } catch (err: any) {
      console.error('Erro ao carregar obra ativa:', err);
      setError('Erro ao carregar obra ativa. Tente novamente.');
    }
  }, []);

  /**
   * Carrega EAPs da obra ativa
   */
  const loadEapData = useCallback(async () => {
    if (!obraAtivaId) {
      setEapComercial([]);
      setEapOperacional([]);
      setFatoresConversao([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Busca EAPs comerciais e operacionais em paralelo
      const [comercial, operacional] = await Promise.all([
        listEapByObra(obraAtivaId, 'comercial'),
        listEapByObra(obraAtivaId, 'operacional'),
      ]);

      setEapComercial(comercial);
      setEapOperacional(operacional);

      // Busca fatores de conversão para cada EAP comercial folha
      const eapFolha = comercial.filter(e => e.is_folha);
      if (eapFolha.length > 0) {
        const fatoresPromises = eapFolha.map(eap => listFatoresConversao(eap.id, true));
        const fatoresArrays = await Promise.all(fatoresPromises);
        const todosFatores = fatoresArrays.flat();
        setFatoresConversao(todosFatores);
      } else {
        setFatoresConversao([]);
      }
    } catch (err: any) {
      console.error('Erro ao carregar EAP:', err);
      setError(err.message || 'Erro ao carregar estrutura da EAP. Tente novamente.');
      setEapComercial([]);
      setEapOperacional([]);
      setFatoresConversao([]);
    } finally {
      setLoading(false);
    }
  }, [obraAtivaId]);

  /**
   * Carrega obra ativa ao montar o componente
   */
  useEffect(() => {
    loadObraAtiva();
  }, [loadObraAtiva]);

  /**
   * Recarrega EAP quando obra ativa muda
   */
  useEffect(() => {
    loadEapData();
  }, [loadEapData]);

  /**
   * Escuta mudanças na obra ativa (polling ou evento customizado)
   * Por enquanto, recarrega a cada 5 segundos se não houver obra ativa
   */
  useEffect(() => {
    if (!obraAtivaId) {
      const interval = setInterval(() => {
        loadObraAtiva();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [obraAtivaId, loadObraAtiva]);

  const handleUpdateEap = (eap: Eap) => {
    // TODO: Implementar atualização via API
    // Atualização local para demonstração
    if (eap.tipo === 'comercial') {
      setEapComercial(prev => prev.map(e => e.id === eap.id ? eap : e));
    } else {
      setEapOperacional(prev => prev.map(e => e.id === eap.id ? eap : e));
    }
  };

  const handleUpdateFatorConversao = (fator: EapFatorConversao) => {
    // TODO: Implementar atualização via API
    // Atualização local para demonstração
    setFatoresConversao(prev => prev.map(f => f.id === fator.id ? fator : f));
  };

  // Estado de loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando estrutura da EAP...</p>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-800 font-medium mb-2">Erro ao carregar EAP</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadObraAtiva();
              loadEapData();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Estado vazio (sem obra ativa)
  if (!obraAtivaId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <p className="text-gray-800 font-medium mb-2">Nenhuma obra selecionada</p>
          <p className="text-gray-600 text-sm">
            Selecione uma obra ativa para visualizar a estrutura da EAP.
          </p>
        </div>
      </div>
    );
  }

  // Estado vazio (sem dados na EAP)
  if (eapComercial.length === 0 && eapOperacional.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-gray-400 text-4xl mb-4">📄</div>
          <p className="text-gray-800 font-medium mb-2">EAP vazia</p>
          <p className="text-gray-600 text-sm">
            Esta obra ainda não possui estrutura de EAP cadastrada.
          </p>
        </div>
      </div>
    );
  }

  // Renderiza a tabela com dados
  return (
    <div className="eap-estruturacao-page">
      <EapEstruturacaoTable
        baselineId={baselineId}
        eapComercial={eapComercial}
        eapOperacional={eapOperacional}
        fatoresConversao={fatoresConversao}
        onUpdateEap={handleUpdateEap}
        onUpdateFatorConversao={handleUpdateFatorConversao}
      />
    </div>
  );
}
