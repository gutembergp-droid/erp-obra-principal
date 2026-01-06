/**
 * TEMPLATE: Tela Básica
 * 
 * Copie este arquivo e adapte para criar uma nova tela
 * 
 * INSTRUÇÕES:
 * 1. Renomeie o arquivo para o nome da sua tela (ex: fornecedores.tsx)
 * 2. Substitua "NomeDaTela" pelo nome real
 * 3. Adapte os campos do formulário conforme necessário
 * 4. Conecte com a API quando estiver pronto
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash, Eye } from 'lucide-react';

// Interface para os dados (adaptar conforme necessário)
interface Item {
  id: string;
  nome: string;
  descricao?: string;
  status: 'ativo' | 'inativo';
  created_at: string;
}

export default function NomeDaTelaPage() {
  // ============================================
  // 1. ESTADOS (dados que mudam na tela)
  // ============================================
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para modal/drawer (se necessário)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    status: 'ativo' as 'ativo' | 'inativo',
  });

  // ============================================
  // 2. CARREGAR DADOS QUANDO A TELA ABRIR
  // ============================================
  useEffect(() => {
    loadItems();
  }, []);

  // ============================================
  // 3. FUNÇÕES PARA TRABALHAR COM DADOS
  // ============================================
  
  /**
   * Carrega itens da API
   */
  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Substituir por chamada real à API
      // Exemplo: const data = await listItems();
      // setItems(data);
      
      // Dados mockados para teste
      setTimeout(() => {
        setItems([
          {
            id: '1',
            nome: 'Item 1',
            descricao: 'Descrição do item 1',
            status: 'ativo',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            nome: 'Item 2',
            descricao: 'Descrição do item 2',
            status: 'inativo',
            created_at: new Date().toISOString(),
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar itens');
      setLoading(false);
    }
  };

  /**
   * Salva um novo item ou atualiza existente
   */
  const handleSave = async () => {
    try {
      if (editingItem) {
        // TODO: Atualizar item existente
        // await updateItem(editingItem.id, formData);
        console.log('Atualizar:', editingItem.id, formData);
      } else {
        // TODO: Criar novo item
        // await createItem(formData);
        console.log('Criar:', formData);
      }
      
      // Fechar modal e recarregar lista
      setIsModalOpen(false);
      setEditingItem(null);
      resetForm();
      loadItems();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar');
    }
  };

  /**
   * Deleta um item
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este item?')) {
      return;
    }

    try {
      // TODO: Chamar API para deletar
      // await deleteItem(id);
      console.log('Deletar:', id);
      loadItems();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar');
    }
  };

  /**
   * Abre modal para editar
   */
  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      nome: item.nome,
      descricao: item.descricao || '',
      status: item.status,
    });
    setIsModalOpen(true);
  };

  /**
   * Abre modal para criar novo
   */
  const handleNew = () => {
    setEditingItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  /**
   * Reseta formulário
   */
  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      status: 'ativo',
    });
  };

  /**
   * Filtra itens pela busca
   */
  const filteredItems = items.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================================
  // 4. RENDERIZAR TELA
  // ============================================

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Erro
  if (error && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro: {error}</p>
          <button
            onClick={loadItems}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Tela principal
  return (
    <div className="p-8">
      {/* ============================================ */}
      {/* CABEÇALHO */}
      {/* ============================================ */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Nome da Tela</h1>
          <p className="text-gray-600">Descrição do que esta tela faz</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Novo Item
        </button>
      </div>

      {/* ============================================ */}
      {/* BUSCA E FILTROS */}
      {/* ============================================ */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ============================================ */}
      {/* MENSAGEM DE ERRO (se houver) */}
      {/* ============================================ */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* ============================================ */}
      {/* TABELA DE ITENS */}
      {/* ============================================ */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Nome</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Descrição</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Nenhum item encontrado
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-800">{item.nome}</td>
                  <td className="p-4 text-sm text-gray-600">{item.descricao || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'ativo'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Deletar"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ============================================ */}
      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      {/* ============================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar Item' : 'Novo Item'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ativo' | 'inativo' })}
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                  setEditingItem(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}






