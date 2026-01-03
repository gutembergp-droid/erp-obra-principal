'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  ArrowLeftRight,
  Download,
  RefreshCw,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react';

// Tipos
interface EapItem {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
}

interface ComparativoItem {
  eap_id: string;
  eap?: EapItem;
  mp_quantidade: number;
  mp_valor: number;
  mc_quantidade: number;
  mc_valor: number;
  divergencia_quantidade: number;
  divergencia_valor: number;
  percentual_divergencia: number;
}

export default function ComparativoMPMCPage() {
  // Estados
  const [comparativo, setComparativo] = useState<ComparativoItem[]>([]);
  const [eapItems, setEapItems] = useState<EapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [obraId, setObraId] = useState<string | null>(null);
  const [competencia, setCompetencia] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Carrega obra ativa do localStorage
  useEffect(() => {
    const storedObra = localStorage.getItem('obraAtiva');
    if (storedObra) {
      try {
        const obra = JSON.parse(storedObra);
        setObraId(obra.id);
      } catch (e) {
        console.error('Erro ao parsear obra ativa:', e);
      }
    }
  }, []);

  // Carrega dados quando obra estiver disponível
  useEffect(() => {
    if (obraId) {
      carregarDados();
    }
  }, [obraId, competencia]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Carrega itens da EAP
      const resEap = await fetch(`/api/eap/obra/${obraId}`);
      let eapData: EapItem[] = [];
      if (resEap.ok) {
        eapData = await resEap.json();
        setEapItems(eapData);
      }

      // Carrega medições MP
      const resMp = await fetch(`/api/medicoes/obra/${obraId}?periodo_referencia=${competencia}`);
      let medicoesMP: any[] = [];
      let medicoesMC: any[] = [];
      
      if (resMp.ok) {
        const data = await resMp.json();
        medicoesMP = data.filter((m: any) => m.tipo === 'MP' && m.status === 'aprovada');
        medicoesMC = data.filter((m: any) => m.tipo === 'MC' && m.status === 'aprovada');
      }

      // Agrupa por EAP e calcula comparativo
      const comparativoMap = new Map<string, ComparativoItem>();

      // Processa MP
      medicoesMP.forEach((m: any) => {
        const key = m.eap_id || 'sem_eap';
        const atual = comparativoMap.get(key) || {
          eap_id: m.eap_id,
          eap: eapData.find(e => e.id === m.eap_id),
          mp_quantidade: 0,
          mp_valor: 0,
          mc_quantidade: 0,
          mc_valor: 0,
          divergencia_quantidade: 0,
          divergencia_valor: 0,
          percentual_divergencia: 0,
        };
        atual.mp_quantidade += Number(m.quantidade_medida);
        atual.mp_valor += Number(m.valor_medido || 0);
        comparativoMap.set(key, atual);
      });

      // Processa MC
      medicoesMC.forEach((m: any) => {
        const key = m.eap_id || 'sem_eap';
        const atual = comparativoMap.get(key) || {
          eap_id: m.eap_id,
          eap: eapData.find(e => e.id === m.eap_id),
          mp_quantidade: 0,
          mp_valor: 0,
          mc_quantidade: 0,
          mc_valor: 0,
          divergencia_quantidade: 0,
          divergencia_valor: 0,
          percentual_divergencia: 0,
        };
        atual.mc_quantidade += Number(m.quantidade_medida);
        atual.mc_valor += Number(m.valor_medido || 0);
        comparativoMap.set(key, atual);
      });

      // Calcula divergências
      const resultado = Array.from(comparativoMap.values()).map(item => {
        const divergencia_quantidade = item.mc_quantidade - item.mp_quantidade;
        const divergencia_valor = item.mc_valor - item.mp_valor;
        const percentual_divergencia = item.mp_quantidade > 0
          ? (divergencia_quantidade / item.mp_quantidade) * 100
          : (item.mc_quantidade > 0 ? 100 : 0);

        return {
          ...item,
          divergencia_quantidade,
          divergencia_valor,
          percentual_divergencia,
        };
      });

      setComparativo(resultado);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Formata valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Formata número
  const formatNumber = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Formata percentual
  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Retorna cor baseada na divergência
  const getDivergenciaColor = (percentual: number) => {
    if (Math.abs(percentual) < 1) return 'text-gray-400';
    if (percentual > 0) return 'text-green-400';
    return 'text-red-400';
  };

  // Retorna ícone baseado na divergência
  const getDivergenciaIcon = (percentual: number) => {
    if (Math.abs(percentual) < 1) return <Minus size={14} />;
    if (percentual > 0) return <TrendingUp size={14} />;
    return <TrendingDown size={14} />;
  };

  // Retorna status baseado na divergência
  const getDivergenciaStatus = (percentual: number) => {
    if (Math.abs(percentual) < 1) return { text: 'Alinhado', color: 'bg-gray-800 text-gray-400 border-gray-700' };
    if (Math.abs(percentual) < 5) return { text: 'Atenção', color: 'bg-yellow-900/50 text-yellow-400 border-yellow-700' };
    if (percentual > 0) return { text: 'MC > MP', color: 'bg-green-900/50 text-green-400 border-green-700' };
    return { text: 'MC < MP', color: 'bg-red-900/50 text-red-400 border-red-700' };
  };

  // Calcula totais
  const totais = comparativo.reduce((acc, item) => ({
    mp_quantidade: acc.mp_quantidade + item.mp_quantidade,
    mp_valor: acc.mp_valor + item.mp_valor,
    mc_quantidade: acc.mc_quantidade + item.mc_quantidade,
    mc_valor: acc.mc_valor + item.mc_valor,
    divergencia_valor: acc.divergencia_valor + item.divergencia_valor,
  }), {
    mp_quantidade: 0,
    mp_valor: 0,
    mc_quantidade: 0,
    mc_valor: 0,
    divergencia_valor: 0,
  });

  const percentualTotal = totais.mp_valor > 0 
    ? ((totais.mc_valor - totais.mp_valor) / totais.mp_valor) * 100 
    : 0;

  if (!obraId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Nenhuma obra selecionada</h2>
          <p className="text-gray-400">Selecione uma obra para visualizar o comparativo MP x MC.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Comparativo MP x MC</h1>
          <p className="text-gray-400 mt-1">Análise de divergências entre Produção e Cliente</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={carregarDados}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Atualizar
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-500" />
          <label className="text-gray-400 text-sm">Competência:</label>
          <input
            type="month"
            value={competencia}
            onChange={(e) => setCompetencia(e.target.value)}
            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={18} className="text-blue-500" />
            <p className="text-gray-400 text-sm">Total MP (Produção)</p>
          </div>
          <p className="text-2xl font-bold text-blue-400">{formatCurrency(totais.mp_valor)}</p>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <FileSpreadsheet size={18} className="text-green-500" />
            <p className="text-gray-400 text-sm">Total MC (Cliente)</p>
          </div>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totais.mc_valor)}</p>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <ArrowLeftRight size={18} className="text-yellow-500" />
            <p className="text-gray-400 text-sm">Divergência</p>
          </div>
          <p className={`text-2xl font-bold ${getDivergenciaColor(percentualTotal)}`}>
            {formatCurrency(totais.divergencia_valor)}
          </p>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            {Math.abs(percentualTotal) < 5 ? (
              <CheckCircle size={18} className="text-green-500" />
            ) : (
              <AlertTriangle size={18} className="text-yellow-500" />
            )}
            <p className="text-gray-400 text-sm">% Divergência</p>
          </div>
          <p className={`text-2xl font-bold ${getDivergenciaColor(percentualTotal)}`}>
            {formatPercent(percentualTotal)}
          </p>
        </div>
      </div>

      {/* Alerta de Divergência */}
      {Math.abs(percentualTotal) >= 5 && (
        <div className="flex items-center gap-3 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <AlertTriangle size={24} className="text-yellow-500 flex-shrink-0" />
          <div>
            <p className="text-yellow-400 font-semibold">Atenção: Divergência significativa detectada</p>
            <p className="text-yellow-400/70 text-sm mt-1">
              A diferença entre MP e MC está acima de 5%. Verifique os itens com maior divergência abaixo.
            </p>
          </div>
        </div>
      )}

      {/* Tabela Comparativa */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Item EAP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Descrição</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Unid.</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-blue-400 uppercase bg-blue-900/20">Qtd. MP</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-blue-400 uppercase bg-blue-900/20">Valor MP</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-green-400 uppercase bg-green-900/20">Qtd. MC</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-green-400 uppercase bg-green-900/20">Valor MC</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Divergência</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                  Carregando comparativo...
                </td>
              </tr>
            ) : comparativo.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma medição aprovada encontrada para esta competência.
                </td>
              </tr>
            ) : (
              comparativo.map((item, index) => {
                const status = getDivergenciaStatus(item.percentual_divergencia);
                return (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-white font-mono">
                      {item.eap?.codigo || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.eap?.descricao || 'Sem EAP vinculada'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 text-center">
                      {item.eap?.unidade || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-400 text-right font-mono bg-blue-900/10">
                      {formatNumber(item.mp_quantidade)}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-400 text-right bg-blue-900/10">
                      {formatCurrency(item.mp_valor)}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-400 text-right font-mono bg-green-900/10">
                      {formatNumber(item.mc_quantidade)}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-400 text-right bg-green-900/10">
                      {formatCurrency(item.mc_valor)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className={`flex items-center justify-end gap-1 text-sm ${getDivergenciaColor(item.percentual_divergencia)}`}>
                        {getDivergenciaIcon(item.percentual_divergencia)}
                        <span>{formatPercent(item.percentual_divergencia)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {comparativo.length > 0 && (
            <tfoot>
              <tr className="bg-gray-800/50 font-semibold">
                <td colSpan={3} className="px-4 py-3 text-sm text-white">
                  TOTAL
                </td>
                <td className="px-4 py-3 text-sm text-blue-400 text-right font-mono bg-blue-900/20">
                  {formatNumber(totais.mp_quantidade)}
                </td>
                <td className="px-4 py-3 text-sm text-blue-400 text-right bg-blue-900/20">
                  {formatCurrency(totais.mp_valor)}
                </td>
                <td className="px-4 py-3 text-sm text-green-400 text-right font-mono bg-green-900/20">
                  {formatNumber(totais.mc_quantidade)}
                </td>
                <td className="px-4 py-3 text-sm text-green-400 text-right bg-green-900/20">
                  {formatCurrency(totais.mc_valor)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className={`flex items-center justify-end gap-1 text-sm ${getDivergenciaColor(percentualTotal)}`}>
                    {getDivergenciaIcon(percentualTotal)}
                    <span>{formatPercent(percentualTotal)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getDivergenciaStatus(percentualTotal).color}`}>
                    {getDivergenciaStatus(percentualTotal).text}
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
        <p className="text-gray-400 text-sm">Legenda:</p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-gray-400 text-sm">MC &gt; MP (Cliente mediu mais)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-gray-400 text-sm">MC &lt; MP (Cliente mediu menos)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-500"></span>
          <span className="text-gray-400 text-sm">Alinhado (divergência &lt; 1%)</span>
        </div>
      </div>
    </div>
  );
}
