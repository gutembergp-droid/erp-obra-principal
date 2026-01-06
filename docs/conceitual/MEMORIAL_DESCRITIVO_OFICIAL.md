# MEMORIAL DESCRITIVO OFICIAL – ERP GENESIS
## Plataforma Corporativa + Módulo Obra
### Versão Final – Documento Mestre
**Data:** Janeiro / 2026

---

## 1. VISÃO GERAL DO ERP GENESIS

O ERP GENESIS é uma plataforma corporativa integrada, desenvolvida especificamente para empresas de engenharia pesada e infraestrutura (rodovias, pontes, barragens, saneamento, grandes obras).

O sistema é estruturado em **DOIS GRANDES BLOCOS INSEPARÁVEIS**:

1. **MÓDULO CORPORATIVO** (Governança, Estratégia e Padronização)
2. **MÓDULO OBRA** (Execução, Controle e Resultado)

### Princípio Fundamental do GENESIS:

**"O CORPORATIVO GOVERNA. A OBRA EXECUTA."**

- Nada nasce na obra sem origem corporativa.
- Nada é validado no corporativo sem evidência da obra.

---

## 2. ARQUITETURA CONCEITUAL MACRO

```
ERP GENESIS (Plataforma Única)
│
├── MÓDULO CORPORATIVO
│   ├── Governança Corporativa
│   ├── Baseline Comercial (Estratégia e Governança)
│   ├── Cadastro de Obras
│   ├── Contratos e Clientes
│   ├── Padrões Técnicos e Econômicos
│   ├── Usuários e Perfis
│   ├── Políticas, Regras e Gates Globais
│
└── MÓDULO OBRA
    ├── Comercial da Obra
    ├── Engenharia
    ├── Produção
    ├── Suprimentos
    ├── Custos
    ├── Qualidade
    ├── SSMA
    ├── Meio Ambiente
    ├── Financeiro da Obra
    ├── Planejamento e Controle
    ├── Painel Gerencial Integrado
```

---

## 3. MÓDULO CORPORATIVO – CONCEITO E RESPONSABILIDADES

O Módulo Corporativo é o **"CÉREBRO"** do ERP GENESIS.  
Ele **NÃO executa obra**. Ele **DEFINE, CONTROLA e GOVERNA**.

### Responsabilidades Principais:

- Cadastro e gestão de **CLIENTES**
- Cadastro e gestão de **CONTRATOS**
- **Abertura de Centro de Custo**
- **Upload de Planilha Analítica** com dados referenciais:
  - Proposta
  - Orçamento
  - Preços
  - Dados referenciais
- Parametrização padrão (custos, índices, metas)
- Governança de **GATES globais**
- Criação e liberação de **OBRAS**
- Gestão de usuários e perfis
- Consolidação corporativa multi-obras

### IMPORTANTE:

O upload da planilha analítica de orçamento nasce **CONCEITUALMENTE no CORPORATIVO**.  
O Corporativo **NÃO cria a EAP**. Ele apenas fornece **dados referenciais** (proposta, orçamento, preços).  
A **EAP é criada no Módulo Obra, no Departamento Comercial**, usando esses dados referenciais.

---

## 4. BASELINE COMERCIAL – ESTRATÉGIA E GOVERNANÇA

A Baseline Comercial é o **coração do sistema**.

### Ela representa:

- A **VERDADE ECONÔMICA OFICIAL** da obra
- O contrato base
- O orçamento validado
- A estratégia de execução
- As metas econômicas

### Características:

- **Versionada** (Baseline v1, v2, v3...)
- **Auditável**
- **Imutável** após liberação
- **Criada no Comercial da Obra** (usando dados referenciais do Corporativo)
- **Referência única** para todas as áreas da obra

### Conteúdo da Baseline:

- Planilha analítica de serviços (estruturada pelo Comercial)
- Itens contratuais
- Estrutura de receita
- Estrutura de custos
- Custos-meta
- Margens esperadas
- Índices de desempenho alvo

### IMPORTANTE - Fluxo de Criação:

1. **Corporativo:** Abre centro de custo e carrega planilha analítica com dados referenciais (proposta, orçamento, preços)
2. **Sistema:** Preenche automaticamente o sistema comercial com essas informações
3. **Comercial da Obra:** Gerente comercial cria a EAP e faz a **ESTRUTURAÇÃO**
4. **Comercial da Obra:** Após estruturação, **libera para outros serviços**

---

## 5. TRANSIÇÃO CORPORATIVO → OBRA

### Fluxo Oficial:

1. Corporativo **cria** a obra
2. Corporativo **abre centro de custo** e **carrega planilha analítica** com dados referenciais (proposta, orçamento, preços)
3. Sistema **preenche automaticamente** o sistema comercial com essas informações
4. Corporativo **LIBERA** a obra (Gate 1)
5. Obra passa a existir operacionalmente
6. **Comercial da Obra:** Gerente comercial cria a EAP e faz a **ESTRUTURAÇÃO** (primeira atividade)
7. **Comercial da Obra:** Após estruturação, **libera para outros serviços**
8. Obra **NÃO altera** a baseline após liberação, apenas executa

### Esse processo é controlado pelo:

**GATE 1 – LIBERAÇÃO DA OBRA**

---

## 6. MÓDULO OBRA – VISÃO GERAL

O Módulo Obra é o ambiente de **EXECUÇÃO**.  
Ele transforma estratégia em realidade.

### Princípio:

**"Executar, medir, comparar, corrigir."**

Todos os departamentos da obra operam sobre:
- A mesma baseline
- A mesma EAP
- Os mesmos dados mestres

---

## 7. DEPARTAMENTOS DO MÓDULO OBRA

### 7.1 COMERCIAL DA OBRA

**Responsável por:**
- **ESTRUTURAÇÃO** (primeira atividade)
  - Criação da EAP
  - Estruturação hierárquica baseada em dados referenciais do Corporativo
  - Definição de itens e valores
  - Liberação para outros serviços após estruturação
- Medição de Produção (MP)
- Medição do Cliente (MC)
- Aditivos
- Glosas
- Faturamento
- Comparativo MP x MC (sigiloso)

**Conceito-chave:**
- **EAP é criada no Comercial**, usando dados referenciais do Corporativo
- **Estruturação é a primeira atividade** do Gerente Comercial
- MP ≠ MC (podem divergir)
- Desvios exigem justificativa e governança.

### 7.2 ENGENHARIA

**Responsável por:**
- Projetos
- Documentação técnica
- Liberação de frentes
- Apoio técnico à produção
- Interface com qualidade e SSMA

### 7.3 PRODUÇÃO

**Responsável por:**
- Execução física
- Avanços diários
- PBS
- Apontamentos
- Produtividade

**IMPORTANTE:**  
Produção **NÃO trabalha** com valores financeiros absolutos.

### 7.4 SUPRIMENTOS

**Responsável por:**
- Requisições
- Compras
- Contratos
- Recebimentos
- Controle de saldo

Integrado com custos e produção.

### 7.5 CUSTOS

**Responsável por:**
- Apropriações
- Rateios
- Controle CR/CO
- Controle F/CD
- Fechamento mensal

### 7.6 QUALIDADE

**Responsável por:**
- Inspeções
- NCs
- Ensaios
- Liberação de serviços

**QUALIDADE TEM PODER DE TRAVA (GATE).**

### 7.7 SSMA

**Responsável por:**
- Segurança do trabalho
- Incidentes
- Treinamentos
- Inspeções de campo

**SSMA TEM PODER DE TRAVA (GATE).**

### 7.8 MEIO AMBIENTE

**Responsável por:**
- Licenças
- Condicionantes
- Monitoramentos

### 7.9 FINANCEIRO DA OBRA

**Responsável por:**
- Fluxo de caixa
- Contas a receber
- Contas a pagar
- Interface com faturamento

### 7.10 GERENCIAL

**Responsável por:**
- Análise de resultado
- Tendências
- Cenários
- Tomada de decisão

---

## 8. EAP – ESTRUTURA ANALÍTICA COM VISÃO DUAL

A EAP é **ÚNICA**, mas possui **DUAS LEITURAS**:

### 1) VISÃO COMERCIAL (econômica)
- Unidade: m³, ton, m², hh
- Foco: custo unitário, margem, resultado

### 2) VISÃO OPERACIONAL (execução)
- Unidade: bloco, estaca, viga, trecho
- Foco: produção, quantidade, avanço

### As duas visões são conectadas por:

**FATORES DE CONVERSÃO**

**Exemplo:**
1 bloco tipo A = 2,50 m³

**Os valores financeiros DEVEM ser idênticos, independente da unidade.**

---

## 9. GATES DE GOVERNANÇA (OBRIGATÓRIOS)

Os Gates garantem disciplina real de obra.

### Gates Definidos:

1. **Gate 1** – Liberação da Obra
2. **Gate 2** – Fechamento Mensal de Custos
3. **Gate 3** – Fechamento de Produção
4. **Gate 4** – Fechamento Comercial
5. **Gate 5** – Qualidade OK
6. **Gate 6** – SSMA OK
7. **Gate 7** – Financeiro OK
8. **Gate 8** – Gerencial OK
9. **Gate 9** – Competência Concluída

### REGRA FUNDAMENTAL:

**Sem Qualidade OK e SSMA OK, a competência NÃO FECHA.**

---

## 10. FECHAMENTO MENSAL

Uma competência mensal só é considerada **FECHADA** quando:

- ✅ Produção validada
- ✅ Custos apropriados
- ✅ Receita validada
- ✅ Qualidade aprovada
- ✅ SSMA aprovado
- ✅ Financeiro conciliado
- ✅ Gerencial aprovado

Isso reflete a **VIDA REAL DE OBRA**.

---

## 11. INTERFACE E EXPERIÊNCIA DO USUÁRIO

### Princípios Obrigatórios:

- Sidebar lateral fixa (departamentos)
- Topbar com ações globais
- Páginas operacionais = tabelas
- Páginas gerenciais = resumos + gráficos
- Nada de excesso de cards
- Alta densidade de informação
- Cada assunto na sua "caixinha"

---

## 12. CONCLUSÃO

O ERP GENESIS não é um sistema genérico.  
Ele é uma **PLATAFORMA DE GESTÃO DE OBRAS REAIS**.

Ele une:
- Estratégia corporativa
- Execução de obra
- Governança rígida
- Informação confiável
- Decisão baseada em fatos

**Este documento é a referência oficial para qualquer desenvolvimento futuro.**

---

**FIM DO MEMORIAL DESCRITIVO OFICIAL – ERP GENESIS**

