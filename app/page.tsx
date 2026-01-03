"use client"

import { useState } from "react"
import { Clock, CheckCircle, Bell, ListTodo, Eye, Check, X, FileCheck, ShoppingCart, Receipt, FileText, Megaphone, AlertTriangle, Users, Calendar, ChevronLeft, ChevronRight, Circle, Flag, Plus } from "lucide-react"

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
  ],
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
  ],
  requisicoes: [
    {
      id: "1",
      numero: "REQ-2024-0001",
      descricao: "Aço CA-50 para armaduras de fundação",
      valor: 5754000,
      data: "2024-01-18",
      status: "enviada",
    },
  ],
  marcos: [
    { id: "1", titulo: "Início da Mobilização", data: "2024-01-15", tipo: "marco", concluido: false },
    { id: "2", titulo: "Medição #01", data: "2024-02-05", tipo: "medicao", concluido: false },
    { id: "3", titulo: "Início Fundações", data: "2024-02-15", tipo: "entrega", concluido: false },
    { id: "4", titulo: "Medição #02", data: "2024-03-05", tipo: "medicao", concluido: false },
    { id: "5", titulo: "Reunião de Acompanhamento", data: "2024-03-15", tipo: "reuniao", concluido: false },
  ],
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

  const stats = {
    tarefasPendentes: dadosMock.tarefasPendentes.length,
    tarefasConcluidas: 0,
    comunicadosNaoLidos: dadosMock.comunicados.filter((c) => !c.lido).length,
    marcosPendentes: dadosMock.marcos.filter((m) => !m.concluido).length,
  }

  const nomeMes = mesAtual.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })

  const navegarMes = (direcao: number) => {
    setMesAtual((prev) => new Date(prev.getFullYear(), prev.getMonth() + direcao, 1))
  }

  const marcosDoMes = dadosMock.marcos.filter((m) => {
    const dataMarco = new Date(m.data + "T00:00:00")
    return dataMarco.getMonth() === mesAtual.getMonth() && dataMarco.getFullYear() === mesAtual.getFullYear()
  })

  const tipoIcons: Record<string, any> = {
    aprovacao: FileCheck,
    requisicao: ShoppingCart,
    medicao: Receipt,
    documento: FileText,
    contrato: FileText,
  }

  const prioridadeColors: Record<string, string> = {
    urgente: "bg-red-100 text-red-700",
    alta: "bg-orange-100 text-orange-700",
    media: "bg-yellow-100 text-yellow-700",
    baixa: "bg-gray-100 text-gray-700",
  }

  const tipoMarcoColors: Record<string, string> = {
    medicao: "bg-emerald-500",
    entrega: "bg-blue-500",
    marco: "bg-amber-500",
    reuniao: "bg-purple-500",
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Intranet</h1>
        <p className="text-gray-500">Visão geral da obra e tarefas pendentes</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500">Tarefas Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tarefasPendentes}</p>
              <p className="text-xs text-gray-500">Aguardando ação</p>
            </div>
            <div className="bg-amber-50 rounded-full p-2">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500">Tarefas Concluídas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tarefasConcluidas}</p>
              <p className="text-xs text-gray-500">Finalizadas</p>
            </div>
            <div className="bg-emerald-50 rounded-full p-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500">Comunicados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.comunicadosNaoLidos}</p>
              <p className="text-xs text-gray-500">Não lidos</p>
            </div>
            <div className="bg-blue-50 rounded-full p-2">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500">Marcos Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.marcosPendentes}</p>
              <p className="text-xs text-gray-500">Próximos eventos</p>
            </div>
            <div className="bg-pink-50 rounded-full p-2">
              <ListTodo className="h-5 w-5 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Fila de Trabalho + Requisições */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fila de Trabalho */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                <h2 className="font-semibold text-gray-900">Fila de Trabalho</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {stats.tarefasPendentes} itens pendentes de aprovação
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
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
                  {dadosMock.tarefasPendentes.map((tarefa) => {
                    const Icon = tipoIcons[tarefa.tipo] || FileText
                    return (
                      <tr key={tarefa.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Icon className="h-4 w-4 text-gray-400" />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900">{tarefa.titulo}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="text-sm text-gray-900">{tarefa.solicitante}</span>
                            <p className="text-xs text-gray-500">{tarefa.departamento}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">
                            {tarefa.valor ? formatCurrency(tarefa.valor) : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">{formatDate(tarefa.prazo)}</span>
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
                            <button className="p-1.5 hover:bg-gray-100 rounded">
                              <Eye className="h-4 w-4 text-gray-500" />
                            </button>
                            <button className="p-1.5 hover:bg-emerald-50 rounded">
                              <Check className="h-4 w-4 text-emerald-600" />
                            </button>
                            <button className="p-1.5 hover:bg-red-50 rounded">
                              <X className="h-4 w-4 text-red-600" />
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
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                  <h2 className="font-semibold text-gray-900">Requisições</h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">1 pendente de aprovação</p>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
                <Plus className="h-4 w-4" />
                Nova
              </button>
            </div>
            <div className="p-4">
              {dadosMock.requisicoes.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-500">{req.numero}</span>
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-700">
                        {req.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-1">{req.descricao}</p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(req.valor)} • {formatDate(req.data)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-emerald-50 rounded">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded">
                      <X className="h-4 w-4 text-red-600" />
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
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-gray-600" />
                <h2 className="font-semibold text-gray-900">Comunicados</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {stats.comunicadosNaoLidos} comunicados não lidos
              </p>
            </div>
            <div className="p-4 space-y-3">
              {dadosMock.comunicados.map((comunicado) => (
                <div
                  key={comunicado.id}
                  className={`p-3 rounded-lg border ${!comunicado.lido ? "bg-blue-50/50 border-blue-200" : "border-gray-100"}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-full p-1.5 ${
                        comunicado.tipo === "urgente"
                          ? "bg-orange-100"
                          : comunicado.tipo === "info"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                      }`}
                    >
                      {comunicado.tipo === "urgente" ? (
                        <AlertTriangle className="h-3 w-3 text-orange-600" />
                      ) : comunicado.tipo === "info" ? (
                        <Megaphone className="h-3 w-3 text-blue-600" />
                      ) : (
                        <Users className="h-3 w-3 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-medium text-gray-900 ${!comunicado.lido ? "font-semibold" : ""}`}>
                          {comunicado.titulo}
                        </h4>
                        {comunicado.tipo === "urgente" && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-orange-500 text-white rounded">
                            URGENTE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{comunicado.conteudo}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>{comunicado.autor}</span>
                        <span>•</span>
                        <span>{formatDate(comunicado.data)}</span>
                      </div>
                    </div>
                    {!comunicado.lido && (
                      <button className="p-1 hover:bg-blue-100 rounded">
                        <Check className="h-4 w-4 text-blue-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendário */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <h2 className="font-semibold text-gray-900">Calendário</h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Marcos e eventos da obra</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded" onClick={() => navegarMes(-1)}>
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="text-sm font-medium min-w-[120px] text-center capitalize">{nomeMes}</span>
                  <button className="p-1 hover:bg-gray-100 rounded" onClick={() => navegarMes(1)}>
                    <ChevronRight className="h-4 w-4 text-gray-600" />
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
                    <div key={marco.id} className="flex items-center justify-between p-2 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${tipoMarcoColors[marco.tipo]}`} />
                        <div>
                          <span className="text-sm font-medium text-gray-900">{marco.titulo}</span>
                          <p className="text-xs text-gray-500">{formatDateShort(marco.data)}</p>
                        </div>
                      </div>
                      {!marco.concluido && (
                        <button className="text-xs text-gray-600 hover:text-gray-900 font-medium">
                          Concluir
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Próximos Marcos */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Próximos Marcos</h4>
                <div className="space-y-2">
                  {dadosMock.marcos.filter((m) => !m.concluido).map((marco) => (
                    <div key={marco.id} className="flex items-center gap-2 text-sm">
                      <Circle className="h-3 w-3 text-gray-400" />
                      <span className="flex-1 text-gray-700">{marco.titulo}</span>
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