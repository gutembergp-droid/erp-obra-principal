'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Medicao, MedicaoStatus } from '@/types/medicao';
import { listMedicoesByObra, submitMedicao, approveMedicao, rejectMedicao } from '@/services/api/medicaoApi';
import { useAuthContext } from '@/providers/AuthProvider';
import { CheckCircle, XCircle, Send, Loader2, AlertCircle } from 'lucide-react';

export default function MedicoesPage() {
  const params = useParams();
  const obraId = params?.id as string;
  const { user } = useAuthContext();

  const [medicoes, setMedicoes] = useState<Medicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<MedicaoStatus | 'ALL'>('ALL');
  const [rejectModal, setRejectModal] = useState<{ open: boolean; medicaoId: string | null; motivo: string }>({
    open: false,
    medicaoId: null,
    motivo: '',
  });

  const loadMedicoes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listMedicoesByObra(obraId, {
        status: filterStatus !== 'ALL' ? filterStatus : undefined,
      });
      setMedicoes(data);
    } catch (err: any) {
      console.error('Erro ao carregar medições:', err);
      setError(err.message || 'Erro ao carregar medições');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (obraId) {
      loadMedicoes();
    }
  }, [obraId, filterStatus]);

  const handleSubmit = async (id: string) => {
    try {
      await submitMedicao(id);
      await loadMedicoes();
    } catch (err: any) {
      alert(err.message || 'Erro ao submeter medição');
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Deseja aprovar esta medição?')) return;
    try {
      await approveMedicao(id);
      await loadMedicoes();
    } catch (err: any) {
      alert(err.message || 'Erro ao aprovar medição');
    }
  };

  const handleReject = async () => {
    if (!rejectModal.medicaoId || !rejectModal.motivo.trim()) {
      alert('Motivo de rejeição é obrigatório');
      return;
    }
    try {
      await rejectMedicao(rejectModal.medicaoId, rejectModal.motivo.trim());
      setRejectModal({ open: false, medicaoId: null, motivo: '' });
      await loadMedicoes();
    } catch (err: any) {
      alert(err.message || 'Erro ao rejeitar medição');
    }
  };

  const getStatusBadge = (status: MedicaoStatus) => {
    const badges = {
      DRAFT: { label: 'Rascunho', color: 'bg-gray-100 text-gray-800' },
      SUBMITTED: { label: 'Enviada', color: 'bg-blue-100 text-blue-800' },
      APPROVED: { label: 'Aprovada', color: 'bg-green-100 text-green-800' },
      REJECTED: { label: 'Rejeitada', color: 'bg-red-100 text-red-800' },
    };
    const badge = badges[status];
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const canEdit = (status: MedicaoStatus) => status === 'DRAFT' || status === 'REJECTED';
  const canSubmit = (status: MedicaoStatus) => status === 'DRAFT' || status === 'REJECTED';
  const canApprove = (status: MedicaoStatus) => status === 'SUBMITTED' && (user?.perfil === 'admin' || user?.perfil === 'gestor');
  const canReject = (status: MedicaoStatus) => status === 'SUBMITTED' && (user?.perfil === 'admin' || user?.perfil === 'gestor');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <span className="ml-3 text-gray-600">Carregando medições...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadMedicoes}
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
        <h2 className="text-2xl font-bold text-gray-800">Medições</h2>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as MedicaoStatus | 'ALL')}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="ALL">Todas</option>
            <option value="DRAFT">Rascunho</option>
            <option value="SUBMITTED">Enviadas</option>
            <option value="APPROVED">Aprovadas</option>
            <option value="REJECTED">Rejeitadas</option>
          </select>
        </div>
      </div>

      {medicoes.length === 0 ? (
        <div className="text-center p-12 text-gray-500">
          <p>Nenhuma medição encontrada.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700">Tipo</th>
                <th className="p-4 text-left font-semibold text-gray-700">Período</th>
                <th className="p-4 text-left font-semibold text-gray-700">Data</th>
                <th className="p-4 text-left font-semibold text-gray-700">Quantidade</th>
                <th className="p-4 text-left font-semibold text-gray-700">Valor</th>
                <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                <th className="p-4 text-left font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {medicoes.map((medicao) => (
                <tr key={medicao.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {medicao.tipo}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700">{medicao.periodo_referencia}</td>
                  <td className="p-4 text-gray-700">
                    {new Date(medicao.data_medicao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 text-gray-700">
                    {Number(medicao.quantidade_medida).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-gray-700">
                    {medicao.valor_medido
                      ? `R$ ${Number(medicao.valor_medido).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : '-'}
                  </td>
                  <td className="p-4">{getStatusBadge(medicao.status)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {canSubmit(medicao.status) && (
                        <button
                          onClick={() => handleSubmit(medicao.id)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center gap-1"
                          title="Enviar para aprovação"
                        >
                          <Send size={14} />
                          Enviar
                        </button>
                      )}
                      {canApprove(medicao.status) && (
                        <button
                          onClick={() => handleApprove(medicao.id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-1"
                          title="Aprovar medição"
                        >
                          <CheckCircle size={14} />
                          Aprovar
                        </button>
                      )}
                      {canReject(medicao.status) && (
                        <button
                          onClick={() => setRejectModal({ open: true, medicaoId: medicao.id, motivo: '' })}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center gap-1"
                          title="Rejeitar medição"
                        >
                          <XCircle size={14} />
                          Rejeitar
                        </button>
                      )}
                      {medicao.status === 'REJECTED' && medicao.motivo_rejeicao && (
                        <span className="text-xs text-red-600" title={medicao.motivo_rejeicao}>
                          {medicao.motivo_rejeicao}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Rejeição */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Rejeitar Medição</h3>
            <p className="text-gray-600 mb-4">Informe o motivo da rejeição:</p>
            <textarea
              value={rejectModal.motivo}
              onChange={(e) => setRejectModal({ ...rejectModal, motivo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              rows={4}
              placeholder="Motivo da rejeição..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRejectModal({ open: false, medicaoId: null, motivo: '' })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
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

