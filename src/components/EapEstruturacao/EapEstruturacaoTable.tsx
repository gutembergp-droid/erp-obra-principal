import React, { useState } from 'react';
import { Eap, EapFatorConversao } from '../../types';
import { EapDrawer } from './EapDrawer';
import './EapEstruturacaoTable.css';

interface EapEstruturacaoTableProps {
  baselineId: string;
  eapComercial: Eap[];
  eapOperacional: Eap[];
  fatoresConversao: EapFatorConversao[];
  onUpdateEap?: (eap: Eap) => void;
  onUpdateFatorConversao?: (fator: EapFatorConversao) => void;
}

interface EapRowData {
  eapComercial: Eap;
  fatoresConversao: EapFatorConversao[];
  eapOperacionalRelacionadas: Eap[];
}

export const EapEstruturacaoTable: React.FC<EapEstruturacaoTableProps> = ({
  baselineId,
  eapComercial,
  eapOperacional,
  fatoresConversao,
  onUpdateEap,
  onUpdateFatorConversao,
}) => {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Agrupa EAP Comercial com seus fatores de conversão e EAPs Operacionais relacionadas
  const rowsData: EapRowData[] = eapComercial
    .filter(eap => eap.is_folha) // Apenas itens folha na visão principal
    .map(eap => {
      const fatores = fatoresConversao.filter(f => f.eap_comercial_id === eap.id && f.is_ativo);
      const eapsOperacionais = fatores.map(f => 
        eapOperacional.find(e => e.id === f.eap_operacional_id)
      ).filter(Boolean) as Eap[];

      return {
        eapComercial: eap,
        fatoresConversao: fatores,
        eapOperacionalRelacionadas: eapsOperacionais,
      };
    });

  const handleRowClick = (eapId: string) => {
    setSelectedRow(eapId);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const selectedRowData = rowsData.find(r => r.eapComercial.id === selectedRow);

  return (
    <div className="eap-estruturacao-container">
      <div className="eap-table-wrapper">
        <table className="eap-estruturacao-table">
          <thead>
            <tr>
              <th className="col-codigo">Código</th>
              <th className="col-descricao-comercial">Descrição Comercial</th>
              <th className="col-unidade-comercial">Unidade</th>
              <th className="col-volume-planejado">Volume Planejado</th>
              <th className="col-custo-unitario">Custo Unitário Meta</th>
              <th className="col-separator"></th>
              <th className="col-unidade-operacional">Unidade Operacional</th>
              <th className="col-quantidade-planejada">Quantidade Planejada</th>
              <th className="col-acoes">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rowsData.length === 0 ? (
              <tr>
                <td colSpan={9} className="empty-state">
                  Nenhum item de EAP encontrado. Adicione itens folha na EAP Comercial.
                </td>
              </tr>
            ) : (
              rowsData.map((row) => {
                const eapCom = row.eapComercial;
                const primeiroFator = row.fatoresConversao[0];
                const primeiraEapOp = row.eapOperacionalRelacionadas[0];

                // Calcula quantidade operacional baseada no fator de conversão
                const quantidadeOperacional = primeiroFator && primeiraEapOp
                  ? (Number(eapCom.quantidade || 0) * Number(primeiroFator.fator_quantidade))
                  : null;

                return (
                  <tr
                    key={eapCom.id}
                    className={selectedRow === eapCom.id ? 'selected' : ''}
                    onClick={() => handleRowClick(eapCom.id)}
                  >
                    <td className="col-codigo">{eapCom.codigo}</td>
                    <td className="col-descricao-comercial">{eapCom.descricao}</td>
                    <td className="col-unidade-comercial">{eapCom.unidade_medida || '-'}</td>
                    <td className="col-volume-planejado">
                      {eapCom.quantidade?.toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 4 
                      }) || '-'}
                    </td>
                    <td className="col-custo-unitario">
                      {eapCom.valor_unitario?.toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }) || '-'}
                    </td>
                    <td className="col-separator">→</td>
                    <td className="col-unidade-operacional">
                      {primeiraEapOp?.unidade_medida || '-'}
                    </td>
                    <td className="col-quantidade-planejada">
                      {quantidadeOperacional !== null
                        ? quantidadeOperacional.toLocaleString('pt-BR', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 4 
                          })
                        : '-'}
                    </td>
                    <td className="col-acoes">
                      <button
                        className="btn-config"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(eapCom.id);
                        }}
                        title="Configurar"
                      >
                        ⚙
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {drawerOpen && selectedRowData && (
        <EapDrawer
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          eapComercial={selectedRowData.eapComercial}
          fatoresConversao={selectedRowData.fatoresConversao}
          eapOperacionalRelacionadas={selectedRowData.eapOperacionalRelacionadas}
          todasEapOperacional={eapOperacional}
          onUpdateEap={onUpdateEap}
          onUpdateFatorConversao={onUpdateFatorConversao}
        />
      )}
    </div>
  );
};

