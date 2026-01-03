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
  ChevronLeft,
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
  Flag,
  Globe,
  Megaphone,
  Pin,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

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
  escopo: 'global' | 'obra' | 'setor';
  prioridade: 'normal' | 'urgente' | 'critico';
  categoria?: string;
  fixado: boolean;
  exige_confirmacao: boolean;
  publicado_em: string;
  autor: {
    id: string;
    nome: string;
  };
  confirmacoes_leitura?: any[];
  _count?: {
    confirmacoes_leitura: number;
  };
}

interface ComunicadosIntranet {
  corporativos: Comunicado[];
  obra: Comunicado[];
  setor: Comunicado[];
  todos: Comunicado[];
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
  const [comunicados, setComunicados] = useState<ComunicadosIntranet>({
    corporativos: [],
    obra: [],
    setor: [],
    todos: []
  });
  const [carrosselIndex, setCarrosselIndex] = useState(0);
  const [obraAtiva, setObraAtiva] = useState<any>(null);

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

  // Carrega comunicados da API
  const carregarComunicados = async () => {
    try {
      const obraId = localStorage.getItem('obraAtiva');
      const response = await api.get(`/comunicados/intranet${obraId ? `?obra_id=${obraId}` : ''}`) as { data: ComunicadosIntranet };
      setComunicados(response.data);
    } catch (err) {
      console.error('Erro ao carregar comunicados:', err);
      // Se não conseguir carregar, usa dados mockados
      setComunicados({
        corporativos: [
          {
            id: '1',
            titulo: 'Novo Contrato Assinado - Rodovia BR-101',
            conteudo: 'A AahBrant acaba de assinar um novo contrato para a duplicação de 50km da BR-101. Este é mais um marco importante para nossa empresa.',
            escopo: 'global',
            prioridade: 'normal',
            categoria: 'Institucional',
            fixado: true,
            exige_confirmacao: false,
            publicado_em: new Date().toISOString(),
            autor: { id: '1', nome: 'Diretoria' }
          },
          {
            id: '2',
            titulo: 'Treinamento Obrigatório de Segurança',
            conteudo: 'Todos os colaboradores devem participar do treinamento de segurança até o dia 15/01. Compareçam à sala de treinamento às 9h.',
            escopo: 'global',
            prioridade: 'urgente',
            categoria: 'SSMA',
            fixado: false,
            exige_confirmacao: true,
            publicado_em: new Date().toISOString(),
            autor: { id: '2', nome: 'SSMA Corporativo' }
          }
        ],
        obra: [
          {
            id: '3',
            titulo: 'Entrega da Data Marco - Fundações Concluídas',
            conteudo: 'Informamos que as fundações da Ponte Rio Azul foram concluídas dentro do prazo previsto. Parabéns a toda a equipe!',
            escopo: 'obra',
            prioridade: 'normal',
            categoria: 'Obra',
            fixado: false,
            exige_confirmacao: false,
            publicado_em: new Date().toISOString(),
            autor: { id: '3', nome: 'Gerência de Obra' }
          }
        ],
        setor: [],
        todos: []
      });
    }
  };

  useEffect(() => {
    // Carrega obra ativa do localStorage
    const obraId = localStorage.getItem('obraAtiva');
    if (obraId) {
      setObraAtiva(JSON.parse(obraId));
    }

    // Carrega comunicados
    carregarComunicados();

    // Simula carregamento de dados
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // Auto-rotação do carrossel
  useEffect(() => {
    const todosFixados = [...comunicados.corporativos, ...comunicados.obra].filter(c => c.fixado);
    const todosNaoFixados = [...comunicados.corporativos, ...comunicados.obra].filter(c => !c.fixado);
    const todosComunicados = [...todosFixados, ...todosNaoFixados];
    
    if (todosComunicados.length > 1) {
      const interval = setInterval(() => {
        setCarrosselIndex((prev) => (prev + 1) % todosComunicados.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [comunicados]);

  const confirmarLeitura = async (comunicadoId: string) => {
    try {
      await api.post(`/comunicados/${comunicadoId}/confirmar-leitura`);
      carregarComunicados();
    } catch (err) {
      console.error('Erro ao confirmar leitura:', err);
    }
  };

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

  // Prepara comunicados para o carrossel
  const todosFixados = [...comunicados.corporativos, ...comunicados.obra].filter(c => c.fixado);
  const todosNaoFixados = [...comunicados.corporativos, ...comunicados.obra].filter(c => !c.fixado);
  const comunicadosCarrossel = [...todosFixados, ...todosNaoFixados];
  const comunicadoAtual = comunicadosCarrossel[carrosselIndex];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Intranet</h1>
          <p className="text-gray-600">Painel de controle e informações gerais do projeto</p>
        </div>
      </div>

      {/* Carrossel de Comunicados */}
      {comunicadosCarrossel.length > 0 && (
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
          <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header do Carrossel */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Megaphone className="text-gray-600" size={18} />
                <span className="text-sm font-medium text-gray-700">Comunicados</span>
                {comunicadoAtual?.fixado && (
                  <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                    <Pin size={12} /> Fixado
                  </span>
                )}
                {comunicadoAtual?.escopo === 'global' && (
                  <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    <Globe size={12} /> Corporativo
                  </span>
                )}
                {comunicadoAtual?.prioridade === 'urgente' && (
                  <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                    <AlertCircle size={12} /> Urgente
                  </span>
                )}
                {comunicadoAtual?.prioridade === 'critico' && (
                  <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                    <AlertTriangle size={12} /> Crítico
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {carrosselIndex + 1} / {comunicadosCarrossel.length}
                </span>
                <button 
                  onClick={() => setCarrosselIndex((prev) => (prev - 1 + comunicadosCarrossel.length) % comunicadosCarrossel.length)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <button 
                  onClick={() => setCarrosselIndex((prev) => (prev + 1) % comunicadosCarrossel.length)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Conteúdo do Comunicado */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{comunicadoAtual?.titulo}</h3>
              <p className="text-gray-600 text-sm mb-3">{comunicadoAtual?.conteudo}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{comunicadoAtual?.autor?.nome}</span>
                  <span>{comunicadoAtual?.publicado_em ? new Date(comunicadoAtual.publicado_em).toLocaleDateString('pt-BR') : ''}</span>
                  {comunicadoAtual?.categoria && (
                    <span className={`px-2 py-0.5 rounded ${
                      comunicadoAtual.categoria === 'SSMA' ? 'bg-red-100 text-red-700' :
                      comunicadoAtual.categoria === 'Institucional' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {comunicadoAtual.categoria}
                    </span>
                  )}
                </div>
                {comunicadoAtual?.exige_confirmacao && (
                  <button 
                    onClick={() => confirmarLeitura(comunicadoAtual.id)}
                    className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
                  >
                    <Check size={14} /> Li e estou ciente
                  </button>
                )}
              </div>
            </div>

            {/* Indicadores de posição */}
            <div className="flex justify-center gap-1 pb-3">
              {comunicadosCarrossel.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarrosselIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === carrosselIndex ? 'bg-gray-800' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

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
            {/* Lista de Comunicados Recentes */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Comunicados Recentes</h3>
                <span className="text-xs text-gray-500">{comunicados.corporativos.length + comunicados.obra.length} novos</span>
              </div>
              <div className="space-y-3">
                {[...comunicados.corporativos, ...comunicados.obra].slice(0, 5).map((comunicado) => (
                  <div 
                    key={comunicado.id} 
                    className={`border-l-4 pl-4 py-2 ${
                      comunicado.escopo === 'global' ? 'border-blue-500' :
                      comunicado.categoria === 'SSMA' ? 'border-red-500' :
                      'border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{comunicado.titulo}</p>
                        <p className="text-xs text-gray-500 mt-1">{comunicado.autor?.nome}</p>
                      </div>
                      {comunicado.fixado && <Pin size={14} className="text-yellow-600" />}
                    </div>
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
