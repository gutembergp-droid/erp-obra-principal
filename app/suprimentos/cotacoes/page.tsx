'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, DollarSign, Plus, Search, Filter } from 'lucide-react';

const cotacoesMock = [
  { id: 'COT-001', requisicao: 'REQ-001', item: 'Aço CA-50 12.5mm', fornecedores: 3, melhorPreco: 'R$ 42.500,00', status: 'Em Análise' },
  { id: 'COT-002', requisicao: 'REQ-003', item: 'Brita 1 - 20m³', fornecedores: 4, melhorPreco: 'R$ 7.800,00', status: 'Aguardando' },
  { id: 'COT-003', requisicao: 'REQ-004', item: 'Areia Média - 30m³', fornecedores: 2, melhorPreco: 'R$ 5.900,00', status: 'Finalizada' },
];

export default function SuprimentosCotacoes() {
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Análise': return { bg: '#F59E0B20', text: '#F59E0B' };
      case 'Aguardando': return { bg: '#3B82F620', text: '#3B82F6' };
      case 'Finalizada': return { bg: '#10B98120', text: '#10B981' };
      default: return { bg: colors.bgCardHover, text: colors.textMuted };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/suprimentos"
            className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
            style={{ backgroundColor: colors.bgCardHover }}
          >
            <ArrowLeft size={20} style={{ color: colors.textMuted }} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              Cotações
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
              Comparativo de preços de fornecedores
            </p>
          </div>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: colors.accent }}
        >
          <Plus size={18} /> Nova Cotação
        </button>
      </div>

      {/* Tabela */}
      <div 
        className="rounded-lg border overflow-hidden"
        style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: colors.bgCardHover }}>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Cotação</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Requisição</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Item</th>
              <th className="text-center p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Fornecedores</th>
              <th className="text-right p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Melhor Preço</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {cotacoesMock.map((cot) => {
              const statusColor = getStatusColor(cot.status);
              return (
                <tr 
                  key={cot.id} 
                  className="border-t cursor-pointer transition-colors"
                  style={{ borderColor: colors.borderPrimary }}
                >
                  <td className="p-4 font-mono text-sm" style={{ color: colors.accent }}>{cot.id}</td>
                  <td className="p-4 font-mono text-sm" style={{ color: colors.textMuted }}>{cot.requisicao}</td>
                  <td className="p-4 font-medium" style={{ color: colors.textPrimary }}>{cot.item}</td>
                  <td className="p-4 text-center" style={{ color: colors.textSecondary }}>{cot.fornecedores}</td>
                  <td className="p-4 text-right font-medium" style={{ color: '#10B981' }}>{cot.melhorPreco}</td>
                  <td className="p-4">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                    >
                      {cot.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info de Teste */}
      <div 
        className="p-4 rounded-lg border-2 border-dashed"
        style={{ borderColor: colors.accent, backgroundColor: `${colors.accent}10` }}
      >
        <p className="text-sm font-medium" style={{ color: colors.accent }}>
          🧪 Breadcrumb esperado: <strong>Suprimentos / Cotações</strong>
        </p>
      </div>
    </div>
  );
}
