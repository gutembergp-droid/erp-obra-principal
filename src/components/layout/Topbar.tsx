'use client';

import React from 'react';
import { 
  Bell, 
  User, 
  ChevronDown, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  DollarSign,
  Clock,
} from 'lucide-react';

interface TopbarProps {
  competencia?: {
    mes: number;
    ano: number;
  };
  contrato?: {
    valor: number;
    prazo: number; // em meses
  };
  gateStatus?: {
    numero: number;
    status: 'ok' | 'pendente' | 'bloqueado';
  };
  usuario?: {
    nome: string;
    perfil: string;
  };
  notificacoes?: number;
}

export default function Topbar({
  competencia,
  contrato,
  gateStatus,
  usuario,
  notificacoes = 0,
}: TopbarProps) {
  // Valores padrão
  const comp = competencia || { mes: new Date().getMonth() + 1, ano: new Date().getFullYear() };
  const contratoInfo = contrato || { valor: 0, prazo: 0 };
  const gate = gateStatus || { numero: 1, status: 'pendente' };
  const user = usuario || { nome: 'Usuário', perfil: 'usuario' };

  // Formata o mês/ano
  const mesFormatado = comp.mes.toString().padStart(2, '0');
  
  // Formata o valor do contrato
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Cor do status do gate
  const getGateStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-900/50 text-green-400 border-green-700';
      case 'pendente':
        return 'bg-yellow-900/50 text-yellow-400 border-yellow-700';
      case 'bloqueado':
        return 'bg-red-900/50 text-red-400 border-red-700';
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  // Ícone do status do gate
  const getGateStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle size={14} className="text-green-400" />;
      case 'pendente':
        return <Clock size={14} className="text-yellow-400" />;
      case 'bloqueado':
        return <AlertCircle size={14} className="text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      {/* Lado Esquerdo - Informações da Competência e Contrato */}
      <div className="flex items-center gap-6">
        {/* Competência */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-gray-500" />
          <span className="text-gray-400">Competência:</span>
          <span className="text-white font-semibold">{mesFormatado}/{comp.ano}</span>
        </div>

        {/* Separador */}
        <div className="h-4 w-px bg-gray-700" />

        {/* Valor do Contrato */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign size={16} className="text-gray-500" />
          <span className="text-gray-400">Contrato:</span>
          <span className="text-white font-semibold">{formatCurrency(contratoInfo.valor)}</span>
        </div>

        {/* Separador */}
        <div className="h-4 w-px bg-gray-700" />

        {/* Prazo */}
        <div className="flex items-center gap-2 text-sm">
          <Clock size={16} className="text-gray-500" />
          <span className="text-gray-400">Prazo:</span>
          <span className="text-white font-semibold">{contratoInfo.prazo} meses</span>
        </div>

        {/* Separador */}
        <div className="h-4 w-px bg-gray-700" />

        {/* Status do Gate */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getGateStatusColor(gate.status)}`}>
          {getGateStatusIcon(gate.status)}
          <span className="text-sm font-medium">
            Gate {gate.numero} {gate.status === 'ok' ? 'OK' : gate.status === 'pendente' ? 'Pendente' : 'Bloqueado'}
          </span>
        </div>
      </div>

      {/* Lado Direito - Notificações e Perfil */}
      <div className="flex items-center gap-4">
        {/* Notificações */}
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
          <Bell size={20} />
          {notificacoes > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
              {notificacoes > 9 ? '9+' : notificacoes}
            </span>
          )}
        </button>

        {/* Perfil do Usuário */}
        <button className="flex items-center gap-2 px-3 py-1.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User size={16} className="text-gray-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">{user.nome}</p>
            <p className="text-xs text-gray-500 capitalize">{user.perfil}</p>
          </div>
          <ChevronDown size={14} className="text-gray-500" />
        </button>
      </div>
    </header>
  );
}
