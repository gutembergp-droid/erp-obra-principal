import React, { useState, useEffect } from 'react';
import { EapEstruturacaoTable } from '../components/EapEstruturacao';
import { Eap, EapFatorConversao, BaselineComercial } from '../types';

/**
 * Página principal de Estruturação da EAP
 * 
 * Esta página exibe a tabela de alta densidade com a visão dual
 * (Comercial e Operacional) e permite configuração detalhada via Drawers.
 */
export const EapEstruturacaoPage: React.FC = () => {
  const [baselineId, setBaselineId] = useState<string>('');
  const [eapComercial, setEapComercial] = useState<Eap[]>([]);
  const [eapOperacional, setEapOperacional] = useState<Eap[]>([]);
  const [fatoresConversao, setFatoresConversao] = useState<EapFatorConversao[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Substituir por chamada real à API
  useEffect(() => {
    // Simulação de carregamento de dados
    const loadData = async () => {
      setLoading(true);
      
      // Aqui você faria a chamada à API
      // const data = await api.getEapData(baselineId);
      
      // Dados de exemplo para demonstração
      setTimeout(() => {
        setEapComercial([
          {
            id: '1',
            baseline_comercial_id: 'baseline-1',
            codigo: '1.1.1',
            descricao: 'Serviço de Terraplanagem',
            tipo: 'comercial',
            nivel: 3,
            unidade_medida: 'm³',
            quantidade: 1500.5,
            valor_unitario: 45.75,
            valor_total: 68662.875,
            ordem: 1,
            is_folha: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '2',
            baseline_comercial_id: 'baseline-1',
            codigo: '1.1.2',
            descricao: 'Concreto Estrutural',
            tipo: 'comercial',
            nivel: 3,
            unidade_medida: 'm³',
            quantidade: 850.25,
            valor_unitario: 320.00,
            valor_total: 272080.00,
            ordem: 2,
            is_folha: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]);

        setEapOperacional([
          {
            id: 'op1',
            baseline_comercial_id: 'baseline-1',
            codigo: 'OP.1.1',
            descricao: 'Escavação Manual',
            tipo: 'operacional',
            nivel: 2,
            unidade_medida: 'm³',
            quantidade: 3750.125,
            valor_unitario: 18.30,
            valor_total: 68627.29,
            ordem: 1,
            is_folha: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'op2',
            baseline_comercial_id: 'baseline-1',
            codigo: 'OP.1.2',
            descricao: 'Aterro Compactado',
            tipo: 'operacional',
            nivel: 2,
            unidade_medida: 'm³',
            quantidade: 1500.5,
            valor_unitario: 22.50,
            valor_total: 33761.25,
            ordem: 2,
            is_folha: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]);

        setFatoresConversao([
          {
            id: 'f1',
            eap_comercial_id: '1',
            eap_operacional_id: 'op1',
            fator_quantidade: 2.5,
            fator_valor: 0.4,
            is_ativo: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]);

        setBaselineId('baseline-1');
        setLoading(false);
      }, 500);
    };

    loadData();
  }, []);

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando estrutura da EAP...</p>
      </div>
    );
  }

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
};

