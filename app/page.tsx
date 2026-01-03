"use client"

import { useState, useEffect, useCallback } from "react"
import { Clock, CheckCircle, Bell, ListTodo, Eye, Check, X, FileCheck, ShoppingCart, Receipt, FileText, Megaphone, AlertTriangle, Calendar, ChevronLeft, ChevronRight, Circle, Loader2 } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

// ============================================================================
// TIPOS
// ============================================================================

interface Tarefa {
  id: string
  tipo: string
  titulo: string
  solicitante: string
  departamento: string
  valor: number | null
  prazo: string
  prioridade: string
}

interface ComunicadoAPI {
  id: string
  titulo: string
  conteudo: string
  escopo: string
  prioridade: string
  status: string
  categoria: string | null
  setor_origem: string | null
  obra_id: string | null
  fixado: boolean
  exige_confirmacao: boolean
  publicado_em: string | null
  autor: {
    id: string
    nome: string
  }
  confirmacoes_leitura?: Array<{ usuario_id: string }>
  _count?: {
    confirmacoes_leitura: number
  }
}

interface Comunicado {
  id: string
  tipo: string
  titulo: string
  conteudo: string
  autor: string
  data: string
  lido: boolean
  prioridade: string
  exigeConfirmacao: boolean
}

interface Marco {
  id: string
  titulo: string
  data: string
  tipo: string
  concluido: boolean
}

// ============================================================================
// DADOS MOCK
// ============================================================================

const tarefasMock: Tarefa[] = [
  {
    id: "1",
    tipo: "aprovacao",
    titulo: "Aprovação de BDI - Duplicação BR-101",
    solicitante: "Carlos Mendes",
    departamento: "Comercial",
    valor: 119700000,
    prazo: "2025-01-15",
    prioridade: "alta",
  },
  {
    id: "2",
    tipo: "requisicao",
    titulo: "Requisição de Compra - Aço CA-50",
    solicitante: "Roberto Silva",
    departamento: "Suprimentos",
    valor: 15750000,
    prazo: "2025-01-20",
    prioridade: "urgente",
  },
  {
    id: "3",
    tipo: "medicao",
    titulo: "Medição #01 - Mobilização",
    solicitante: "Ana Paula Costa",
    departamento: "Comercial",
    valor: 8400000,
    prazo: "2025-02-05",
    prioridade: "alta",
  },
  {
    id: "4",
    tipo: "documento",
    titulo: "Revisão de Contrato - Aditivo Prazo",
    solicitante: "Mariana Lopes",
    departamento: "Jurídico",
    valor: null,
    prazo: "2025-02-01",
    prioridade: "media",
  },
  {
    id: "5",
    tipo: "aprovacao",
    titulo: "Aprovação de Subcontrato - Fundações",
    solicitante: "Pedro Augusto",
    departamento: "Engenharia",
    valor: 32000000,
    prazo: "2025-01-25",
    prioridade: "alta",
  },
]

const marcosMock: Marco[] = [
  { id: "1", titulo: "Início da Mobilização", data: "2025-01-15", tipo: "marco", concluido: false },
  { id: "2", titulo: "Medição #01", data: "2025-02-05", tipo: "medicao", concluido: false },
  { id: "3", titulo: "Início Fundações", data: "2025-02-15", tipo: "entrega", concluido: false },
  { id: "4", titulo: "Medição #02", data: "2025-03-05", tipo: "medicao", concluido: false },
  { id: "5", titulo: "Reunião de Acompanhamento", data: "2025-03-15", tipo: "reuniao", concluido: false },
]

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100)
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("pt-BR")
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "")
}

function mapPrioridadeToTipo(prioridade: string): string {
  switch (prioridade) {
    case 'urgente':
    case 'critico':
      return 'urgente'
    case 'normal':
    default:
      return 'info'
  }
}

// ============================================================================
// COMPONENTE PRINCIPAL - INTRANET
// ============================================================================

export default function IntranetPage() {
  const { colors, theme } = useTheme()
  const [mesAtual, setMesAtual] = useState(new Date(2025, 0, 1))
  const [tarefas] = useState<Tarefa[]>(tarefasMock)
  const [comunicados, setComunicados] = useState<Comunicado[]>([])
  const [marcos] = useState<Marco[]>(marcosMock)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComunicados = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const obraAtivaStr = localStorage.getItem('obraAtiva')
      const obraAtiva = obraAtivaStr ? JSON.parse(obraAtivaStr) : null
      const obraId = obraAtiva?.id || ''
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/comunicados/intranet?obra_id=${obraId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Erro ao buscar comunicados')
      }
      
      const data = await response.json()
      const todosComunicados: ComunicadoAPI[] = data.todos || []
      const comunicadosMapeados: Comunicado[] = todosComunicados.map((c: ComunicadoAPI) => ({
        id: c.id,
        tipo: mapPrioridadeToTipo(c.prioridade),
        titulo: c.titulo,
        conteudo: c.conteudo,
        autor: c.setor_origem || c.autor?.nome || 'Sistema',
        data: c.publicado_em || new Date().toISOString(),
        lido: Boolean(c.confirmacoes_leitura && c.confirmacoes_leitura.length > 0),
        prioridade: c.prioridade,
        exigeConfirmacao: c.exige_confirmacao
      }))
      
      setComunicados(comunicadosMapeados)
    } catch (err) {
      console.error('Erro ao buscar comunicados:', err)
      setError('Não foi possível carregar os comunicados')
      setComunicados([
        {
          id: "1",
          tipo: "info",
          titulo: "Início das Operações - Duplicação BR-101",
          conteudo: "Comunicamos o início oficial das operações da obra Duplicação BR-101 - Lote 2 a partir de 15/01/2025.",
          autor: "Diretoria de Operações",
          data: "2025-01-10",
          lido: false,
          prioridade: "normal",
          exigeConfirmacao: true
        },
        {
          id: "2",
          tipo: "urgente",
          titulo: "URGENTE: Prazo para Estruturação Comercial (Gate 1)",
          conteudo: "Lembramos que o prazo para conclusão da estruturação comercial (Gate 1) é 31/01/2025.",
          autor: "Gerência Comercial",
          data: "2025-01-15",
          lido: false,
          prioridade: "urgente",
          exigeConfirmacao: true
        },
        {
          id: "3",
          tipo: "info",
          titulo: "Treinamento Sistema GENESIS",
          conteudo: "Será realizado treinamento do módulo Comercial do GENESIS nos dias 20 e 21/01.",
          autor: "TI Corporativo",
          data: "2025-01-12",
          lido: true,
          prioridade: "normal",
          exigeConfirmacao: false
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchComunicados()
  }, [fetchComunicados])

  const stats = {
    tarefasPendentes: tarefas.length,
    tarefasConcluidas: 0,
    comunicadosNaoLidos: comunicados.filter((c) => !c.lido).length,
    comunicadosTotal: comunicados.length,
    marcosPendentes: marcos.filter((m) => !m.concluido).length,
  }

  const nomeMes = mesAtual.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })

  const navegarMes = (direcao: number) => {
    setMesAtual((prev) => new Date(prev.getFullYear(), prev.getMonth() + direcao, 1))
  }

  const marcosDoMes = marcos.filter((m) => {
    const dataMarco = new Date(m.data + "T00:00:00")
    return dataMarco.getMonth() === mesAtual.getMonth() && dataMarco.getFullYear() === mesAtual.getFullYear()
  })

  const tipoIcons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
    aprovacao: FileCheck,
    requisicao: ShoppingCart,
    medicao: Receipt,
    documento: FileText,
    contrato: FileText,
  }

  // Cores de prioridade baseadas no tema
  const getPrioridadeStyle = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente':
        return { backgroundColor: colors.errorBg, color: colors.error, border: `1px solid ${colors.error}30` }
      case 'alta':
        return { backgroundColor: colors.warningBg, color: colors.warning, border: `1px solid ${colors.warning}30` }
      case 'media':
        return { backgroundColor: colors.warningBg, color: colors.warning, border: `1px solid ${colors.warning}30` }
      case 'baixa':
        return { backgroundColor: colors.bgCardHover, color: colors.textMuted, border: `1px solid ${colors.borderSecondary}` }
      default:
        return { backgroundColor: colors.infoBg, color: colors.info, border: `1px solid ${colors.info}30` }
    }
  }

  const tipoMarcoColors: Record<string, string> = {
    medicao: colors.success,
    entrega: colors.info,
    marco: colors.warning,
    reuniao: theme === 'vibrant' ? '#A855F7' : '#8B5CF6',
  }

  const marcarComoLido = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/comunicados/${id}/confirmar-leitura`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      })
      setComunicados(prev => prev.map(c => c.id === id ? { ...c, lido: true } : c))
    } catch (err) {
      console.error('Erro ao confirmar leitura:', err)
      setComunicados(prev => prev.map(c => c.id === id ? { ...c, lido: true } : c))
    }
  }

  // Altura fixa para os cards de Comunicados e Fila de Trabalho
  const cardHeight = "min-h-[320px]"

  // O espaçamento uniforme (32px) é aplicado no MainLayout
  // Aqui apenas definimos o gap entre os cards (também 32px para uniformidade)

  return (
    <div className="min-h-full transition-colors duration-200">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.textPrimary }}>Intranet</h1>
        <p className="text-sm mt-1" style={{ color: colors.textMuted }}>Visão geral da obra e tarefas pendentes</p>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda - Comunicados + Fila de Trabalho */}
        <div className="lg:col-span-8 space-y-32">
          
          {/* Card de Comunicados */}
          <div 
            className={`rounded-lg border ${cardHeight} transition-colors duration-200`}
            style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
          >
            <div 
              className="px-5 py-4 border-b flex items-center justify-between"
              style={{ borderColor: colors.borderPrimary }}
            >
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5" style={{ color: colors.textMuted }} />
                <h2 className="text-base font-semibold" style={{ color: colors.textPrimary }}>Comunicados</h2>
              </div>
              {/* KPIs integrados no header */}
              <div className="flex items-center gap-3">
                <div 
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                  style={{ backgroundColor: colors.infoBg, border: `1px solid ${colors.info}30` }}
                >
                  <Bell className="h-4 w-4" style={{ color: colors.info }} />
                  <span className="text-sm font-medium" style={{ color: colors.info }}>{stats.comunicadosNaoLidos}</span>
                  <span className="text-xs" style={{ color: colors.textMuted }}>não lidos</span>
                </div>
                <div 
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                  style={{ backgroundColor: colors.bgCardHover, border: `1px solid ${colors.borderSecondary}` }}
                >
                  <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>{stats.comunicadosTotal}</span>
                  <span className="text-xs" style={{ color: colors.textMuted }}>total</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: colors.textMuted }} />
                </div>
              ) : error ? (
                <div className="text-center py-12 text-sm" style={{ color: colors.textMuted }}>{error}</div>
              ) : comunicados.length === 0 ? (
                <div className="text-center py-12 text-sm" style={{ color: colors.textMuted }}>Nenhum comunicado disponível</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.borderPrimary}` }}>
                      <th className="text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ color: colors.textMuted }}>Status</th>
                      <th className="text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ color: colors.textMuted }}>Título</th>
                      <th className="text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ color: colors.textMuted }}>Origem</th>
                      <th className="text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ color: colors.textMuted }}>Data</th>
                      <th className="text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ color: colors.textMuted }}>Prioridade</th>
                      <th className="text-right text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ color: colors.textMuted }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comunicados.map((comunicado) => (
                      <tr 
                        key={comunicado.id} 
                        className="transition-colors"
                        style={{ 
                          borderBottom: `1px solid ${colors.borderSecondary}`,
                          backgroundColor: !comunicado.lido ? `${colors.info}08` : 'transparent'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = !comunicado.lido ? `${colors.info}08` : 'transparent'}
                      >
                        <td className="px-4 py-3">
                          {comunicado.tipo === "urgente" ? (
                            <AlertTriangle className="h-4 w-4" style={{ color: colors.error }} />
                          ) : (
                            <Megaphone className="h-4 w-4" style={{ color: colors.info }} />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className={`text-sm ${!comunicado.lido ? 'font-semibold' : ''}`} style={{ color: colors.textPrimary }}>
                              {comunicado.titulo}
                            </span>
                            <p className="text-xs mt-0.5 line-clamp-1" style={{ color: colors.textMuted }}>{comunicado.conteudo}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm" style={{ color: colors.textSecondary }}>{comunicado.autor}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm" style={{ color: colors.textSecondary }}>{formatDate(comunicado.data)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span 
                            className="inline-flex px-2 py-1 text-[10px] font-medium rounded"
                            style={getPrioridadeStyle(comunicado.tipo === "urgente" ? "urgente" : "info")}
                          >
                            {comunicado.tipo === "urgente" ? "urgente" : "normal"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              className="p-1.5 rounded transition-colors"
                              style={{ color: colors.textMuted }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            {!comunicado.lido && (
                              <button 
                                onClick={() => marcarComoLido(comunicado.id)}
                                className="p-1.5 rounded transition-colors"
                                style={{ color: colors.success }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.successBg}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Card de Fila de Trabalho */}
          <div 
            className={`rounded-lg border ${cardHeight} transition-colors duration-200`}
            style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary, marginTop: '80px' }}
          >
            <div 
              className="px-5 py-4 border-b flex items-center justify-between"
              style={{ borderColor: colors.borderPrimary }}
            >
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5" style={{ color: colors.textMuted }} />
                <h2 className="text-base font-semibold" style={{ color: colors.textPrimary }}>Fila de Trabalho</h2>
              </div>
              {/* KPIs integrados no header */}
              <div className="flex items-center gap-3">
                <div 
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                  style={{ backgroundColor: colors.warningBg, border: `1px solid ${colors.warning}30` }}
                >
                  <Clock className="h-4 w-4" style={{ color: colors.warning }} />
                  <span className="text-sm font-medium" style={{ color: colors.warning }}>{stats.tarefasPendentes}</span>
                  <span className="text-xs" style={{ color: colors.textMuted }}>pendentes</span>
                </div>
                <div 
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                  style={{ backgroundColor: colors.successBg, border: `1px solid ${colors.success}30` }}
                >
                  <CheckCircle className="h-4 w-4" style={{ color: colors.success }} />
                  <span className="text-sm font-medium" style={{ color: colors.success }}>{stats.tarefasConcluidas}</span>
                  <span className="text-xs" style={{ color: colors.textMuted }}>concluídas</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.borderPrimary}` }}>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ color: colors.textMuted }}>Tipo</th>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ color: colors.textMuted }}>Título</th>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ color: colors.textMuted }}>Solicitante</th>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ color: colors.textMuted }}>Valor</th>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ color: colors.textMuted }}>Prazo</th>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ color: colors.textMuted }}>Prioridade</th>
                    <th className="text-right text-[10px] font-semibold uppercase tracking-wider px-4 py-3" style={{ color: colors.textMuted }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tarefas.map((tarefa) => {
                    const Icon = tipoIcons[tarefa.tipo] || FileText
                    return (
                      <tr 
                        key={tarefa.id} 
                        className="transition-colors"
                        style={{ borderBottom: `1px solid ${colors.borderSecondary}` }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td className="px-4 py-3">
                          <Icon className="h-4 w-4" style={{ color: colors.textMuted } as React.CSSProperties} />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{tarefa.titulo}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="text-sm" style={{ color: colors.textSecondary }}>{tarefa.solicitante}</span>
                            <p className="text-xs" style={{ color: colors.textMuted }}>{tarefa.departamento}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm" style={{ color: colors.textSecondary }}>
                            {tarefa.valor ? formatCurrency(tarefa.valor) : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm" style={{ color: colors.textSecondary }}>{formatDate(tarefa.prazo)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span 
                            className="inline-flex px-2 py-1 text-[10px] font-medium rounded"
                            style={getPrioridadeStyle(tarefa.prioridade)}
                          >
                            {tarefa.prioridade}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              className="p-1.5 rounded transition-colors"
                              style={{ color: colors.textMuted }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              className="p-1.5 rounded transition-colors"
                              style={{ color: colors.success }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.successBg}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              className="p-1.5 rounded transition-colors"
                              style={{ color: colors.error }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.errorBg}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Calendário */}
        <div className="lg:col-span-4">
          <div 
            className="rounded-lg border h-full transition-colors duration-200"
            style={{ backgroundColor: colors.bgCard, borderColor: colors.borderPrimary }}
          >
            <div 
              className="px-5 py-4 border-b"
              style={{ borderColor: colors.borderPrimary }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5" style={{ color: colors.textMuted }} />
                  <h2 className="text-base font-semibold" style={{ color: colors.textPrimary }}>Calendário</h2>
                </div>
                {/* KPI integrado no header */}
                <div 
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                  style={{ backgroundColor: colors.accentBg, border: `1px solid ${colors.accent}30` }}
                >
                  <ListTodo className="h-4 w-4" style={{ color: colors.accent }} />
                  <span className="text-sm font-medium" style={{ color: colors.accent }}>{stats.marcosPendentes}</span>
                  <span className="text-xs" style={{ color: colors.textMuted }}>pendentes</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: colors.textMuted }}>Marcos e eventos da obra</p>
                <div className="flex items-center gap-1">
                  <button 
                    className="p-1.5 rounded transition-colors" 
                    onClick={() => navegarMes(-1)}
                    style={{ color: colors.textMuted }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-medium min-w-[100px] text-center capitalize" style={{ color: colors.textSecondary }}>{nomeMes}</span>
                  <button 
                    className="p-1.5 rounded transition-colors" 
                    onClick={() => navegarMes(1)}
                    style={{ color: colors.textMuted }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgCardHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-5">
              {/* Marcos do Mês */}
              <div className="space-y-3 mb-6">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: colors.textMuted }}>Marcos do Mês</h4>
                {marcosDoMes.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: colors.textMuted }}>Nenhum marco neste mês</p>
                ) : (
                  marcosDoMes.map((marco) => (
                    <div 
                      key={marco.id} 
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{ backgroundColor: colors.bgCardHover, borderColor: colors.borderSecondary }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tipoMarcoColors[marco.tipo] }} />
                        <div>
                          <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{marco.titulo}</span>
                          <p className="text-xs" style={{ color: colors.textMuted }}>{formatDateShort(marco.data)}</p>
                        </div>
                      </div>
                      {!marco.concluido && (
                        <button 
                          className="text-xs font-semibold transition-colors"
                          style={{ color: colors.accent }}
                          onMouseEnter={(e) => e.currentTarget.style.color = colors.accentHover}
                          onMouseLeave={(e) => e.currentTarget.style.color = colors.accent}
                        >
                          Concluir
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Próximos Marcos */}
              <div className="border-t pt-5" style={{ borderColor: colors.borderPrimary }}>
                <h4 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>Próximos Marcos</h4>
                <div className="space-y-3">
                  {marcos.filter((m) => !m.concluido).map((marco) => (
                    <div key={marco.id} className="flex items-center gap-3 text-sm">
                      <Circle className="h-2.5 w-2.5 flex-shrink-0" style={{ color: colors.textMuted }} />
                      <span className="flex-1 text-sm" style={{ color: colors.textSecondary }}>{marco.titulo}</span>
                      <span className="text-xs" style={{ color: colors.textMuted }}>{formatDateShort(marco.data)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legenda */}
              <div className="border-t pt-5 mt-6" style={{ borderColor: colors.borderPrimary }}>
                <h4 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>Legenda</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tipoMarcoColors.marco }} />
                    <span className="text-xs" style={{ color: colors.textSecondary }}>Marco</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tipoMarcoColors.medicao }} />
                    <span className="text-xs" style={{ color: colors.textSecondary }}>Medição</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tipoMarcoColors.entrega }} />
                    <span className="text-xs" style={{ color: colors.textSecondary }}>Entrega</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tipoMarcoColors.reuniao }} />
                    <span className="text-xs" style={{ color: colors.textSecondary }}>Reunião</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
