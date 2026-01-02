'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Obra } from '../../../src/types/obras';
import { Gate } from '../../../src/types/gates';
import { Eap, EapFatorConversao } from '../../../src/types';
import { getObraById } from '../../../src/services/api/obraApi';
import { listGatesByObra } from '../../../src/services/api/gateApi';
import { listEapByObra, listFatoresConversao } from '../../../src/services/api/eapApi';
import { listMedicoesByObra, createMedicao } from '../../../src/services/api/medicaoApi';
import { getDashboardData, DashboardData } from '../../../src/services/api/dashboardApi';
import { EapEstruturacaoTable } from '../../../src/components/EapEstruturacao';
import { ProtectedRoute } from '../../../src/components/ProtectedRoute';
import { Medicao } from '../../../src/types/medicao';
import { EvolucaoLineChart } from './components/EvolucaoLineChart';
import { ComposicaoPizzaChart } from './components/ComposicaoPizzaChart';
import './page.css';

type TabType = 'resumo' | 'eap' | 'medicoes' | 'relatorios';

function ObraDetailContent() {
  const params = useParams();
  const router = useRouter();
  const obraId = params.id as string;

  const [obra, setObra] = useState<Obra | null>(null);
  const [gates, setGates] = useState<Gate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('resumo');

  // Dados para EAP
  const [eapComercial, setEapComercial] = useState<Eap[]>([]);
  const [eapOperacional, setEapOperacional] = useState<Eap[]>([]);
  const [fatoresConversao, setFatoresConversao] = useState<EapFatorConversao[]>([]);
  const [baselineId, setBaselineId] = useState<string | null>(null);
  const [loadingEap, setLoadingEap] = useState(false);

  // Dados para Medições
  const [medicoes, setMedicoes] = useState<Medicao[]>([]);
  const [loadingMedicoes, setLoadingMedicoes] = useState(false);
  const [isDrawerMedicaoOpen, setIsDrawerMedicaoOpen] = useState(false);
  const [isSavingMedicao, setIsSavingMedicao] = useState(false);
  
  // Dados para Relatórios
  const [loadingRelatorios, setLoadingRelatorios] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [periodoFiltro, setPeriodoFiltro] = useState<'30' | '90' | 'todos'>('todos');
  
  // Formulário de nova medição
  const [medicaoForm, setMedicaoForm] = useState({
    eap_id: '',
    periodo_referencia: '',
    data_medicao: new Date().toISOString().split('T')[0],
    quantidade_medida: '',
    valor_medido: '',
    observacoes: '',
  });

  /**
   * Carrega dados da obra
   */
  const loadObra = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getObraById(obraId);
      setObra(data);
      
      // Busca baseline ativa
      if (data.baseline_comercial && data.baseline_comercial.length > 0) {
        const baselineAtiva = data.baseline_comercial.find(b => b.is_ativo) || data.baseline_comercial[0];
        setBaselineId(baselineAtiva.id);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar obra');
      console.error('Erro ao carregar obra:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega gates da obra
   */
  const loadGates = async () => {
    try {
      const data = await listGatesByObra(obraId);
      setGates(data);
    } catch (err: any) {
      console.error('Erro ao carregar gates:', err);
    }
  };

  /**
   * Carrega EAPs da obra
   */
  const loadEap = async () => {
    if (!baselineId) return;

    try {
      setLoadingEap(true);
      
      // Busca EAPs comerciais e operacionais
      const [comercial, operacional] = await Promise.all([
        listEapByObra(obraId, 'comercial'),
        listEapByObra(obraId, 'operacional'),
      ]);

      setEapComercial(comercial);
      setEapOperacional(operacional);

      // Busca fatores de conversão para cada EAP comercial folha
      const eapFolha = comercial.filter(e => e.is_folha);
      const fatoresPromises = eapFolha.map(eap => listFatoresConversao(eap.id, true));
      const fatoresArrays = await Promise.all(fatoresPromises);
      const todosFatores = fatoresArrays.flat();
      setFatoresConversao(todosFatores);
    } catch (err: any) {
      console.error('Erro ao carregar EAP:', err);
    } finally {
      setLoadingEap(false);
    }
  };

  useEffect(() => {
    if (obraId) {
      loadObra();
      loadGates();
    }
  }, [obraId]);

  useEffect(() => {
    if (baselineId && activeTab === 'eap') {
      loadEap();
    }
  }, [baselineId, activeTab]);

  /**
   * Carrega medições da obra
   */
  const loadMedicoes = async () => {
    try {
      setLoadingMedicoes(true);
      const data = await listMedicoesByObra(obraId);
      setMedicoes(data);
    } catch (err: any) {
      console.error('Erro ao carregar medições:', err);
    } finally {
      setLoadingMedicoes(false);
    }
  };

  useEffect(() => {
    if (obraId && activeTab === 'medicoes') {
      loadMedicoes();
      // Carrega EAPs se ainda não foram carregadas (para o select)
      if (eapComercial.length === 0 && baselineId) {
        loadEap();
      }
    }
  }, [obraId, activeTab]);

  /**
   * Abre drawer de nova medição
   */
  const handleOpenDrawerMedicao = () => {
    setIsDrawerMedicaoOpen(true);
    setMedicaoForm({
      eap_id: '',
      periodo_referencia: '',
      data_medicao: new Date().toISOString().split('T')[0],
      quantidade_medida: '',
      valor_medido: '',
      observacoes: '',
    });
  };

  /**
   * Fecha drawer de medição
   */
  const handleCloseDrawerMedicao = () => {
    setIsDrawerMedicaoOpen(false);
  };

  /**
   * Atualiza campo do formulário de medição
   */
  const handleMedicaoFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedicaoForm(prev => {
      const updated = { ...prev, [name]: value };
      
      // Calcula valor medido automaticamente se EAP e quantidade estiverem preenchidos
      const eapIdAtual = name === 'eap_id' ? value : prev.eap_id;
      const quantidadeAtual = name === 'quantidade_medida' ? parseFloat(value) : parseFloat(prev.quantidade_medida);
      
      if (eapIdAtual && !isNaN(quantidadeAtual) && quantidadeAtual > 0) {
        const eapSelecionada = eapComercial.find(e => e.id === eapIdAtual);
        
        if (eapSelecionada && eapSelecionada.valor_unitario) {
          const valorMedido = quantidadeAtual * Number(eapSelecionada.valor_unitario);
          updated.valor_medido = valorMedido.toFixed(2);
        } else {
          updated.valor_medido = '';
        }
      } else {
        updated.valor_medido = '';
      }
      
      return updated;
    });
  };

  /**
   * Salva nova medição
   */
  const handleSaveMedicao = async () => {
    try {
      setIsSavingMedicao(true);
      
      if (!medicaoForm.eap_id || !medicaoForm.periodo_referencia || !medicaoForm.quantidade_medida) {
        alert('EAP, Período e Quantidade são obrigatórios');
        return;
      }

      const medicaoData = {
        obra_id: obraId,
        eap_id: medicaoForm.eap_id,
        periodo_referencia: medicaoForm.periodo_referencia,
        data_medicao: new Date(medicaoForm.data_medicao),
        quantidade_medida: parseFloat(medicaoForm.quantidade_medida),
        valor_medido: medicaoForm.valor_medido ? parseFloat(medicaoForm.valor_medido) : undefined,
        observacoes: medicaoForm.observacoes || undefined,
        status: 'rascunho' as const,
      };

      await createMedicao(medicaoData);
      
      setIsDrawerMedicaoOpen(false);
      await loadMedicoes();
    } catch (err: any) {
      console.error('Erro ao salvar medição:', err);
      alert(err.message || 'Erro ao salvar medição');
    } finally {
      setIsSavingMedicao(false);
    }
  };

  /**
   * Calcula progresso dos gates
   */
  const calculateGateProgress = () => {
    if (gates.length === 0) return 0;
    const aprovados = gates.filter(g => g.status === 'aprovado').length;
    return Math.round((aprovados / gates.length) * 100);
  };

  /**
   * Formata data
   */
  const formatDate = (date?: Date | string): string => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
  };

  /**
   * Formata valor monetário
   */
  const formatCurrency = (value?: number): string => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  /**
   * Obtém cor do status
   */
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      planejamento: '#9CA3AF',
      em_andamento: '#3B82F6',
      pausada: '#F59E0B',
      concluida: '#10B981',
      cancelada: '#EF4444',
    };
    return colors[status] || '#9CA3AF';
  };

  /**
   * Obtém cor do status do gate
   */
  const getGateStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pendente: '#9CA3AF',
      em_analise: '#F59E0B',
      aprovado: '#10B981',
      rejeitado: '#EF4444',
    };
    return colors[status] || '#9CA3AF';
  };

  /**
   * Obtém cor do status da medição
   */
  const getMedicaoStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      rascunho: '#9CA3AF',
      enviada: '#3B82F6',
      aprovada: '#10B981',
      rejeitada: '#EF4444',
    };
    return colors[status] || '#9CA3AF';
  };

  /**
   * Calcula dados para relatórios
   */
  const calcularDadosRelatorios = () => {
    // Valor Total Medido (soma de todas as medições aprovadas)
    const valorTotalMedido = medicoes
      .filter(m => m.status === 'aprovada' && m.valor_medido)
      .reduce((sum, m) => sum + Number(m.valor_medido || 0), 0);

    // Valor Total do Orçamento
    const valorTotalOrcamento = obra?.orcamento_total ? Number(obra.orcamento_total) : 0;

    // Porcentagem de avanço financeiro
    const porcentagemAvanco = valorTotalOrcamento > 0
      ? Math.round((valorTotalMedido / valorTotalOrcamento) * 100)
      : 0;

    // Evolução mensal (acumulado de medições)
    const evolucaoMensal: { mes: string; acumulado: number }[] = [];
    const medicoesAprovadas = medicoes
      .filter(m => m.status === 'aprovada' && m.valor_medido)
      .sort((a, b) => new Date(a.data_medicao).getTime() - new Date(b.data_medicao).getTime());

    let acumulado = 0;
    const mesesMap = new Map<string, number>();

    medicoesAprovadas.forEach(medicao => {
      const data = new Date(medicao.data_medicao);
      const mes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      acumulado += Number(medicao.valor_medido || 0);
      mesesMap.set(mes, acumulado);
    });

    // Converte map para array ordenado
    Array.from(mesesMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([mes, valor]) => {
        evolucaoMensal.push({ mes, acumulado: valor });
      });

    // Top 5 Serviços (EAPs com maior valor medido)
    const eapValores = new Map<string, { eap: Eap; valorTotal: number }>();

    medicoes
      .filter(m => m.status === 'aprovada' && m.eap_id && m.valor_medido)
      .forEach(medicao => {
        const eap = eapComercial.find(e => e.id === medicao.eap_id);
        if (eap) {
          const atual = eapValores.get(eap.id) || { eap, valorTotal: 0 };
          atual.valorTotal += Number(medicao.valor_medido || 0);
          eapValores.set(eap.id, atual);
        }
      });

    const top5Servicos = Array.from(eapValores.values())
      .sort((a, b) => b.valorTotal - a.valorTotal)
      .slice(0, 5);

    return {
      valorTotalMedido,
      valorTotalOrcamento,
      porcentagemAvanco,
      evolucaoMensal,
      top5Servicos,
    };
  };

  if (loading) {
    return (
      <div className="obra-detail-loading">
        <p>Carregando obra...</p>
      </div>
    );
  }

  if (error || !obra) {
    return (
      <div className="obra-detail-error">
        <p>{error || 'Obra não encontrada'}</p>
        <button onClick={() => router.push('/obras')}>Voltar para Obras</button>
      </div>
    );
  }

  const gateProgress = calculateGateProgress();

  return (
    <div className="obra-detail-page">
      {/* Header da Obra */}
      <div className="obra-header">
        <div className="obra-header-main">
          <div>
            <h1>{obra.nome}</h1>
            <p className="obra-codigo">Código: {obra.codigo}</p>
            {obra.cliente && <p className="obra-cliente">Cliente: {obra.cliente}</p>}
          </div>
          <div className="obra-status">
            <span
              className="status-badge"
              style={{ backgroundColor: getStatusColor(obra.status) }}
            >
              {obra.status}
            </span>
          </div>
        </div>

        {/* Progresso dos Gates */}
        <div className="gates-progress">
          <div className="gates-progress-header">
            <h3>Progresso dos Gates</h3>
            <span className="gates-progress-percentage">{gateProgress}%</span>
          </div>
          <div className="gates-progress-bar">
            <div
              className="gates-progress-fill"
              style={{ width: `${gateProgress}%` }}
            />
          </div>
          <div className="gates-list">
            {gates.map((gate) => (
              <div key={gate.id} className="gate-item">
                <span className="gate-ordem">{gate.ordem}</span>
                <span className="gate-nome">{gate.nome}</span>
                <span
                  className="gate-status"
                  style={{ backgroundColor: getGateStatusColor(gate.status) }}
                >
                  {gate.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sistema de Abas */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'resumo' ? 'active' : ''}`}
            onClick={() => setActiveTab('resumo')}
          >
            Resumo
          </button>
          <button
            className={`tab-button ${activeTab === 'eap' ? 'active' : ''}`}
            onClick={() => setActiveTab('eap')}
          >
            EAP
          </button>
          <button
            className={`tab-button ${activeTab === 'medicoes' ? 'active' : ''}`}
            onClick={() => setActiveTab('medicoes')}
          >
            Medições
          </button>
          <button
            className={`tab-button ${activeTab === 'relatorios' ? 'active' : ''}`}
            onClick={() => setActiveTab('relatorios')}
          >
            Relatórios
          </button>
        </div>

        <div className="tabs-content">
          {/* Aba Resumo */}
          {activeTab === 'resumo' && (
            <div className="tab-panel">
              <h2>Resumo da Obra</h2>
              <div className="resumo-grid">
                <div className="resumo-item">
                  <label>Data Início:</label>
                  <span>{formatDate(obra.data_inicio)}</span>
                </div>
                <div className="resumo-item">
                  <label>Data Fim Prevista:</label>
                  <span>{formatDate(obra.data_fim_prevista)}</span>
                </div>
                <div className="resumo-item">
                  <label>Orçamento Total:</label>
                  <span>{formatCurrency(obra.orcamento_total)}</span>
                </div>
                {obra.descricao && (
                  <div className="resumo-item full-width">
                    <label>Descrição:</label>
                    <span>{obra.descricao}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aba EAP */}
          {activeTab === 'eap' && (
            <div className="tab-panel">
              {loadingEap ? (
                <p>Carregando EAP...</p>
              ) : baselineId ? (
                <EapEstruturacaoTable
                  baselineId={baselineId}
                  eapComercial={eapComercial}
                  eapOperacional={eapOperacional}
                  fatoresConversao={fatoresConversao}
                />
              ) : (
                <p>Nenhuma baseline comercial encontrada para esta obra.</p>
              )}
            </div>
          )}

          {/* Aba Medições */}
          {activeTab === 'medicoes' && (
            <div className="tab-panel">
              <h2>Medições</h2>
              <p>Funcionalidade de medições em desenvolvimento.</p>
            </div>
          )}

          {/* Aba Relatórios */}
          {activeTab === 'relatorios' && (
            <div className="tab-panel">
              <div className="dashboard-header">
                <h2>Relatórios e Dashboards</h2>
                <div className="period-filter">
                  <label htmlFor="periodo-filtro">Período:</label>
                  <select
                    id="periodo-filtro"
                    value={periodoFiltro}
                    onChange={(e) => setPeriodoFiltro(e.target.value as '30' | '90' | 'todos')}
                    className="filter-select"
                  >
                    <option value="30">Últimos 30 dias</option>
                    <option value="90">Últimos 90 dias</option>
                    <option value="todos">Todos</option>
                  </select>
                </div>
              </div>
              
              {loadingRelatorios ? (
                <p>Carregando relatórios...</p>
              ) : dashboardData ? (
                <>
                  {/* Cards de KPI */}
                  <div className="kpi-cards">
                    <div className="kpi-card">
                      <label>Valor Total Contratado</label>
                      <span className="kpi-value">{formatCurrency(dashboardData.kpi.valorTotalContratado)}</span>
                    </div>
                    <div className="kpi-card">
                      <label>Valor Total Medido</label>
                      <span className="kpi-value">{formatCurrency(dashboardData.kpi.valorTotalMedido)}</span>
                    </div>
                    <div className="kpi-card highlight">
                      <label>% Avanço Físico-Financeiro</label>
                      <span className="kpi-value percentage">{dashboardData.kpi.percentualAvanco}%</span>
                      <div className="kpi-progress-bar">
                        <div
                          className="kpi-progress-fill"
                          style={{ width: `${Math.min(dashboardData.kpi.percentualAvanco, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gráficos */}
                  <div className="charts-grid">
                    {/* Gráfico de Evolução */}
                    <div className="report-card">
                      <h3>Evolução do Acumulado de Medições</h3>
                      <div className="chart-container">
                        <EvolucaoLineChart data={dashboardData.evolucao} />
                      </div>
                    </div>

                    {/* Gráfico de Composição */}
                    <div className="report-card">
                      <h3>Composição por Grupo da EAP</h3>
                      <div className="chart-container">
                        <ComposicaoPizzaChart data={dashboardData.composicao} />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p>Nenhum dado disponível</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Página de Detalhes da Obra com Proteção de Rota
 */
export default function ObraDetailPage() {
  return (
    <ProtectedRoute>
      <ObraDetailContent />
    </ProtectedRoute>
  );
}

