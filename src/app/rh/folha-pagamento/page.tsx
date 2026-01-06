'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Wallet, FileText, Download } from 'lucide-react';

const folhasMock = [
  { competencia: 'Dezembro/2025', colaboradores: 247, bruto: 'R$ 1.850.000,00', liquido: 'R$ 1.420.000,00', status: 'Fechada' },
  { competencia: 'Novembro/2025', colaboradores: 245, bruto: 'R$ 1.820.000,00', liquido: 'R$ 1.400.000,00', status: 'Fechada' },
  { competencia: 'Outubro/2025', colaboradores: 243, bruto: 'R$ 1.790.000,00', liquido: 'R$ 1.375.000,00', status: 'Fechada' },
  { competencia: 'Janeiro/2026', colaboradores: 247, bruto: 'R$ 1.870.000,00', liquido: '-', status: 'Em Processamento' },
];

export default function RHFolhaPagamento() {
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fechada': return { bg: '#10B98120', text: '#10B981' };
      case 'Em Processamento': return { bg: '#F59E0B20', text: '#F59E0B' };
      default: return { bg: colors.bgCardHover, text: colors.textMuted };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/rh"
            className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
            style={{ backgroundColor: colors.bgCardHover }}
          >
            <ArrowLeft size={20} style={{ color: colors.textMuted }} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              Folha de Pagamento
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
              Processamento e histórico de folhas
            </p>
          </div>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: colors.accent }}
        >
          <FileText size={18} /> Processar Folha
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
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Competência</th>
              <th className="text-center p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Colaboradores</th>
              <th className="text-right p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Total Bruto</th>
              <th className="text-right p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Total Líquido</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Status</th>
              <th className="text-center p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {folhasMock.map((folha, idx) => {
              const statusColor = getStatusColor(folha.status);
              return (
                <tr 
                  key={idx} 
                  className="border-t cursor-pointer transition-colors"
                  style={{ borderColor: colors.borderPrimary }}
                >
                  <td className="p-4 font-medium" style={{ color: colors.textPrimary }}>{folha.competencia}</td>
                  <td className="p-4 text-center" style={{ color: colors.textSecondary }}>{folha.colaboradores}</td>
                  <td className="p-4 text-right font-medium" style={{ color: colors.textPrimary }}>{folha.bruto}</td>
                  <td className="p-4 text-right font-medium" style={{ color: '#10B981' }}>{folha.liquido}</td>
                  <td className="p-4">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                    >
                      {folha.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {folha.status === 'Fechada' && (
                      <button 
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: colors.textMuted }}
                      >
                        <Download size={18} />
                      </button>
                    )}
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
          🧪 Breadcrumb esperado: <strong>RH / Folha de Pagamento</strong>
        </p>
      </div>
    </div>
  );
}
