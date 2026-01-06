'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Users, Plus, Search, Filter } from 'lucide-react';

const colaboradoresMock = [
  { id: '001', nome: 'João Carlos Silva', cargo: 'Engenheiro Civil', setor: 'Engenharia', admissao: '15/03/2020', status: 'Ativo' },
  { id: '002', nome: 'Maria Santos Oliveira', cargo: 'Técnica de Segurança', setor: 'SSMA', admissao: '20/06/2021', status: 'Ativo' },
  { id: '003', nome: 'Carlos Eduardo Mendes', cargo: 'Mestre de Obras', setor: 'Produção', admissao: '10/01/2019', status: 'Férias' },
  { id: '004', nome: 'Ana Paula Costa', cargo: 'Analista Financeiro', setor: 'Financeiro', admissao: '05/09/2022', status: 'Ativo' },
  { id: '005', nome: 'Pedro Augusto Lima', cargo: 'Comprador', setor: 'Suprimentos', admissao: '12/04/2023', status: 'Ativo' },
];

export default function RHColaboradores() {
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return { bg: '#10B98120', text: '#10B981' };
      case 'Férias': return { bg: '#F59E0B20', text: '#F59E0B' };
      case 'Afastado': return { bg: '#EF444420', text: '#EF4444' };
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
              Colaboradores
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
              Cadastro e gestão de funcionários
            </p>
          </div>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: colors.accent }}
        >
          <Plus size={18} /> Novo Colaborador
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
            placeholder="Buscar colaborador..."
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
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Matrícula</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Nome</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Cargo</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Setor</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Admissão</th>
              <th className="text-left p-4 font-semibold text-sm" style={{ color: colors.textSecondary }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {colaboradoresMock.map((colab) => {
              const statusColor = getStatusColor(colab.status);
              return (
                <tr 
                  key={colab.id} 
                  className="border-t cursor-pointer transition-colors"
                  style={{ borderColor: colors.borderPrimary }}
                >
                  <td className="p-4 font-mono text-sm" style={{ color: colors.accent }}>{colab.id}</td>
                  <td className="p-4 font-medium" style={{ color: colors.textPrimary }}>{colab.nome}</td>
                  <td className="p-4" style={{ color: colors.textSecondary }}>{colab.cargo}</td>
                  <td className="p-4" style={{ color: colors.textMuted }}>{colab.setor}</td>
                  <td className="p-4" style={{ color: colors.textMuted }}>{colab.admissao}</td>
                  <td className="p-4">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                    >
                      {colab.status}
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
          🧪 Breadcrumb esperado: <strong>RH / Colaboradores</strong>
        </p>
      </div>
    </div>
  );
}
