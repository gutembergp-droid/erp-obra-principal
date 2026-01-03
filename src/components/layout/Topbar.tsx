'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  User, 
  ChevronDown, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  DollarSign,
  Clock,
  Sun,
  Moon,
  Palette,
  Check,
} from 'lucide-react';
import { useTheme, ThemeType, themeNames } from '@/contexts/ThemeContext';

interface TopbarProps {
  competencia?: {
    mes: number;
    ano: number;
  };
  contrato?: {
    valor: number;
    prazo: number; // em meses
  };
  gateStatus?: {
    numero: number;
    status: 'ok' | 'pendente' | 'bloqueado';
  };
  usuario?: {
    nome: string;
    perfil: string;
  };
  notificacoes?: number;
}

export default function Topbar({
  competencia,
  contrato,
  gateStatus,
  usuario,
  notificacoes = 0,
}: TopbarProps) {
  const { theme, setTheme, colors } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Valores padrão
  const comp = competencia || { mes: new Date().getMonth() + 1, ano: new Date().getFullYear() };
  const contratoInfo = contrato || { valor: 0, prazo: 0 };
  const gate = gateStatus || { numero: 1, status: 'pendente' };
  const user = usuario || { nome: 'Usuário', perfil: 'usuario' };

  // Formata o mês/ano
  const mesFormatado = comp.mes.toString().padStart(2, '0');
  
  // Formata o valor do contrato
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Cor do status do gate
  const getGateStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-900/50 text-green-400 border-green-700';
      case 'pendente':
        return 'bg-yellow-900/50 text-yellow-400 border-yellow-700';
      case 'bloqueado':
        return 'bg-red-900/50 text-red-400 border-red-700';
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  // Ícone do status do gate
  const getGateStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle size={14} className="text-green-400" />;
      case 'pendente':
        return <Clock size={14} className="text-yellow-400" />;
      case 'bloqueado':
        return <AlertCircle size={14} className="text-red-400" />;
      default:
        return null;
    }
  };

  // Ícone do tema atual
  const getThemeIcon = (themeType: ThemeType) => {
    switch (themeType) {
      case 'light':
        return <Sun size={16} />;
      case 'dark':
        return <Moon size={16} />;
      case 'vibrant':
        return <Palette size={16} />;
    }
  };

  // Cores de preview dos temas
  const themePreviewColors: Record<ThemeType, { bg: string; accent: string }> = {
    light: { bg: '#F8F9FA', accent: '#96110D' },
    dark: { bg: '#0A0A0A', accent: '#96110D' },
    vibrant: { bg: '#F0F4FF', accent: '#7C3AED' },
  };

  return (
    <header 
      className="h-14 border-b flex items-center justify-between px-6 transition-colors duration-200"
      style={{ 
        backgroundColor: colors.topbarBg, 
        borderColor: colors.borderPrimary,
        color: colors.topbarText 
      }}
    >
      {/* Lado Esquerdo - Informações da Competência e Contrato */}
      <div className="flex items-center gap-6">
        {/* Competência */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} style={{ color: colors.textMuted }} />
          <span style={{ color: colors.textSecondary }}>Competência:</span>
          <span className="font-semibold" style={{ color: colors.textPrimary }}>{mesFormatado}/{comp.ano}</span>
        </div>

        {/* Separador */}
        <div className="h-4 w-px" style={{ backgroundColor: colors.borderPrimary }} />

        {/* Valor do Contrato */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign size={16} style={{ color: colors.textMuted }} />
          <span style={{ color: colors.textSecondary }}>Contrato:</span>
          <span className="font-semibold" style={{ color: colors.textPrimary }}>{formatCurrency(contratoInfo.valor)}</span>
        </div>

        {/* Separador */}
        <div className="h-4 w-px" style={{ backgroundColor: colors.borderPrimary }} />

        {/* Prazo */}
        <div className="flex items-center gap-2 text-sm">
          <Clock size={16} style={{ color: colors.textMuted }} />
          <span style={{ color: colors.textSecondary }}>Prazo:</span>
          <span className="font-semibold" style={{ color: colors.textPrimary }}>{contratoInfo.prazo} meses</span>
        </div>

        {/* Separador */}
        <div className="h-4 w-px" style={{ backgroundColor: colors.borderPrimary }} />

        {/* Status do Gate */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getGateStatusColor(gate.status)}`}>
          {getGateStatusIcon(gate.status)}
          <span className="text-sm font-medium">
            Gate {gate.numero} {gate.status === 'ok' ? 'OK' : gate.status === 'pendente' ? 'Pendente' : 'Bloqueado'}
          </span>
        </div>
      </div>

      {/* Lado Direito - Tema, Notificações e Perfil */}
      <div className="flex items-center gap-3">
        {/* Seletor de Tema */}
        <div className="relative" ref={themeMenuRef}>
          <button 
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
            style={{ 
              backgroundColor: showThemeMenu ? colors.bgCardHover : 'transparent',
              color: colors.textSecondary 
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = showThemeMenu ? colors.bgCardHover : 'transparent'}
          >
            {getThemeIcon(theme)}
            <span className="text-sm">{themeNames[theme]}</span>
            <ChevronDown size={14} className={`transition-transform ${showThemeMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Menu dropdown de temas */}
          {showThemeMenu && (
            <div 
              className="absolute right-0 top-full mt-2 w-48 rounded-lg border shadow-lg overflow-hidden z-50"
              style={{ 
                backgroundColor: colors.bgCard, 
                borderColor: colors.borderPrimary 
              }}
            >
              <div className="p-2">
                <p className="text-xs font-semibold uppercase tracking-wider px-2 py-1" style={{ color: colors.textMuted }}>
                  Escolha o tema
                </p>
                
                {(['light', 'dark', 'vibrant'] as ThemeType[]).map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => {
                      setTheme(themeOption);
                      setShowThemeMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-md transition-colors"
                    style={{ 
                      backgroundColor: theme === themeOption ? colors.bgCardHover : 'transparent',
                      color: colors.textPrimary 
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme === themeOption ? colors.bgCardHover : 'transparent'}
                  >
                    {/* Preview do tema */}
                    <div 
                      className="w-6 h-6 rounded-md border flex items-center justify-center"
                      style={{ 
                        backgroundColor: themePreviewColors[themeOption].bg,
                        borderColor: colors.borderPrimary
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: themePreviewColors[themeOption].accent }}
                      />
                    </div>
                    
                    <span className="flex-1 text-left text-sm">{themeNames[themeOption]}</span>
                    
                    {theme === themeOption && (
                      <Check size={16} style={{ color: colors.accent }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notificações */}
        <button 
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: colors.textSecondary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.bgCardHover;
            e.currentTarget.style.color = colors.textPrimary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = colors.textSecondary;
          }}
        >
          <Bell size={20} />
          {notificacoes > 0 && (
            <span 
              className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.error }}
            >
              {notificacoes > 9 ? '9+' : notificacoes}
            </span>
          )}
        </button>

        {/* Perfil do Usuário */}
        <button 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: colors.textSecondary }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.bgCardHover }}
          >
            <User size={16} style={{ color: colors.textMuted }} />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{user.nome}</p>
            <p className="text-xs capitalize" style={{ color: colors.textMuted }}>{user.perfil}</p>
          </div>
          <ChevronDown size={14} style={{ color: colors.textMuted }} />
        </button>
      </div>
    </header>
  );
}
