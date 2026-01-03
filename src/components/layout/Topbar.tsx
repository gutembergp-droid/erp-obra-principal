'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  ChevronDown, 
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

// Mapeamento de rotas para breadcrumb (Departamento > Página)
const routeMap: Record<string, { depto: string; pagina: string }> = {
  // Intranet
  '/': { depto: 'Intranet', pagina: 'Dashboard da Obra' },
  '/comunicados': { depto: 'Intranet', pagina: 'Comunicados' },
  '/tarefas': { depto: 'Intranet', pagina: 'Minhas Tarefas' },
  '/agenda': { depto: 'Intranet', pagina: 'Agenda' },
  
  // Corporativo
  '/clientes': { depto: 'Corporativo', pagina: 'Clientes' },
  '/contratos': { depto: 'Corporativo', pagina: 'Contratos' },
  '/portfolio': { depto: 'Corporativo', pagina: 'Portfólio de Obras' },
  
  // Obras
  '/gestao-obras': { depto: 'Obras', pagina: 'Gestão de Obras' },
  
  // Comercial
  '/estruturacao': { depto: 'Comercial', pagina: 'Estruturação (EAP)' },
  '/medicao-producao': { depto: 'Comercial', pagina: 'Medição Produção' },
  '/medicao-cliente': { depto: 'Comercial', pagina: 'Medição Cliente' },
  
  // Engenharia
  '/projetos': { depto: 'Engenharia', pagina: 'Projetos' },
  
  // Planejamento
  '/cronograma': { depto: 'Planejamento', pagina: 'Cronograma' },
  
  // Produção
  '/diario-obra': { depto: 'Produção', pagina: 'Diário de Obra' },
  
  // SUPRIMENTOS - Módulo completo para teste
  '/suprimentos': { depto: 'Suprimentos', pagina: 'Dashboard' },
  '/suprimentos/requisicoes': { depto: 'Suprimentos', pagina: 'Requisições' },
  '/suprimentos/cotacoes': { depto: 'Suprimentos', pagina: 'Cotações' },
  '/suprimentos/pedidos': { depto: 'Suprimentos', pagina: 'Pedidos de Compra' },
  '/suprimentos/estoque': { depto: 'Suprimentos', pagina: 'Controle de Estoque' },
  '/suprimentos/fornecedores': { depto: 'Suprimentos', pagina: 'Fornecedores' },
  '/suprimentos/recebimento': { depto: 'Suprimentos', pagina: 'Recebimento' },
  '/requisicoes': { depto: 'Suprimentos', pagina: 'Requisições' },
  '/cotacoes': { depto: 'Suprimentos', pagina: 'Cotações' },
  '/pedidos': { depto: 'Suprimentos', pagina: 'Pedidos de Compra' },
  '/estoque': { depto: 'Suprimentos', pagina: 'Controle de Estoque' },
  
  // FINANCEIRO - Módulo completo para teste
  '/financeiro': { depto: 'Financeiro', pagina: 'Dashboard' },
  '/financeiro/contas-pagar': { depto: 'Financeiro', pagina: 'Contas a Pagar' },
  '/financeiro/contas-receber': { depto: 'Financeiro', pagina: 'Contas a Receber' },
  '/financeiro/fluxo-caixa': { depto: 'Financeiro', pagina: 'Fluxo de Caixa' },
  '/financeiro/conciliacao': { depto: 'Financeiro', pagina: 'Conciliação Bancária' },
  '/financeiro/orcamento': { depto: 'Financeiro', pagina: 'Orçamento' },
  '/financeiro/relatorios': { depto: 'Financeiro', pagina: 'Relatórios Financeiros' },
  
  // RH - Módulo completo para teste
  '/rh': { depto: 'RH', pagina: 'Dashboard' },
  '/rh/colaboradores': { depto: 'RH', pagina: 'Colaboradores' },
  '/rh/folha-pagamento': { depto: 'RH', pagina: 'Folha de Pagamento' },
  '/rh/ferias': { depto: 'RH', pagina: 'Férias' },
  '/rh/beneficios': { depto: 'RH', pagina: 'Benefícios' },
  '/rh/ponto': { depto: 'RH', pagina: 'Controle de Ponto' },
  '/rh/recrutamento': { depto: 'RH', pagina: 'Recrutamento' },
  
  // Custos
  '/custos': { depto: 'Custos', pagina: 'Apropriação de Custos' },
  
  // Qualidade
  '/inspecoes': { depto: 'Qualidade', pagina: 'Inspeções' },
  
  // SSMA
  '/seguranca': { depto: 'SSMA', pagina: 'Segurança do Trabalho' },
  '/treinamentos': { depto: 'SSMA', pagina: 'Treinamentos' },
  
  // Administrativo
  '/documentos': { depto: 'Administrativo', pagina: 'Documentos' },
  
  // Sistema
  '/suporte': { depto: 'Sistema', pagina: 'Suporte' },
};

// Ações rápidas fixas (somente ícones)
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

  // Obtém as iniciais do nome do usuário
  const getIniciais = (nome: string) => {
    const partes = nome.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  // Obtém o breadcrumb baseado na rota atual (Departamento > Página)
  const getBreadcrumb = () => {
    const route = pathname ? routeMap[pathname] : null;
    return route || { depto: 'Sistema', pagina: 'Dashboard' };
  };

  const breadcrumb = getBreadcrumb();

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
      className="h-14 border-b flex items-center justify-between px-6 transition-colors duration-200"
      style={{ 
        backgroundColor: colors.topbarBg, 
        borderColor: colors.borderPrimary,
        color: colors.topbarText 
      }}
    >
      {/* ESQUERDA - Breadcrumb (Departamento > Página) */}
      <div className="flex items-center gap-3">
        <nav className="flex items-center gap-2 text-sm">
          <span className="font-semibold" style={{ color: colors.accent }}>{breadcrumb.depto}</span>
          <span style={{ color: colors.textMuted }}>/</span>
          <span className="font-medium" style={{ color: colors.textPrimary }}>{breadcrumb.pagina}</span>
        </nav>
      </div>

      {/* CENTRO - Card de Ações Rápidas (somente ícones com destaque) */}
      <div 
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl"
        style={{ backgroundColor: colors.bgCardHover }}
      >
        {acoesRapidas.map((acao) => {
          const Icon = acao.icon;
          const isActive = pathname === acao.href;
          return (
            <a
              key={acao.id}
              href={acao.href}
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
              style={{ 
                backgroundColor: isActive ? colors.accent : 'transparent',
                color: isActive ? '#FFFFFF' : colors.textMuted,
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = colors.borderPrimary;
                  e.currentTarget.style.color = colors.textPrimary;
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.textMuted;
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              title={acao.label}
            >
              <Icon size={20} />
            </a>
          );
        })}
      </div>

      {/* DIREITA - Clima, Tema, Notificações, Avatar com iniciais e nome */}
      <div className="flex items-center gap-3">
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
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors"
            style={{ 
              backgroundColor: showThemeMenu ? colors.bgCardHover : 'transparent',
              color: colors.textSecondary 
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = showThemeMenu ? colors.bgCardHover : 'transparent'}
          >
            {getThemeIcon(theme)}
            <ChevronDown size={12} className={`transition-transform ${showThemeMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Menu dropdown de temas */}
          {showThemeMenu && (
            <div 
              className="absolute right-0 top-full mt-2 w-44 rounded-lg border shadow-lg overflow-hidden z-50"
              style={{ 
                backgroundColor: colors.bgCard, 
                borderColor: colors.borderPrimary 
              }}
            >
              <div className="p-2">
                <p className="text-xs font-semibold uppercase tracking-wider px-2 py-1" style={{ color: colors.textMuted }}>
                  Tema
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
                    <div 
                      className="w-5 h-5 rounded-md border flex items-center justify-center"
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
                      <Check size={14} style={{ color: colors.accent }} />
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
          <Bell size={18} />
          {notificacoes > 0 && (
            <span 
              className="absolute -top-0.5 -right-0.5 w-4 h-4 text-white text-[10px] rounded-full flex items-center justify-center font-medium"
              style={{ backgroundColor: colors.error }}
            >
              {notificacoes > 9 ? '9+' : notificacoes}
            </span>
          )}
        </button>

        {/* Separador */}
        <div className="h-4 w-px" style={{ backgroundColor: colors.borderPrimary }} />

        {/* Widget de Avatar com iniciais e nome */}
        <div className="relative" ref={statusMenuRef}>
          <button 
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center gap-2.5 px-2 py-1 rounded-lg transition-colors"
            style={{ color: colors.textSecondary }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {/* Avatar com iniciais e Badge de Status */}
            <div className="relative">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm"
                style={{ 
                  backgroundColor: colors.accent,
                  color: '#FFFFFF'
                }}
              >
                {getIniciais(user.nome)}
              </div>
              {/* Badge de Status */}
              <div 
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{ 
                  backgroundColor: statusConfig[userStatus].color,
                  borderColor: colors.topbarBg
                }}
              />
            </div>
            
            {/* Nome do Usuário */}
            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
              {user.nome}
            </span>
            
            <ChevronDown size={14} style={{ color: colors.textMuted }} />
          </button>

          {/* Menu de Status */}
          {showStatusMenu && (
            <div 
              className="absolute right-0 top-full mt-2 w-48 rounded-lg border shadow-lg overflow-hidden z-50"
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
                  Status
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
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: statusConfig[status].color }}
                    />
                    <span className="flex-1 text-left text-sm">{statusConfig[status].label}</span>
                    {userStatus === status && (
                      <Check size={14} style={{ color: colors.accent }} />
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
