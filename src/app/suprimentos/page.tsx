'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Loader2 } from 'lucide-react';
import ModalNovoInsumo from '@/components/suprimentos/ModalNovoInsumo';

interface Insumo {
  id: string;
  codigo: string;
  nome: string;
  unidade: string;
  categoria: string;
  preco_estimado: number;
  estoque: number;
}

export default function SuprimentosPage() {
  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega insumos do banco de dados
  const loadInsumos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/insumos');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar insumos');
      }

      const data = await response.json();
      setInsumos(data);
    } catch (err: any) {
      console.error('Erro ao carregar insumos:', err);
      setError(err.message || 'Erro ao carregar insumos. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsumos();
  }, []);

  const handleSaveInsumo = () => {
    // Recarrega os insumos após salvar
    loadInsumos();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" /> Suprimentos
          </h1>
          <p className="text-gray-600">Controle de insumos e materiais de construção.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Novo Insumo
        </button>
      </header>

      {/* Barra de Ferramentas */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou código..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
          <Filter size={18} /> Filtros
        </button>
      </div>

      {/* Tabela de Insumos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Carregando insumos...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadInsumos}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        ) : insumos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nenhum insumo cadastrado ainda.</p>
            <p className="text-sm mt-2">Clique em "Novo Insumo" para começar.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Código</th>
                <th className="p-4 font-semibold text-gray-700">Nome do Material</th>
                <th className="p-4 font-semibold text-gray-700">Categoria</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Unidade</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Preço Unit.</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Estoque</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {insumos
                .filter((item) => {
                  if (!busca) return true;
                  const searchLower = busca.toLowerCase();
                  return (
                    item.nome.toLowerCase().includes(searchLower) ||
                    item.codigo.toLowerCase().includes(searchLower)
                  );
                })
                .map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 font-mono text-sm text-gray-500">{item.codigo}</td>
                    <td className="p-4 font-medium text-gray-800">{item.nome}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                        {item.categoria}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-600">{item.unidade}</td>
                    <td className="p-4 text-right text-gray-800">
                      R$ {Number(item.preco_estimado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`font-bold ${Number(item.estoque) < 20 ? 'text-red-500' : 'text-green-600'}`}>
                        {Number(item.estoque).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Novo Insumo */}
      <ModalNovoInsumo
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInsumo}
      />
    </div>
  );
}

