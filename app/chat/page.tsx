'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Image,
  Send,
  Mic,
  X,
  Calendar,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ===== INTERFACES =====
interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isGroup: boolean;
  status?: 'online' | 'away' | 'busy' | 'offline';
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  senderInitials: string;
  isTask?: boolean;
  taskData?: {
    title: string;
    description: string;
    priority: 'low' | 'normal' | 'high';
    dueDate: string;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'normal' | 'high';
  dueDate: string;
  completed: boolean;
  assignedTo: string;
}

// ===== COMPONENT =====
const ChatPage = () => {
  // ===== STATES =====
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'groups'>('all');
  const [bottomPanelTab, setBottomPanelTab] = useState<'tasks' | 'calendar'>('tasks');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expandBottomPanel, setExpandBottomPanel] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // ===== MOCK DATA =====
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Carlos Mendes',
      avatar: 'CM',
      lastMessage: 'Tarefa criada: Revisar proposta...',
      timestamp: '10:32',
      unread: 0,
      isGroup: false,
      status: 'online',
    },
    {
      id: '2',
      name: 'Equipe Comercial',
      avatar: 'EC',
      lastMessage: 'Ana Paula: Reunião confirmada para 14h',
      timestamp: '09:45',
      unread: 3,
      isGroup: true,
    },
    {
      id: '3',
      name: 'Roberto Silva',
      avatar: 'RS',
      lastMessage: 'Requisição enviada para aprovação',
      timestamp: 'Ontem',
      unread: 0,
      isGroup: false,
      status: 'away',
    },
    {
      id: '4',
      name: 'Tarefas Projeto BR-101',
      avatar: 'TP',
      lastMessage: '5 tarefas pendentes',
      timestamp: 'Hoje',
      unread: 0,
      isGroup: true,
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      sender: 'Carlos Mendes',
      content: 'Bom dia! Você conseguiu analisar a proposta de BDI para a Duplicação BR-101?',
      timestamp: '09:15',
      isOwn: false,
      senderInitials: 'CM',
    },
    {
      id: '2',
      sender: 'Você',
      content: 'Sim, estou revisando agora. O valor está dentro do esperado, mas preciso confirmar alguns itens com o financeiro.',
      timestamp: '09:20',
      isOwn: true,
      senderInitials: 'JC',
    },
    {
      id: '3',
      sender: 'Carlos Mendes',
      content: 'Perfeito! O prazo para envio ao cliente é até sexta-feira. Consegue me dar um retorno até quinta?',
      timestamp: '09:25',
      isOwn: false,
      senderInitials: 'CM',
      isTask: true,
      taskData: {
        title: 'Revisar proposta de BDI com Financeiro',
        description: 'Confirmar valores e itens da proposta',
        priority: 'high',
        dueDate: 'Quinta-feira',
      },
    },
    {
      id: '4',
      sender: 'Você',
      content: 'Sem problemas! Vou priorizar essa análise.',
      timestamp: '09:28',
      isOwn: true,
      senderInitials: 'JC',
    },
  ];

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Revisar proposta de BDI',
      description: 'Confirmar com Financeiro',
      priority: 'high',
      dueDate: '2026-01-09',
      completed: false,
      assignedTo: 'Carlos Mendes',
    },
    {
      id: '2',
      title: 'Confirmar com Financeiro',
      description: '',
      priority: 'normal',
      dueDate: '2026-01-04',
      completed: false,
      assignedTo: 'Você',
    },
    {
      id: '3',
      title: 'Enviar proposta ao cliente',
      description: '',
      priority: 'normal',
      dueDate: '2026-01-10',
      completed: false,
      assignedTo: 'Carlos Mendes',
    },
    {
      id: '4',
      title: 'Análise inicial concluída',
      description: '',
      priority: 'low',
      dueDate: '2026-01-03',
      completed: true,
      assignedTo: 'Você',
    },
  ]);

  // ===== FUNCTIONS =====
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'normal':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'unread') return matchesSearch && conv.unread > 0;
    if (activeTab === 'groups') return matchesSearch && conv.isGroup;
    return matchesSearch;
  });

  const currentConversation = selectedConversation || conversations[0];

  // ===== AUDIO RECORDING =====
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstart = () => {
        setIsRecording(true);
      };

      mediaRecorder.onstop = () => {
        setIsRecording(false);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        console.log('Áudio gravado:', audioBlob);
        setMessageInput('Tarefa criada por áudio: [Transcrição da gravação]');
      };

      mediaRecorder.start();
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  // ===== CALENDAR FUNCTIONS =====
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasEvent = tasks.some((task) => task.dueDate === dateStr);
      const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

      days.push(
        <div
          key={day}
          className={`aspect-square flex items-center justify-center rounded text-xs font-medium cursor-pointer transition ${
            isToday
              ? 'bg-red-900 text-white'
              : hasEvent
              ? 'border border-red-900 text-red-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // ===== RENDER =====
  return (
    <div className="flex flex-col h-full bg-white">
      {/* ===== MAIN LAYOUT ===== */}
      <div className="flex flex-1 overflow-hidden gap-0">
        {/* ===== SIDEBAR ESQUERDA ===== */}
        <div className="w-72 border-r border-gray-200 flex flex-col bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-900 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                💬
              </div>
              <h1 className="text-base font-bold text-gray-900">Chat & Tarefas</h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 px-3 py-2 border-b border-gray-100">
            {['all', 'unread', 'groups'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`text-xs font-medium px-2 py-1.5 rounded transition ${
                  activeTab === tab
                    ? 'text-red-900 border-b-2 border-red-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'all' && 'Todas'}
                {tab === 'unread' && 'Não lidas'}
                {tab === 'groups' && 'Grupos'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-900 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-2.5 mx-2 my-0.5 rounded-lg cursor-pointer transition ${
                  selectedConversation?.id === conv.id
                    ? 'bg-red-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="relative flex-shrink-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                      conv.isGroup ? 'bg-gradient-to-br from-red-900 to-red-800' : 'bg-red-900'
                    }`}>
                      {conv.avatar}
                    </div>
                    {conv.status && (
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${getStatusColor(conv.status)} rounded-full border-2 border-white`}></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-medium text-gray-900 text-xs">{conv.name}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">{conv.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="bg-red-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== MAIN CHAT AREA ===== */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-16 border-b border-gray-200 flex items-center justify-between px-5 bg-white shadow-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  currentConversation.isGroup ? 'bg-gradient-to-br from-red-900 to-red-800' : 'bg-red-900'
                }`}>
                  {currentConversation.avatar}
                </div>
                {currentConversation.status && (
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${getStatusColor(currentConversation.status)} rounded-full border-2 border-white`}></div>
                )}
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-sm">{currentConversation.name}</h2>
                <p className="text-xs text-gray-500">
                  {currentConversation.status === 'online' && '● Online • Gerente Comercial'}
                  {currentConversation.status === 'away' && '● Ausente'}
                  {currentConversation.status === 'busy' && '● Ocupado'}
                  {currentConversation.status === 'offline' && '● Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Phone className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 bg-red-900 hover:bg-red-800 rounded-lg transition text-white shadow-md">
                <Video className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                {msg.isTask ? (
                  <div className="max-w-xs">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="text-red-900 font-bold text-xs mb-1">📋 Tarefa Criada</div>
                      <div className="text-gray-900 text-xs font-medium mb-1">{msg.taskData?.title}</div>
                      <div className="text-gray-600 text-xs mb-2">{msg.taskData?.description}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full ${getPriorityDot(msg.taskData?.priority || 'normal')}`}></div>
                        <span>Prazo: {msg.taskData?.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`flex gap-2 max-w-xs ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                      msg.isOwn ? 'bg-blue-600' : 'bg-red-900'
                    }`}>
                      {msg.senderInitials}
                    </div>
                    <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                      <p className={`px-3 py-2 rounded-lg text-xs ${
                        msg.isOwn
                          ? 'bg-red-900 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}>
                        {msg.content}
                      </p>
                      <span className="text-xs text-gray-500 mt-0.5">{msg.timestamp}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 bg-white flex-shrink-0">
            <div className="flex items-end gap-2">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-600">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-600">
                <Image className="w-4 h-4" />
              </button>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-1.5 rounded-lg transition relative ${
                  isRecording
                    ? 'bg-red-900 text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Gravar áudio / Criar tarefa por voz"
              >
                <Mic className="w-4 h-4" />
                {isRecording && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
              <button
                onClick={() => setShowTaskModal(true)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-600"
                title="Criar nova tarefa"
              >
                <Plus className="w-4 h-4" />
              </button>
              <textarea
                placeholder="Digite sua mensagem..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent resize-none max-h-20 text-xs"
                rows={1}
              />
              <button className="p-1.5 bg-red-900 hover:bg-red-800 rounded-lg transition text-white">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM PANEL - TAREFAS/CALENDÁRIO ===== */}
      <div className={`border-t border-gray-200 bg-white transition-all duration-300 ${
        expandBottomPanel ? 'h-80' : 'h-40'
      } flex flex-col flex-shrink-0 shadow-lg`}>
        {/* Panel Header */}
        <div className="p-3 border-b border-gray-100 flex gap-2 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setBottomPanelTab('tasks')}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium transition ${
                bottomPanelTab === 'tasks'
                  ? 'bg-red-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Tarefas
            </button>
            <button
              onClick={() => setBottomPanelTab('calendar')}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium transition ${
                bottomPanelTab === 'calendar'
                  ? 'bg-red-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📅 Calendário
            </button>
          </div>
          <button
            onClick={() => setExpandBottomPanel(!expandBottomPanel)}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            {expandBottomPanel ? '▼' : '▲'}
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {bottomPanelTab === 'tasks' ? (
            // TASKS VIEW
            <div className="grid grid-cols-2 gap-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-2 rounded-lg border transition cursor-pointer ${
                    task.completed
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    <button
                      onClick={() => {
                        setTasks(tasks.map((t) =>
                          t.id === task.id ? { ...t, completed: !t.completed } : t
                        ));
                      }}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className={`w-1 h-1 rounded-full ${getPriorityDot(task.priority)}`}></div>
                        <span className="text-xs text-gray-600">
                          {new Date(task.dueDate).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // CALENDAR VIEW
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <h3 className="text-xs font-bold text-gray-900">
                  {currentMonth.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
                  <div key={day} className="text-center text-xs font-bold text-gray-600 py-1">
                    {day[0]}
                  </div>
                ))}
                {renderCalendarDays()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL CRIAR TAREFA ===== */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-base font-bold text-gray-900">Criar Nova Tarefa</h2>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Título da Tarefa</label>
                <input
                  type="text"
                  placeholder="Ex: Revisar documento..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Descrição</label>
                <textarea
                  placeholder="Detalhes da tarefa..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-900 resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Atribuir Para</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-900">
                  <option>Selecione um usuário...</option>
                  <option>Carlos Mendes</option>
                  <option>Roberto Silva</option>
                  <option>Ana Paula Costa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Prazo</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Prioridade</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-900">
                  <option>Normal</option>
                  <option>Alta</option>
                  <option>Baixa</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex gap-2 justify-end sticky bottom-0 bg-white">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-lg text-xs font-medium hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-3 py-1.5 bg-red-900 text-white rounded-lg text-xs font-medium hover:bg-red-800 transition"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
