'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';
import { CheckCircle, XCircle, Lock, Unlock, Loader2, AlertCircle, Calendar } from 'lucide-react';

interface CompetenciaGate {
  id: string;
  numero: number;
  nome: string;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'bloqueado';
  trava: boolean;
  aprovado_em?: string;
  rejeitado_em?: string;
  motivo_rejeicao?: string;
  observacoes?: string;
}

interface Competencia {
  id: string;
  obra_id: string;
  periodo: string;
  status: 'aberta' | 'fechada';
  aberta_em: string;
  fechada_em?: string;
}

interface CompetenciaStatus {
  competencia: Competencia;
  gates: CompetenciaGate[];
  travas: {
    ativas: boolean;
    motivos: string[];
  };
  pode_concluir: boolean;
}

export default function CompetenciasPage() {
  const params = useParams();
  const obraId = params?.id as string;
  const { user } = useAuthContext();

  const [competenciaAtual, setCompetenciaAtual] = useState<Competencia | null>(null);
  const [status, setStatus] = useState<CompetenciaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abrirModal, setAbrirModal] = useState(false);
  const [periodoNovo, setPeriodoNovo] = useState('');
  const [rejectModal, setRejectModal] = useState<{ open: boolean; gateId: string | null; motivo: string }>({
    open: false,
    gateId: null,
    motivo: '',
  });

  const loadCompetenciaAtual = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/competencias/atual', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.status === 404) {
        setCompetenciaAtual(null);
        setStatus(null);
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ao carregar competência atual');
      }

      const data = await response.json();
      setCompetenciaAtual(data.data);

      // Carrega status consolidado
      if (data.data) {
        await loadStatus(data.data.id);
      }
    } catch (err: any) {
      console.error('Erro ao carregar competência:', err);
      setError(err.message || 'Erro ao carregar competência');
    } finally {
      setLoading(false);
    }
  };

  const loadStatus = async (competenciaId: string) => {
    try {
      const response = await fetch(`/api/competencias/${competenciaId}/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar status');
      }

      const data = await response.json();
      setStatus(data.data);
    } catch (err: any) {
      console.error('Erro ao carregar status:', err);
    }
  };

  useEffect(() => {
    if (obraId) {
      loadCompetenciaAtual();
    }
  }, [obraId]);

  const handleAbrirCompetencia = async () => {
    if (!periodoNovo || !/^\d{4}-(0[1-9]|1[0-2])$/.test(periodoNovo)) {
      alert('Período inválido. Use o formato YYYY-MM (ex: 2026-01)');
      return;
    }

    try {
      const response = await fetch('/api/competencias/abrir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ periodo: periodoNovo }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro ao abrir competência');
      }

      setAbrirModal(false);
      setPeriodoNovo('');
      await loadCompetenciaAtual();
    } catch (err: any) {
      alert(err.message || 'Erro ao abrir competência');
    }
  };

  const handleFecharCompetencia = async () => {
    if (!competenciaAtual) return;
    if (!confirm('Deseja fechar esta competência? Esta ação não pode ser desfeita.')) return;

    try {
      const response = await fetch(`/api/competencias/${competenciaAtual.id}/fechar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro ao fechar competência');
      }

      await loadCompetenciaAtual();
    } catch (err: any) {
      alert(err.message || 'Erro ao fechar competência');
    }
  };

  const handleApproveGate = async (gateId: string) => {
    if (!competenciaAtual) return;
    if (!confirm('Deseja aprovar este gate?')) return;

    try {
      const response = await fetch(`/api/competencias/${competenciaAtual.id}/gates/${gateId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro ao aprovar gate');
      }

      await loadStatus(competenciaAtual.id);
    } catch (err: any) {
      alert(err.message || 'Erro ao aprovar gate');
    }
  };

  const handleRejectGate = async () => {
    if (!rejectModal.gateId || !rejectModal.motivo.trim()) {
      alert('Motivo de rejeição é obrigatório');
      return;
    }

    if (!competenciaAtual) return;

    try {
      const response = await fetch(`/api/competencias/${competenciaAtual.id}/gates/${rejectModal.gateId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ motivo: rejectModal.motivo.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro ao rejeitar gate');
      }

      setRejectModal({ open: false, gateId: null, motivo: '' });
      await loadStatus(competenciaAtual.id);
    } catch (err: any) {
      alert(err.message || 'Erro ao rejeitar gate');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      pendente: { label: 'Pendente', color: 'bg-gray-100 text-gray-800' },
      aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-800' },
      rejeitado: { label: 'Rejeitado', color: 'bg-red-100 text-red-800' },
      bloqueado: { label: 'Bloqueado', color: 'bg-yellow-100 text-yellow-800' },
    };
    const badge = badges[status] || badges.pendente;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const canApprove = (gate: CompetenciaGate) => {
    return gate.status === 'pendente' && (user?.perfil === 'admin' || user?.perfil === 'gestor');
  };

  const canReject = (gate: CompetenciaGate) => {
    return gate.status === 'pendente' && (user?.perfil === 'admin' || user?.perfil === 'gestor');
  };

  const isAdmin = user?.perfil === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <span className="ml-3 text-gray-600">Carregando competência...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadCompetenciaAtual}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="text-blue-600" size={24} />
          Competência Mensal
        </h2>
        {isAdmin && (
          <div className="flex gap-2">
            {!competenciaAtual && (
              <button
                onClick={() => setAbrirModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
              >
                <Unlock size={18} />
                Abrir Competência
              </button>
            )}
            {competenciaAtual && competenciaAtual.status === 'aberta' && status?.pode_concluir && (
              <button
                onClick={handleFecharCompetencia}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
              >
                <Lock size={18} />
                Fechar Competência
              </button>
            )}
          </div>
        )}
      </div>

      {!competenciaAtual ? (
        <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-2">Nenhuma competência aberta</p>
          <p className="text-sm text-gray-500 mb-4">Abra uma competência para iniciar o fechamento mensal</p>
          {isAdmin && (
            <button
              onClick={() => setAbrirModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Abrir Competência
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card da Competência */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Período: {competenciaAtual.periodo}</h3>
                <p className="text-sm text-gray-600">
                  Aberta em: {new Date(competenciaAtual.aberta_em).toLocaleDateString('pt-BR')}
                </p>
                {competenciaAtual.fechada_em && (
                  <p className="text-sm text-gray-600">
                    Fechada em: {new Date(competenciaAtual.fechada_em).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
              {getStatusBadge(competenciaAtual.status)}
            </div>

            {status?.travas.ativas && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-1">⚠️ Travas Ativas:</p>
                <ul className="text-sm text-yellow-700 list-disc list-inside">
                  {status.travas.motivos.map((motivo, idx) => (
                    <li key={idx}>{motivo}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Lista de Gates */}
          {status && status.gates.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Gates de Fechamento</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {status.gates.map((gate) => (
                  <div key={gate.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          {gate.trava && <Lock size={16} className="text-yellow-600" />}
                          <span className="font-mono text-sm text-gray-500">Gate {gate.numero}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{gate.nome}</p>
                          {gate.motivo_rejeicao && (
                            <p className="text-sm text-red-600 mt-1">Motivo: {gate.motivo_rejeicao}</p>
                          )}
                        </div>
                        {getStatusBadge(gate.status)}
                      </div>
                      <div className="flex gap-2">
                        {canApprove(gate) && (
                          <button
                            onClick={() => handleApproveGate(gate.numero.toString())}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-1"
                            title="Aprovar gate"
                          >
                            <CheckCircle size={14} />
                            Aprovar
                          </button>
                        )}
                        {canReject(gate) && (
                          <button
                            onClick={() => setRejectModal({ open: true, gateId: gate.numero.toString(), motivo: '' })}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center gap-1"
                            title="Rejeitar gate"
                          >
                            <XCircle size={14} />
                            Rejeitar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Abrir Competência */}
      {abrirModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Abrir Nova Competência</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período (YYYY-MM)
              </label>
              <input
                type="text"
                value={periodoNovo}
                onChange={(e) => setPeriodoNovo(e.target.value)}
                placeholder="2026-01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                pattern="\d{4}-(0[1-9]|1[0-2])"
              />
              <p className="text-xs text-gray-500 mt-1">Formato: YYYY-MM (ex: 2026-01)</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setAbrirModal(false);
                  setPeriodoNovo('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAbrirCompetencia}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Abrir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejeitar Gate */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Rejeitar Gate</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo da Rejeição
              </label>
              <textarea
                value={rejectModal.motivo}
                onChange={(e) => setRejectModal({ ...rejectModal, motivo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={4}
                placeholder="Informe o motivo da rejeição..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRejectModal({ open: false, gateId: null, motivo: '' })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleRejectGate}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Rejeitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



