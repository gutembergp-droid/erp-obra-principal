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
  Calendar,
  FileText,
  GraduationCap,
  Headphones,
  Bot,
  Cloud,
  CloudRain,
  CloudSun,
  Star,
  ShoppingCart,
  Video,
  User,
  Settings,
  LogOut,
  Mail,
} from 'lucide-react';
import { useTheme, ThemeType, themeNames } from '@/contexts/ThemeContext';

interface TopbarProps {
  usuario?: {
    nome: string;
    perfil: string;
    cargo?: string;
    setor?: string;
    email?: string;
    foto?: string;
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
  hasVideo?: boolean;
}

// Ações rápidas organizadas: ESQUERDA (Tarefas) | CENTRO (Home) | DIREITA (Apoio)
const acoesRapidas: AcaoRapida[] = [
  // ESQUERDA - Executam Tarefas
  { id: 'favoritos', icon: Star, name: 'Favoritos', shortcut: 'Ctrl+F', href: '/favoritos', group: 'left' },
  { id: 'requisicao', icon: ShoppingCart, name: 'Requisição', shortcut: 'Ctrl+R', href: '/suprimentos/requisicoes', group: 'left' },
  { id: 'calendario', icon: Calendar, name: 'Calendário', shortcut: 'Ctrl+A', href: '/agenda', group: 'left' },
  { id: 'chat', icon: MessageSquare, name: 'Chat & Vídeo', shortcut: 'Ctrl+M', href: '/comunicados', group: 'left', hasVideo: true },
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

  const user = usuario || { 
    nome: 'João Carlos Silva', 
    perfil: 'Colaborador',
    cargo: 'Engenheiro Civil',
    setor: 'Engenharia',
    email: 'joao.carlos@empresa.com',
    foto: ''
  };
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
                className="flex items-center h-9 rounded-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  backgroundColor: isActive ? colors.accent : isHovered ? 'rgba(150, 17, 13, 0.15)' : 'transparent',
                  color: isActive ? '#FFFFFF' : isHovered ? colors.accent : colors.textMuted,
                  paddingLeft: '10px',
                  paddingRight: isHovered && !isActive ? '12px' : '10px',
                  width: isHovered && !isActive ? 'auto' : '36px',
                  minWidth: '36px',
                }}
              >
                <div className="relative flex-shrink-0">
                  <Icon size={20} />
                  {acao.hasVideo && (
                    <Video size={10} className="absolute -bottom-0.5 -right-1" style={{ backgroundColor: isActive ? colors.accent : isHovered ? 'rgba(150, 17, 13, 0.15)' : colors.bgCardHover, borderRadius: '2px' }} />
                  )}
                </div>
                <span 
                  className="text-xs font-medium whitespace-nowrap overflow-hidden transition-all duration-300"
                  style={{
                    maxWidth: isHovered && !isActive ? '100px' : '0px',
                    opacity: isHovered && !isActive ? 1 : 0,
                    marginLeft: isHovered && !isActive ? '8px' : '0px',
                  }}
                >
                  {acao.name}
                </span>
              </Link>
              {/* Tooltip preto com maior espaçamento */}
              {isHovered && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 z-50 pointer-events-none">
                  <div className="px-4 py-2 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-3" style={{ backgroundColor: '#1a1a1a' }}>
                    <span className="text-sm font-medium text-white">{acao.name}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-400">{acao.shortcut}</span>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-3 h-3 rotate-45" style={{ backgroundColor: '#1a1a1a' }} />
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
            {/* Tooltip preto com maior espaçamento */}
            {hoveredAction === centerAction.id && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 z-50 pointer-events-none">
                <div className="px-4 py-2 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-3" style={{ backgroundColor: '#1a1a1a' }}>
                  <span className="text-sm font-medium text-white">{centerAction.name}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-400">{centerAction.shortcut}</span>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-3 h-3 rotate-45" style={{ backgroundColor: '#1a1a1a' }} />
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
                className="flex items-center h-9 rounded-lg transition-all duration-300 overflow-hidden"
                style={{ 
                  backgroundColor: isActive ? colors.accent : isHovered ? 'rgba(150, 17, 13, 0.15)' : 'transparent',
                  color: isActive ? '#FFFFFF' : isHovered ? colors.accent : colors.textMuted,
                  paddingLeft: '10px',
                  paddingRight: isHovered && !isActive ? '12px' : '10px',
                  width: isHovered && !isActive ? 'auto' : '36px',
                  minWidth: '36px',
                }}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span 
                  className="text-xs font-medium whitespace-nowrap overflow-hidden transition-all duration-300"
                  style={{
                    maxWidth: isHovered && !isActive ? '100px' : '0px',
                    opacity: isHovered && !isActive ? 1 : 0,
                    marginLeft: isHovered && !isActive ? '8px' : '0px',
                  }}
                >
                  {acao.name}
                </span>
              </Link>
              {/* Tooltip preto com maior espaçamento */}
              {isHovered && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 z-50 pointer-events-none">
                  <div className="px-4 py-2 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-3" style={{ backgroundColor: '#1a1a1a' }}>
                    <span className="text-sm font-medium text-white">{acao.name}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-400">{acao.shortcut}</span>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-3 h-3 rotate-45" style={{ backgroundColor: '#1a1a1a' }} />
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

        {/* Avatar com Status, Nome e Cargo */}
        <div className="relative group" ref={statusMenuRef}>
          <button 
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-200 hover:shadow-md"
            style={{ backgroundColor: colors.bgCardHover }}
          >
            <div className="relative">
              {user.foto ? (
                <img 
                  src={user.foto} 
                  alt={user.nome}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                  style={{ backgroundColor: colors.accent }}
                >
                  {initials}
                </div>
              )}
              <div 
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                style={{ backgroundColor: statusConfig[userStatus].color, borderColor: colors.topbarBg }}
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold leading-tight" style={{ color: colors.textPrimary }}>
                {user.nome.split(' ').slice(0, 2).join(' ')}
              </span>
              <span className="text-[11px] leading-tight" style={{ color: colors.textMuted }}>
                {user.cargo || user.perfil}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: colors.textMuted }} />
          </button>

          {/* Tooltip no hover */}
          <div 
            className="absolute right-0 bottom-full mb-3 px-4 py-3 rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap"
            style={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}
          >
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Nome:</span>
                <span className="text-white font-medium">{user.nome}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Cargo:</span>
                <span className="text-white font-medium">{user.cargo || user.perfil}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Setor:</span>
                <span className="text-white font-medium">{user.setor || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Status:</span>
                <span className="font-medium" style={{ color: statusConfig[userStatus].color }}>
                  ● {statusConfig[userStatus].label}
                </span>
              </div>
            </div>
            <div 
              className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
              style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #1a1a1a' }}
            />
          </div>
          
          {/* Menu Dropdown */}
          {showStatusMenu && (
            <div 
              className="absolute right-0 top-full mt-2 rounded-xl shadow-lg border overflow-hidden z-50"
              style={{ 
                backgroundColor: colors.bgCard, 
                borderColor: colors.borderPrimary,
                width: '220px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
              }}
            >
              {/* Cabeçalho com info do usuário */}
              <div className="border-b" style={{ borderColor: colors.borderPrimary, padding: '16px' }}>
                <div className="flex items-center" style={{ gap: '12px' }}>
                  {user.foto ? (
                    <img 
                      src={user.foto} 
                      alt={user.nome}
                      className="rounded-full object-cover"
                      style={{ width: '44px', height: '44px' }}
                    />
                  ) : (
                    <div 
                      className="rounded-full flex items-center justify-center font-semibold text-white"
                      style={{ 
                        backgroundColor: colors.accent,
                        width: '44px',
                        height: '44px',
                        fontSize: '16px'
                      }}
                    >
                      {initials}
                    </div>
                  )}
                  <div className="flex flex-col" style={{ gap: '2px' }}>
                    <span className="font-semibold" style={{ color: colors.textPrimary, fontSize: '14px' }}>{user.nome}</span>
                    <span style={{ color: colors.textMuted, fontSize: '12px' }}>{user.cargo || user.perfil}</span>
                    <span style={{ color: '#999', fontSize: '11px' }}>{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Opções do menu */}
              <div style={{ padding: '8px' }}>
                <button
                  className="w-full flex items-center rounded-lg transition-colors duration-150"
                  style={{ 
                    backgroundColor: 'transparent',
                    gap: '12px',
                    padding: '10px 12px',
                    fontSize: '13px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <User size={18} style={{ color: '#666' }} />
                  <span style={{ color: colors.textPrimary }}>Meu Perfil</span>
                </button>
                <button
                  className="w-full flex items-center rounded-lg transition-colors duration-150"
                  style={{ 
                    backgroundColor: 'transparent',
                    gap: '12px',
                    padding: '10px 12px',
                    fontSize: '13px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Settings size={18} style={{ color: '#666' }} />
                  <span style={{ color: colors.textPrimary }}>Configurações</span>
                </button>
              </div>

              {/* Status */}
              <div className="border-t" style={{ borderColor: colors.borderPrimary, padding: '8px' }}>
                <div className="font-semibold uppercase" style={{ 
                  color: '#999', 
                  fontSize: '11px',
                  padding: '8px 12px 4px'
                }}>
                  Alterar Status
                </div>
                {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => (
                  <button
                    key={status}
                    onClick={() => { setUserStatus(status); setShowStatusMenu(false); }}
                    className="w-full flex items-center rounded-lg transition-colors duration-150"
                    style={{ 
                      backgroundColor: userStatus === status ? '#F0F0F0' : 'transparent',
                      gap: '10px',
                      padding: '8px 12px',
                      fontSize: '13px'
                    }}
                    onMouseEnter={(e) => { if (userStatus !== status) e.currentTarget.style.backgroundColor = '#F5F5F5'; }}
                    onMouseLeave={(e) => { if (userStatus !== status) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <div className="rounded-full" style={{ 
                      backgroundColor: statusConfig[status].color,
                      width: '10px',
                      height: '10px'
                    }} />
                    <span style={{ color: colors.textPrimary }}>{statusConfig[status].label}</span>
                    {userStatus === status && <Check size={14} style={{ color: colors.accent }} className="ml-auto" />}
                  </button>
                ))}
              </div>

              {/* Sair */}
              <div className="border-t" style={{ borderColor: colors.borderPrimary, padding: '8px' }}>
                <button
                  className="w-full flex items-center rounded-lg transition-colors duration-150"
                  style={{ 
                    backgroundColor: 'transparent',
                    gap: '12px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    color: '#EF4444'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={18} />
                  <span>Sair do Sistema</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
