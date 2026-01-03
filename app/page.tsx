'use client';

import React, { useState, useEffect } from 'react';
import { 
  Newspaper,
  BarChart3,
  ListTodo,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clipboard,
  Settings,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2,
  Circle,
  RefreshCw,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

// Interfaces
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
}

interface Atividade {
  id: string;
  titulo: string;
  prazo: string;
  prioridade: 'urgente' | 'alta' | 'media' | 'baixa';
  status: 'pendente' | 'em_andamento' | 'concluida';
}

interface Indicador {
  label: string;
  valor: string | number;
  icone: React.ReactNode;
  link?: string;
}

interface Aviso {
  id: string;
  mensagem: string;
  tipo: 'alerta' | 'info' | 'urgente';
}

interface AtalhoSetor {
  id: string;
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  link: string;
  pendencias?: number;
  avanço?: number;
}

export default function IntranetPage() {
  const [loading, setLoading] = useState(true);
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [carrosselIndex, setCarrosselIndex] = useState(0);

  // Dados mockados (serão substituídos por API)
  const indicadores: Indicador[] = [
    { label: 'Avanço físico (semana)', valor: '62%', icone: <TrendingUp size={20} className="text-gray-600" />, link: '/planejamento/avanco-fisico' },
    { label: 'Frentes ativas', valor: 4, icone: <Users size={20} className="text-gray-600" />, link: '/producao/frentes' },
    { label: 'Pendências críticas', valor: 3, icone: <FileText size={20} className="text-gray-600" />, link: '/tarefas/pendencias' },
  ];

  const minhasAtividades: Atividade[] = [
    { id: '1', titulo: 'Revisar RDO — Fora do Tempo', prazo: 'Hoje', prioridade: 'urgente', status: 'pendente' },
    { id: '2', titulo: 'Conferir apontamentos de equipe', prazo: 'Amanhã', prioridade: 'alta', status: 'pendente' },
    { id: '3', titulo: 'Atualizar checklist de qualidade', prazo: 'Em 3 dias', prioridade: 'media', status: 'pendente' },
  ];

  const avisosImportantes: Aviso[] = [
    { id: '1', mensagem: 'Atenção: atividades em área de risco nesta semana — reforçar sinalização.', tipo: 'alerta' },
    { id: '2', mensagem: 'Documentos pendentes (medição) — prazo em 3 dias', tipo: 'urgente' },
  ];

  const atalhosSetor: AtalhoSetor[] = [
    { id: '1', titulo: 'RDO', descricao: 'Registrar atividades do dia', icone: <Calendar size={20} />, link: '/producao/rdo' },
    { id: '2', titulo: 'Medições', descricao: 'Acompanhar avanço e entregas', icone: <BarChart3 size={20} />, link: '/comercial/medicao-mp' },
    { id: '3', titulo: 'Opções', descricao: 'Preferências e acessos da obra', icone: <Settings size={20} />, link: '/configuracoes' },
  ];

  // Carrega comunicados
  const carregarComunicados = async () => {
    try {
      const obraId = localStorage.getItem('obraAtiva');
      const response = await api.get(`/comunicados/intranet${obraId ? `?obra_id=${obraId}` : ''}`) as { data: any };
      const todos = [...(response.data.corporativos || []), ...(response.data.obra || [])];
      setComunicados(todos);
    } catch (err) {
      console.error('Erro ao carregar comunicados:', err);
      // Dados mockados para demonstração
      setComunicados([
        {
          id: '1',
          titulo: 'Atualização de cronograma — Fora do Tempo',
          conteudo: 'Revisão do plano da semana e alinhamento de frentes de serviço.',
          escopo: 'obra',
          prioridade: 'normal',
          categoria: 'Novidades',
          fixado: false,
          exige_confirmacao: false,
          publicado_em: '2024-01-15',
          autor: { id: '1', nome: 'Planejamento' }
        },
        {
          id: '2',
          titulo: 'DDS obrigatório antes do início das atividades',
          conteudo: 'Próximo passo: registre a presença e anexe a lista de participantes.',
          escopo: 'obra',
          prioridade: 'urgente',
          categoria: 'Segurança',
          fixado: false,
          exige_confirmacao: true,
          publicado_em: '2024-01-14',
          autor: { id: '2', nome: 'SSMA' }
        },
        {
          id: '3',
          titulo: 'Novo Contrato Assinado - Rodovia BR-101',
          conteudo: 'A AahBrant acaba de assinar um novo contrato para a duplicação de 50km da BR-101.',
          escopo: 'global',
          prioridade: 'normal',
          categoria: 'Institucional',
          fixado: true,
          exige_confirmacao: false,
          publicado_em: '2024-01-13',
          autor: { id: '3', nome: 'Diretoria' }
        }
      ]);
    }
  };

  useEffect(() => {
    carregarComunicados();
    setLoading(false);
  }, []);

  // Cor do indicador de prioridade
  const corPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-500';
      case 'alta': return 'bg-orange-500';
      case 'media': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  // Cor do badge de categoria
  const corCategoria = (categoria?: string) => {
    switch (categoria) {
      case 'Segurança': return 'bg-red-100 text-red-700 border-red-200';
      case 'Novidades': return 'bg-green-100 text-green-700 border-green-200';
      case 'Institucional': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Cor do aviso
  const corAviso = (tipo: string) => {
    switch (tipo) {
      case 'urgente': return 'bg-red-50 border-l-4 border-red-500 text-red-800';
      case 'alerta': return 'bg-amber-50 border-l-4 border-amber-500 text-amber-800';
      default: return 'bg-blue-50 border-l-4 border-blue-500 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-gray-400" size={32} />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Esquerda - Notícias e Comunicados (2/3 da largura) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Notícias e Comunicados */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Newspaper className="text-gray-500" size={22} />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Notícias e Comunicados</h2>
                  <p className="text-sm text-gray-500">Atualizações da obra e corporativo</p>
                </div>
              </div>
              <button 
                onClick={() => carregarComunicados()}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <RefreshCw size={16} />
                Atualizar
              </button>
            </div>

            {/* Lista de Comunicados */}
            <div className="divide-y divide-gray-100">
              {comunicados.length === 0 ? (
                <div className="p-8 text-center">
                  <Newspaper className="mx-auto mb-4 text-gray-300" size={48} />
                  <p className="text-gray-500">Nenhum comunicado disponível</p>
                  <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto">
                    Tentar novamente <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                comunicados.map((comunicado) => (
                  <div key={comunicado.id} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer">
                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-400">
                        {comunicado.escopo === 'global' ? 'Corporativo' : 'Obra'}
                      </span>
                      {comunicado.categoria && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${corCategoria(comunicado.categoria)}`}>
                          {comunicado.categoria}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(comunicado.publicado_em).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    {/* Título */}
                    <h3 className="font-semibold text-gray-800 mb-1">{comunicado.titulo}</h3>
                    
                    {/* Descrição */}
                    <p className="text-sm text-gray-600">{comunicado.conteudo}</p>
                  </div>
                ))
              )}
            </div>

            {/* Footer - Ver mais */}
            {comunicados.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <Link href="/comunicados" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Ver todos os comunicados <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* Card: Avisos Importantes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <AlertTriangle className="text-amber-500" size={22} />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Avisos Importantes</h2>
                <p className="text-sm text-gray-500">Riscos e pendências que merecem atenção</p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {avisosImportantes.map((aviso) => (
                <div key={aviso.id} className={`p-4 rounded-lg ${corAviso(aviso.tipo)}`}>
                  <p className="text-sm font-medium">{aviso.mensagem}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Atalhos Rápidos / Informações do Setor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Atalhos Rápidos</h2>
              <p className="text-sm text-gray-500">Acesse as áreas mais comuns do dia a dia da obra</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {atalhosSetor.map((atalho) => (
                <Link 
                  key={atalho.id} 
                  href={atalho.link}
                  className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-gray-200 transition-colors">
                      {atalho.icone}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{atalho.titulo}</h3>
                      <p className="text-sm text-gray-500">{atalho.descricao}</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita - Indicadores e Atividades (1/3 da largura) */}
        <div className="space-y-6">
          
          {/* Card: Indicadores Rápidos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <BarChart3 className="text-gray-500" size={22} />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Indicadores Rápidos</h2>
                <p className="text-sm text-gray-500">Resumo do que está acontecendo agora</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {indicadores.map((indicador, index) => (
                <Link 
                  key={index} 
                  href={indicador.link || '#'}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {indicador.icone}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{indicador.label}</p>
                      <p className="text-xl font-bold text-gray-800">{indicador.valor}</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Card: Minhas Atividades */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <ListTodo className="text-gray-500" size={22} />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Minhas Atividades</h2>
                <p className="text-sm text-gray-500">O que você precisa fazer agora</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {minhasAtividades.map((atividade) => (
                <div key={atividade.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${corPrioridade(atividade.prioridade)}`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{atividade.titulo}</h4>
                      <p className="text-sm text-gray-500">{atividade.prazo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <Link href="/tarefas" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Ver todas as atividades <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
