# Interface de Estruturação da EAP

Interface profissional de alta densidade para estruturação da EAP (Estrutura Analítica do Projeto) com visão dual Comercial/Operacional.

## Características

### ✅ Regras Visuais Implementadas

1. **SEM CARDS**: Interface limpa sem cartões ou espaços vazios desnecessários
2. **TABELA DE ALTA DENSIDADE**: Tabela estilo planilha profissional que ocupa toda a largura da tela
3. **TEMA ESCURO**: Dark mode com cores sóbrias (#1a1a1a, #2a2a2a, etc.)
4. **VISÃO DUAL**: Colunas separadas para dados Comerciais e Operacionais
5. **DRAWERS**: Configurações detalhadas em gavetas laterais sem ocultar a tabela principal

## Estrutura de Arquivos

```
src/components/EapEstruturacao/
├── EapEstruturacaoTable.tsx    # Componente principal da tabela
├── EapEstruturacaoTable.css    # Estilos da tabela (alta densidade)
├── EapDrawer.tsx               # Drawer lateral para configurações
├── EapDrawer.css               # Estilos do drawer
└── index.ts                    # Exportações

src/pages/
├── EapEstruturacaoPage.tsx     # Página principal (exemplo de uso)
└── EapEstruturacaoPage.css     # Estilos da página
```

## Uso

### Importação

```tsx
import { EapEstruturacaoTable } from '../components/EapEstruturacao';
import { Eap, EapFatorConversao } from '../types';
```

### Exemplo Básico

```tsx
<EapEstruturacaoTable
  baselineId="baseline-1"
  eapComercial={eapComercial}
  eapOperacional={eapOperacional}
  fatoresConversao={fatoresConversao}
  onUpdateEap={handleUpdateEap}
  onUpdateFatorConversao={handleUpdateFatorConversao}
/>
```

## Colunas da Tabela

### Grupo Comercial
- **Código**: Código hierárquico da EAP (ex: 1.1.2.3)
- **Descrição Comercial**: Descrição do item comercial
- **Unidade**: Unidade de medida (m³, ton, etc.)
- **Volume Planejado**: Quantidade planejada
- **Custo Unitário Meta**: Valor unitário meta

### Separador Visual
- Seta (→) indicando conversão para operacional

### Grupo Operacional
- **Unidade Operacional**: Unidade de medida operacional (bloco, viga, etc.)
- **Quantidade Planejada**: Quantidade calculada via fator de conversão

### Ações
- Botão de configuração (⚙) para abrir drawer

## Drawer de Configuração

O drawer lateral possui 3 abas:

### 1. Comercial
- Edição de dados comerciais
- Descrição, unidade, volume, custo unitário
- Cálculo automático do valor total

### 2. Operacional
- Lista de EAPs Operacionais relacionadas
- Exibição de fatores de conversão
- Detalhes de cada item operacional

### 3. Fatores de Conversão
- Lista completa de fatores configurados
- Status (ativo/inativo)
- Valores de fator quantidade e valor
- Observações

## Integração com API

A interface está preparada para integração com API. Substitua os dados mockados em `EapEstruturacaoPage.tsx`:

```tsx
// Exemplo de integração
useEffect(() => {
  const loadData = async () => {
    const response = await fetch(`/api/baseline/${baselineId}/eap`);
    const data = await response.json();
    setEapComercial(data.eapComercial);
    setEapOperacional(data.eapOperacional);
    setFatoresConversao(data.fatoresConversao);
  };
  loadData();
}, [baselineId]);
```

## Estilo e Tema

### Cores Principais
- **Fundo Principal**: `#1a1a1a`
- **Fundo Secundário**: `#2a2a2a`
- **Bordas**: `#3a3a3a`
- **Texto Principal**: `#e0e0e0`
- **Texto Secundário**: `#b0b0b0`
- **Destaque**: `#4a90e2` (azul)

### Tipografia
- **Fonte**: Consolas, Monaco, Courier New (monospace)
- **Tamanho Base**: 12px
- **Alta Densidade**: Padding mínimo (6px)

## Responsividade

A tabela mantém alta densidade mesmo em telas menores:
- Redução automática de font-size
- Padding ajustado
- Scroll horizontal quando necessário

## Acessibilidade

- Contraste adequado para leitura
- Hover states claros
- Feedback visual em interações
- Navegação por teclado (a implementar)

## Próximos Passos

- [ ] Integração completa com API
- [ ] Validação de dados em tempo real
- [ ] Exportação para Excel/CSV
- [ ] Filtros e busca
- [ ] Ordenação de colunas
- [ ] Edição inline na tabela
- [ ] Histórico de alterações

