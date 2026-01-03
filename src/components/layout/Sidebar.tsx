'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  ListTodo,
  Calendar,
  AlertTriangle,
  Bot,
  Users,
  FileText,
  Briefcase,
  DollarSign,
  FileSpreadsheet,
  ArrowLeftRight,
  FilePlus,
  FileX,
  Receipt,
  Wrench,
  ClipboardList,
  Factory,
  Package,
  Wallet,
  CheckCircle2,
  Shield,
  Leaf,
  Building,
  ChevronDown,
  ChevronRight,
  LogOut,
  HardHat,
  Home,
  Search,
  TrendingUp,
  FolderOpen,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { logout } from '@/services/api/authApi';

// Tipos
interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

interface SubSection {
  id: string;
  title: string;
  icon: React.ElementType;
  items: MenuItem[];
}

interface MenuGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  items?: MenuItem[];
  subSections?: SubSection[];
  defaultOpen?: boolean;
}

interface MenuCategory {
  id: string;
  label: string;
  groups: MenuGroup[];
}

interface SidebarProps {
  obraAtiva?: {
    id: string;
    codigo: string;
    nome: string;
    cliente: string;
    status: string;
  };
}

export default function Sidebar({ obraAtiva }: SidebarProps) {
  const pathname = usePathname() || '';
  const { colors } = useTheme();
  
  // Estado para controlar grupos expandidos
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'intranet': true,
  });

  // Estado para controlar subseções expandidas
  const [expandedSubSections, setExpandedSubSections] = useState<Record<string, boolean>>({});

  // Dados padrão da obra ativa
  const obra = obraAtiva || {
    id: '',
    codigo: 'BR-101-LOTE 2',
    nome: 'Duplicação Rodovia BR-101 - Lote 2',
    cliente: 'DNIT',
    status: 'Em Andamento',
  };

  // Toggle de grupo
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Toggle de subseção
  const toggleSubSection = (subSectionId: string) => {
    setExpandedSubSections(prev => ({
      ...prev,
      [subSectionId]: !prev[subSectionId],
    }));
  };

  // Estrutura do menu organizada por categorias
  const menuCategories: MenuCategory[] = [
    {
      id: 'comum',
      label: 'COMUM',
      groups: [
        {
          id: 'intranet',
          title: 'Intranet',
          icon: Home,
          defaultOpen: true,
          items: [
            { name: 'Dashboard da Obra', icon: Building2, path: '/' },
            { name: 'Comunicados', icon: MessageSquare, path: '/comunicados', badge: 2 },
            { name: 'Minhas Tarefas', icon: ListTodo, path: '/tarefas', badge: 5 },
            { name: 'Agenda', icon: Calendar, path: '/agenda' },
            { name: 'Alertas de Gates', icon: AlertTriangle, path: '/alertas-gates' },
            { name: 'Assistente IA', icon: Bot, path: '/assistente' },
          ],
        },
      ],
    },
    {
      id: 'corporativo',
      label: 'MÓDULO CORPORATIVO',
      groups: [
        {
          id: 'corporativo',
          title: 'Corporativo',
          icon: Briefcase,
          items: [
            { name: 'Clientes', icon: Users, path: '/corporativo/clientes' },
            { name: 'Contratos', icon: FileText, path: '/corporativo/contratos' },
            { name: 'Portfólio de Obras', icon: Building2, path: '/corporativo/portfolio' },
            { name: 'Homologações', icon: CheckCircle2, path: '/corporativo/homologacoes' },
          ],
        },
        {
          id: 'obras',
          title: 'Gestão de Obras',
          icon: HardHat,
          items: [
            { name: 'Todas as Obras', icon: Building2, path: '/obras' },
          ],
        },
      ],
    },
    {
      id: 'departamentos',
      label: 'DEPARTAMENTOS DA OBRA',
      groups: [
        {
          id: 'comercial',
          title: 'Comercial',
          icon: DollarSign,
          subSections: [
            {
              id: 'estruturacao',
              title: 'Estruturação',
              icon: FileSpreadsheet,
              items: [
                { name: 'Estruturação (EAP)', icon: FileSpreadsheet, path: '/comercial/estruturacao' },
              ],
            },
            {
              id: 'receita',
              title: 'Receita',
              icon: TrendingUp,
              items: [
                { name: 'Medição Produção (MP)', icon: ClipboardList, path: '/comercial/medicao-mp' },
                { name: 'Medição Cliente (MC)', icon: DollarSign, path: '/comercial/medicao-mc' },
                { name: 'Comparativo MP x MC', icon: ArrowLeftRight, path: '/comercial/comparativo' },
                { name: 'Aditivos', icon: FilePlus, path: '/comercial/aditivos' },
                { name: 'Glosas', icon: FileX, path: '/comercial/glosas' },
                { name: 'Faturamento', icon: Receipt, path: '/comercial/faturamento' },
              ],
            },
            {
              id: 'suprimentos',
              title: 'Suprimentos',
              icon: Package,
              items: [
                { name: 'Requisições', icon: FileText, path: '/suprimentos/requisicoes' },
                { name: 'Pedidos de Compra', icon: Package, path: '/suprimentos/pedidos' },
                { name: 'Controle de Estoque', icon: Package, path: '/suprimentos/estoque' },
              ],
            },
            {
              id: 'custos',
              title: 'Custos',
              icon: Wallet,
              items: [
                { name: 'Apropriação', icon: Wallet, path: '/custos/apropriacao' },
                { name: 'Análise de Desvios', icon: ArrowLeftRight, path: '/custos/desvios' },
              ],
            },
          ],
        },
        {
          id: 'engenharia',
          title: 'Engenharia',
          icon: Wrench,
          items: [
            { name: 'Projetos', icon: FileText, path: '/engenharia/projetos' },
            { name: 'Métodos Construtivos', icon: Wrench, path: '/engenharia/metodos' },
          ],
        },
        {
          id: 'planejamento',
          title: 'Planejamento',
          icon: Calendar,
          items: [
            { name: 'Cronograma', icon: Calendar, path: '/planejamento/cronograma' },
            { name: 'Avanço Físico', icon: ClipboardList, path: '/planejamento/avanco' },
            { name: 'Fechamento Mensal', icon: CheckCircle2, path: '/planejamento/fechamento' },
          ],
        },
        {
          id: 'producao',
          title: 'Produção',
          icon: Factory,
          items: [
            { name: 'Diário de Obra', icon: FileText, path: '/producao/diario' },
            { name: 'Apontamentos', icon: ClipboardList, path: '/producao/apontamentos' },
            { name: 'Equipamentos', icon: Factory, path: '/producao/equipamentos' },
          ],
        },
        {
          id: 'qualidade',
          title: 'Qualidade',
          icon: CheckCircle2,
          items: [
            { name: 'Inspeções', icon: CheckCircle2, path: '/qualidade/inspecoes' },
            { name: 'Não Conformidades', icon: AlertTriangle, path: '/qualidade/nao-conformidades' },
            { name: 'Ensaios', icon: FileText, path: '/qualidade/ensaios' },
          ],
        },
        {
          id: 'ssma',
          title: 'SSMA',
          icon: Shield,
          items: [
            { name: 'Segurança', icon: Shield, path: '/ssma/seguranca' },
            { name: 'Incidentes', icon: AlertTriangle, path: '/ssma/incidentes' },
            { name: 'Treinamentos', icon: Users, path: '/ssma/treinamentos' },
          ],
        },
        {
          id: 'meio-ambiente',
          title: 'Meio Ambiente',
          icon: Leaf,
          items: [
            { name: 'Licenças', icon: FileText, path: '/meio-ambiente/licencas' },
            { name: 'Monitoramento', icon: Leaf, path: '/meio-ambiente/monitoramento' },
          ],
        },
        {
          id: 'administrativo',
          title: 'Administrativo',
          icon: Building,
          items: [
            { name: 'RH / Pessoal', icon: Users, path: '/administrativo/rh' },
            { name: 'Patrimônio', icon: Building, path: '/administrativo/patrimonio' },
            { name: 'Documentos', icon: FileText, path: '/administrativo/documentos' },
          ],
        },
      ],
    },
  ];

  // Verifica se um item está ativo
  const isItemActive = (path: string): boolean => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  // Verifica se um grupo tem item ativo
  const hasActiveItem = (group: MenuGroup): boolean => {
    if (group.items) {
      return group.items.some(item => isItemActive(item.path));
    }
    if (group.subSections) {
      return group.subSections.some(sub => 
        sub.items.some(item => isItemActive(item.path))
      );
    }
    return false;
  };

  // Verifica se uma subseção tem item ativo
  const hasActiveSubSection = (subSection: SubSection): boolean => {
    return subSection.items.some(item => isItemActive(item.path));
  };

  // Renderiza um item de menu
  const renderMenuItem = (item: MenuItem, indent: number = 0) => {
    const isActive = isItemActive(item.path);
    const Icon = item.icon;

    return (
      <Link
        key={item.path}
        href={item.path}
        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200"
        style={{
          marginLeft: indent > 0 ? `${indent * 8}px` : 0,
          backgroundColor: isActive ? `${colors.accent}15` : 'transparent',
          color: isActive ? colors.accent : colors.textSecondary,
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
            e.currentTarget.style.color = colors.textSecondary;
          }
        }}
      >
        <div className="flex items-center gap-3">
          <Icon size={16} style={{ opacity: isActive ? 1 : 0.7 }} />
          <span>{item.name}</span>
        </div>
        {item.badge && (
          <span 
            className="px-2 py-0.5 text-xs font-semibold rounded-full"
            style={{ backgroundColor: colors.accent, color: '#FFFFFF' }}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  // Renderiza uma subseção (para o Comercial)
  const renderSubSection = (subSection: SubSection) => {
    const isExpanded = expandedSubSections[subSection.id];
    const hasActive = hasActiveSubSection(subSection);
    const Icon = subSection.icon;

    return (
      <div key={subSection.id} className="mb-1">
        <button
          onClick={() => toggleSubSection(subSection.id)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200"
          style={{
            backgroundColor: hasActive && !isExpanded ? `${colors.accent}10` : 'transparent',
            color: hasActive ? colors.accent : colors.textSecondary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.bgCardHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = hasActive && !isExpanded ? `${colors.accent}10` : 'transparent';
          }}
        >
          <div className="flex items-center gap-3">
            <Icon size={16} style={{ color: hasActive ? colors.accent : colors.textMuted }} />
            <span className="font-medium">{subSection.title}</span>
          </div>
          {isExpanded ? (
            <ChevronDown size={14} style={{ color: colors.textMuted }} />
          ) : (
            <ChevronRight size={14} style={{ color: colors.textMuted }} />
          )}
        </button>

        {isExpanded && (
          <div 
            className="ml-4 mt-1 pl-3 space-y-0.5 border-l"
            style={{ borderColor: hasActive ? colors.accent : colors.borderPrimary }}
          >
            {subSection.items.map(item => renderMenuItem(item, 0))}
          </div>
        )}
      </div>
    );
  };

  // Renderiza um grupo de menu
  const renderMenuGroup = (group: MenuGroup) => {
    const isExpanded = expandedGroups[group.id];
    const hasActive = hasActiveItem(group);
    const Icon = group.icon;

    return (
      <div key={group.id} className="mb-1">
        <button
          onClick={() => toggleGroup(group.id)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{
            backgroundColor: hasActive && !isExpanded ? `${colors.accent}10` : 'transparent',
            color: hasActive ? colors.accent : colors.textPrimary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.bgCardHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = hasActive && !isExpanded ? `${colors.accent}10` : 'transparent';
          }}
        >
          <div className="flex items-center gap-3">
            <Icon size={18} style={{ color: hasActive ? colors.accent : colors.textMuted }} />
            <span>{group.title}</span>
          </div>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown size={16} style={{ color: colors.textMuted }} />
            ) : (
              <ChevronRight size={16} style={{ color: colors.textMuted }} />
            )}
          </div>
        </button>

        {/* Itens ou Subseções do grupo */}
        {isExpanded && (
          <div 
            className="ml-3 mt-1 pl-3 space-y-0.5 border-l-2"
            style={{ borderColor: hasActive ? colors.accent : colors.borderPrimary }}
          >
            {group.items && group.items.map(item => renderMenuItem(item))}
            {group.subSections && group.subSections.map(sub => renderSubSection(sub))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside 
      className="w-64 flex flex-col h-screen border-r transition-colors duration-200"
      style={{ 
        backgroundColor: colors.topbarBg, // Mesmo fundo do Topbar (claro)
        borderColor: colors.borderPrimary 
      }}
    >
      {/* Cabeçalho Compacto - Logo + Obra */}
      <div 
        className="p-4 border-b"
        style={{ borderColor: colors.borderPrimary }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.accent }}
          >
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div className="flex items-baseline">
            <span style={{ color: colors.accent }} className="font-bold text-lg">G</span>
            <span style={{ color: colors.textPrimary }} className="font-bold text-lg">ENESIS</span>
          </div>
        </div>

        {/* Obra Ativa - Compacta */}
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: colors.bgCardHover }}
        >
          <div className="flex items-center justify-between mb-1">
            <span 
              className="text-xs font-semibold px-2 py-0.5 rounded"
              style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
            >
              {obra.codigo}
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded"
              style={{ 
                backgroundColor: obra.status === 'Em Andamento' ? '#10B98120' : colors.bgCard,
                color: obra.status === 'Em Andamento' ? '#10B981' : colors.textMuted 
              }}
            >
              {obra.status === 'Em Andamento' ? 'Ativo' : obra.status}
            </span>
          </div>
          <p 
            className="text-sm font-medium truncate"
            style={{ color: colors.textPrimary }}
            title={obra.nome}
          >
            {obra.nome}
          </p>
        </div>
      </div>

      {/* Busca Rápida */}
      <div className="px-4 py-3">
        <div 
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: colors.bgCardHover }}
        >
          <Search size={16} style={{ color: colors.textMuted }} />
          <input
            type="text"
            placeholder="Buscar no menu..."
            className="bg-transparent text-sm flex-1 outline-none"
            style={{ color: colors.textPrimary }}
          />
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {menuCategories.map(category => (
          <div key={category.id} className="mb-4">
            {/* Título da Categoria */}
            <div 
              className="px-3 py-2 text-xs font-bold tracking-wider"
              style={{ color: colors.textMuted }}
            >
              {category.label}
            </div>
            
            {/* Grupos da Categoria */}
            {category.groups.map(group => renderMenuGroup(group))}
          </div>
        ))}
      </nav>

      {/* Rodapé - Logout */}
      <div 
        className="p-3 border-t"
        style={{ borderColor: colors.borderPrimary }}
      >
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-all duration-200"
          style={{ color: colors.textMuted }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#EF444420';
            e.currentTarget.style.color = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = colors.textMuted;
          }}
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
