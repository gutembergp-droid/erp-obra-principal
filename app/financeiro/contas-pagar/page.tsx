'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, CreditCard, Plus, Search, Filter, AlertTriangle } from 'lucide-react';

const contasMock = [
  { id: 'CP-001', fornecedor: 'Aço Brasil Ltda', descricao: 'NF 12345 - Aço CA-50', vencimento: '05/01/2026', valor: 'R$ 45.000,00', status: 'Vencido' },
  { id: 'CP-002', fornecedor: 'Cimento Nacional', descricao: 'NF 67890 - Cimento CP-II', vencimento: '10/01/2026', valor: 'R$ 12.500,00', status: 'A Vencer' },
  { id: 'CP-003', fornecedor: 'Pedreira São João', descricao: 'NF 11223 - Brita e Areia', vencimento: '15/01/2026', valor: 'R$ 8.200,00', status: 'A Vencer' },
  { id: 'CP-004', fornecedor: 'Locadora Máquinas', descricao: 'NF 44556 - Aluguel Retroescavadeira', vencimento: '20/01/2026', valor: 'R$ 15.000,00', status: 'A Vencer' },
  { id: 'CP-005', fornecedor: 'Elétrica Total', descricao: 'NF 77889 - Material Elétrico', vencimento: '25/01/2026', valor: 'R$ 6.800,00', status: 'Pago' },
];

export default function FinanceiroContasPagar() {
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vencido': return { bg: '#EF444420', text: '#EF4444' };
      case 'A Vencer': return { bg: '#F59E0B20', text: '#F59E0B' };
      case 'Pago': return { bg: '#10B98120', text: '#10B981' };
      default: return { bg: colors.bgCardHover, text: colors.textMuted };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/financeiro"
            className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
            style={{ backgroundColor: colors.bgCardHover }}
          >
            <ArrowLeft size={20} style={{ color: colors.textMuted }} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              Contas a Pagar
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
              Títulos e obrigações a vencer
            </p>
          </div>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: colors.accent }}
        >
          <Plus size={18} /> Novo Título
        </button>
      </div>

      {/* Alerta de Vencidos */}
      <div 
        className="flex items-center gap-3 p-4 rounded-lg"
        style={{ backgroundColor: '#EF444420' }}
      >
        <AlertTriangle size={20} style={{ color: '#EF4444' }} />
        <p className="text-sm font-medium" style={{ color: '#EF4444' }}>
          Existem 1 título(s) vencido(s) totalizando R$ 45.000,00
        </p>
      </div>

      {/* Tabela */}
      <div 
        className="rounded-lg border overflow-hidden"
        style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: colors.bgCardHover }}>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Código</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Fornecedor</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Descrição</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Vencimento</th>
              <th className="text-right p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Valor</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {contasMock.map((conta) => {
              const statusColor = getStatusColor(conta.status);
              return (
                <tr 
                  key={conta.id} 
                  className="border-t cursor-pointer transition-colors"
                  style={{ borderColor: colors.borderPrimary }}
                >
                  <td className="p-4 font-mono text-sm" style={{ color: colors.accent }}>{conta.id}</td>
                  <td className="p-4 font-medium" style={{ color: colors.textPrimary }}>{conta.fornecedor}</td>
                  <td className="p-4" style={{ color: colors.textSecondary }}>{conta.descricao}</td>
                  <td className="p-4" style={{ color: conta.status === 'Vencido' ? '#EF4444' : colors.textMuted }}>{conta.vencimento}</td>
                  <td className="p-4 text-right font-medium" style={{ color: colors.textPrimary }}>{conta.valor}</td>
                  <td className="p-4">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                    >
                      {conta.status}
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
          🧪 Breadcrumb esperado: <strong>Financeiro / Contas a Pagar</strong>
        </p>
      </div>
    </div>
  );
}
