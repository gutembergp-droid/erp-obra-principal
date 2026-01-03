'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, FileText, Plus, Search, Filter } from 'lucide-react';

const requisicoesMock = [
  { id: 'REQ-001', descricao: 'Aço CA-50 12.5mm', solicitante: 'João Silva', data: '03/01/2026', status: 'Pendente', valor: 'R$ 45.000,00' },
  { id: 'REQ-002', descricao: 'Cimento CP-II 50kg', solicitante: 'Maria Santos', data: '02/01/2026', status: 'Aprovada', valor: 'R$ 12.500,00' },
  { id: 'REQ-003', descricao: 'Brita 1 - 20m³', solicitante: 'Carlos Mendes', data: '02/01/2026', status: 'Em Cotação', valor: 'R$ 8.200,00' },
  { id: 'REQ-004', descricao: 'Areia Média - 30m³', solicitante: 'Ana Paula', data: '01/01/2026', status: 'Pendente', valor: 'R$ 6.300,00' },
  { id: 'REQ-005', descricao: 'Forma Metálica', solicitante: 'Pedro Augusto', data: '01/01/2026', status: 'Aprovada', valor: 'R$ 28.000,00' },
];

export default function SuprimentosRequisicoes() {
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return { bg: '#F59E0B20', text: '#F59E0B' };
      case 'Aprovada': return { bg: '#10B98120', text: '#10B981' };
      case 'Em Cotação': return { bg: '#3B82F620', text: '#3B82F6' };
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
              Requisições
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
              Solicitações de materiais e serviços
            </p>
          </div>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: colors.accent }}
        >
          <Plus size={18} /> Nova Requisição
        </button>
      </div>

      {/* Barra de Busca */}
      <div 
        className="flex items-center gap-4 p-4 rounded-lg border"
        style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
      >
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textMuted }} />
          <input
            type="text"
            placeholder="Buscar requisição..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none"
            style={{ 
              backgroundColor: colors.bgPrimary, 
              borderColor: colors.borderPrimary,
              color: colors.textPrimary
            }}
          />
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg border"
          style={{ borderColor: colors.borderPrimary, color: colors.textSecondary }}
        >
          <Filter size={18} /> Filtros
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
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Código</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Descrição</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Solicitante</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Data</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Status</th>
              <th className="text-right p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {requisicoesMock.map((req) => {
              const statusColor = getStatusColor(req.status);
              return (
                <tr 
                  key={req.id} 
                  className="border-t cursor-pointer transition-colors"
                  style={{ borderColor: colors.borderPrimary }}
                >
                  <td className="p-4 font-mono text-sm" style={{ color: colors.accent }}>{req.id}</td>
                  <td className="p-4 font-medium" style={{ color: colors.textPrimary }}>{req.descricao}</td>
                  <td className="p-4" style={{ color: colors.textSecondary }}>{req.solicitante}</td>
                  <td className="p-4" style={{ color: colors.textMuted }}>{req.data}</td>
                  <td className="p-4">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium" style={{ color: colors.textPrimary }}>{req.valor}</td>
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
          🧪 Breadcrumb esperado: <strong>Suprimentos / Requisições</strong>
        </p>
      </div>
    </div>
  );
}
