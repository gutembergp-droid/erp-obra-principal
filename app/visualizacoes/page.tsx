'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import { useObraAtivaContext } from '@/providers/ObraAtivaProvider';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ObraResumo {
  obra: {
    id: string;
    nome: string;
    cliente: string | null;
    orcamento_total: number;
  };
  kpis: {
    total_eap: number;
    total_medido_mp: number;
    total_medido_mc: number;
    desvio_mp_mc: number;
    percentual_avanco: number;
    competencia_status: 'aberta' | 'fechada' | null;
    gates_pendentes: number;
    gates_aprovados: number;
  };
  periodo: string | null;
}

interface CompetenciaStatus {
  competencia: {
    id: string;
    periodo: string;
    status: 'aberta' | 'fechada';
    aberta_em: string;
    fechada_em: string | null;
  } | null;
  gates: Array<{
    numero: number;
    nome: string;
    status: string;
    trava: boolean;
    aprovado_em: string | null;
    rejeitado_em: string | null;
    motivo_rejeicao: string | null;
  }>;
  travas: {
    ativas: boolean;
    motivos: string[];
  };
  pode_concluir: boolean;
}

export default function VisualizacoesPage() {
  const { user } = useAuthContext();
  const { obraAtiva } = useObraAtivaContext();

  const [obraResumo, setObraResumo] = useState<ObraResumo | null>(null);
  const [competenciaStatus, setCompetenciaStatus] = useState<CompetenciaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const loadData = async () => {
    if (!obraAtiva?.id) {
      setError('Nenhuma obra ativa selecionada');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [resumoRes, statusRes] = await Promise.all([
        fetch(`/api/read/obra/resumo?obra_id=${obraAtiva.id}&periodo=${periodo}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }),
        fetch(`/api/read/competencia/status?obra_id=${obraAtiva.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }),
      ]);

      if (!resumoRes.ok || !statusRes.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const resumoData = await resumoRes.json();
      const statusData = await statusRes.json();

      setObraResumo(resumoData.data);
      setCompetenciaStatus(statusData.data);
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [obraAtiva?.id, periodo]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string; icon: any }> = {
      aberta: { label: 'Aberta', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      fechada: { label: 'Fechada', color: 'bg-gray-100 text-gray-800', icon: XCircle },
      pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejeitado: { label: 'Rejeitado', color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    const badge = badges[status] || badges.pendente;
    const Icon = badge.icon;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${badge.color}`}>
        <Icon size={12} />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <span className="ml-3 text-gray-600">Carregando visualizações...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!obraAtiva) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600">Selecione uma obra ativa para visualizar os dados</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={28} />
          Visualizações Tático/Gerenciais
        </h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Período:</label>
          <input
            type="month"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* KPIs da Obra */}
      {obraResumo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total EAP</span>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(obraResumo.kpis.total_eap)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Medido (MP)</span>
              <BarChart3 className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(obraResumo.kpis.total_medido_mp)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {obraResumo.kpis.percentual_avanco.toFixed(2)}% do EAP
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Medido (MC)</span>
              <BarChart3 className="text-purple-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(obraResumo.kpis.total_medido_mc)}</p>
            <p className={`text-xs mt-1 ${obraResumo.kpis.desvio_mp_mc >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Desvio: {formatCurrency(obraResumo.kpis.desvio_mp_mc)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Competência</span>
              {obraResumo.kpis.competencia_status ? (
                getStatusBadge(obraResumo.kpis.competencia_status)
              ) : (
                <span className="text-xs text-gray-500">N/A</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Gates: {obraResumo.kpis.gates_aprovados}/{obraResumo.kpis.gates_aprovados + obraResumo.kpis.gates_pendentes} aprovados
            </p>
          </div>
        </div>
      )}

      {/* Status da Competência */}
      {competenciaStatus && competenciaStatus.competencia && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Status da Competência</h2>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Período: {competenciaStatus.competencia.periodo}</span>
              {getStatusBadge(competenciaStatus.competencia.status)}
            </div>
            {competenciaStatus.travas.ativas && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-1">⚠️ Travas Ativas:</p>
                <ul className="text-sm text-yellow-700 list-disc list-inside">
                  {competenciaStatus.travas.motivos.map((motivo, idx) => (
                    <li key={idx}>{motivo}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Gates:</h3>
            {competenciaStatus.gates.map((gate) => (
              <div key={gate.numero} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  {gate.trava && <AlertCircle size={16} className="text-yellow-600" />}
                  <span className="font-mono text-sm text-gray-500">Gate {gate.numero}</span>
                  <span className="text-sm text-gray-700">{gate.nome}</span>
                </div>
                {getStatusBadge(gate.status)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
