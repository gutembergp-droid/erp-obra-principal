'use client';

import React, { useState } from 'react';
import { CheckCircle2, Plus, Search, Filter, AlertTriangle, FileCheck, ClipboardList } from 'lucide-react';

export default function QualidadePage() {
  const [busca, setBusca] = useState('');

  // Dados fictícios para visualização inicial
  const inspecoes = [
    {
      id: '1',
      codigo: 'INS-001',
      descricao: 'Inspeção de Concreto - Estrutura Principal',
      tipo: 'Inspeção',
      data: '2026-01-15',
      responsavel: 'Eng. João Silva',
      status: 'Aprovado',
      resultado: 'Conforme',
    },
    {
      id: '2',
      codigo: 'INS-002',
      descricao: 'Ensaio de Resistência - CP 28 dias',
      tipo: 'Ensaio',
      data: '2026-01-10',
      responsavel: 'Eng. Maria Santos',
      status: 'Pendente',
      resultado: 'Aguardando',
    },
    {
      id: '3',
      codigo: 'NC-001',
      descricao: 'Não Conformidade - Revestimento',
      tipo: 'Não Conformidade',
      data: '2026-01-08',
      responsavel: 'Eng. Carlos Oliveira',
      status: 'Em Correção',
      resultado: 'Não Conforme',
    },
  ];

  const inspecoesFiltradas = inspecoes.filter(item =>
    item.codigo.toLowerCase().includes(busca.toLowerCase()) ||
    item.descricao.toLowerCase().includes(busca.toLowerCase()) ||
    item.responsavel.toLowerCase().includes(busca.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Aprovado': 'bg-green-100 text-green-700',
      'Pendente': 'bg-yellow-100 text-yellow-700',
      'Em Correção': 'bg-orange-100 text-orange-700',
      'Rejeitado': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getResultadoColor = (resultado: string) => {
    const colors: Record<string, string> = {
      'Conforme': 'text-green-600',
      'Não Conforme': 'text-red-600',
      'Aguardando': 'text-gray-500',
    };
    return colors[resultado] || 'text-gray-600';
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle2 className="text-blue-600" />
            Qualidade
          </h1>
          <p className="text-gray-600">Controle de qualidade, inspeções e não conformidades.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Nova Inspeção
        </button>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Inspeções</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
            </div>
            <FileCheck className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprovadas</p>
              <p className="text-2xl font-bold text-green-600">18</p>
            </div>
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Não Conformidades</p>
              <p className="text-2xl font-bold text-red-600">3</p>
            </div>
            <AlertTriangle className="text-red-600" size={32} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">3</p>
            </div>
            <ClipboardList className="text-yellow-600" size={32} />
          </div>
        </div>
      </div>

      {/* Barra de Ferramentas */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por código, descrição, responsável..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
          <Filter size={18} />
          Filtros
        </button>
      </div>

      {/* Tabela de Inspeções */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Código</th>
              <th className="p-4 font-semibold text-gray-700">Descrição</th>
              <th className="p-4 font-semibold text-gray-700">Tipo</th>
              <th className="p-4 font-semibold text-gray-700">Data</th>
              <th className="p-4 font-semibold text-gray-700">Responsável</th>
              <th className="p-4 font-semibold text-gray-700 text-center">Status</th>
              <th className="p-4 font-semibold text-gray-700 text-center">Resultado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {inspecoesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Nenhuma inspeção encontrada
                </td>
              </tr>
            ) : (
              inspecoesFiltradas.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4 font-mono text-sm text-gray-500">{item.codigo}</td>
                  <td className="p-4 font-medium text-gray-800">{item.descricao}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      {item.tipo}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(item.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 text-gray-600">{item.responsavel}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-semibold ${getResultadoColor(item.resultado)}`}>
                      {item.resultado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

