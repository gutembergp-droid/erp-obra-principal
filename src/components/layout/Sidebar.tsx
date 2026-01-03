'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  HardHat,
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
} from 'lucide-react';
import { logout } from '@/services/api/authApi';

// Tipos
interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
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
  const pathname = usePathname();
  
  // Estado para controlar seções expandidas
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'INTRANET / COMUM': true,
    'COMERCIAL DA OBRA': true,
  });

  // Estado para controlar submenus expandidos
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  // Dados padrão da obra ativa
  const obra = obraAtiva || {
    id: '',
    codigo: 'SEM-OBRA',
    nome: 'Selecione uma Obra',
    cliente: '-',
    status: 'Inativo',
  };

  // Toggle de seção
  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Toggle de submenu
  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Estrutura do menu conforme Memorial Descritivo
  const menuSections: MenuSection[] = [
    {
      title: 'INTRANET / COMUM',
      items: [
        { name: 'Dashboard Corporativo', icon: <LayoutDashboard size={18} />, path: '/dashboard-corporativo' },
        { name: 'Dashboard da Obra', icon: <Building2 size={18} />, path: '/' },
        { name: 'Comunicados', icon: <MessageSquare size={18} />, path: '/comunicados', badge: 2 },
        { name: 'Minhas Tarefas', icon: <ListTodo size={18} />, path: '/tarefas', badge: 5 },
        { name: 'Agenda', icon: <Calendar size={18} />, path: '/agenda' },
        { name: 'Alertas de Gates', icon: <AlertTriangle size={18} />, path: '/alertas-gates' },
        { name: 'Assistente IA', icon: <Bot size={18} />, path: '/assistente' },
      ],
    },
    {
      title: 'MÓDULO CORPORATIVO',
      items: [
        { name: 'Clientes', icon: <Users size={18} />, path: '/corporativo/clientes' },
        { name: 'Contratos', icon: <FileText size={18} />, path: '/corporativo/contratos' },
        { name: 'Portfólio de Obras', icon: <Briefcase size={18} />, path: '/corporativo/portfolio' },
        { name: 'Homologações', icon: <CheckCircle2 size={18} />, path: '/corporativo/homologacoes' },
      ],
    },
    {
      title: 'OBRAS',
      items: [
        { name: 'Gestão de Obras', icon: <HardHat size={18} />, path: '/obras' },
      ],
    },
    {
      title: 'COMERCIAL DA OBRA',
      items: [
        { 
          name: 'Estruturação (EAP)', 
          icon: <FileSpreadsheet size={18} />, 
          path: '/comercial/estruturacao',
          submenu: [
            { name: 'Baseline Comercial', path: '/comercial/baseline' },
          ],
        },
        { name: 'Medição Produção (MP)', icon: <ClipboardList size={18} />, path: '/comercial/medicao-mp' },
        { name: 'Medição Cliente (MC)', icon: <DollarSign size={18} />, path: '/comercial/medicao-mc' },
        { name: 'Comparativo MP x MC', icon: <ArrowLeftRight size={18} />, path: '/comercial/comparativo' },
        { name: 'Aditivos', icon: <FilePlus size={18} />, path: '/comercial/aditivos' },
        { name: 'Glosas', icon: <FileX size={18} />, path: '/comercial/glosas' },
        { name: 'Faturamento', icon: <Receipt size={18} />, path: '/comercial/faturamento' },
      ],
    },
    {
      title: 'ENGENHARIA',
      items: [
        { name: 'Projetos', icon: <FileText size={18} />, path: '/engenharia/projetos' },
        { name: 'Métodos Construtivos', icon: <Wrench size={18} />, path: '/engenharia/metodos' },
      ],
    },
    {
      title: 'PLANEJAMENTO & CONTROLE',
      items: [
        { name: 'Cronograma', icon: <Calendar size={18} />, path: '/planejamento/cronograma' },
        { name: 'Avanço Físico', icon: <ClipboardList size={18} />, path: '/planejamento/avanco' },
        { name: 'Fechamento Mensal', icon: <CheckCircle2 size={18} />, path: '/planejamento/fechamento' },
      ],
    },
    {
      title: 'PRODUÇÃO',
      items: [
        { name: 'Diário de Obra', icon: <FileText size={18} />, path: '/producao/diario' },
        { name: 'Apontamentos', icon: <ClipboardList size={18} />, path: '/producao/apontamentos' },
        { name: 'Equipamentos', icon: <Factory size={18} />, path: '/producao/equipamentos' },
      ],
    },
    {
      title: 'SUPRIMENTOS',
      items: [
        { name: 'Requisições', icon: <FileText size={18} />, path: '/suprimentos/requisicoes' },
        { name: 'Pedidos de Compra', icon: <Package size={18} />, path: '/suprimentos/pedidos' },
        { name: 'Controle de Estoque', icon: <Package size={18} />, path: '/suprimentos/estoque' },
      ],
    },
    {
      title: 'CUSTOS',
      items: [
        { name: 'Apropriação de Custos', icon: <Wallet size={18} />, path: '/custos/apropriacao' },
        { name: 'Análise de Desvios', icon: <ArrowLeftRight size={18} />, path: '/custos/desvios' },
      ],
    },
    {
      title: 'QUALIDADE',
      items: [
        { name: 'Inspeções', icon: <CheckCircle2 size={18} />, path: '/qualidade/inspecoes' },
        { name: 'Não Conformidades', icon: <AlertTriangle size={18} />, path: '/qualidade/nao-conformidades' },
        { name: 'Ensaios', icon: <FileText size={18} />, path: '/qualidade/ensaios' },
      ],
    },
    {
      title: 'SSMA',
      items: [
        { name: 'Segurança do Trabalho', icon: <Shield size={18} />, path: '/ssma/seguranca' },
        { name: 'Incidentes', icon: <AlertTriangle size={18} />, path: '/ssma/incidentes' },
        { name: 'Treinamentos', icon: <Users size={18} />, path: '/ssma/treinamentos' },
      ],
    },
    {
      title: 'MEIO AMBIENTE',
      items: [
        { name: 'Licenças', icon: <FileText size={18} />, path: '/meio-ambiente/licencas' },
        { name: 'Monitoramento', icon: <Leaf size={18} />, path: '/meio-ambiente/monitoramento' },
      ],
    },
    {
      title: 'DEPTO. ADMINISTRATIVO',
      items: [
        { name: 'RH / Pessoal', icon: <Users size={18} />, path: '/administrativo/rh' },
        { name: 'Patrimônio', icon: <Building size={18} />, path: '/administrativo/patrimonio' },
        { name: 'Documentos', icon: <FileText size={18} />, path: '/administrativo/documentos' },
      ],
    },
  ];

  // Verifica se um item está ativo
  const isItemActive = (item: MenuItem): boolean => {
    if (pathname === item.path) return true;
    if (item.submenu) {
      return item.submenu.some(sub => pathname === sub.path);
    }
    return false;
  };

  // Renderiza um item de menu
  const renderMenuItem = (item: MenuItem) => {
    const isActive = isItemActive(item);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.name];

    if (hasSubmenu) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMenu(item.name)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
              isActive
                ? 'bg-red-900/30 text-red-400'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={isActive ? 'text-red-400' : 'text-gray-500'}>{item.icon}</span>
              <span>{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs rounded-full">
                  {item.badge}
                </span>
              )}
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          </button>
          {isExpanded && (
            <div className="ml-6 mt-1 space-y-1 border-l border-gray-700 pl-3">
              {item.submenu!.map(sub => (
                <Link
                  key={sub.path}
                  href={sub.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    pathname === sub.path
                      ? 'text-red-400 bg-red-900/20'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {sub.icon && <span>{sub.icon}</span>}
                  <span>{sub.name}</span>
                  {sub.badge && (
                    <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs rounded-full">
                      {sub.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        href={item.path}
        className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
          isActive
            ? 'bg-red-900/30 text-red-400'
            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={isActive ? 'text-red-400' : 'text-gray-500'}>{item.icon}</span>
          <span>{item.name}</span>
        </div>
        {item.badge && (
          <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen">
      {/* Cabeçalho - Logo e Obra Ativa */}
      <div className="p-4 border-b border-gray-800">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-red-700 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div>
            <span className="text-red-500 font-bold text-lg">G</span>
            <span className="text-white font-bold text-lg">ENESIS</span>
          </div>
        </div>

        {/* Obra Ativa */}
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-500 text-xs mb-1">{obra.codigo}</p>
          <p className="text-white font-medium text-sm truncate">{obra.nome}</p>
          <p className="text-gray-500 text-xs truncate mt-1">{obra.cliente}</p>
          <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
            obra.status === 'em_andamento' || obra.status === 'Em Andamento'
              ? 'bg-green-900/50 text-green-400'
              : obra.status === 'planejamento'
              ? 'bg-yellow-900/50 text-yellow-400'
              : 'bg-gray-700 text-gray-400'
          }`}>
            {obra.status === 'em_andamento' ? 'Em Execução' : obra.status}
          </span>
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 overflow-y-auto p-2">
        {menuSections.map(section => {
          const isExpanded = expandedSections[section.title] !== false;
          
          return (
            <div key={section.title} className="mb-2">
              {/* Título da Seção */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300"
              >
                <span>{section.title}</span>
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>

              {/* Itens da Seção */}
              {isExpanded && (
                <div className="space-y-0.5">
                  {section.items.map(item => renderMenuItem(item))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Rodapé - Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2 w-full text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-md transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
}
