"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle, Bell, ListTodo, Eye, Check, X, FileCheck, ShoppingCart, Receipt, FileText, Megaphone, AlertTriangle, Users, Calendar, ChevronLeft, ChevronRight, Circle, Plus } from "lucide-react"

// ============================================================================
// CORES AAHBRANT - Identidade Visual Oficial
// ============================================================================
// Preto: #1A1A1A
// Cinza: #F5F5F5
// Vermelho: #96110D

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

interface Comunicado {
  id: string
  tipo: string
  titulo: string
  conteudo: string
  autor: string
  data: string
  lido: boolean
}

interface Requisicao {
  id: string
  numero: string
  descricao: string
  valor: number
  data: string
  status: string
}

interface Marco {
  id: string
  titulo: string
  data: string
  tipo: string
  concluido: boolean
}

// ============================================================================
// DADOS MOCK - SUBSTITUA POR DADOS REAIS DO SEU BACKEND
// ============================================================================

const dadosMock = {
  tarefasPendentes: [
    {
      id: "1",
      tipo: "aprovacao",
      titulo: "Aprovação de BDI - Ponte Rio Azul",
      solicitante: "Carlos Mendes",
      departamento: "Comercial",
      valor: 119700000,
      prazo: "2024-01-15",
      prioridade: "alta",
    },
    {
      id: "2",
      tipo: "requisicao",
      titulo: "Requisição de Compra - Aço CA-50",
      solicitante: "Roberto Silva",
      departamento: "Suprimentos",
      valor: 15750000,
      prazo: "2024-01-20",
      prioridade: "urgente",
    },
    {
      id: "3",
      tipo: "medicao",
      titulo: "Medição #01 - Mobilização",
      solicitante: "Ana Paula Costa",
      departamento: "Comercial",
      valor: 8400000,
      prazo: "2024-02-05",
      prioridade: "alta",
    },
    {
      id: "4",
      tipo: "documento",
      titulo: "Revisão de Contrato - Aditivo Prazo",
      solicitante: "Mariana Lopes",
      departamento: "Jurídico",
      valor: null,
      prazo: "2024-02-01",
      prioridade: "media",
    },
    {
      id: "5",
      tipo: "aprovacao",
      titulo: "Aprovação de Subcontrato - Fundações",
      solicitante: "Pedro Augusto",
      departamento: "Engenharia",
      valor: 32000000,
      prazo: "2024-01-25",
      prioridade: "alta",
    },
  ] as Tarefa[],
  comunicados: [
    {
      id: "1",
      tipo: "info",
      titulo: "Início das Operações - Ponte Rio Azul",
      conteudo:
        "Comunicamos o início oficial das operações da obra Ponte Rio Azul a partir de 15/01/2024. Todas as equipes devem seguir o cronograma de mobilização.",
      autor: "Diretoria de Operações",
      data: "2024-01-10",
      lido: false,
    },
    {
      id: "2",
      tipo: "urgente",
      titulo: "URGENTE: Prazo para Estruturação",
      conteudo:
        "Lembramos que o prazo para conclusão da estruturação comercial (Gate 1) é 31/01/2024. Todos os responsáveis devem finalizar suas etapas até esta data.",
      autor: "Gerência Comercial",
      data: "2024-01-15",
      lido: false,
    },
    {
      id: "3",
      tipo: "geral",
      titulo: "Treinamento Sistema GENESIS",
      conteudo:
        "Será realizado treinamento do módulo Comercial do GENESIS nos dias 20 e 21/01. Participação obrigatória para equipe comercial e gestores de obra.",
      autor: "TI Corporativo",
      data: "2024-01-12",
      lido: true,
    },
  ] as Comunicado[],
  requisicoes: [
    {
      id: "1",
      numero: "REQ-2024-0001",
      descricao: "Aço CA-50 para armaduras de fundação",
      valor: 5754000,
      data: "2024-01-18",
      status: "enviada",
    },
  ] as Requisicao[],
  marcos: [
    { id: "1", titulo: "Início da Mobilização", data: "2024-01-15", tipo: "marco", concluido: false },
    { id: "2", titulo: "Medição #01", data: "2024-02-05", tipo: "medicao", concluido: false },
    { id: "3", titulo: "Início Fundações", data: "2024-02-15", tipo: "entrega", concluido: false },
    { id: "4", titulo: "Medição #02", data: "2024-03-05", tipo: "medicao", concluido: false },
    { id: "5", titulo: "Reunião de Acompanhamento", data: "2024-03-15", tipo: "reuniao", concluido: false },
  ] as Marco[],
}

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
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("pt-BR")
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "")
}

// ============================================================================
// COMPONENTE PRINCIPAL - INTRANET
// ============================================================================

export default function IntranetPage() {
  const [mesAtual, setMesAtual] = useState(new Date(2024, 0, 1))
  const [tarefas, setTarefas] = useState<Tarefa[]>(dadosMock.tarefasPendentes)
  const [comunicados, setComunicados] = useState<Comunicado[]>(dadosMock.comunicados)
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>(dadosMock.requisicoes)
  const [marcos, setMarcos] = useState<Marco[]>(dadosMock.marcos)

  const stats = {
    tarefasPendentes: tarefas.length,
    tarefasConcluidas: 0,
    comunicadosNaoLidos: comunicados.filter((c) => !c.lido).length,
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

  // Cores de prioridade com tema AahBrant
  const prioridadeColors: Record<string, string> = {
    urgente: "bg-[#96110D]/20 text-[#96110D] border border-[#96110D]/30",
    alta: "bg-orange-900/30 text-orange-400 border border-orange-700/30",
    media: "bg-yellow-900/30 text-yellow-400 border border-yellow-700/30",
    baixa: "bg-gray-700/30 text-gray-400 border border-gray-600/30",
  }

  const tipoMarcoColors: Record<string, string> = {
    medicao: "bg-emerald-500",
    entrega: "bg-blue-500",
    marco: "bg-amber-500",
    reuniao: "bg-purple-500",
  }

  // Marcar comunicado como lido
  const marcarComoLido = (id: string) => {
    setComunicados(prev => prev.map(c => c.id === id ? { ...c, lido: true } : c))
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Intranet</h1>
        <p className="text-gray-400">Visão geral da obra e tarefas pendentes</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500">Tarefas Pendentes</p>
              <p className="text-2xl font-bold text-gray-100">{stats.tarefasPendentes}</p>
              <p className="text-xs text-gray-500">Aguardando ação</p>
            </div>
            <div className="bg-amber-900/30 rounded-full p-2">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500">Tarefas Concluídas</p>
              <p className="text-2xl font-bold text-gray-100">{stats.tarefasConcluidas}</p>
              <p className="text-xs text-gray-500">Finalizadas</p>
            </div>
            <div className="bg-emerald-900/30 rounded-full p-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500">Comunicados</p>
              <p className="text-2xl font-bold text-gray-100">{stats.comunicadosNaoLidos}</p>
              <p className="text-xs text-gray-500">Não lidos</p>
            </div>
            <div className="bg-blue-900/30 rounded-full p-2">
              <Bell className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500">Marcos Pendentes</p>
              <p className="text-2xl font-bold text-gray-100">{stats.marcosPendentes}</p>
              <p className="text-xs text-gray-500">Próximos eventos</p>
            </div>
            <div className="bg-[#96110D]/30 rounded-full p-2">
              <ListTodo className="h-5 w-5 text-[#96110D]" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Fila de Trabalho + Requisições */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fila de Trabalho */}
          <div className="bg-gray-900 rounded-lg border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <h2 className="font-semibold text-gray-100">Fila de Trabalho</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {stats.tarefasPendentes} itens pendentes de aprovação
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Tipo</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Título</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Solicitante</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Valor</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Prazo</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Prioridade</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tarefas.map((tarefa) => {
                    const Icon = tipoIcons[tarefa.tipo] || FileText
                    return (
                      <tr key={tarefa.id} className="border-b border-gray-800/50 hover:bg-gray-800/50">
                        <td className="px-4 py-3">
                          <Icon className="h-4 w-4 text-gray-500" />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-200">{tarefa.titulo}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="text-sm text-gray-300">{tarefa.solicitante}</span>
                            <p className="text-xs text-gray-500">{tarefa.departamento}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-300">
                            {tarefa.valor ? formatCurrency(tarefa.valor) : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-300">{formatDate(tarefa.prazo)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded ${prioridadeColors[tarefa.prioridade]}`}
                          >
                            {tarefa.prioridade}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                              <Eye className="h-4 w-4 text-gray-400" />
                            </button>
                            <button className="p-1.5 hover:bg-emerald-900/50 rounded transition-colors">
                              <Check className="h-4 w-4 text-emerald-500" />
                            </button>
                            <button className="p-1.5 hover:bg-red-900/50 rounded transition-colors">
                              <X className="h-4 w-4 text-red-500" />
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

          {/* Requisições */}
          <div className="bg-gray-900 rounded-lg border border-gray-800">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-gray-400" />
                  <h2 className="font-semibold text-gray-100">Requisições</h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">{requisicoes.length} pendente de aprovação</p>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-[#96110D] text-white text-sm font-medium rounded-lg hover:bg-[#7a0e0b] transition-colors">
                <Plus className="h-4 w-4" />
                Nova
              </button>
            </div>
            <div className="p-4">
              {requisicoes.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">{req.numero}</span>
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-amber-900/30 text-amber-400 border border-amber-700/30">
                        {req.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-200 mt-1">{req.descricao}</p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(req.valor)} • {formatDate(req.data)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-emerald-900/50 rounded transition-colors">
                      <Check className="h-4 w-4 text-emerald-500" />
                    </button>
                    <button className="p-1.5 hover:bg-red-900/50 rounded transition-colors">
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita - Comunicados + Calendário */}
        <div className="space-y-6">
          {/* Comunicados */}
          <div className="bg-gray-900 rounded-lg border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-gray-400" />
                <h2 className="font-semibold text-gray-100">Comunicados</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {stats.comunicadosNaoLidos} comunicados não lidos
              </p>
            </div>
            <div className="p-4 space-y-3">
              {comunicados.map((comunicado) => (
                <div
                  key={comunicado.id}
                  className={`p-3 rounded-lg border ${!comunicado.lido ? "bg-blue-900/20 border-blue-700/30" : "bg-gray-800/30 border-gray-700/30"}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-full p-1.5 ${
                        comunicado.tipo === "urgente"
                          ? "bg-[#96110D]/30"
                          : comunicado.tipo === "info"
                            ? "bg-blue-900/30"
                            : "bg-gray-700/30"
                      }`}
                    >
                      {comunicado.tipo === "urgente" ? (
                        <AlertTriangle className="h-3 w-3 text-[#96110D]" />
                      ) : comunicado.tipo === "info" ? (
                        <Megaphone className="h-3 w-3 text-blue-400" />
                      ) : (
                        <Users className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-medium text-gray-200 ${!comunicado.lido ? "font-semibold" : ""}`}>
                          {comunicado.titulo}
                        </h4>
                        {comunicado.tipo === "urgente" && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#96110D] text-white rounded">
                            URGENTE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{comunicado.conteudo}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>{comunicado.autor}</span>
                        <span>•</span>
                        <span>{formatDate(comunicado.data)}</span>
                      </div>
                    </div>
                    {!comunicado.lido && (
                      <button 
                        onClick={() => marcarComoLido(comunicado.id)}
                        className="p-1 hover:bg-blue-900/30 rounded transition-colors"
                      >
                        <Check className="h-4 w-4 text-blue-400" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendário */}
          <div className="bg-gray-900 rounded-lg border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <h2 className="font-semibold text-gray-100">Calendário</h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Marcos e eventos da obra</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-800 rounded transition-colors" onClick={() => navegarMes(-1)}>
                    <ChevronLeft className="h-4 w-4 text-gray-400" />
                  </button>
                  <span className="text-sm font-medium min-w-[120px] text-center capitalize text-gray-300">{nomeMes}</span>
                  <button className="p-1 hover:bg-gray-800 rounded transition-colors" onClick={() => navegarMes(1)}>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              {/* Marcos do Mês */}
              <div className="space-y-2 mb-4">
                {marcosDoMes.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Nenhum marco neste mês</p>
                ) : (
                  marcosDoMes.map((marco) => (
                    <div key={marco.id} className="flex items-center justify-between p-2 rounded-lg border border-gray-700/50 bg-gray-800/30">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${tipoMarcoColors[marco.tipo]}`} />
                        <div>
                          <span className="text-sm font-medium text-gray-200">{marco.titulo}</span>
                          <p className="text-xs text-gray-500">{formatDateShort(marco.data)}</p>
                        </div>
                      </div>
                      {!marco.concluido && (
                        <button className="text-xs text-[#96110D] hover:text-[#b81510] font-medium transition-colors">
                          Concluir
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Próximos Marcos */}
              <div className="border-t border-gray-800 pt-4">
                <h4 className="text-sm font-medium text-gray-200 mb-3">Próximos Marcos</h4>
                <div className="space-y-2">
                  {marcos.filter((m) => !m.concluido).map((marco) => (
                    <div key={marco.id} className="flex items-center gap-2 text-sm">
                      <Circle className="h-3 w-3 text-gray-600" />
                      <span className="flex-1 text-gray-400">{marco.titulo}</span>
                      <span className="text-xs text-gray-500">{formatDateShort(marco.data)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
