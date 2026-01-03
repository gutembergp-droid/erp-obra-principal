'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  User, 
  ChevronDown, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Sun,
  Moon,
  Palette,
  Check,
  Home,
  ShoppingCart,
  Calendar,
  FileText,
  GraduationCap,
  HelpCircle,
  Cloud,
  CloudRain,
  CloudSun,
} from 'lucide-react';
import { useTheme, ThemeType, themeNames } from '@/contexts/ThemeContext';

interface TopbarProps {
  usuario?: {
    nome: string;
    perfil: string;
    status?: 'online' | 'ausente' | 'ocupado' | 'offline';
  };
  notificacoes?: number;
}

// Mapeamento de rotas para breadcrumb
const routeMap: Record<string, { modulo: string; depto?: string; setor?: string }> = {
  '/': { modulo: 'Intranet', depto: 'Dashboard da Obra' },
  '/comunicados': { modulo: 'Intranet', depto: 'Comunicados' },
  '/tarefas': { modulo: 'Intranet', depto: 'Minhas Tarefas' },
  '/agenda': { modulo: 'Intranet', depto: 'Agenda' },
  '/clientes': { modulo: 'Corporativo', depto: 'Clientes' },
  '/contratos': { modulo: 'Corporativo', depto: 'Contratos' },
  '/portfolio': { modulo: 'Corporativo', depto: 'Portfólio de Obras' },
  '/gestao-obras': { modulo: 'Obras', depto: 'Gestão de Obras' },
  '/estruturacao': { modulo: 'Comercial', depto: 'Estruturação (EAP)' },
  '/medicao-producao': { modulo: 'Comercial', depto: 'Medição Produção' },
  '/medicao-cliente': { modulo: 'Comercial', depto: 'Medição Cliente' },
  '/projetos': { modulo: 'Engenharia', depto: 'Projetos' },
  '/cronograma': { modulo: 'Planejamento', depto: 'Cronograma' },
  '/diario-obra': { modulo: 'Produção', depto: 'Diário de Obra' },
  '/requisicoes': { modulo: 'Suprimentos', depto: 'Requisições' },
  '/custos': { modulo: 'Custos', depto: 'Apropriação de Custos' },
  '/inspecoes': { modulo: 'Qualidade', depto: 'Inspeções' },
  '/seguranca': { modulo: 'SSMA', depto: 'Segurança do Trabalho' },
};

// Ações rápidas fixas
const acoesRapidas = [
  { id: 'home', icon: Home, label: 'Tela Inicial', href: '/' },
  { id: 'suprimentos', icon: ShoppingCart, label: 'Suprimentos', href: '/requisicoes' },
  { id: 'calendario', icon: Calendar, label: 'Calendário', href: '/agenda' },
  { id: 'documentacao', icon: FileText, label: 'Documentação', href: '/documentos' },
  { id: 'treinamento', icon: GraduationCap, label: 'Treinamento', href: '/treinamentos' },
  { id: 'suporte', icon: HelpCircle, label: 'Suporte', href: '/suporte' },
];

export default function Topbar({
  usuario,
  notificacoes = 0,
}: TopbarProps) {
  const pathname = usePathname();
  const { theme, setTheme, colors } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [userStatus, setUserStatus] = useState<'online' | 'ausente' | 'ocupado' | 'offline'>(usuario?.status || 'online');
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  // Fecha os menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setShowStatusMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Valores padrão
  const user = usuario || { nome: 'Usuário', perfil: 'usuario', status: 'online' };

  // Obtém o breadcrumb baseado na rota atual
  const getBreadcrumb = () => {
    const route = pathname ? routeMap[pathname] : null;
    return route || { modulo: 'Genesis', depto: 'Dashboard' };
  };

  const breadcrumb = getBreadcrumb();

  // Saudação baseada na hora do dia
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Data completa formatada
  const getDataCompleta = () => {
    const hoje = new Date();
    const opcoes: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return hoje.toLocaleDateString('pt-BR', opcoes);
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

  // Cores e labels do status
  const statusConfig = {
    online: { color: '#22C55E', label: 'Online' },
    ausente: { color: '#F59E0B', label: 'Ausente' },
    ocupado: { color: '#EF4444', label: 'Ocupado' },
    offline: { color: '#6B7280', label: 'Offline' },
  };

  // Clima placeholder (pode ser integrado com API futuramente)
  const clima = { temp: 28, condicao: 'ensolarado' };
  const getClimaIcon = () => {
    switch (clima.condicao) {
      case 'ensolarado':
        return <Sun size={16} style={{ color: '#F59E0B' }} />;
      case 'nublado':
        return <Cloud size={16} style={{ color: colors.textMuted }} />;
      case 'chuvoso':
        return <CloudRain size={16} style={{ color: '#3B82F6' }} />;
      default:
        return <CloudSun size={16} style={{ color: '#F59E0B' }} />;
    }
  };

  return (
    <header 
      className="h-16 border-b flex items-center justify-between px-6 transition-colors duration-200"
      style={{ 
        backgroundColor: colors.topbarBg, 
        borderColor: colors.borderPrimary,
        color: colors.topbarText 
      }}
    >
      {/* ESQUERDA - Logo GENESIS + Breadcrumb */}
      <div className="flex items-center gap-4">
        {/* Logo GENESIS */}
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
            style={{ backgroundColor: colors.accent }}
          >
            G
          </div>
          <span className="font-bold text-lg" style={{ color: colors.textPrimary }}>
            GENESIS
          </span>
        </div>

        {/* Separador */}
        <div className="h-6 w-px" style={{ backgroundColor: colors.borderPrimary }} />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <span style={{ color: colors.textMuted }}>{breadcrumb.modulo}</span>
          {breadcrumb.depto && (
            <>
              <span style={{ color: colors.textMuted }}>&gt;</span>
              <span className="font-medium" style={{ color: colors.textPrimary }}>{breadcrumb.depto}</span>
            </>
          )}
          {breadcrumb.setor && (
            <>
              <span style={{ color: colors.textMuted }}>&gt;</span>
              <span className="font-medium" style={{ color: colors.accent }}>{breadcrumb.setor}</span>
            </>
          )}
        </nav>
      </div>

      {/* CENTRO - Card de Ações Rápidas */}
      <div className="flex items-center gap-1">
        {acoesRapidas.map((acao) => {
          const Icon = acao.icon;
          const isActive = pathname === acao.href;
          return (
            <a
              key={acao.id}
              href={acao.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors"
              style={{ 
                backgroundColor: isActive ? colors.bgCardHover : 'transparent',
                color: isActive ? colors.accent : colors.textMuted 
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = colors.bgCardHover;
                  e.currentTarget.style.color = colors.textPrimary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.textMuted;
                }
              }}
              title={acao.label}
            >
              <Icon size={20} />
              <span className="text-[9px] font-medium">{acao.label}</span>
            </a>
          );
        })}
      </div>

      {/* DIREITA - Widget de Avatar com saudação, data, clima e Badge de Status */}
      <div className="flex items-center gap-4">
        {/* Clima */}
        <div className="flex items-center gap-1.5 text-sm">
          {getClimaIcon()}
          <span style={{ color: colors.textSecondary }}>{clima.temp}°C</span>
        </div>

        {/* Separador */}
        <div className="h-4 w-px" style={{ backgroundColor: colors.borderPrimary }} />

        {/* Seletor de Tema */}
        <div className="relative" ref={themeMenuRef}>
          <button 
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
            style={{ 
              backgroundColor: showThemeMenu ? colors.bgCardHover : 'transparent',
              color: colors.textSecondary 
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = showThemeMenu ? colors.bgCardHover : 'transparent'}
          >
            {getThemeIcon(theme)}
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

        {/* Separador */}
        <div className="h-4 w-px" style={{ backgroundColor: colors.borderPrimary }} />

        {/* Widget de Avatar Completo */}
        <div className="relative" ref={statusMenuRef}>
          <button 
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: colors.textSecondary }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {/* Avatar com Badge de Status */}
            <div className="relative">
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.bgCardHover }}
              >
                <User size={18} style={{ color: colors.textMuted }} />
              </div>
              {/* Badge de Status */}
              <div 
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                style={{ 
                  backgroundColor: statusConfig[userStatus].color,
                  borderColor: colors.topbarBg
                }}
              />
            </div>
            
            {/* Informações do Usuário */}
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                {getSaudacao()}, {user.nome.split(' ')[0]}
              </p>
              <p className="text-[10px]" style={{ color: colors.textMuted }}>
                {getDataCompleta()}
              </p>
            </div>
            
            <ChevronDown size={14} style={{ color: colors.textMuted }} />
          </button>

          {/* Menu de Status */}
          {showStatusMenu && (
            <div 
              className="absolute right-0 top-full mt-2 w-56 rounded-lg border shadow-lg overflow-hidden z-50"
              style={{ 
                backgroundColor: colors.bgCard, 
                borderColor: colors.borderPrimary 
              }}
            >
              <div className="p-3 border-b" style={{ borderColor: colors.borderPrimary }}>
                <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{user.nome}</p>
                <p className="text-xs capitalize" style={{ color: colors.textMuted }}>{user.perfil}</p>
              </div>
              
              <div className="p-2">
                <p className="text-xs font-semibold uppercase tracking-wider px-2 py-1" style={{ color: colors.textMuted }}>
                  Alterar Status
                </p>
                
                {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setUserStatus(status);
                      setShowStatusMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-md transition-colors"
                    style={{ 
                      backgroundColor: userStatus === status ? colors.bgCardHover : 'transparent',
                      color: colors.textPrimary 
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = userStatus === status ? colors.bgCardHover : 'transparent'}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: statusConfig[status].color }}
                    />
                    <span className="flex-1 text-left text-sm">{statusConfig[status].label}</span>
                    {userStatus === status && (
                      <Check size={16} style={{ color: colors.accent }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
