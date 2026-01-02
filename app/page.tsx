'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Bell, 
  Calendar, 
  Eye, 
  Check, 
  X,
  ChevronRight,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  FileText,
  Building2,
  Users,
  BarChart3,
  AlertTriangle,
  Settings,
  Home,
  Search,
  GraduationCap,
  ArrowRight,
  Info,
  Plus,
  Flag
} from 'lucide-react';
import Link from 'next/link';

// Interfaces para os dados da API
interface Tarefa {
  id: string;
  tipo: string;
  titulo: string;
  solicitante: string;
  valor?: number;
  prazo: string;
  prioridade: 'urgente' | 'alta' | 'media' | 'baixa';
  icone?: string;
}

interface Comunicado {
  id: string;
  titulo: string;
  conteudo: string;
  remetente: string;
  data: string;
  lido: boolean;
}

interface Requisicao {
  id: string;
  tipo: string;
  descricao: string;
  valor: number;
  status: 'pendente' | 'aprovada' | 'rejeitada' | 'enviada';
}

export default function IntranetPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dados mockados (serão substituídos por chamadas à API)
  const data = {
    obraAtiva: {
      codigo: 'PRA-2024-001',
      nome: 'Ponte Rio Azul',
      cliente: 'Governo do Estado - Secretaria de Infraestrutura',
      status: 'Em Andamento',
      contrato: 45000000,
      prazo: '2026-12-31',
      gateAtual: 3,
    },
    indicadores: {
      obrasAtivas: 3,
      funcionarios: 45,
      receitaMes: 1250000,
    },
    tarefas: [
      {
        id: '1',
        tipo: 'Aprovação',
        titulo: 'Aprovar Medição Mensal - Outubro',
        solicitante: 'Comercial',
        valor: 1250000,
        prazo: '2026-01-20',
        prioridade: 'urgente' as const,
      },
      {
        id: '2',
        tipo: 'Revisão',
        titulo: 'Revisar EAP - Estrutura Principal',
        solicitante: 'Engenharia',
        prazo: '2026-01-22',
        prioridade: 'alta' as const,
      },
    ],
    filaTrabalho: [
      {
        id: '1',
        tipo: 'Medição',
        descricao: 'Medição Mensal - Outubro/2025',
        responsavel: 'João Silva',
        prazo: '2026-01-20',
        prioridade: 'urgente' as const,
      },
      {
        id: '2',
        tipo: 'Inspeção',
        descricao: 'Inspeção de Qualidade - Concreto',
        responsavel: 'Maria Santos',
        prazo: '2026-01-21',
        prioridade: 'alta' as const,
      },
    ],
    comunicados: [
      {
        id: '1',
        titulo: 'Reunião Geral - Segunda-feira',
        conteudo: 'Reunião geral da equipe às 9h na sala de reuniões.',
        remetente: 'Diretoria',
        data: '2026-01-15',
        lido: false,
      },
    ],
    requisicoes: [
      {
        id: '1',
        tipo: 'Compra',
        descricao: 'Material de Construção',
        valor: 45000,
        status: 'pendente' as 'pendente' | 'aprovada' | 'rejeitada' | 'enviada',
      },
    ],
  };

  useEffect(() => {
    // Simula carregamento de dados
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Intranet</h1>
          <p className="text-gray-600">Painel de controle e informações gerais do projeto</p>
        </div>
      </div>

      {/* Indicadores Rápidos */}
      <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Obras Ativas</p>
                <p className="text-2xl font-bold text-gray-800">{data.indicadores.obrasAtivas}</p>
              </div>
              <Building2 className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Funcionários</p>
                <p className="text-2xl font-bold text-gray-800">{data.indicadores.funcionarios}</p>
              </div>
              <Users className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita do Mês</p>
                <p className="text-2xl font-bold text-gray-800">
                  R$ {data.indicadores.receitaMes.toLocaleString('pt-BR')}
                </p>
              </div>
              <DollarSign className="text-emerald-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cards de Resumo */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cards de Tarefas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Tarefas Pendentes</h3>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    {data.tarefas.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {data.tarefas.map((tarefa) => (
                    <div key={tarefa.id} className="border-l-4 border-red-500 pl-4 py-2">
                      <p className="font-medium text-gray-800">{tarefa.titulo}</p>
                      <p className="text-sm text-gray-600">{tarefa.solicitante}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Tarefas Concluídas</h3>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    12
                  </span>
                </div>
                <p className="text-gray-600 text-sm">Últimas 24 horas</p>
              </div>
            </div>

            {/* Fila de Trabalho */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Fila de Trabalho</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-sm font-semibold text-gray-700">Tipo</th>
                      <th className="p-3 text-sm font-semibold text-gray-700">Descrição</th>
                      <th className="p-3 text-sm font-semibold text-gray-700">Responsável</th>
                      <th className="p-3 text-sm font-semibold text-gray-700">Prazo</th>
                      <th className="p-3 text-sm font-semibold text-gray-700">Prioridade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.filaTrabalho.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-600">{item.tipo}</td>
                        <td className="p-3 text-sm font-medium text-gray-800">{item.descricao}</td>
                        <td className="p-3 text-sm text-gray-600">{item.responsavel}</td>
                        <td className="p-3 text-sm text-gray-600">
                          {new Date(item.prazo).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.prioridade === 'urgente' ? 'bg-red-100 text-red-700' :
                            item.prioridade === 'alta' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.prioridade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Direita */}
          <div className="space-y-6">
            {/* Comunicados */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Comunicados</h3>
              <div className="space-y-3">
                {data.comunicados.map((comunicado) => (
                  <div key={comunicado.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="font-medium text-gray-800">{comunicado.titulo}</p>
                    <p className="text-sm text-gray-600">{comunicado.conteudo}</p>
                    <p className="text-xs text-gray-500 mt-1">{comunicado.remetente}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Requisições */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Requisições</h3>
              <div className="space-y-3">
                {data.requisicoes.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-800">{req.descricao}</p>
                      <p className="text-sm text-gray-600">R$ {req.valor.toLocaleString('pt-BR')}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      req.status === 'aprovada' ? 'bg-green-100 text-green-700' :
                      req.status === 'rejeitada' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status}
                    </span>
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

