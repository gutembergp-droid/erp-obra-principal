'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  User, 
  Package, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Printer,
  Send
} from 'lucide-react';

// Dados mock para demonstração
const requisicoesMock: Record<string, any> = {
  'REQ-001': {
    id: 'REQ-001',
    descricao: 'Aço CA-50 12.5mm',
    solicitante: 'João Silva',
    departamento: 'Engenharia',
    data: '03/01/2026',
    status: 'Pendente',
    prioridade: 'Alta',
    valor: 45000,
    quantidade: 5000,
    unidade: 'kg',
    observacao: 'Necessário para início das fundações do Bloco A. Prazo crítico.',
    historico: [
      { data: '03/01/2026 09:15', acao: 'Requisição criada', usuario: 'João Silva' },
      { data: '03/01/2026 10:30', acao: 'Enviada para aprovação', usuario: 'Sistema' },
    ]
  },
  'REQ-002': {
    id: 'REQ-002',
    descricao: 'Cimento CP-II 50kg',
    solicitante: 'Maria Santos',
    departamento: 'Produção',
    data: '02/01/2026',
    status: 'Aprovada',
    prioridade: 'Média',
    valor: 12500,
    quantidade: 500,
    unidade: 'sacos',
    observacao: 'Reposição de estoque para concretagem.',
    historico: [
      { data: '02/01/2026 08:00', acao: 'Requisição criada', usuario: 'Maria Santos' },
      { data: '02/01/2026 11:00', acao: 'Aprovada pelo gestor', usuario: 'Carlos Mendes' },
    ]
  },
};

export default function RequisicaoDetalhePage() {
  const params = useParams();
  const { colors } = useTheme();
  const id = (params?.id as string) || '';
  
  // Busca os dados da requisição (em produção seria uma chamada API)
  const requisicao = requisicoesMock[id] || {
    id: id,
    descricao: 'Requisição não encontrada',
    solicitante: '-',
    departamento: '-',
    data: '-',
    status: 'Desconhecido',
    prioridade: '-',
    valor: 0,
    quantidade: 0,
    unidade: '-',
    observacao: 'Esta requisição não foi encontrada no sistema.',
    historico: []
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Pendente': return { bg: '#F59E0B20', text: '#F59E0B', icon: AlertCircle };
      case 'Aprovada': return { bg: '#10B98120', text: '#10B981', icon: CheckCircle };
      case 'Rejeitada': return { bg: '#EF444420', text: '#EF4444', icon: XCircle };
      case 'Em Cotação': return { bg: '#3B82F620', text: '#3B82F6', icon: Clock };
      default: return { bg: colors.bgCardHover, text: colors.textMuted, icon: AlertCircle };
    }
  };

  const statusConfig = getStatusConfig(requisicao.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/suprimentos/requisicoes"
            className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
            style={{ backgroundColor: colors.bgCardHover }}
          >
            <ArrowLeft size={20} style={{ color: colors.textMuted }} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {requisicao.id}
              </h1>
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5"
                style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}
              >
                <StatusIcon size={14} />
                {requisicao.status}
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
              {requisicao.descricao}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg border"
            style={{ borderColor: colors.borderPrimary, color: colors.textSecondary }}
          >
            <Printer size={18} /> Imprimir
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg border"
            style={{ borderColor: colors.borderPrimary, color: colors.textSecondary }}
          >
            <Edit size={18} /> Editar
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: colors.accent }}
          >
            <Send size={18} /> Enviar para Cotação
          </button>
        </div>
      </div>

      {/* Grid de Informações */}
      <div className="grid grid-cols-3 gap-6">
        {/* Coluna 1 - Dados Principais */}
        <div 
          className="col-span-2 p-6 rounded-lg border"
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Dados da Requisição
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs mb-1" style={{ color: colors.textMuted }}>Solicitante</p>
              <div className="flex items-center gap-2">
                <User size={16} style={{ color: colors.textSecondary }} />
                <span style={{ color: colors.textPrimary }}>{requisicao.solicitante}</span>
              </div>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: colors.textMuted }}>Departamento</p>
              <span style={{ color: colors.textPrimary }}>{requisicao.departamento}</span>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: colors.textMuted }}>Data da Solicitação</p>
              <div className="flex items-center gap-2">
                <Clock size={16} style={{ color: colors.textSecondary }} />
                <span style={{ color: colors.textPrimary }}>{requisicao.data}</span>
              </div>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: colors.textMuted }}>Prioridade</p>
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: requisicao.prioridade === 'Alta' ? '#EF444420' : '#F59E0B20',
                  color: requisicao.prioridade === 'Alta' ? '#EF4444' : '#F59E0B'
                }}
              >
                {requisicao.prioridade}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: colors.borderPrimary }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
              Itens Solicitados
            </h3>
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.bgCardHover }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package size={20} style={{ color: colors.accent }} />
                  <div>
                    <p className="font-medium" style={{ color: colors.textPrimary }}>{requisicao.descricao}</p>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      {requisicao.quantidade.toLocaleString('pt-BR')} {requisicao.unidade}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                    R$ {requisicao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>Valor estimado</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: colors.borderPrimary }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
              Observações
            </h3>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {requisicao.observacao}
            </p>
          </div>
        </div>

        {/* Coluna 2 - Histórico */}
        <div 
          className="p-6 rounded-lg border"
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Histórico
          </h2>
          
          <div className="space-y-4">
            {requisicao.historico.map((item: any, index: number) => (
              <div 
                key={index}
                className="relative pl-6 pb-4 border-l-2"
                style={{ borderColor: index === 0 ? colors.accent : colors.borderPrimary }}
              >
                <div 
                  className="absolute left-[-5px] top-0 w-2 h-2 rounded-full"
                  style={{ backgroundColor: index === 0 ? colors.accent : colors.borderPrimary }}
                />
                <p className="text-xs mb-1" style={{ color: colors.textMuted }}>{item.data}</p>
                <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{item.acao}</p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>por {item.usuario}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info de Teste */}
      <div 
        className="p-4 rounded-lg border-2 border-dashed"
        style={{ borderColor: colors.accent, backgroundColor: `${colors.accent}10` }}
      >
        <p className="text-sm font-medium" style={{ color: colors.accent }}>
          🧪 Breadcrumb esperado (3 níveis): <strong>Suprimentos / Requisições / {id}</strong>
        </p>
      </div>
    </div>
  );
}
