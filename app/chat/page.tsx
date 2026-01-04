'use client';

import React, { useState } from 'react';
import { Search, Plus, Phone, Video, MoreVertical, Paperclip, Image, Smile, Send } from 'lucide-react';

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
}

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'groups'>('all');

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Carlos Mendes',
      avatar: 'CM',
      lastMessage: 'Ok, vou verificar o BDI e te retorno',
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
      status: 'offline',
    },
    {
      id: '4',
      name: 'Ana Paula Costa',
      avatar: 'AP',
      lastMessage: 'Medição #01 está pronta para revisão',
      timestamp: 'Ontem',
      unread: 0,
      isGroup: false,
      status: 'away',
    },
    {
      id: '5',
      name: 'Engenharia BR-101',
      avatar: 'EB',
      lastMessage: 'Pedro: Projeto atualizado no sistema',
      timestamp: 'Seg',
      unread: 0,
      isGroup: true,
    },
    {
      id: '6',
      name: 'Mariana Lopes',
      avatar: 'ML',
      lastMessage: 'Contrato revisado, aguardando assinatura',
      timestamp: 'Seg',
      unread: 0,
      isGroup: false,
      status: 'busy',
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
      content: 'Bom dia Carlos! Sim, estou revisando agora. O valor está dentro do esperado, mas preciso confirmar alguns itens com o financeiro.',
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
    },
    {
      id: '4',
      sender: 'Você',
      content: 'Sem problemas! Vou priorizar essa análise. Qualquer dúvida, te chamo.',
      timestamp: '09:28',
      isOwn: true,
      senderInitials: 'JC',
    },
    {
      id: '5',
      sender: 'Carlos Mendes',
      content: 'Ok, vou verificar o BDI e te retorno',
      timestamp: '10:32',
      isOwn: false,
      senderInitials: 'CM',
    },
  ];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'unread') return matchesSearch && conv.unread > 0;
    if (activeTab === 'groups') return matchesSearch && conv.isGroup;
    return matchesSearch;
  });

  const currentConversation = selectedConversation || conversations[0];

  return (
    <div className="flex h-screen bg-white">
      {/* SIDEBAR - Lista de Conversas */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">💬</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Chat & Vídeo</h1>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-900"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 py-3 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`text-sm font-medium px-3 py-1 rounded ${
              activeTab === 'all' ? 'text-red-900 border-b-2 border-red-900' : 'text-gray-600'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`text-sm font-medium px-3 py-1 rounded ${
              activeTab === 'unread' ? 'text-red-900 border-b-2 border-red-900' : 'text-gray-600'
            }`}
          >
            Não lidas
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`text-sm font-medium px-3 py-1 rounded ${
              activeTab === 'groups' ? 'text-red-900 border-b-2 border-red-900' : 'text-gray-600'
            }`}
          >
            Grupos
          </button>
        </div>

        {/* Nova Conversa Button */}
        <div className="px-4 py-3">
          <button className="w-full bg-red-900 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-red-800 transition">
            <Plus className="w-4 h-4" />
            Nova Conversa
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                selectedConversation?.id === conv.id ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {conv.avatar}
                  </div>
                  {conv.status && (
                    <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(conv.status)} rounded-full border-2 border-white`}></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 text-sm">{conv.name}</h3>
                    <span className="text-xs text-gray-500">{conv.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="bg-red-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {conv.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center text-white font-bold">
                {currentConversation.avatar}
              </div>
              {currentConversation.status && (
                <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(currentConversation.status)} rounded-full border-2 border-white`}></div>
              )}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{currentConversation.name}</h2>
              <p className="text-xs text-gray-500">
                {currentConversation.status === 'online' && '● Online'}
                {currentConversation.status === 'away' && '● Ausente'}
                {currentConversation.status === 'busy' && '● Ocupado'}
                {currentConversation.status === 'offline' && '● Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 bg-red-900 rounded-lg transition hover:bg-red-800">
              <Video className="w-5 h-5 text-white" />
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
              <div className={`flex gap-3 max-w-md ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                    msg.isOwn ? 'bg-blue-600' : 'bg-red-900'
                  }`}
                >
                  {msg.senderInitials}
                </div>
                <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                  <p
                    className={`px-4 py-2 rounded-lg text-sm ${
                      msg.isOwn ? 'bg-red-900 text-white' : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    {msg.content}
                  </p>
                  <span className="text-xs text-gray-500 mt-1">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-end gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Image className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
            />
            <button className="p-2 bg-red-900 hover:bg-red-800 rounded-lg transition">
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Detalhes do Contato */}
      <div className="w-72 border-l border-gray-200 p-6 bg-white overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-red-900 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            {currentConversation.avatar}
          </div>
          <h3 className="font-bold text-gray-900">{currentConversation.name}</h3>
          <p className="text-sm text-gray-600 mt-1">Gerente Comercial</p>
          <p className="text-xs text-green-600 mt-2">● Online</p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Informações</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">📧</span>
                <span className="text-gray-900">carlos.mendes@empresa.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">📱</span>
                <span className="text-gray-900">(11) 99999-1234</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">🏢</span>
                <span className="text-gray-900">Depto. Comercial</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Arquivos Compartilhados</h4>
            <div className="space-y-2">
              <div className="p-2 bg-gray-100 rounded text-sm text-gray-900 truncate">
                📄 Proposta_BDI_BR101.pdf
              </div>
              <div className="p-2 bg-gray-100 rounded text-sm text-gray-900 truncate">
                📊 Planilha_Custos.xlsx
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
