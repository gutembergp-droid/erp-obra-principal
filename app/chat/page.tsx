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
  AlertCircle,
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

interface CalendarEvent {
  date: number;
  hasEvent: boolean;
  events: string[];
}

// ===== COMPONENT =====
const ChatPage = () => {
  // ===== STATES =====
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'groups'>('all');
  const [rightPanelTab, setRightPanelTab] = useState<'tasks' | 'calendar'>('tasks');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'normal':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
        // Aqui você integraria com a API de transcrição (Whisper, etc)
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        console.log('Áudio gravado:', audioBlob);
        // Simular criação de tarefa por voz
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

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square"></div>
      );
    }

    // Days of month
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
    <div className="flex h-screen bg-white">
      {/* ===== SIDEBAR ESQUERDA ===== */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white shadow-sm">
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-900 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              💬
            </div>
            <h1 className="text-lg font-bold text-gray-900">Chat & Tarefas</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 px-4 py-3 border-b border-gray-100">
          {['all', 'unread', 'groups'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`text-xs font-medium px-3 py-2 rounded transition ${
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
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-900 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`p-3 mx-2 my-1 rounded-lg cursor-pointer transition ${
                selectedConversation?.id === conv.id
                  ? 'bg-red-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                    conv.isGroup ? 'bg-gradient-to-br from-red-900 to-red-800' : 'bg-red-900'
                  }`}>
                    {conv.avatar}
                  </div>
                  {conv.status && (
                    <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(conv.status)} rounded-full border-2 border-white`}></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 text-xs">{conv.name}</h3>
                    <span className="text-xs text-gray-500 ml-2">{conv.timestamp}</span>
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
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <div className="h-20 border-b border-gray-200 flex items-center justify-between px-6 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                currentConversation.isGroup ? 'bg-gradient-to-br from-red-900 to-red-800' : 'bg-red-900'
              }`}>
                {currentConversation.avatar}
              </div>
              {currentConversation.status && (
                <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(currentConversation.status)} rounded-full border-2 border-white`}></div>
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
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 bg-red-900 hover:bg-red-800 rounded-lg transition text-white shadow-md">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
              {msg.isTask ? (
                <div className={`max-w-md ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-900 font-bold text-sm mb-2">📋 Tarefa Criada</div>
                    <div className="text-gray-900 text-sm font-medium mb-1">{msg.taskData?.title}</div>
                    <div className="text-gray-600 text-xs mb-2">{msg.taskData?.description}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${getPriorityDot(msg.taskData?.priority || 'normal')}`}></div>
                      <span>Prazo: {msg.taskData?.dueDate}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`flex gap-3 max-w-md ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                    msg.isOwn ? 'bg-blue-600' : 'bg-red-900'
                  }`}>
                    {msg.senderInitials}
                  </div>
                  <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                    <p className={`px-4 py-2 rounded-lg text-sm ${
                      msg.isOwn
                        ? 'bg-red-900 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      {msg.content}
                    </p>
                    <span className="text-xs text-gray-500 mt-1">{msg.timestamp}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-end gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
              <Image className="w-5 h-5" />
            </button>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-lg transition relative ${
                isRecording
                  ? 'bg-red-900 text-white'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Gravar áudio / Criar tarefa por voz"
            >
              <Mic className="w-5 h-5" />
              {isRecording && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
            <button
              onClick={() => setShowTaskModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
              title="Criar nova tarefa"
            >
              <Plus className="w-5 h-5" />
            </button>
            <textarea
              placeholder="Digite sua mensagem ou crie uma tarefa por áudio..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent resize-none max-h-24 text-sm"
              rows={1}
            />
            <button className="p-2 bg-red-900 hover:bg-red-800 rounded-lg transition text-white">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="w-80 border-l border-gray-200 flex flex-col bg-white shadow-sm">
        {/* Panel Header */}
        <div className="p-4 border-b border-gray-100 flex gap-2">
          <button
            onClick={() => setRightPanelTab('tasks')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition ${
              rightPanelTab === 'tasks'
                ? 'bg-red-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Tarefas
          </button>
          <button
            onClick={() => setRightPanelTab('calendar')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition ${
              rightPanelTab === 'calendar'
                ? 'bg-red-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📅 Calendário
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {rightPanelTab === 'tasks' ? (
            // TASKS VIEW
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border transition cursor-pointer ${
                    task.completed
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => {
                        setTasks(tasks.map((t) =>
                          t.id === task.id ? { ...t, completed: !t.completed } : t
                        ));
                      }}
                      className="mt-1 flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${getPriorityDot(task.priority)}`}></div>
                        <span className="text-xs text-gray-600">
                          {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // CALENDAR VIEW
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <h3 className="text-sm font-bold text-gray-900">
                  {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
                  <div key={day} className="text-center text-xs font-bold text-gray-600 py-2">
                    {day}
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
            <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-900">Criar Nova Tarefa</h2>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Título da Tarefa</label>
                <input
                  type="text"
                  placeholder="Ex: Revisar documento..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Descrição</label>
                <textarea
                  placeholder="Detalhes da tarefa..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-900 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Atribuir Para</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-900">
                  <option>Selecione um usuário...</option>
                  <option>Carlos Mendes</option>
                  <option>Roberto Silva</option>
                  <option>Ana Paula Costa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Prazo</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Prioridade</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-900">
                  <option>Normal</option>
                  <option>Alta</option>
                  <option>Baixa</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-200 flex gap-3 justify-end sticky bottom-0 bg-white">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 bg-red-900 text-white rounded-lg text-sm font-medium hover:bg-red-800 transition"
              >
                Criar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
