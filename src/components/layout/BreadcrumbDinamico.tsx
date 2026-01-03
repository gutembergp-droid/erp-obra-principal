'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

// Mapeamento de slugs para nomes amigáveis
const slugToLabel: Record<string, string> = {
  // Módulos principais
  'suprimentos': 'Suprimentos',
  'financeiro': 'Financeiro',
  'rh': 'RH',
  'comercial': 'Comercial',
  'engenharia': 'Engenharia',
  'producao': 'Produção',
  'planejamento': 'Planejamento',
  'qualidade': 'Qualidade',
  'ssma': 'SSMA',
  'custos': 'Custos',
  'administrativo': 'Administrativo',
  'corporativo': 'Corporativo',
  'obras': 'Obras',
  'intranet': 'Intranet',
  
  // Sub-páginas Suprimentos
  'requisicoes': 'Requisições',
  'cotacoes': 'Cotações',
  'pedidos': 'Pedidos de Compra',
  'estoque': 'Controle de Estoque',
  'fornecedores': 'Fornecedores',
  'recebimento': 'Recebimento',
  
  // Sub-páginas Financeiro
  'contas-pagar': 'Contas a Pagar',
  'contas-receber': 'Contas a Receber',
  'fluxo-caixa': 'Fluxo de Caixa',
  'conciliacao': 'Conciliação Bancária',
  'orcamento': 'Orçamento',
  'relatorios': 'Relatórios',
  
  // Sub-páginas RH
  'colaboradores': 'Colaboradores',
  'folha-pagamento': 'Folha de Pagamento',
  'ferias': 'Férias',
  'beneficios': 'Benefícios',
  'ponto': 'Controle de Ponto',
  'recrutamento': 'Recrutamento',
  
  // Sub-páginas Comercial
  'medicao-mp': 'Medição Produção',
  'medicao-mc': 'Medição Cliente',
  'comparativo': 'Comparativo MP x MC',
  'aditivos': 'Aditivos',
  'glosas': 'Glosas',
  'faturamento': 'Faturamento',
  
  // Ações comuns
  'detalhe': 'Detalhe',
  'novo': 'Novo',
  'editar': 'Editar',
  'visualizar': 'Visualizar',
  'historico': 'Histórico',
  'aprovacao': 'Aprovação',
};

// Função para formatar o texto do segmento
const formatarSegmento = (segmento: string): string => {
  // Se existe no mapeamento, usa o label
  if (slugToLabel[segmento.toLowerCase()]) {
    return slugToLabel[segmento.toLowerCase()];
  }
  
  // Se parece ser um ID (começa com letras e tem números), mantém como está
  if (/^[A-Z]{2,4}-\d+$/i.test(segmento)) {
    return segmento.toUpperCase();
  }
  
  // Se é um número puro (ID numérico), mantém como está
  if (/^\d+$/.test(segmento)) {
    return `#${segmento}`;
  }
  
  // Caso contrário, formata o slug para título
  return segmento
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
  isDynamic: boolean; // Indica se é um parâmetro dinâmico (ID, etc)
}

interface BreadcrumbDinamicoProps {
  showHomeIcon?: boolean;
  maxItems?: number; // Máximo de itens antes de colapsar
  separator?: 'slash' | 'chevron';
}

export default function BreadcrumbDinamico({
  showHomeIcon = false,
  maxItems = 4,
  separator = 'slash',
}: BreadcrumbDinamicoProps) {
  const pathname = usePathname();
  const { colors } = useTheme();
  
  // Se estiver na home, não exibe breadcrumb
  if (!pathname || pathname === '/') {
    return (
      <nav className="flex items-center gap-2 text-sm">
        <span className="font-semibold" style={{ color: colors.accent }}>Intranet</span>
        <span style={{ color: colors.textMuted }}>/</span>
        <span className="font-medium" style={{ color: colors.textPrimary }}>Dashboard da Obra</span>
      </nav>
    );
  }
  
  // Divide o pathname em segmentos
  const segmentos = pathname.split('/').filter(Boolean);
  
  // Gera os itens do breadcrumb
  const items: BreadcrumbItem[] = segmentos.map((segmento, index) => {
    const href = '/' + segmentos.slice(0, index + 1).join('/');
    const isLast = index === segmentos.length - 1;
    const isDynamic = /^[A-Z]{2,4}-\d+$/i.test(segmento) || /^\d+$/.test(segmento);
    
    return {
      label: formatarSegmento(segmento),
      href,
      isLast,
      isDynamic,
    };
  });
  
  // Se tiver mais itens que o máximo, colapsa os do meio
  const shouldCollapse = items.length > maxItems;
  let displayItems = items;
  
  if (shouldCollapse) {
    // Mantém o primeiro, último e penúltimo, colapsa o resto
    displayItems = [
      items[0],
      { label: '...', href: '#', isLast: false, isDynamic: false },
      ...items.slice(-2),
    ];
  }
  
  const Separator = () => (
    separator === 'chevron' ? (
      <ChevronRight size={14} style={{ color: colors.textMuted }} />
    ) : (
      <span style={{ color: colors.textMuted }}>/</span>
    )
  );
  
  return (
    <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      {showHomeIcon && (
        <>
          <Link 
            href="/"
            className="flex items-center justify-center w-6 h-6 rounded transition-colors hover:bg-opacity-10"
            style={{ color: colors.textMuted }}
            title="Página Inicial"
          >
            <Home size={16} />
          </Link>
          <Separator />
        </>
      )}
      
      {displayItems.map((item, index) => (
        <React.Fragment key={item.href + index}>
          {index > 0 && <Separator />}
          
          {item.label === '...' ? (
            <span 
              className="px-1"
              style={{ color: colors.textMuted }}
              title="Níveis intermediários"
            >
              {item.label}
            </span>
          ) : item.isLast ? (
            <span 
              className="font-medium"
              style={{ 
                color: item.isDynamic ? colors.accent : colors.textPrimary,
                fontFamily: item.isDynamic ? 'monospace' : 'inherit',
              }}
            >
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="font-semibold transition-colors hover:underline"
              style={{ 
                color: index === 0 ? colors.accent : colors.textSecondary,
              }}
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// Exporta também uma versão compacta para uso em espaços menores
export function BreadcrumbCompacto() {
  const pathname = usePathname();
  const { colors } = useTheme();
  
  if (!pathname || pathname === '/') {
    return <span style={{ color: colors.textPrimary }}>Dashboard</span>;
  }
  
  const segmentos = pathname.split('/').filter(Boolean);
  const ultimoSegmento = segmentos[segmentos.length - 1];
  
  return (
    <span 
      className="font-medium text-sm"
      style={{ color: colors.textPrimary }}
    >
      {formatarSegmento(ultimoSegmento)}
    </span>
  );
}
