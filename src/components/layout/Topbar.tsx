'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import BreadcrumbDinamico from './BreadcrumbDinamico';
import { 
  Bell, 
  ChevronDown, 
  Sun,
  Moon,
  Palette,
  Check,
  Home,
  MessageSquare,
  ClipboardList,
  Calendar,
  FileText,
  GraduationCap,
  Headphones,
  Bot,
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
  '/': { depto: 'Intranet', pagina: 'Dashboard da Obra' },
  '/comunicados': { depto: 'Intranet', pagina: 'Comunicados' },
  '/tarefas': { depto: 'Intranet', pagina: 'Minhas Tarefas' },
  '/agenda': { depto: 'Intranet', pagina: 'Agenda' },
  '/clientes': { depto: 'Corporativo', pagina: 'Clientes' },
  '/contratos': { depto: 'Corporativo', pagina: 'Contratos' },
  '/portfolio': { depto: 'Corporativo', pagina: 'Portfólio de Obras' },
  '/gestao-obras': { depto: 'Obras', pagina: 'Gestão de Obras' },
  '/estruturacao': { depto: 'Comercial', pagina: 'Estruturação (EAP)' },
  '/medicao-producao': { depto: 'Comercial', pagina: 'Medição Produção' },
  '/medicao-cliente': { depto: 'Comercial', pagina: 'Medição Cliente' },
  '/projetos': { depto: 'Engenharia', pagina: 'Projetos' },
  '/cronograma': { depto: 'Planejamento', pagina: 'Cronograma' },
  '/diario-obra': { depto: 'Produção', pagina: 'Diário de Obra' },
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
  '/financeiro': { depto: 'Financeiro', pagina: 'Dashboard' },
  '/financeiro/contas-pagar': { depto: 'Financeiro', pagina: 'Contas a Pagar' },
  '/financeiro/contas-receber': { depto: 'Financeiro', pagina: 'Contas a Receber' },
  '/financeiro/fluxo-caixa': { depto: 'Financeiro', pagina: 'Fluxo de Caixa' },
  '/financeiro/conciliacao': { depto: 'Financeiro', pagina: 'Conciliação Bancária' },
  '/financeiro/orcamento': { depto: 'Financeiro', pagina: 'Orçamento' },
  '/financeiro/relatorios': { depto: 'Financeiro', pagina: 'Relatórios Financeiros' },
  '/rh': { depto: 'RH', pagina: 'Dashboard' },
  '/rh/colaboradores': { depto: 'RH', pagina: 'Colaboradores' },
  '/rh/folha-pagamento': { depto: 'RH', pagina: 'Folha de Pagamento' },
  '/rh/ferias': { depto: 'RH', pagina: 'Férias' },
  '/rh/beneficios': { depto: 'RH', pagina: 'Benefícios' },
  '/rh/ponto': { depto: 'RH', pagina: 'Controle de Ponto' },
  '/rh/recrutamento': { depto: 'RH', pagina: 'Recrutamento' },
  '/custos': { depto: 'Custos', pagina: 'Apropriação de Custos' },
  '/qualidade': { depto: 'Qualidade', pagina: 'Inspeções' },
  '/ssma': { depto: 'SSMA', pagina: 'Segurança' },
  '/meio-ambiente': { depto: 'Meio Ambiente', pagina: 'Licenças' },
  '/administrativo': { depto: 'Administrativo', pagina: 'RH / Pessoal' },
};

// Interface para ações rápidas
interface AcaoRapida {
  id: string;
  icon: React.ElementType;
  name: string;
  shortcut: string;
  href: string;
  group: 'left' | 'center' | 'right';
}

// Ações rápidas organizadas: ESQUERDA (Tarefas) | CENTRO (Home) | DIREITA (Apoio)
const acoesRapidas: AcaoRapida[] = [
  // ESQUERDA - Executam Tarefas
  { id: 'requisicao', icon: ClipboardList, name: 'Requisição', shortcut: 'Ctrl+R', href: '/suprimentos/requisicoes', group: 'left' },
  { id: 'calendario', icon: Calendar, name: 'Calendário', shortcut: 'Ctrl+A', href: '/agenda', group: 'left' },
  { id: 'chat', icon: MessageSquare, name: 'Chat', shortcut: 'Ctrl+M', href: '/comunicados', group: 'left' },
  // CENTRO - Home
  { id: 'home', icon: Home, name: 'Início', shortcut: 'Ctrl+H', href: '/', group: 'center' },
  // DIREITA - Apoio/Suporte
  { id: 'documentacao', icon: FileText, name: 'Documentação', shortcut: 'Ctrl+D', href: '/documentos', group: 'right' },
  { id: 'treinamento', icon: GraduationCap, name: 'Treinamento', shortcut: 'Ctrl+T', href: '/treinamentos', group: 'right' },
  { id: 'suporte', icon: Headphones, name: 'Suporte', shortcut: 'Ctrl+S', href: '/suporte', group: 'right' },
  { id: 'ia', icon: Bot, name: 'Assistente IA', shortcut: 'Ctrl+I', href: '/assistente', group: 'right' },
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
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);

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

  const user = usuario || { nome: 'Usuário', perfil: 'Colaborador' };
  const initials = user.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const badgeCount = notificacoes || 3;

  const themePreviewColors: Record<ThemeType, { bg: string; accent: string }> = {
    light: { bg: '#F8F9FA', accent: '#96110D' },
    dark: { bg: '#0A0A0A', accent: '#96110D' },
    vibrant: { bg: '#F0F4FF', accent: '#7C3AED' },
  };

  const statusConfig = {
    online: { color: '#22C55E', label: 'Online' },
    ausente: { color: '#F59E0B', label: 'Ausente' },
    ocupado: { color: '#EF4444', label: 'Ocupado' },
    offline: { color: '#6B7280', label: 'Offline' },
  };

  const clima = { temp: 28, condicao: 'ensolarado' };
  const getClimaIcon = () => {
    switch (clima.condicao) {
      case 'ensolarado': return <Sun size={16} style={{ color: '#F59E0B' }} />;
      case 'nublado': return <Cloud size={16} style={{ color: colors.textMuted }} />;
      case 'chuvoso': return <CloudRain size={16} style={{ color: '#3B82F6' }} />;
      default: return <CloudSun size={16} style={{ color: '#F59E0B' }} />;
    }
  };

  const leftActions = acoesRapidas.filter(a => a.group === 'left');
  const centerAction = acoesRapidas.find(a => a.group === 'center');
  const rightActions = acoesRapidas.filter(a => a.group === 'right');

  return (
    <header 
      className="h-14 border-b flex items-center justify-between px-6 transition-colors duration-200"
      style={{ 
        backgroundColor: colors.topbarBg, 
        borderColor: colors.borderPrimary,
        color: colors.topbarText 
      }}
    >
      {/* ESQUERDA - Breadcrumb */}
      <div className="flex items-center gap-3">
        <BreadcrumbDinamico separator="slash" maxItems={4} />
      </div>

      {/* CENTRO - Card de Ações Rápidas (Compacto, expansão no hover) */}
      <div 
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl"
        style={{ backgroundColor: colors.bgCardHover }}
      >
        {/* Grupo Esquerda */}
        {leftActions.map((acao) => {
          const Icon = acao.icon;
          const isActive = pathname === acao.href;
          const isHovered = hoveredAction === acao.id;
          return (
            <div 
              key={acao.id} 
              className="relative"
              onMouseEnter={() => setHoveredAction(acao.id)}
              onMouseLeave={() => setHoveredAction(null)}
            >
              <Link
                href={acao.href}
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
                style={{ 
                  backgroundColor: isActive ? colors.accent : isHovered ? 'rgba(150, 17, 13, 0.15)' : 'transparent',
                  color: isActive ? '#FFFFFF' : isHovered ? colors.accent : colors.textMuted,
                  transform: isHovered && !isActive ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: isHovered && !isActive ? '0 2px 8px rgba(150, 17, 13, 0.2)' : 'none',
                }}
              >
                <Icon size={20} />
              </Link>
              {/* Tooltip preto */}
              {isHovered && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 pointer-events-none">
                  <div className="px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap flex items-center gap-2" style={{ backgroundColor: '#1a1a1a' }}>
                    <span className="text-xs font-medium text-white">{acao.name}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{acao.shortcut}</span>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45" style={{ backgroundColor: '#1a1a1a' }} />
                </div>
              )}
            </div>
          );
        })}
        
        {/* Separador */}
        <div className="w-px h-6 mx-1" style={{ backgroundColor: colors.borderPrimary }} />
        
        {/* Grupo Centro - Home */}
        {centerAction && (
          <div 
            className="relative"
            onMouseEnter={() => setHoveredAction(centerAction.id)}
            onMouseLeave={() => setHoveredAction(null)}
          >
            <Link
              href={centerAction.href}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200"
              style={{ 
                backgroundColor: colors.accent,
                color: '#FFFFFF',
                transform: hoveredAction === centerAction.id ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <Home size={22} />
            </Link>
            {/* Tooltip preto */}
            {hoveredAction === centerAction.id && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 pointer-events-none">
                <div className="px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap flex items-center gap-2" style={{ backgroundColor: '#1a1a1a' }}>
                  <span className="text-xs font-medium text-white">{centerAction.name}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{centerAction.shortcut}</span>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45" style={{ backgroundColor: '#1a1a1a' }} />
              </div>
            )}
          </div>
        )}
        
        {/* Separador */}
        <div className="w-px h-6 mx-1" style={{ backgroundColor: colors.borderPrimary }} />
        
        {/* Grupo Direita */}
        {rightActions.map((acao) => {
          const Icon = acao.icon;
          const isActive = pathname === acao.href;
          const isHovered = hoveredAction === acao.id;
          return (
            <div 
              key={acao.id} 
              className="relative"
              onMouseEnter={() => setHoveredAction(acao.id)}
              onMouseLeave={() => setHoveredAction(null)}
            >
              <Link
                href={acao.href}
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
                style={{ 
                  backgroundColor: isActive ? colors.accent : isHovered ? 'rgba(150, 17, 13, 0.15)' : 'transparent',
                  color: isActive ? '#FFFFFF' : isHovered ? colors.accent : colors.textMuted,
                  transform: isHovered && !isActive ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: isHovered && !isActive ? '0 2px 8px rgba(150, 17, 13, 0.2)' : 'none',
                }}
              >
                <Icon size={20} />
              </Link>
              {/* Tooltip preto */}
              {isHovered && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 pointer-events-none">
                  <div className="px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap flex items-center gap-2" style={{ backgroundColor: '#1a1a1a' }}>
                    <span className="text-xs font-medium text-white">{acao.name}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{acao.shortcut}</span>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45" style={{ backgroundColor: '#1a1a1a' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DIREITA - Clima, Tema, Notificações, Avatar */}
      <div className="flex items-center gap-3">
        {/* Clima */}
        <div className="flex items-center gap-1.5 text-sm">
          {getClimaIcon()}
          <span style={{ color: colors.textSecondary }}>{clima.temp}°C</span>
        </div>

        <div className="h-4 w-px" style={{ backgroundColor: colors.borderPrimary }} />

        {/* Seletor de Tema */}
        <div className="relative" ref={themeMenuRef}>
          <button 
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="p-2 rounded-lg transition-colors duration-200 hover:opacity-80"
            style={{ backgroundColor: colors.bgCardHover }}
            title="Alterar tema"
          >
            {theme === 'light' && <Sun size={18} style={{ color: colors.textSecondary }} />}
            {theme === 'dark' && <Moon size={18} style={{ color: colors.textSecondary }} />}
            {theme === 'vibrant' && <Palette size={18} style={{ color: colors.textSecondary }} />}
          </button>
          
          {showThemeMenu && (
            <div 
              className="absolute right-0 top-full mt-2 w-44 rounded-xl shadow-xl border overflow-hidden z-50"
              style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
            >
              <div className="p-2">
                <div className="text-xs font-semibold px-2 py-1.5 mb-1" style={{ color: colors.textMuted }}>
                  Selecionar Tema
                </div>
                {(['light', 'dark', 'vibrant'] as ThemeType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTheme(t); setShowThemeMenu(false); }}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors duration-150"
                    style={{ backgroundColor: theme === t ? colors.bgCardHover : 'transparent' }}
                  >
                    <div 
                      className="w-6 h-6 rounded-md border flex items-center justify-center"
                      style={{ backgroundColor: themePreviewColors[t].bg, borderColor: themePreviewColors[t].accent }}
                    >
                      {theme === t && <Check size={14} style={{ color: themePreviewColors[t].accent }} />}
                    </div>
                    <span className="text-sm" style={{ color: colors.textPrimary }}>{themeNames[t]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notificações */}
        <button 
          className="relative p-2 rounded-lg transition-colors duration-200 hover:opacity-80"
          style={{ backgroundColor: colors.bgCardHover }}
          title="Notificações"
        >
          <Bell size={18} style={{ color: colors.textSecondary }} />
          {badgeCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white rounded-full px-1"
              style={{ backgroundColor: colors.accent }}
            >
              {badgeCount > 9 ? '9+' : badgeCount}
            </span>
          )}
        </button>

        {/* Avatar com Status e Nome */}
        <div className="relative" ref={statusMenuRef}>
          <button 
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors duration-200 hover:opacity-80"
            style={{ backgroundColor: colors.bgCardHover }}
          >
            <div className="relative">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                style={{ backgroundColor: colors.accent }}
              >
                {initials}
              </div>
              <div 
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{ backgroundColor: statusConfig[userStatus].color, borderColor: colors.topbarBg }}
              />
            </div>
            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{user.nome}</span>
            <ChevronDown size={14} style={{ color: colors.textMuted }} />
          </button>
          
          {showStatusMenu && (
            <div 
              className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border overflow-hidden z-50"
              style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
            >
              <div className="p-2">
                <div className="text-xs font-semibold px-2 py-1.5 mb-1" style={{ color: colors.textMuted }}>
                  Alterar Status
                </div>
                {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => (
                  <button
                    key={status}
                    onClick={() => { setUserStatus(status); setShowStatusMenu(false); }}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors duration-150"
                    style={{ backgroundColor: userStatus === status ? colors.bgCardHover : 'transparent' }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusConfig[status].color }} />
                    <span className="text-sm" style={{ color: colors.textPrimary }}>{statusConfig[status].label}</span>
                    {userStatus === status && <Check size={14} style={{ color: colors.accent }} className="ml-auto" />}
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
