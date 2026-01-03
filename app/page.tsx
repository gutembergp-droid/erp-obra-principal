'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock,
  CheckCircle,
  MessageSquare,
  Calendar,
  Eye,
  Check,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  FileText,
  ShoppingCart,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';

// Interfaces
interface TarefaPendente {
  id: string;
  tipo: 'aprovacao' | 'medicao' | 'requisicao' | 'revisao';
  titulo: string;
  solicitante: string;
  setor: string;
  valor?: number;
  prazo: string;
  prioridade: 'urgente' | 'alta' | 'media' | 'baixa';
}

interface Comunicado {
  id: string;
  titulo: string;
  descricao: string;
  autor: string;
  data: string;
  urgente?: boolean;
  lido?: boolean;
}

interface Requisicao {
  id: string;
  codigo: string;
  status: 'enviada' | 'aprovada' | 'rejeitada' | 'pendente';
  descricao: string;
  valor: number;
  data: string;
}

interface Marco {
  id: string;
  titulo: string;
  data: string;
  concluido?: boolean;
}

export default function IntranetPage() {
  const [mesAtual, setMesAtual] = useState(new Date());

  // Dados mockados (serão substituídos por API)
  const resumo = {
    tarefasPendentes: 5,
    tarefasConcluidas: 0,
    comunicadosNaoLidos: 2,
    marcosPendentes: 12
  };

  const filaTrabaho: TarefaPendente[] = [
    { id: '1', tipo: 'aprovacao', titulo: 'Aprovação de BDI - Ponte Rio Azul', solicitante: 'Carlos Mendes', setor: 'Comercial', valor: 119700000, prazo: '15/01/2024', prioridade: 'alta' },
    { id: '2', tipo: 'requisicao', titulo: 'Requisição de Compra - Aço CA-50', solicitante: 'Roberto Silva', setor: 'Suprimentos', valor: 15750000, prazo: '20/01/2024', prioridade: 'urgente' },
    { id: '3', tipo: 'medicao', titulo: 'Medição #01 - Mobilização', solicitante: 'Ana Paula Costa', setor: 'Comercial', valor: 8400000, prazo: '05/02/2024', prioridade: 'alta' },
    { id: '4', tipo: 'revisao', titulo: 'Revisão de Contrato - Aditivo Prazo', solicitante: 'Mariana Lopes', setor: 'Jurídico', prazo: '01/02/2024', prioridade: 'media' },
    { id: '5', tipo: 'aprovacao', titulo: 'Aprovação de Subcontrato - Fundações', solicitante: 'Pedro Augusto', setor: 'Engenharia', valor: 32000000, prazo: '25/01/2024', prioridade: 'alta' },
  ];

  const comunicados: Comunicado[] = [
    { 
      id: '1', 
      titulo: 'Início das Operações - Ponte Rio Azul', 
      descricao: 'Comunicamos o início oficial das operações da obra Ponte Rio Azul a partir de 15/01/2024. Todas as equipes devem seguir o cronograma de mobilização...', 
      autor: 'Diretoria de Operações', 
      data: '10/01/2024',
      lido: true
    },
    { 
      id: '2', 
      titulo: 'URGENTE: Prazo para Estruturação', 
      descricao: 'Lembramos que o prazo para conclusão da estruturação comercial (Gate 1) é 31/01/2024. Todos os responsáveis devem finalizar suas etapas até esta data.', 
      autor: 'Gerência Comercial', 
      data: '15/01/2024',
      urgente: true
    },
    { 
      id: '3', 
      titulo: 'Treinamento Sistema GENESIS', 
      descricao: 'Será realizado treinamento do módulo Comercial do GENESIS nos dias 20 e 21/01. Participação obrigatória para analistas comerciais e gerentes de obra.', 
      autor: 'TI Corporativo', 
      data: '12/01/2024'
    },
  ];

  const requisicoes: Requisicao[] = [
    { id: '1', codigo: 'REQ-2024-0001', status: 'enviada', descricao: 'Aço CA-50 para armaduras de fundação', valor: 5754000, data: '18/01/2024' }
  ];

  const marcos: Marco[] = [
    { id: '1', titulo: 'Início da Mobilização', data: '15 de jan.', concluido: false },
    { id: '2', titulo: 'Medição #01', data: '05 de fev.', concluido: false },
    { id: '3', titulo: 'Início Fundações', data: '15 de fev.', concluido: false },
    { id: '4', titulo: 'Medição #02', data: '05 de mar.', concluido: false },
    { id: '5', titulo: 'Reunião de Acompanhamento', data: '15 de mar.', concluido: false },
  ];

  // Formatação de valores
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor / 100);
  };

  // Cor do badge de prioridade
  const corPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-100 text-red-700';
      case 'alta': return 'bg-orange-100 text-orange-700';
      case 'media': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Ícone do tipo de tarefa
  const iconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'aprovacao': return <FileText size={16} className="text-gray-400" />;
      case 'medicao': return <ClipboardList size={16} className="text-gray-400" />;
      case 'requisicao': return <ShoppingCart size={16} className="text-gray-400" />;
      default: return <FileText size={16} className="text-gray-400" />;
    }
  };

  // Navegação do calendário
  const mesAnterior = () => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1));
  const proximoMes = () => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1));
  const nomeMes = mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Intranet</h1>
        <p className="text-gray-500">Visão geral da obra e tarefas pendentes</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Tarefas Pendentes */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Tarefas Pendentes</p>
            <p className="text-3xl font-bold text-gray-800">{resumo.tarefasPendentes}</p>
            <p className="text-xs text-gray-400">Aguardando ação</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-full">
            <Clock size={24} className="text-amber-500" />
          </div>
        </div>

        {/* Tarefas Concluídas */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Tarefas Concluídas</p>
            <p className="text-3xl font-bold text-gray-800">{resumo.tarefasConcluidas}</p>
            <p className="text-xs text-gray-400">Finalizadas</p>
          </div>
          <div className="p-3 bg-green-50 rounded-full">
            <CheckCircle size={24} className="text-green-500" />
          </div>
        </div>

        {/* Comunicados */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Comunicados</p>
            <p className="text-3xl font-bold text-gray-800">{resumo.comunicadosNaoLidos}</p>
            <p className="text-xs text-gray-400">Não lidos</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            <MessageSquare size={24} className="text-blue-500" />
          </div>
        </div>

        {/* Marcos Pendentes */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Marcos Pendentes</p>
            <p className="text-3xl font-bold text-gray-800">{resumo.marcosPendentes}</p>
            <p className="text-xs text-gray-400">Próximos eventos</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-full">
            <Calendar size={24} className="text-purple-500" />
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Esquerda (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Fila de Trabalho */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <Clock size={20} className="text-gray-500" />
              <div>
                <h2 className="font-semibold text-gray-800">Fila de Trabalho</h2>
                <p className="text-sm text-gray-500">{filaTrabaho.length} itens pendentes de aprovação</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Tipo</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Título</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Solicitante</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Valor</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Prazo</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Prioridade</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filaTrabaho.map((tarefa) => (
                    <tr key={tarefa.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{iconeTipo(tarefa.tipo)}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800">{tarefa.titulo}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800">{tarefa.solicitante}</p>
                        <p className="text-xs text-gray-500">{tarefa.setor}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800">{tarefa.valor ? formatarMoeda(tarefa.valor) : '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800">{tarefa.prazo}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${corPrioridade(tarefa.prioridade)}`}>
                          {tarefa.prioridade}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-1.5 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Check size={16} />
                          </button>
                          <button className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Requisições */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-gray-500" />
                <div>
                  <h2 className="font-semibold text-gray-800">Requisições</h2>
                  <p className="text-sm text-gray-500">{requisicoes.length} pendente de aprovação</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                <Plus size={16} />
                Nova
              </button>
            </div>

            <div className="p-4 space-y-3">
              {requisicoes.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono text-gray-600">{req.codigo}</span>
                        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">{req.status}</span>
                      </div>
                      <p className="text-sm text-gray-800">{req.descricao}</p>
                      <p className="text-xs text-gray-500">{formatarMoeda(req.valor)} • {req.data}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Check size={16} />
                    </button>
                    <button className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita (1/3) */}
        <div className="space-y-6">
          
          {/* Comunicados */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <MessageSquare size={20} className="text-gray-500" />
              <div>
                <h2 className="font-semibold text-gray-800">Comunicados</h2>
                <p className="text-sm text-gray-500">{resumo.comunicadosNaoLidos} comunicados não lidos</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {comunicados.map((comunicado) => (
                <div key={comunicado.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${comunicado.lido ? 'bg-gray-300' : 'bg-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-800 truncate">{comunicado.titulo}</h4>
                        {comunicado.urgente && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">URGENTE</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">{comunicado.descricao}</p>
                      <p className="text-xs text-gray-400">{comunicado.autor} • {comunicado.data}</p>
                    </div>
                    {comunicado.lido && (
                      <Check size={16} className="text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendário */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-500" />
                  <div>
                    <h2 className="font-semibold text-gray-800">Calendário</h2>
                    <p className="text-sm text-gray-500">Marcos e eventos da obra</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={mesAnterior} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft size={18} className="text-gray-500" />
                  </button>
                  <span className="text-sm font-medium text-gray-700 capitalize min-w-[120px] text-center">{nomeMes}</span>
                  <button onClick={proximoMes} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight size={18} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Evento em Destaque */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Início da Mobilização</p>
                    <p className="text-xs text-gray-500">15 de jan.</p>
                  </div>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Concluir</button>
              </div>
            </div>

            {/* Próximos Marcos */}
            <div className="p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Próximos Marcos</p>
              <div className="space-y-3">
                {marcos.map((marco) => (
                  <div key={marco.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${marco.concluido ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <p className="text-sm text-gray-700">{marco.titulo}</p>
                    </div>
                    <p className="text-xs text-gray-500">{marco.data}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
