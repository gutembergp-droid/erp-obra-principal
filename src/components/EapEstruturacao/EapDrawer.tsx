import React, { useState, useEffect } from 'react';
import { Eap, EapFatorConversao, CreateEapFatorConversaoDto, UpdateEapFatorConversaoDto } from '../../types';
import './EapDrawer.css';

interface EapDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  eapComercial: Eap;
  fatoresConversao: EapFatorConversao[];
  eapOperacionalRelacionadas: Eap[];
  todasEapOperacional: Eap[];
  onUpdateEap?: (eap: Eap) => void;
  onUpdateFatorConversao?: (fator: EapFatorConversao) => void;
}

export const EapDrawer: React.FC<EapDrawerProps> = ({
  isOpen,
  onClose,
  eapComercial,
  fatoresConversao,
  eapOperacionalRelacionadas,
  todasEapOperacional,
  onUpdateEap,
  onUpdateFatorConversao,
}) => {
  const [activeTab, setActiveTab] = useState<'comercial' | 'operacional' | 'fatores'>('comercial');
  const [editMode, setEditMode] = useState(false);

  // Estados para edição
  const [descricao, setDescricao] = useState(eapComercial.descricao);
  const [unidadeMedida, setUnidadeMedida] = useState(eapComercial.unidade_medida || '');
  const [quantidade, setQuantidade] = useState(eapComercial.quantidade?.toString() || '');
  const [valorUnitario, setValorUnitario] = useState(eapComercial.valor_unitario?.toString() || '');

  useEffect(() => {
    if (isOpen) {
      setDescricao(eapComercial.descricao);
      setUnidadeMedida(eapComercial.unidade_medida || '');
      setQuantidade(eapComercial.quantidade?.toString() || '');
      setValorUnitario(eapComercial.valor_unitario?.toString() || '');
      setEditMode(false);
    }
  }, [isOpen, eapComercial]);

  const handleSave = () => {
    if (onUpdateEap) {
      const updatedEap: Eap = {
        ...eapComercial,
        descricao,
        unidade_medida: unidadeMedida || undefined,
        quantidade: quantidade ? parseFloat(quantidade) : undefined,
        valor_unitario: valorUnitario ? parseFloat(valorUnitario) : undefined,
        valor_total: quantidade && valorUnitario 
          ? parseFloat(quantidade) * parseFloat(valorUnitario) 
          : undefined,
      };
      onUpdateEap(updatedEap);
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setDescricao(eapComercial.descricao);
    setUnidadeMedida(eapComercial.unidade_medida || '');
    setQuantidade(eapComercial.quantidade?.toString() || '');
    setValorUnitario(eapComercial.valor_unitario?.toString() || '');
    setEditMode(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer-container">
        <div className="drawer-header">
          <div className="drawer-title">
            <span className="eap-codigo">{eapComercial.codigo}</span>
            <h3>{eapComercial.descricao}</h3>
          </div>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="drawer-tabs">
          <button
            className={`tab ${activeTab === 'comercial' ? 'active' : ''}`}
            onClick={() => setActiveTab('comercial')}
          >
            Comercial
          </button>
          <button
            className={`tab ${activeTab === 'operacional' ? 'active' : ''}`}
            onClick={() => setActiveTab('operacional')}
          >
            Operacional ({eapOperacionalRelacionadas.length})
          </button>
          <button
            className={`tab ${activeTab === 'fatores' ? 'active' : ''}`}
            onClick={() => setActiveTab('fatores')}
          >
            Fatores de Conversão ({fatoresConversao.length})
          </button>
        </div>

        <div className="drawer-content">
          {activeTab === 'comercial' && (
            <div className="tab-content">
              <div className="form-section">
                <div className="form-header">
                  <h4>Dados Comerciais</h4>
                  {!editMode && (
                    <button className="btn-edit" onClick={() => setEditMode(true)}>
                      Editar
                    </button>
                  )}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Descrição</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="input-field"
                      />
                    ) : (
                      <div className="field-value">{descricao}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Unidade de Medida</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={unidadeMedida}
                        onChange={(e) => setUnidadeMedida(e.target.value)}
                        className="input-field"
                        placeholder="m³, ton, un, etc."
                      />
                    ) : (
                      <div className="field-value">{unidadeMedida || '-'}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Volume Planejado</label>
                    {editMode ? (
                      <input
                        type="number"
                        step="0.0001"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        className="input-field"
                      />
                    ) : (
                      <div className="field-value">
                        {eapComercial.quantidade?.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 4
                        }) || '-'}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Custo Unitário Meta</label>
                    {editMode ? (
                      <input
                        type="number"
                        step="0.01"
                        value={valorUnitario}
                        onChange={(e) => setValorUnitario(e.target.value)}
                        className="input-field"
                      />
                    ) : (
                      <div className="field-value">
                        {eapComercial.valor_unitario?.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }) || '-'}
                      </div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label>Valor Total</label>
                    <div className="field-value highlight">
                      {eapComercial.valor_total?.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }) || '-'}
                    </div>
                  </div>
                </div>

                {editMode && (
                  <div className="form-actions">
                    <button className="btn-save" onClick={handleSave}>
                      Salvar
                    </button>
                    <button className="btn-cancel" onClick={handleCancel}>
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'operacional' && (
            <div className="tab-content">
              <div className="operacional-list">
                {eapOperacionalRelacionadas.length === 0 ? (
                  <div className="empty-message">
                    Nenhuma EAP Operacional relacionada. Configure os fatores de conversão.
                  </div>
                ) : (
                  eapOperacionalRelacionadas.map((eapOp, index) => {
                    const fator = fatoresConversao.find(f => f.eap_operacional_id === eapOp.id);
                    return (
                      <div key={eapOp.id} className="operacional-item">
                        <div className="item-header">
                          <span className="item-codigo">{eapOp.codigo}</span>
                          <span className="item-fator">
                            Fator: {fator?.fator_quantidade.toFixed(4)}
                          </span>
                        </div>
                        <div className="item-descricao">{eapOp.descricao}</div>
                        <div className="item-details">
                          <span>Unidade: {eapOp.unidade_medida || '-'}</span>
                          <span>
                            Qtd: {eapOp.quantidade?.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 4
                            }) || '-'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'fatores' && (
            <div className="tab-content">
              <div className="fatores-list">
                {fatoresConversao.length === 0 ? (
                  <div className="empty-message">
                    Nenhum fator de conversão configurado.
                  </div>
                ) : (
                  fatoresConversao.map((fator) => {
                    const eapOp = todasEapOperacional.find(e => e.id === fator.eap_operacional_id);
                    return (
                      <div key={fator.id} className="fator-item">
                        <div className="fator-header">
                          <span className="fator-label">EAP Operacional</span>
                          <span className={`fator-status ${fator.is_ativo ? 'ativo' : 'inativo'}`}>
                            {fator.is_ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <div className="fator-eap">
                          {eapOp ? `${eapOp.codigo} - ${eapOp.descricao}` : 'EAP não encontrada'}
                        </div>
                        <div className="fator-values">
                          <div className="fator-value">
                            <label>Fator Quantidade:</label>
                            <span>{fator.fator_quantidade.toFixed(6)}</span>
                          </div>
                          {fator.fator_valor && (
                            <div className="fator-value">
                              <label>Fator Valor:</label>
                              <span>{fator.fator_valor.toFixed(6)}</span>
                            </div>
                          )}
                        </div>
                        {fator.observacoes && (
                          <div className="fator-observacoes">
                            <label>Observações:</label>
                            <div>{fator.observacoes}</div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

