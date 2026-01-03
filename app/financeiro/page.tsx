'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  Building, 
  PieChart, 
  FileBarChart,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const subPaginas = [
  { 
    href: '/financeiro/contas-pagar', 
    titulo: 'Contas a Pagar', 
    descricao: 'Títulos e obrigações a vencer',
    icon: CreditCard,
    pendentes: 23,
    cor: '#EF4444'
  },
  { 
    href: '/financeiro/contas-receber', 
    titulo: 'Contas a Receber', 
    descricao: 'Medições e recebíveis',
    icon: Wallet,
    pendentes: 8,
    cor: '#10B981'
  },
  { 
    href: '/financeiro/fluxo-caixa', 
    titulo: 'Fluxo de Caixa', 
    descricao: 'Projeção de entradas e saídas',
    icon: TrendingUp,
    pendentes: 0,
    cor: '#3B82F6'
  },
  { 
    href: '/financeiro/conciliacao', 
    titulo: 'Conciliação Bancária', 
    descricao: 'Conferência de extratos',
    icon: Building,
    pendentes: 5,
    cor: '#8B5CF6'
  },
  { 
    href: '/financeiro/orcamento', 
    titulo: 'Orçamento', 
    descricao: 'Controle orçamentário da obra',
    icon: PieChart,
    pendentes: 0,
    cor: '#F59E0B'
  },
  { 
    href: '/financeiro/relatorios', 
    titulo: 'Relatórios Financeiros', 
    descricao: 'DRE, Balanço e análises',
    icon: FileBarChart,
    pendentes: 0,
    cor: '#06B6D4'
  },
];

export default function FinanceiroDashboard() {
  const { colors } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
          Financeiro
        </h1>
        <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
          Gestão financeira e controle orçamentário
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: colors.textMuted }}>Saldo em Caixa</p>
            <ArrowUpRight size={16} style={{ color: '#10B981' }} />
          </div>
          <p className="text-xl font-bold mt-2" style={{ color: colors.textPrimary }}>R$ 2.4M</p>
          <p className="text-xs mt-1" style={{ color: '#10B981' }}>+12% vs mês anterior</p>
        </div>
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: colors.textMuted }}>A Pagar (30 dias)</p>
            <ArrowDownRight size={16} style={{ color: '#EF4444' }} />
          </div>
          <p className="text-xl font-bold mt-2" style={{ color: colors.textPrimary }}>R$ 890K</p>
          <p className="text-xs mt-1" style={{ color: '#EF4444' }}>23 títulos</p>
        </div>
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: colors.textMuted }}>A Receber (30 dias)</p>
            <ArrowUpRight size={16} style={{ color: '#10B981' }} />
          </div>
          <p className="text-xl font-bold mt-2" style={{ color: colors.textPrimary }}>R$ 1.5M</p>
          <p className="text-xs mt-1" style={{ color: '#10B981' }}>8 medições</p>
        </div>
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: colors.textMuted }}>Orçamento Utilizado</p>
          </div>
          <p className="text-xl font-bold mt-2" style={{ color: colors.textPrimary }}>68%</p>
          <div className="w-full h-2 rounded-full mt-2" style={{ backgroundColor: colors.bgCardHover }}>
            <div className="h-full rounded-full" style={{ width: '68%', backgroundColor: colors.accent }} />
          </div>
        </div>
      </div>

      {/* Grid de Sub-páginas */}
      <div className="grid grid-cols-3 gap-4">
        {subPaginas.map((pagina) => {
          const Icon = pagina.icon;
          return (
            <Link
              key={pagina.href}
              href={pagina.href}
              className="p-5 rounded-lg border transition-all duration-200 hover:shadow-lg group"
              style={{ 
                backgroundColor: colors.bgCard, 
                borderColor: colors.borderPrimary 
              }}
            >
              <div className="flex items-start justify-between">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${pagina.cor}20` }}
                >
                  <Icon size={24} style={{ color: pagina.cor }} />
                </div>
                {pagina.pendentes > 0 && (
                  <span 
                    className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                    style={{ backgroundColor: colors.accent }}
                  >
                    {pagina.pendentes} pendentes
                  </span>
                )}
              </div>
              <h3 
                className="text-lg font-semibold mt-4 group-hover:text-[#96110D] transition-colors"
                style={{ color: colors.textPrimary }}
              >
                {pagina.titulo}
              </h3>
              <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
                {pagina.descricao}
              </p>
              <div className="flex items-center gap-1 mt-3 text-sm font-medium" style={{ color: colors.accent }}>
                Acessar <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Info de Teste */}
      <div 
        className="p-4 rounded-lg border-2 border-dashed"
        style={{ borderColor: colors.accent, backgroundColor: `${colors.accent}10` }}
      >
        <p className="text-sm font-medium" style={{ color: colors.accent }}>
          🧪 Cenário de Teste: Navegue pelas sub-páginas e observe o breadcrumb no Topbar mudando para "Financeiro / [Página]"
        </p>
      </div>
    </div>
  );
}
