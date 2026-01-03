'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Save,
  X,
  DollarSign,
  FileCheck,
  Send,
} from 'lucide-react';

// Tipos
interface EapItem {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade_total: number;
  valor_unitario: number;
}

interface MedicaoMC {
  id: string;
  eap_id: string;
  eap?: EapItem;
  periodo_referencia: string;
  data_medicao: string;
  quantidade_medida: number;
  valor_medido: number;
  observacoes?: string;
  status: 'rascunho' | 'enviada' | 'aprovada' | 'rejeitada';
  usuario?: { nome: string };
  aprovado_por?: { nome: string };
  data_aprovacao?: string;
  created_at: string;
}

interface NovaLinhaMedicao {
  eap_id: string;
  quantidade_medida: number;
  observacoes: string;
}

export default function MedicaoClientePage() {
  // Estados
  const [medicoes, setMedicoes] = useState<MedicaoMC[]>([]);
  const [eapItems, setEapItems] = useState<EapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [obraId, setObraId] = useState<string | null>(null);
  const [competencia, setCompetencia] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  
  // Estados do modal de nova medição
  const [showModal, setShowModal] = useState(false);
  const [novasMedicoes, setNovasMedicoes] = useState<NovaLinhaMedicao[]>([
    { eap_id: '', quantidade_medida: 0, observacoes: '' }
  ]);
  const [salvando, setSalvando] = useState(false);

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

  // Carrega medições e EAP quando obra estiver disponível
  useEffect(() => {
    if (obraId) {
      carregarDados();
    }
  }, [obraId, competencia]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Carrega medições MC
      const resMedicoes = await fetch(`/api/medicoes/obra/${obraId}?tipo=MC&periodo_referencia=${competencia}`);
      if (resMedicoes.ok) {
        const data = await resMedicoes.json();
        setMedicoes(data.filter((m: any) => m.tipo === 'MC'));
      }

      // Carrega itens da EAP
      const resEap = await fetch(`/api/eap/obra/${obraId}`);
      if (resEap.ok) {
        const data = await resEap.json();
        setEapItems(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adiciona nova linha de medição
  const adicionarLinha = () => {
    setNovasMedicoes([...novasMedicoes, { eap_id: '', quantidade_medida: 0, observacoes: '' }]);
  };

  // Remove linha de medição
  const removerLinha = (index: number) => {
    if (novasMedicoes.length > 1) {
      setNovasMedicoes(novasMedicoes.filter((_, i) => i !== index));
    }
  };

  // Atualiza linha de medição
  const atualizarLinha = (index: number, campo: keyof NovaLinhaMedicao, valor: any) => {
    const novas = [...novasMedicoes];
    novas[index] = { ...novas[index], [campo]: valor };
    setNovasMedicoes(novas);
  };

  // Calcula valor baseado na EAP selecionada
  const calcularValor = (eapId: string, quantidade: number): number => {
    const eap = eapItems.find(e => e.id === eapId);
    if (eap) {
      return quantidade * eap.valor_unitario;
    }
    return 0;
  };

  // Salva medições
  const salvarMedicoes = async () => {
    setSalvando(true);
    try {
      for (const linha of novasMedicoes) {
        if (linha.eap_id && linha.quantidade_medida > 0) {
          await fetch('/api/medicoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              obra_id: obraId,
              eap_id: linha.eap_id,
              tipo: 'MC',
              periodo_referencia: competencia,
              data_medicao: new Date().toISOString(),
              quantidade_medida: linha.quantidade_medida,
              valor_medido: calcularValor(linha.eap_id, linha.quantidade_medida),
              observacoes: linha.observacoes,
              status: 'rascunho',
            }),
          });
        }
      }
      setShowModal(false);
      setNovasMedicoes([{ eap_id: '', quantidade_medida: 0, observacoes: '' }]);
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar medições:', error);
    } finally {
      setSalvando(false);
    }
  };

  // Envia medição para aprovação do cliente
  const enviarParaCliente = async (id: string) => {
    try {
      await fetch(`/api/medicoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'enviada' }),
      });
      carregarDados();
    } catch (error) {
      console.error('Erro ao enviar medição:', error);
    }
  };

  // Aprova medição (simula aprovação do cliente)
  const aprovarMedicao = async (id: string) => {
    try {
      await fetch(`/api/medicoes/${id}/aprovar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          aprovado_por_id: 'user-admin-001', // TODO: pegar do contexto de autenticação
          observacoes: 'Aprovado pelo cliente'
        }),
      });
      carregarDados();
    } catch (error) {
      console.error('Erro ao aprovar medição:', error);
    }
  };

  // Formata valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Formata data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Retorna cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada':
        return 'bg-green-900/50 text-green-400 border-green-700';
      case 'enviada':
        return 'bg-blue-900/50 text-blue-400 border-blue-700';
      case 'rejeitada':
        return 'bg-red-900/50 text-red-400 border-red-700';
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  // Retorna ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovada':
        return <CheckCircle size={14} />;
      case 'enviada':
        return <Send size={14} />;
      case 'rejeitada':
        return <XCircle size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  // Calcula totais
  const totalQuantidade = medicoes.reduce((acc, m) => acc + Number(m.quantidade_medida), 0);
  const totalValor = medicoes.reduce((acc, m) => acc + Number(m.valor_medido || 0), 0);
  const totalAprovado = medicoes
    .filter(m => m.status === 'aprovada')
    .reduce((acc, m) => acc + Number(m.valor_medido || 0), 0);

  if (!obraId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Nenhuma obra selecionada</h2>
          <p className="text-gray-400">Selecione uma obra para visualizar as medições do cliente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Medição do Cliente (MC)</h1>
          <p className="text-gray-400 mt-1">Registro das quantidades aprovadas para faturamento</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nova Medição
        </button>
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
        <div className="flex-1" />
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-gray-400">Total Medido:</span>
            <span className="text-white font-semibold ml-2">{formatCurrency(totalValor)}</span>
          </div>
          <div className="h-4 w-px bg-gray-700" />
          <div>
            <span className="text-gray-400">Aprovado:</span>
            <span className="text-green-400 font-semibold ml-2">{formatCurrency(totalAprovado)}</span>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={18} className="text-gray-500" />
            <p className="text-gray-400 text-sm">Itens Medidos</p>
          </div>
          <p className="text-2xl font-bold text-white">{medicoes.length}</p>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-yellow-500" />
            <p className="text-gray-400 text-sm">Aguardando Envio</p>
          </div>
          <p className="text-2xl font-bold text-yellow-400">
            {medicoes.filter(m => m.status === 'rascunho').length}
          </p>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Send size={18} className="text-blue-500" />
            <p className="text-gray-400 text-sm">Enviadas ao Cliente</p>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {medicoes.filter(m => m.status === 'enviada').length}
          </p>
        </div>
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-green-500" />
            <p className="text-gray-400 text-sm">Aprovadas p/ Faturar</p>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {medicoes.filter(m => m.status === 'aprovada').length}
          </p>
        </div>
      </div>

      {/* Tabela de Medições */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Item EAP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Descrição</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Unid.</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Qtd. Medida</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Valor</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Data Aprov.</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  Carregando medições...
                </td>
              </tr>
            ) : medicoes.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma medição do cliente encontrada para esta competência.
                </td>
              </tr>
            ) : (
              medicoes.map((medicao) => (
                <tr key={medicao.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm text-white font-mono">
                    {medicao.eap?.codigo || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {medicao.eap?.descricao || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 text-center">
                    {medicao.eap?.unidade || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-white text-right font-mono">
                    {Number(medicao.quantidade_medida).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-white text-right">
                    {formatCurrency(Number(medicao.valor_medido || 0))}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(medicao.status)}`}>
                      {getStatusIcon(medicao.status)}
                      {medicao.status === 'enviada' ? 'Aguard. Cliente' : medicao.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 text-center">
                    {medicao.data_aprovacao ? formatDate(medicao.data_aprovacao) : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {medicao.status === 'rascunho' && (
                        <>
                          <button
                            onClick={() => enviarParaCliente(medicao.id)}
                            className="p-1.5 text-blue-400 hover:bg-blue-900/30 rounded transition-colors"
                            title="Enviar para cliente"
                          >
                            <Send size={16} />
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:bg-gray-700 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="p-1.5 text-red-400 hover:bg-red-900/30 rounded transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                      {medicao.status === 'enviada' && (
                        <button
                          onClick={() => aprovarMedicao(medicao.id)}
                          className="p-1.5 text-green-400 hover:bg-green-900/30 rounded transition-colors"
                          title="Aprovar (simular aprovação do cliente)"
                        >
                          <FileCheck size={16} />
                        </button>
                      )}
                      <button
                        className="p-1.5 text-gray-400 hover:bg-gray-700 rounded transition-colors"
                        title="Visualizar"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {medicoes.length > 0 && (
            <tfoot>
              <tr className="bg-gray-800/50">
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-white">
                  Total da Competência
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-white text-right font-mono">
                  {totalQuantidade.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-white text-right">
                  {formatCurrency(totalValor)}
                </td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Modal de Nova Medição */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div>
                <h2 className="text-lg font-semibold text-white">Nova Medição do Cliente</h2>
                <p className="text-sm text-gray-400">Competência: {competencia}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase">Item EAP</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-400 uppercase">Unid.</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-400 uppercase">Qtd. Medida</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-400 uppercase">Valor</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase">Observações</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {novasMedicoes.map((linha, index) => {
                    const eapSelecionada = eapItems.find(e => e.id === linha.eap_id);
                    const valorCalculado = calcularValor(linha.eap_id, linha.quantidade_medida);
                    
                    return (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="px-3 py-2">
                          <select
                            value={linha.eap_id}
                            onChange={(e) => atualizarLinha(index, 'eap_id', e.target.value)}
                            className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-red-600"
                          >
                            <option value="">Selecione um item</option>
                            {eapItems.map((eap) => (
                              <option key={eap.id} value={eap.id}>
                                {eap.codigo} - {eap.descricao}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2 text-center text-sm text-gray-400">
                          {eapSelecionada?.unidade || '-'}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={linha.quantidade_medida || ''}
                            onChange={(e) => atualizarLinha(index, 'quantidade_medida', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-sm text-right focus:outline-none focus:border-red-600"
                            placeholder="0,00"
                          />
                        </td>
                        <td className="px-3 py-2 text-right text-sm text-white">
                          {formatCurrency(valorCalculado)}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={linha.observacoes}
                            onChange={(e) => atualizarLinha(index, 'observacoes', e.target.value)}
                            className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-red-600"
                            placeholder="Observações..."
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => removerLinha(index)}
                            className="p-1 text-red-400 hover:bg-red-900/30 rounded transition-colors"
                            disabled={novasMedicoes.length === 1}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <button
                onClick={adicionarLinha}
                className="mt-4 flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Plus size={16} />
                Adicionar linha
              </button>
            </div>

            {/* Footer do Modal */}
            <div className="flex items-center justify-between p-4 border-t border-gray-800 bg-gray-800/50">
              <div className="text-sm text-gray-400">
                Total: <span className="text-white font-semibold">
                  {formatCurrency(novasMedicoes.reduce((acc, l) => acc + calcularValor(l.eap_id, l.quantidade_medida), 0))}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarMedicoes}
                  disabled={salvando}
                  className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  {salvando ? 'Salvando...' : 'Salvar Medições'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
