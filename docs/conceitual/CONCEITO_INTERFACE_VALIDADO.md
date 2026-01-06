# 🎯 Conceito de Interface - VALIDADO E TRAVADO

**Data:** Janeiro 2026  
**Status:** ✅ **CONCEITO OFICIAL TRAVADO**

---

## 📋 RESUMO EXECUTIVO

Este documento contém o **conceito oficial e travado** da interface do ERP GENESIS, validado e aprovado para implementação.

---

## 1. FLUXO DE NAVEGAÇÃO PÓS-LOGIN

### 1.1. Regra Oficial (Travada)

```
Login → Intranet (SEMPRE obrigatório) → Departamento
```

### 1.2. Comportamento Detalhado

**Após o login, o usuário SEMPRE cai primeiro na INTRANET.**

**Em seguida:**

- ✅ **Se o usuário tiver apenas UM departamento principal:**
  - Sistema redireciona **automaticamente** para esse departamento

- ✅ **Se o usuário tiver mais de um departamento/perfil:**
  - Intranet funciona como **tela de escolha**
  - Atalhos claros para cada departamento disponível

### 1.3. Motivos do Design

- ✅ Mantém visão institucional
- ✅ Evita "usuário perdido"
- ✅ Funciona bem para gestores multiárea

### 1.4. Implementação

**Intranet deve ter:**
- ✅ Informações gerais do sistema
- ✅ Atalhos para departamentos do usuário
- ✅ Redirecionamento automático se apenas 1 perfil

---

## 2. NÍVEIS OPERACIONAL / TÁTICO / ESTRATÉGICO

### 2.1. Conceito Fundamental

**Os níveis NÃO aparecem explicitamente para o usuário final.**

Eles são um **conceito arquitetural, não visual**.

### 2.2. Como Funciona na Prática

#### 📊 Nível Operacional
- **Telas de execução**
- **Sempre tabelas**
- Dados primários
- **Exemplos:**
  - Apontamentos
  - Medições
  - Requisições
  - Inspeções

#### 📈 Nível Tático
- **Telas de controle**
- **Tabela + gráficos opcionais**
- Comparativos, desvios
- **Exemplos:**
  - CR/CO
  - MP x MC
  - Acompanhamento mensal

#### 🎯 Nível Estratégico
- **Telas de governança**
- Resumo + indicadores
- Pouca edição, muita leitura
- **Exemplos:**
  - Gates
  - Fechamento Mensal
  - Painel Gerencial

### 2.3. Regra de Ouro

**A mesma informação pode aparecer em níveis diferentes, mas com profundidades e permissões diferentes.**

### 2.4. Implementação

- ❌ **NÃO criar abas ou menus separados por nível**
- ✅ **Organizar telas por funcionalidade/departamento**
- ✅ **Aplicar o conceito na profundidade dos dados**

---

## 3. TOGGLE TABELA / GRÁFICOS

### 3.1. Regra Fundamental

**NÃO. Apenas dados consolidados podem ter gráficos.**

### 3.2. Regras Claras

- ✅ **Tabela é SEMPRE a visualização padrão**
- ✅ **Gráficos são opcionais, quando:**
  - Existe consolidação
  - Existe comparação
  - Existe tendência temporal

### 3.3. Exemplos Práticos

#### ✅ Pode ter gráfico:
- Custos mensais
- Evolução de produção
- CR/CO
- MP x MC
- Indicadores de SSMA

#### ❌ Não deve ter gráfico:
- Cadastros
- Lançamentos unitários
- Apontamentos diários
- Listas operacionais puras

### 3.4. Regra Visual

- ✅ **Toggle só aparece se o gráfico fizer sentido**
- ❌ **Nunca forçar gráfico "decorativo"**

### 3.5. Implementação

**Template de Tela:**
```
┌─────────────────────────────────────┐
│  Cabeçalho                           │
├─────────────────────────────────────┤
│  Ações (Novo, Exportar)              │
├─────────────────────────────────────┤
│  Filtros e Busca                     │
├─────────────────────────────────────┤
│  [Toggle: Tabela | Gráficos]        │ ← Só aparece se aplicável
├─────────────────────────────────────┤
│  [ÁREA DE CONTEÚDO]                 │
│  - Tabela (padrão) OU                │
│  - Gráficos (alternativa)            │
└─────────────────────────────────────┘
```

---

## 4. WORKFLOWS - EXEMPLOS PRÁTICOS

### 4.1. Princípio Fundamental

**Todo workflow no GENESIS segue:**

```
INÍCIO → PROCESSO → FIM (com validação)
```

### 4.2. Exemplo 1 – Requisição de Compra

#### INÍCIO
- Usuário cria requisição (Produção / Engenharia)

#### PROCESSO
- Aprovação técnica
- Aprovação de suprimentos
- Aprovação financeira (se aplicável)

#### FIM
- Pedido gerado
- Compromisso de custo registrado
- Histórico auditável

### 4.3. Exemplo 2 – Medição de Produção (MP)

#### INÍCIO
- Produção lança quantidades executadas

#### PROCESSO
- Validação técnica
- Confronto com EAP
- Consolidação mensal

#### FIM
- MP fechada
- Dados disponíveis para custos e gerencial

### 4.4. Exemplo 3 – Fechamento Mensal (Competência)

#### INÍCIO
- Abertura da competência

#### PROCESSO
- Gate 2: Custos
- Gate 3: Produção
- Gate 4: Comercial
- Gate 5: Qualidade (TRAVA)
- Gate 6: SSMA (TRAVA)
- Gate 7: Financeiro
- Gate 8: Gerencial

#### FIM
- Gate 9 liberado
- Competência encerrada
- Dados consolidados e imutáveis

### 4.5. Regra Crítica

**❗ Sem Qualidade ou SSMA aprovados, o sistema BLOQUEIA o fechamento.**

### 4.6. Implementação

**Cada tela de workflow deve ter:**
- ✅ **Início claro:** O que fazer
- ✅ **Processo claro:** Como fazer
- ✅ **Fim claro:** Resultado esperado
- ✅ **Validações visíveis:** Status, aprovações, bloqueios

---

## 5. RESUMO DAS REGRAS DE OURO

### 5.1. Navegação
- ✅ Intranet é obrigatória e central
- ✅ Redirecionamento automático se 1 perfil
- ✅ Escolha manual se múltiplos perfis

### 5.2. Visualização
- ✅ Tabela é padrão
- ✅ Gráfico é opcional e seletivo
- ✅ Toggle só aparece quando faz sentido

### 5.3. Organização
- ✅ Níveis são conceituais, não menus
- ✅ Telas organizadas por departamento/funcionalidade
- ✅ Profundidade dos dados varia por nível

### 5.4. Workflows
- ✅ Todo processo tem início, meio e fim claros
- ✅ Validações visíveis
- ✅ Qualidade e SSMA têm poder real de trava

---

## 6. TEMPLATE DE TELA BÁSICA

### 6.1. Estrutura Padrão

```typescript
┌─────────────────────────────────────┐
│  Cabeçalho (Título + Descrição)    │
├─────────────────────────────────────┤
│  Botões de Ação (Novo, Exportar)    │
├─────────────────────────────────────┤
│  Filtros e Busca                     │
├─────────────────────────────────────┤
│  [Toggle: Tabela | Gráficos]        │ ← Condicional
├─────────────────────────────────────┤
│  [ÁREA DE CONTEÚDO]                 │
│  - Tabela (padrão) OU               │
│  - Gráficos (alternativa)            │
└─────────────────────────────────────┘
```

### 6.2. Características

1. **Cabeçalho Simples**
   - Título grande
   - Descrição curta
   - Sem muitos elementos

2. **Área de Ações**
   - Botões principais no topo
   - Máximo 3-4 ações principais

3. **Filtros e Busca**
   - Barra de busca
   - Filtros opcionais (colapsáveis)

4. **Toggle de Visualização** (Condicional)
   - Só aparece se gráfico fizer sentido
   - Botão/switch: "Tabela" ↔ "Gráficos"
   - Estado persistente

5. **Área de Conteúdo**
   - **Tabela (padrão):**
     - Colunas claras
     - Ordenação
     - Paginação
     - Ações por linha
   - **Gráficos (alternativa):**
     - Gráficos relevantes
     - Filtros aplicados
     - Exportação

---

## 7. CHECKLIST DE IMPLEMENTAÇÃO

### 7.1. Navegação
- [ ] Intranet como primeira tela após login
- [ ] Redirecionamento automático se 1 perfil
- [ ] Atalhos na Intranet se múltiplos perfis

### 7.2. Visualização
- [ ] Tabela como padrão
- [ ] Toggle gráfico apenas quando aplicável
- [ ] Gráficos apenas para dados consolidados

### 7.3. Organização
- [ ] Telas organizadas por departamento
- [ ] Níveis conceituais (não visuais)
- [ ] Profundidade adequada por nível

### 7.4. Workflows
- [ ] Início, meio e fim claros
- [ ] Validações visíveis
- [ ] Bloqueios quando necessário

---

## 8. CONCLUSÃO

Este documento contém o **conceito oficial e travado** da interface do ERP GENESIS.

**Princípios Fundamentais:**
- ✅ Intranet é obrigatória e central
- ✅ Níveis são conceituais, não menus
- ✅ Tabela é padrão, gráfico é opcional e seletivo
- ✅ Todo processo tem início, meio e fim claros
- ✅ Qualidade e SSMA têm poder real de trava

**Status:** ✅ **CONCEITO VALIDADO E TRAVADO PARA IMPLEMENTAÇÃO**

---

**Fim do Documento**



