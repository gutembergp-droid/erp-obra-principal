"use client"

import { useState, useEffect, useCallback } from "react"
import { Clock, CheckCircle, Bell, ListTodo, Eye, Check, X, FileCheck, ShoppingCart, Receipt, FileText, Megaphone, AlertTriangle, Calendar, ChevronLeft, ChevronRight, Circle, Loader2 } from "lucide-react"

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

  const tipoIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    aprovacao: FileCheck,
    requisicao: ShoppingCart,
    medicao: Receipt,
    documento: FileText,
    contrato: FileText,
  }

  const prioridadeColors: Record<string, string> = {
    urgente: "bg-[#96110D]/20 text-[#96110D] border border-[#96110D]/30",
    alta: "bg-orange-900/30 text-orange-400 border border-orange-700/30",
    media: "bg-yellow-900/30 text-yellow-400 border border-yellow-700/30",
    baixa: "bg-gray-700/30 text-gray-400 border border-gray-600/30",
    normal: "bg-blue-900/30 text-blue-400 border border-blue-700/30",
    info: "bg-blue-900/30 text-blue-400 border border-blue-700/30",
  }

  const tipoMarcoColors: Record<string, string> = {
    medicao: "bg-emerald-500",
    entrega: "bg-blue-500",
    marco: "bg-amber-500",
    reuniao: "bg-purple-500",
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

  return (
    <div className="min-h-screen w-[90%] mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Intranet</h1>
        <p className="text-sm text-gray-400 mt-1">Visão geral da obra e tarefas pendentes</p>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Coluna Esquerda - Comunicados + Fila de Trabalho */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Card de Comunicados */}
          <div className={`bg-gray-900/80 rounded-lg border border-gray-800/60 ${cardHeight}`}>
            <div className="px-5 py-4 border-b border-gray-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-100">Comunicados</h2>
              </div>
              {/* KPIs integrados no header */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-blue-900/20 border border-blue-800/30 rounded-lg px-3 py-1.5">
                  <Bell className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">{stats.comunicadosNaoLidos}</span>
                  <span className="text-xs text-gray-500">não lidos</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 border border-gray-700/30 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-300">{stats.comunicadosTotal}</span>
                  <span className="text-xs text-gray-500">total</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-12 text-gray-500 text-sm">{error}</div>
              ) : comunicados.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm">Nenhum comunicado disponível</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800/60">
                      <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                      <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Título</th>
                      <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Origem</th>
                      <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Data</th>
                      <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Prioridade</th>
                      <th className="text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comunicados.map((comunicado) => (
                      <tr key={comunicado.id} className={`border-b border-gray-800/40 hover:bg-gray-800/40 transition-colors ${!comunicado.lido ? 'bg-blue-900/5' : ''}`}>
                        <td className="px-4 py-3">
                          {comunicado.tipo === "urgente" ? (
                            <AlertTriangle className="h-4 w-4 text-[#96110D]" />
                          ) : (
                            <Megaphone className="h-4 w-4 text-blue-400" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className={`text-sm text-gray-200 ${!comunicado.lido ? 'font-semibold' : ''}`}>
                              {comunicado.titulo}
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{comunicado.conteudo}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400">{comunicado.autor}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400">{formatDate(comunicado.data)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-[10px] font-medium rounded ${prioridadeColors[comunicado.tipo] || prioridadeColors.info}`}>
                            {comunicado.tipo === "urgente" ? "urgente" : "normal"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                              <Eye className="h-3.5 w-3.5 text-gray-400" />
                            </button>
                            {!comunicado.lido && (
                              <button 
                                onClick={() => marcarComoLido(comunicado.id)}
                                className="p-1.5 hover:bg-emerald-900/50 rounded transition-colors"
                              >
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
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
          <div className={`bg-gray-900/80 rounded-lg border border-gray-800/60 ${cardHeight}`}>
            <div className="px-5 py-4 border-b border-gray-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-100">Fila de Trabalho</h2>
              </div>
              {/* KPIs integrados no header */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-amber-900/20 border border-amber-800/30 rounded-lg px-3 py-1.5">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium text-amber-400">{stats.tarefasPendentes}</span>
                  <span className="text-xs text-gray-500">pendentes</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-900/20 border border-emerald-800/30 rounded-lg px-3 py-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">{stats.tarefasConcluidas}</span>
                  <span className="text-xs text-gray-500">concluídas</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800/60">
                    <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Tipo</th>
                    <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Título</th>
                    <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Solicitante</th>
                    <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Valor</th>
                    <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Prazo</th>
                    <th className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Prioridade</th>
                    <th className="text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tarefas.map((tarefa) => {
                    const Icon = tipoIcons[tarefa.tipo] || FileText
                    return (
                      <tr key={tarefa.id} className="border-b border-gray-800/40 hover:bg-gray-800/40 transition-colors">
                        <td className="px-4 py-3">
                          <Icon className="h-4 w-4 text-gray-500" />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-200">{tarefa.titulo}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="text-sm text-gray-400">{tarefa.solicitante}</span>
                            <p className="text-xs text-gray-500">{tarefa.departamento}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400">
                            {tarefa.valor ? formatCurrency(tarefa.valor) : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400">{formatDate(tarefa.prazo)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-[10px] font-medium rounded ${prioridadeColors[tarefa.prioridade]}`}>
                            {tarefa.prioridade}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                              <Eye className="h-3.5 w-3.5 text-gray-400" />
                            </button>
                            <button className="p-1.5 hover:bg-emerald-900/50 rounded transition-colors">
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            </button>
                            <button className="p-1.5 hover:bg-red-900/50 rounded transition-colors">
                              <X className="h-3.5 w-3.5 text-red-500" />
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
          <div className="bg-gray-900/80 rounded-lg border border-gray-800/60 h-full">
            <div className="px-5 py-4 border-b border-gray-800/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <h2 className="text-base font-semibold text-gray-100">Calendário</h2>
                </div>
                {/* KPI integrado no header */}
                <div className="flex items-center gap-2 bg-[#96110D]/20 border border-[#96110D]/30 rounded-lg px-3 py-1.5">
                  <ListTodo className="h-4 w-4 text-[#96110D]" />
                  <span className="text-sm font-medium text-[#96110D]">{stats.marcosPendentes}</span>
                  <span className="text-xs text-gray-500">pendentes</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Marcos e eventos da obra</p>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-gray-800 rounded transition-colors" onClick={() => navegarMes(-1)}>
                    <ChevronLeft className="h-4 w-4 text-gray-400" />
                  </button>
                  <span className="text-xs font-medium min-w-[100px] text-center capitalize text-gray-300">{nomeMes}</span>
                  <button className="p-1.5 hover:bg-gray-800 rounded transition-colors" onClick={() => navegarMes(1)}>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-5">
              {/* Marcos do Mês */}
              <div className="space-y-3 mb-6">
                <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Marcos do Mês</h4>
                {marcosDoMes.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Nenhum marco neste mês</p>
                ) : (
                  marcosDoMes.map((marco) => (
                    <div key={marco.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-700/40 bg-gray-800/20">
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${tipoMarcoColors[marco.tipo]}`} />
                        <div>
                          <span className="text-sm font-medium text-gray-200">{marco.titulo}</span>
                          <p className="text-xs text-gray-500">{formatDateShort(marco.data)}</p>
                        </div>
                      </div>
                      {!marco.concluido && (
                        <button className="text-xs text-[#96110D] hover:text-[#b81510] font-semibold transition-colors">
                          Concluir
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Próximos Marcos */}
              <div className="border-t border-gray-800/60 pt-5">
                <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Próximos Marcos</h4>
                <div className="space-y-3">
                  {marcos.filter((m) => !m.concluido).map((marco) => (
                    <div key={marco.id} className="flex items-center gap-3 text-sm">
                      <Circle className="h-2.5 w-2.5 text-gray-600 flex-shrink-0" />
                      <span className="flex-1 text-gray-400 text-sm">{marco.titulo}</span>
                      <span className="text-xs text-gray-500">{formatDateShort(marco.data)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legenda */}
              <div className="border-t border-gray-800/60 pt-5 mt-6">
                <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Legenda</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs text-gray-400">Marco</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-gray-400">Medição</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span className="text-xs text-gray-400">Entrega</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                    <span className="text-xs text-gray-400">Reunião</span>
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
