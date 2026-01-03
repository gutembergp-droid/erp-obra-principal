'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Users, 
  Wallet, 
  Palmtree, 
  Gift, 
  Clock, 
  UserPlus,
  ArrowRight,
  TrendingUp,
  UserCheck,
  AlertCircle
} from 'lucide-react';

const subPaginas = [
  { 
    href: '/rh/colaboradores', 
    titulo: 'Colaboradores', 
    descricao: 'Cadastro e gestão de funcionários',
    icon: Users,
    pendentes: 0,
    cor: '#3B82F6'
  },
  { 
    href: '/rh/folha-pagamento', 
    titulo: 'Folha de Pagamento', 
    descricao: 'Processamento e histórico de folhas',
    icon: Wallet,
    pendentes: 1,
    cor: '#10B981'
  },
  { 
    href: '/rh/ferias', 
    titulo: 'Férias', 
    descricao: 'Programação e controle de férias',
    icon: Palmtree,
    pendentes: 7,
    cor: '#F59E0B'
  },
  { 
    href: '/rh/beneficios', 
    titulo: 'Benefícios', 
    descricao: 'VT, VR, Plano de Saúde',
    icon: Gift,
    pendentes: 0,
    cor: '#EC4899'
  },
  { 
    href: '/rh/ponto', 
    titulo: 'Controle de Ponto', 
    descricao: 'Registro e apontamento de horas',
    icon: Clock,
    pendentes: 15,
    cor: '#8B5CF6'
  },
  { 
    href: '/rh/recrutamento', 
    titulo: 'Recrutamento', 
    descricao: 'Vagas abertas e processos seletivos',
    icon: UserPlus,
    pendentes: 3,
    cor: '#06B6D4'
  },
];

export default function RHDashboard() {
  const { colors } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
          Recursos Humanos
        </h1>
        <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
          Gestão de pessoas e departamento pessoal
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#3B82F620' }}>
              <Users size={20} style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: colors.textMuted }}>Total Colaboradores</p>
              <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>247</p>
            </div>
          </div>
        </div>
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#10B98120' }}>
              <UserCheck size={20} style={{ color: '#10B981' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: colors.textMuted }}>Presentes Hoje</p>
              <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>232</p>
            </div>
          </div>
        </div>
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#F59E0B20' }}>
              <Palmtree size={20} style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: colors.textMuted }}>Em Férias</p>
              <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>12</p>
            </div>
          </div>
        </div>
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#EF444420' }}>
              <AlertCircle size={20} style={{ color: '#EF4444' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: colors.textMuted }}>Afastados</p>
              <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>3</p>
            </div>
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
          🧪 Cenário de Teste: Navegue pelas sub-páginas e observe o breadcrumb no Topbar mudando para "RH / [Página]"
        </p>
      </div>
    </div>
  );
}
