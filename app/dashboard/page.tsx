'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import { useObraAtivaContext } from '@/providers/ObraAtivaProvider';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react';

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
    desvio_quantidade: number;
    desvio_valor: number;
    percentual_avanco: number;
  };
  competencia_atual: {
    id: string | null;
    periodo: string | null;
    status: 'aberta' | 'fechada' | null;
    gates_pendentes: number;
    gates_aprovados: number;
    gates_rejeitados: number;
  };
}

interface CompetenciaStatus {
  competencia: {
    id: string | null;
    periodo: string | null;
    status: 'aberta' | 'fechada' | null;
    aberta_em: string | null;
    fechada_em: string | null;
  };
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

export default function DashboardPage() {
  const { user } = useAuthContext();
  const { obraAtiva } = useObraAtivaContext();

  const [obraResumo, setObraResumo] = useState<ObraResumo | null>(null);
  const [competenciaStatus, setCompetenciaStatus] = useState<CompetenciaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const mesAtual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setPeriodo(mesAtual);
  }, []);

  const loadData = async () => {
    if (!obraAtiva?.id) {
      setError('Nenhuma obra ativa selecionada');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      // Carrega resumo da obra
      const resumoResponse = await fetch(`/api/read/obra/resumo?periodo=${periodo}`, { headers });
      if (!resumoResponse.ok) {
        throw new Error('Erro ao carregar resumo da obra');
      }
      const resumoData = await resumoResponse.json();
      setObraResumo(resumoData.data);

      // Carrega status da competência
      const competenciaResponse = await fetch('/api/read/competencia/status', { headers });
      if (competenciaResponse.ok) {
        const competenciaData = await competenciaResponse.json();
        setCompetenciaStatus(competenciaData.data);
      }

    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message || 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (obraAtiva?.id && periodo) {
      loadData();
    }
  }, [obraAtiva?.id, periodo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <span className="ml-3 text-gray-600">Carregando dashboard...</span>
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
        <p className="text-gray-600">Selecione uma obra ativa para visualizar o dashboard</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {obraResumo?.obra.nome} - {obraResumo?.obra.cliente || 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="text-gray-400" size={20} />
          <input
            type="month"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* KPIs Cards */}
      {obraResumo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total EAP</span>
              <BarChart3 className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              R$ {obraResumo.kpis.total_eap.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Medido (MP)</span>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              R$ {obraResumo.kpis.total_medido_mp.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {obraResumo.kpis.percentual_avanco}% do EAP
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Medido (MC)</span>
              <DollarSign className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              R$ {obraResumo.kpis.total_medido_mc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Desvio (MC - MP)</span>
              {obraResumo.kpis.desvio_valor >= 0 ? (
                <TrendingUp className="text-green-600" size={20} />
              ) : (
                <TrendingDown className="text-red-600" size={20} />
              )}
            </div>
            <p className={`text-2xl font-bold ${obraResumo.kpis.desvio_valor >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {Math.abs(obraResumo.kpis.desvio_valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      )}

      {/* Competência Atual */}
      {competenciaStatus && competenciaStatus.competencia.id && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" size={24} />
            Competência: {competenciaStatus.competencia.periodo}
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="mx-auto text-yellow-600 mb-2" size={24} />
              <p className="text-2xl font-bold text-gray-800">
                {competenciaStatus.gates.filter(g => g.status === 'pendente').length}
              </p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="mx-auto text-green-600 mb-2" size={24} />
              <p className="text-2xl font-bold text-gray-800">
                {competenciaStatus.gates.filter(g => g.status === 'aprovado').length}
              </p>
              <p className="text-sm text-gray-600">Aprovados</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <XCircle className="mx-auto text-red-600 mb-2" size={24} />
              <p className="text-2xl font-bold text-gray-800">
                {competenciaStatus.gates.filter(g => g.status === 'rejeitado').length}
              </p>
              <p className="text-sm text-gray-600">Rejeitados</p>
            </div>
          </div>

          {/* Travas */}
          {competenciaStatus.travas.ativas && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-yellow-600" size={20} />
                <p className="font-medium text-yellow-800">Travas Ativas</p>
              </div>
              <ul className="text-sm text-yellow-700 list-disc list-inside">
                {competenciaStatus.travas.motivos.map((motivo, idx) => (
                  <li key={idx}>{motivo}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Lista de Gates */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 mb-2">Gates de Fechamento</h3>
            {competenciaStatus.gates.map((gate) => (
              <div
                key={gate.numero}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {gate.trava && <AlertCircle className="text-yellow-600" size={16} />}
                  <span className="font-mono text-sm text-gray-500">Gate {gate.numero}</span>
                  <span className="font-medium text-gray-800">{gate.nome}</span>
                </div>
                <div className="flex items-center gap-2">
                  {gate.status === 'pendente' && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                      Pendente
                    </span>
                  )}
                  {gate.status === 'aprovado' && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      Aprovado
                    </span>
                  )}
                  {gate.status === 'rejeitado' && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                      Rejeitado
                    </span>
                  )}
                  {gate.status === 'bloqueado' && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                      Bloqueado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!competenciaStatus || !competenciaStatus.competencia.id) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Nenhuma competência aberta</p>
        </div>
      )}
    </div>
  );
}



