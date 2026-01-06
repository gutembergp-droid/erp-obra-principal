# 📋 MEMORIAL DESCRITIVO CONCEITUAL OFICIAL
## ERP GENESIS – Plataforma Corporativa + Módulo Obra
### Documento Mestre Validado para Desenvolvimento

**Data:** Janeiro / 2026  
**Versão:** 2.1 (Conceito Refinado e Governança Ajustada)  
**Status:** 🟢 DOCUMENTO OFICIAL DE REFERÊNCIA  
**🔒 TRAVADO:** ✅ Este documento está TRAVADO como referência oficial exclusiva

---

## ================================================================================
## 1. VISÃO GERAL DO ERP GENESIS
## ================================================================================

O ERP GENESIS é uma plataforma corporativa integrada, desenvolvida especificamente para empresas de **engenharia pesada e infraestrutura**:

- Rodovias
- Pontes e viadutos
- Barragens
- Saneamento
- Grandes obras de infraestrutura

O sistema reflete a **realidade operacional de obras reais**, com foco em:
- Governança
- Disciplina operacional
- Controle econômico
- Segurança, qualidade e resultado

### PRINCÍPIO FUNDAMENTAL:

**"O CORPORATIVO GOVERNA. A OBRA EXECUTA."**

**Regras estruturantes:**
- Nada nasce na obra sem origem corporativa
- Nada é validado no corporativo sem evidência da obra
- Estratégia é corporativa, execução é da obra

---

## ================================================================================
## 2. ARQUITETURA CONCEITUAL MACRO
## ================================================================================

```
ERP GENESIS (Plataforma Única)
│
├── MÓDULO CORPORATIVO (Governança e Estratégia)
│   ├── Governança Corporativa
│   ├── Cadastro de Clientes
│   ├── Cadastro de Contratos
│   ├── Abertura de Centro de Custo
│   ├── Upload de Planilha Analítica (Dados Referenciais)
│   ├── Padrões Técnicos e Econômicos
│   ├── Usuários e Perfis
│   ├── Políticas e Regras Globais
│   ├── Cadastro de Obras
│   ├── Homologação da Baseline Comercial
│   └── Liberação da Obra (Gate 1)
│
└── MÓDULO OBRA (Execução e Controle)
    ├── Comercial da Obra
    ├── Engenharia
    ├── Planejamento e Controle
    ├── Produção
    ├── Suprimentos
    ├── Custos
    ├── Qualidade
    ├── SST (Segurança e Saúde do Trabalho)
    ├── Meio Ambiente
    ├── Financeiro da OBRA
    └── Gerencial
```

---

## ================================================================================
## 3. MÓDULO CORPORATIVO – CONCEITO E RESPONSABILIDADES
## ================================================================================

O Módulo Corporativo é o **CÉREBRO** do ERP GENESIS.

**Ele NÃO executa obra.**  
**Ele DEFINE, GOVERNA e CONTROLA.**

### Responsabilidades:
- Definir estratégia econômica
- Garantir padronização
- Controlar riscos corporativos
- Governar dados mestres
- Homologar baselines
- Liberar obras para execução

---

### 3.1 CLIENTES

**Funcionalidades:**
- Cadastro completo (razão social, CNPJ, contatos)
- Classificação (público / privado)
- Histórico de contratos
- Auditoria e versionamento

---

### 3.2 CONTRATOS

**Funcionalidades:**
- Cadastro de contratos
- Valores, prazos, tipo contratual
- Aditivos contratuais
- Upload de documentos
- Um contrato pode gerar múltiplas obras

---

### 3.3 CENTRO DE CUSTO

**Funcionalidades:**
- Criação de centro de custo por obra
- Código único
- Moeda
- Período fiscal
- Pré-requisito para upload de planilha

---

### 3.4 PLANILHA ANALÍTICA (DADOS REFERENCIAIS)

**A planilha analítica é carregada no MÓDULO CORPORATIVO.**

**Conteúdo:**
- Proposta comercial
- Orçamento
- Preços unitários
- Quantidades referenciais
- Serviços contratuais

**IMPORTANTE:**
- Estes dados **NÃO são a EAP final**
- São **DADOS REFERENCIAIS**
- Servem como base para a estruturação na obra

**Funcionalidades:**
- Upload Excel/CSV
- Validação de formato
- Versionamento
- Auditoria

---

### 3.5 BASELINE COMERCIAL – GOVERNANÇA

**A Baseline Comercial representa a VERDADE ECONÔMICA OFICIAL da obra.**

**Conceito refinado:**
- A obra **PROPÕE** a baseline
- O corporativo **HOMOLOGA** a baseline
- Apenas após homologação ela se torna **OFICIAL**

**Características:**
- Versionada (v1, v2, v3...)
- Auditável
- Imutável após homologação
- Referência única corporativa

---

### 3.6 LIBERAÇÃO DA OBRA – GATE 1

**Gate 1 controla a transição Corporativo → Obra.**

**Validações obrigatórias:**
- Cliente cadastrado
- Contrato cadastrado
- Centro de custo criado
- Planilha analítica carregada
- **Baseline proposta homologada**

**Após Gate 1:**
- A obra passa a existir no Módulo Obra
- Não pode ser excluída
- Passa para execução

---

## ================================================================================
## 4. MÓDULO OBRA – VISÃO GERAL
## ================================================================================

O Módulo Obra é o ambiente de **EXECUÇÃO**.

**Princípio operacional:**
**"Executar, medir, comparar, corrigir."**

Todos os departamentos operam sobre:
- Uma baseline homologada
- Uma EAP única
- Dados mestres governados

---

## ================================================================================
## 5. COMERCIAL DA OBRA
## ================================================================================

O Comercial da Obra é o **PRIMEIRO departamento a atuar após Gate 1**.

---

### 5.1 ESTRUTURAÇÃO (CRIAÇÃO DA EAP)

**A EAP é criada NO MÓDULO OBRA, pelo COMERCIAL.**

**Fluxo:**
1. Comercial recebe dados referenciais do corporativo
2. Cria a EAP:
   - Hierarquia
   - Itens
   - Quantidades
   - Valores
3. Define fatores de conversão
4. **Gera Baseline Proposta v1**
5. **Envia para homologação corporativa**
6. **Após homologação, baseline torna-se oficial**

**Regras:**
- EAP não nasce no corporativo
- EAP só pode ser alterada via versionamento
- Apenas uma baseline ativa por vez

---

### 5.2 MEDIÇÃO DE PRODUÇÃO (MP)

**MP representa o que foi REALMENTE EXECUTADO.**

**Origem:**
- Produção lança apontamentos diários
- Comercial consolida em MP mensal

**Função:**
- Base para apropriação de custos
- Base para análise de desempenho

---

### 5.3 MEDIÇÃO DO CLIENTE (MC)

**MC representa o que será FATURADO ao cliente.**

**Características:**
- Pode divergir da MP
- Base para faturamento
- Requer aprovação

---

### 5.4 COMPARATIVO MP x MC

**Funcionalidades:**
- Identifica divergências
- Requer justificativas
- Acesso restrito (sigiloso)
- Base para gestão de risco comercial

---

### 5.5 ADITIVOS, GLOSAS E FATURAMENTO

**Funcionalidades:**
- Aditivos geram nova versão de baseline
- Glosas impactam receita
- Faturamento baseado em MC aprovada

---

## ================================================================================
## 6. DEMAIS DEPARTAMENTOS DO MÓDULO OBRA
## ================================================================================

### ENGENHARIA

**Responsabilidades:**
- Projetos
- Documentação
- Liberação de frentes
- Apoio técnico

---

### PLANEJAMENTO E CONTROLE

**Responsabilidades:**
- Cronograma
- Curva S
- PBS
- Lookahead
- Controle de restrições

---

### PRODUÇÃO

**Responsabilidades:**
- Execução física
- Avanços diários
- Apontamentos
- **PRODUTIVIDADE**
- **NÃO trabalha com valores financeiros**

---

### SUPRIMENTOS

**Responsabilidades:**
- Requisições
- Compras
- Contratos
- Estoque
- Integração com custos e produção

---

### CUSTOS

**Responsabilidades:**
- Apropriações
- Rateios
- CR/CO
- F/CD

---

### QUALIDADE

**Responsabilidades:**
- Inspeções
- NCs
- Ensaios
- Liberação de serviços
- **PODER DE TRAVA**

---

### SST (SEGURANÇA E SAÚDE)

**Responsabilidades:**
- EPIs
- Inspeções
- Incidentes
- Treinamentos
- **PODER DE TRAVA**

---

### MEIO AMBIENTE

**Responsabilidades:**
- Licenças
- Condicionantes
- Monitoramentos

---

### FINANCEIRO DA OBRA

**Responsabilidades:**
- Fluxo de caixa
- Contas a pagar/receber
- Conciliação

---

### GERENCIAL

**Responsabilidades:**
- Resultado
- Tendências
- Cenários
- Decisão

---

## ================================================================================
## 7. EAP – VISÃO DUAL
## ================================================================================

**EAP é ÚNICA, com DUAS LEITURAS:**

### VISÃO COMERCIAL:
- m³, ton, m², hh
- Valores financeiros
- Receita e margem

### VISÃO OPERACIONAL:
- bloco, estaca, viga, trecho
- Quantidades físicas
- Produção

**Ligação via FATOR DE CONVERSÃO.**  
**Valores financeiros DEVEM ser equivalentes.**

---

## ================================================================================
## 8. GATES DE GOVERNANÇA (9 GATES)
## ================================================================================

**Os 9 Gates Oficiais:**

1. **Gate 1** – Liberação da Obra (Corporativo)
2. **Gate 2** – Fechamento de Produção
3. **Gate 3** – Fechamento de Custos
4. **Gate 4** – Fechamento Comercial
5. **Gate 5** – Qualidade OK (**TRAVA**)
6. **Gate 6** – SST OK (**TRAVA**)
7. **Gate 7** – Financeiro OK
8. **Gate 8** – Gerencial OK
9. **Gate 9** – Competência Concluída

### REGRA FUNDAMENTAL:

**Sem Gate 5 e Gate 6 aprovados, Gate 9 NÃO libera.**

---

## ================================================================================
## 9. FECHAMENTO MENSAL
## ================================================================================

Uma competência só fecha quando **TODOS os gates estão aprovados**.

**Após fechamento:**
- Dados congelados
- Reabertura só com aprovação especial
- Auditoria obrigatória

---

## ================================================================================
## 10. PRINCÍPIOS DE INTERFACE
## ================================================================================

**Princípios obrigatórios:**
- Sidebar fixa
- Topbar global
- Operacional = tabelas
- Gerencial = resumos + gráficos
- Alta densidade de informação
- Nada de excesso de cards

---

## ================================================================================
## 11. CONCLUSÃO
## ================================================================================

O ERP GENESIS é uma **PLATAFORMA DE GESTÃO DE OBRAS REAIS**.

**Une:**
- Estratégia corporativa
- Execução disciplinada
- Governança rígida
- Segurança e qualidade como pré-requisito de resultado

**Este documento é a REFERÊNCIA ÚNICA OFICIAL para desenvolvimento.**

**🔒 TRAVADO E AUTORIZADO:** Este documento está travado como conceito oficial. Sempre use este documento quando o usuário perguntar sobre conceito, documento padrão ou referência oficial do ERP GENESIS.

---

**FIM DO MEMORIAL DESCRITIVO OFICIAL – ERP GENESIS**

---

**Documento validado por:** ChatGPT (GPT-REG)  
**Data de validação:** Janeiro 2026  
**Versão:** 2.1 (Conceito Refinado e Governança Ajustada)  
**Status:** 🟢 DOCUMENTO OFICIAL DE REFERÊNCIA




