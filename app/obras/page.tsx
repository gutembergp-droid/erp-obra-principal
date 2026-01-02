'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Obra } from '../../src/types/obras';
import { listObras, createObra, updateObra, deleteObra } from '../../src/services/api/obraApi';
import { logout } from '../../src/services/api/authApi';
import { ProtectedRoute } from '../../src/components/ProtectedRoute';
import './page.css';

/**
 * Página de Gestão de Obras
 * 
 * Exibe lista de obras e permite criar novas obras através de um Drawer
 */
function ObrasPageContent() {
  const router = useRouter();
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingObraId, setEditingObraId] = useState<string | null>(null);
  
  // Filtros
  const [filters, setFilters] = useState({
    status: '',
    cliente: '',
  });

  // Formulário de nova obra
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    cliente: '',
    data_inicio: '',
    data_fim_prevista: '',
    orcamento_total: '',
    status: 'planejamento' as "planejamento" | "em_andamento" | "pausada" | "concluida" | "cancelada",
  });

  /**
   * Carrega obras da API com filtros
   */
  const loadObras = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filterParams: any = {};
      if (filters.status) filterParams.status = filters.status;
      if (filters.cliente) filterParams.cliente = filters.cliente;
      
      const data = await listObras(Object.keys(filterParams).length > 0 ? filterParams : undefined);
      setObras(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar obras');
      console.error('Erro ao carregar obras:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.cliente]);

  /**
   * Carrega obras ao montar o componente e quando filtros mudam
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      loadObras();
    }, filters.cliente ? 500 : 0); // Debounce de 500ms para campo de texto

    return () => clearTimeout(timer);
  }, [loadObras, filters.cliente]);

  /**
   * Abre o drawer de nova obra
   */
  const handleOpenDrawer = () => {
    setEditingObraId(null);
    setIsDrawerOpen(true);
    // Limpa formulário
    setFormData({
      codigo: '',
      nome: '',
      descricao: '',
      cliente: '',
      data_inicio: '',
      data_fim_prevista: '',
      orcamento_total: '',
      status: 'planejamento',
    });
  };

  /**
   * Abre o drawer para editar obra
   */
  const handleEditObra = (obra: Obra) => {
    setEditingObraId(obra.id);
    setIsDrawerOpen(true);
    // Preenche formulário com dados da obra
    setFormData({
      codigo: obra.codigo,
      nome: obra.nome,
      descricao: obra.descricao || '',
      cliente: obra.cliente || '',
      data_inicio: obra.data_inicio 
        ? new Date(obra.data_inicio).toISOString().split('T')[0]
        : '',
      data_fim_prevista: obra.data_fim_prevista
        ? new Date(obra.data_fim_prevista).toISOString().split('T')[0]
        : '',
      orcamento_total: obra.orcamento_total?.toString() || '',
      status: obra.status,
    });
  };

  /**
   * Fecha o drawer
   */
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingObraId(null);
  };

  /**
   * Atualiza campo do formulário
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Salva ou atualiza obra
   */
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Valida campos obrigatórios
      if (!formData.codigo || !formData.nome) {
        setError('Código e Nome são obrigatórios');
        return;
      }

      // Prepara dados para envio
      const obraData = {
        codigo: formData.codigo,
        nome: formData.nome,
        descricao: formData.descricao || undefined,
        cliente: formData.cliente || undefined,
        data_inicio: formData.data_inicio ? new Date(formData.data_inicio) : undefined,
        data_fim_prevista: formData.data_fim_prevista ? new Date(formData.data_fim_prevista) : undefined,
        orcamento_total: formData.orcamento_total ? parseFloat(formData.orcamento_total) : undefined,
        status: formData.status,
      };

      // Chama a API para criar ou atualizar obra
      if (editingObraId) {
        await updateObra(editingObraId, obraData);
      } else {
        await createObra(obraData);
      }

      // Fecha drawer e recarrega lista
      setIsDrawerOpen(false);
      setEditingObraId(null);
      await loadObras();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar obra');
      console.error('Erro ao salvar obra:', err);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Exclui obra (soft delete)
   */
  const handleDeleteObra = async (obraId: string, obraNome: string) => {
    // Confirmação
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a obra "${obraNome}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmar) {
      return;
    }

    try {
      setIsDeleting(obraId);
      setError(null);

      // Chama a API para deletar obra (soft delete)
      await deleteObra(obraId);

      // Recarrega lista
      await loadObras();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir obra');
      console.error('Erro ao excluir obra:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  /**
   * Atualiza filtros
   */
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Formata data para exibição
   */
  const formatDate = (date?: Date | string): string => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
  };

  /**
   * Formata valor monetário
   */
  const formatCurrency = (value?: number): string => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  /**
   * Obtém cor do status
   */
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      planejamento: '#9CA3AF',
      em_andamento: '#3B82F6',
      pausada: '#F59E0B',
      concluida: '#10B981',
      cancelada: '#EF4444',
    };
    return colors[status] || '#9CA3AF';
  };

  return (
    <div className="obras-page">
      {/* Header */}
      <div className="obras-header">
        <h1>Gestão de Obras</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleOpenDrawer}>
            + Nova Obra
          </button>
          <button className="btn-logout" onClick={async () => {
            try {
              await logout();
              router.push('/login');
            } catch (error) {
              router.push('/login');
            }
          }}>
            Sair
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="filter-status">Status</label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            <option value="planejamento">Planejamento</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="pausada">Pausada</option>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="filter-cliente">Cliente</label>
          <input
            type="text"
            id="filter-cliente"
            value={filters.cliente}
            onChange={(e) => handleFilterChange('cliente', e.target.value)}
            placeholder="Filtrar por cliente..."
            className="filter-input"
          />
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading">
          Carregando obras...
        </div>
      )}

      {/* Tabela de obras */}
      {!loading && (
        <div className="obras-table-container">
          <table className="obras-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Data Início</th>
                <th>Data Fim Prevista</th>
                <th>Orçamento Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {obras.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    Nenhuma obra encontrada
                  </td>
                </tr>
              ) : (
                obras.map((obra) => (
                  <tr key={obra.id}>
                    <td>{obra.codigo}</td>
                    <td>{obra.nome}</td>
                    <td>{obra.cliente || '-'}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(obra.status) }}
                      >
                        {obra.status}
                      </span>
                    </td>
                    <td>{formatDate(obra.data_inicio)}</td>
                    <td>{formatDate(obra.data_fim_prevista)}</td>
                    <td>{formatCurrency(obra.orcamento_total)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-view"
                          onClick={() => router.push(`/obras/${obra.id}`)}
                          title="Ver detalhes"
                        >
                          👁️
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleEditObra(obra)}
                          title="Editar obra"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteObra(obra.id, obra.nome)}
                          disabled={isDeleting === obra.id}
                          title="Excluir obra"
                        >
                          {isDeleting === obra.id ? '...' : '🗑️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer de Nova Obra */}
      {isDrawerOpen && (
        <>
          <div className="drawer-overlay" onClick={handleCloseDrawer} />
          <div className="drawer">
            <div className="drawer-header">
              <h2>{editingObraId ? 'Editar Obra' : 'Nova Obra'}</h2>
              <button className="drawer-close" onClick={handleCloseDrawer}>
                ×
              </button>
            </div>
            <div className="drawer-content">
              <div className="form-group">
                <label htmlFor="codigo">Código *</label>
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="nome">Nome *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cliente">Cliente</label>
                <input
                  type="text"
                  id="cliente"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="data_inicio">Data Início</label>
                <input
                  type="date"
                  id="data_inicio"
                  name="data_inicio"
                  value={formData.data_inicio}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="data_fim_prevista">Data Fim Prevista</label>
                <input
                  type="date"
                  id="data_fim_prevista"
                  name="data_fim_prevista"
                  value={formData.data_fim_prevista}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="orcamento_total">Orçamento Total</label>
                <input
                  type="number"
                  id="orcamento_total"
                  name="orcamento_total"
                  value={formData.orcamento_total}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="planejamento">Planejamento</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="pausada">Pausada</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>
            <div className="drawer-footer">
              <button className="btn-secondary" onClick={handleCloseDrawer} disabled={isSaving}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Página de Obras com Proteção de Rota
 */
export default function ObrasPage() {
  return (
    <ProtectedRoute>
      <ObrasPageContent />
    </ProtectedRoute>
  );
}

