# 📋 MEMORIAL COMPLETO CONSOLIDADO - ERP GENESIS

**Documento Mestre para Validação em Inteligência Artificial**

**Data:** Janeiro 2026  
**Versão:** 3.0 (Consolidado Completo)  
**Status:** 🟢 DOCUMENTO OFICIAL DE REFERÊNCIA COMPLETA

---

## 📑 SUMÁRIO

1. [Visão Geral e Conceito Fundamental](#1-visão-geral-e-conceito-fundamental)
2. [Arquitetura Conceitual](#2-arquitetura-conceitual)
3. [Módulo Corporativo](#3-módulo-corporativo)
4. [Módulo Obra](#4-módulo-obra)
5. [EAP - Estrutura Analítica com Visão Dual](#5-eap---estrutura-analítica-com-visão-dual)
6. [Gates de Governança](#6-gates-de-governança)
7. [Fechamento Mensal (Competência)](#7-fechamento-mensal-competência)
8. [Arquitetura Técnica](#8-arquitetura-técnica)
9. [Banco de Dados](#9-banco-de-dados)
10. [API Backend](#10-api-backend)
11. [Frontend](#11-frontend)
12. [Conceito de Interface](#12-conceito-de-interface)
13. [Estado Atual de Implementação](#13-estado-atual-de-implementação)
14. [Próximos Passos](#14-próximos-passos)

---

## 1. VISÃO GERAL E CONCEITO FUNDAMENTAL

### 1.1. O que é o ERP GENESIS

O **ERP GENESIS** é uma plataforma corporativa integrada, desenvolvida especificamente para empresas de **engenharia pesada e infraestrutura**:

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

### 1.2. Princípio Fundamental

**"O CORPORATIVO GOVERNA. A OBRA EXECUTA."**

**Regras estruturantes:**
- Nada nasce na obra sem origem corporativa
- Nada é validado no corporativo sem evidência da obra
- Estratégia é corporativa, execução é da obra

### 1.3. Objetivo do Sistema

O ERP GENESIS une:
- Estratégia corporativa
- Execução disciplinada
- Governança rígida
- Segurança e qualidade como pré-requisito de resultado

---

## 2. ARQUITETURA CONCEITUAL

### 2.1. Estrutura Macro

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

### 2.2. Separação de Responsabilidades

**Módulo Corporativo:**
- DEFINE estratégia
- GOVERNA processos
- CONTROLA riscos
- HOMOLOGA baselines
- LIBERA obras

**Módulo Obra:**
- EXECUTA fisicamente
- MEDE resultados
- COMPARA com baseline
- CORRIGE desvios

---

## 3. MÓDULO CORPORATIVO

### 3.1. Conceito e Responsabilidades

O Módulo Corporativo é o **CÉREBRO** do ERP GENESIS.

**Ele NÃO executa obra.**  
**Ele DEFINE, GOVERNA e CONTROLA.**

**Responsabilidades:**
- Definir estratégia econômica
- Garantir padronização
- Controlar riscos corporativos
- Governar dados mestres
- Homologar baselines
- Liberar obras para execução

### 3.2. Funcionalidades Detalhadas

#### 3.2.1. Clientes
- Cadastro completo (razão social, CNPJ, contatos)
- Classificação (público / privado)
- Histórico de contratos
- Auditoria e versionamento

#### 3.2.2. Contratos
- Cadastro de contratos
- Valores, prazos, tipo contratual
- Aditivos contratuais
- Upload de documentos
- Um contrato pode gerar múltiplas obras

#### 3.2.3. Centro de Custo
- Criação de centro de custo por obra
- Código único
- Moeda
- Período fiscal
- Pré-requisito para upload de planilha

#### 3.2.4. Planilha Analítica (Dados Referenciais)

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

#### 3.2.5. Baseline Comercial – Governança

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

#### 3.2.6. Liberação da Obra – Gate 1

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

### 3.3. Estado de Implementação

**Status:** ❌ **NÃO IMPLEMENTADO**

**Pendente:**
- Cadastro de Clientes
- Cadastro de Contratos
- Abertura de Centro de Custo
- Upload de Planilha Analítica
- Homologação de Baseline
- Gate 1 (Liberação da Obra)

---

## 4. MÓDULO OBRA

### 4.1. Conceito e Princípio

O Módulo Obra é o ambiente de **EXECUÇÃO**.

**Princípio operacional:**
**"Executar, medir, comparar, corrigir."**

Todos os departamentos operam sobre:
- Uma baseline homologada
- Uma EAP única
- Dados mestres governados

### 4.2. Departamentos do Módulo Obra

#### 4.2.1. Comercial da Obra

O Comercial da Obra é o **PRIMEIRO departamento a atuar após Gate 1**.

**Funcionalidades:**

**A. Estruturação (Criação da EAP)**
- A EAP é criada NO MÓDULO OBRA, pelo COMERCIAL
- Fluxo:
  1. Comercial recebe dados referenciais do corporativo
  2. Cria a EAP (hierarquia, itens, quantidades, valores)
  3. Define fatores de conversão
  4. Gera Baseline Proposta v1
  5. Envia para homologação corporativa
  6. Após homologação, baseline torna-se oficial

**B. Medição de Produção (MP)**
- Representa o que foi REALMENTE EXECUTADO
- Origem: Produção lança apontamentos diários → Comercial consolida em MP mensal
- Função: Base para apropriação de custos e análise de desempenho

**C. Medição do Cliente (MC)**
- Representa o que será FATURADO ao cliente
- Pode divergir da MP
- Base para faturamento
- Requer aprovação

**D. Comparativo MP x MC**
- Identifica divergências
- Requer justificativas
- Acesso restrito (sigiloso)
- Base para gestão de risco comercial

**E. Aditivos, Glosas e Faturamento**
- Aditivos geram nova versão de baseline
- Glosas impactam receita
- Faturamento baseado em MC aprovada

**Estado de Implementação:**
- ✅ EAP Dual (parcial - estruturação básica)
- ⚠️ Baseline (versionamento OK, falta proposta/homologação)
- ❌ MP separada de MC
- ❌ Comparativo MP x MC
- ❌ Aditivos
- ❌ Glosas
- ❌ Faturamento

#### 4.2.2. Engenharia

**Responsabilidades:**
- Projetos
- Documentação
- Liberação de frentes
- Apoio técnico

**Estado de Implementação:** ❌ **NÃO IMPLEMENTADO**

#### 4.2.3. Planejamento e Controle

**Responsabilidades:**
- Cronograma
- Curva S
- PBS
- Lookahead
- Controle de restrições

**Estado de Implementação:** ❌ **NÃO IMPLEMENTADO**

#### 4.2.4. Produção

**Responsabilidades:**
- Execução física
- Avanços diários
- Apontamentos
- **PRODUTIVIDADE**
- **NÃO trabalha com valores financeiros**

**Estado de Implementação:** ❌ **NÃO IMPLEMENTADO**

#### 4.2.5. Suprimentos

**Responsabilidades:**
- Requisições
- Compras
- Contratos
- Estoque
- Integração com custos e produção

**Estado de Implementação:**
- ✅ Cadastro de Insumos (básico)
- ❌ Requisições
- ❌ Compras
- ❌ Contratos
- ❌ Estoque por obra

#### 4.2.6. Custos

**Responsabilidades:**
- Apropriações
- Rateios
- CR/CO
- F/CD

**Estado de Implementação:** ❌ **NÃO IMPLEMENTADO**

#### 4.2.7. Qualidade

**Responsabilidades:**
- Inspeções
- NCs (Não Conformidades)
- Ensaios
- Liberação de serviços
- **PODER DE TRAVA** (Gate 5)

**Estado de Implementação:**
- ⚠️ Página básica (dados mockados)
- ❌ Funcionalidades completas

#### 4.2.8. SST (Segurança e Saúde do Trabalho)

**Responsabilidades:**
- EPIs
- Inspeções
- Incidentes
- Treinamentos
- **PODER DE TRAVA** (Gate 6)

**Estado de Implementação:** ❌ **NÃO IMPLEMENTADO**

#### 4.2.9. Meio Ambiente

**Responsabilidades:**
- Licenças
- Condicionantes
- Monitoramentos

**Estado de Implementação:** ❌ **NÃO IMPLEMENTADO**

#### 4.2.10. Financeiro da Obra

**Responsabilidades:**
- Fluxo de caixa
- Contas a pagar/receber
- Conciliação

**Estado de Implementação:** ❌ **NÃO IMPLEMENTADO**

#### 4.2.11. Gerencial

**Responsabilidades:**
- Resultado
- Tendências
- Cenários
- Decisão

**Estado de Implementação:**
- ✅ Dashboard básico (gráficos, KPIs)
- ❌ Análise completa de resultado

---

## 5. EAP - ESTRUTURA ANALÍTICA COM VISÃO DUAL

### 5.1. Conceito Fundamental

**EAP é ÚNICA, com DUAS LEITURAS:**

### 5.2. Visão Comercial

**Características:**
- Unidades: m³, ton, m², hh (horas-homem)
- Valores financeiros
- Receita e margem
- Base para faturamento

**Uso:**
- Medições comerciais (MC)
- Faturamento
- Análise de resultado
- Controle financeiro

### 5.3. Visão Operacional

**Características:**
- Unidades: bloco, estaca, viga, trecho (unidades físicas de execução)
- Quantidades físicas
- Produção
- Base para execução

**Uso:**
- Medições de produção (MP)
- Controle de produção
- Apontamentos
- Produtividade

### 5.4. Fatores de Conversão

**Conceito:**
As duas visões são conectadas por **FATORES DE CONVERSÃO**.

**Exemplo:**
- 1 bloco tipo A = 2,50 m³
- 1 estaca = 15 m³ de concreto
- 1 viga = 8 m³ de concreto

**Regra Fundamental:**
Os **valores financeiros DEVEM ser idênticos**, independente da unidade.

**Exemplo Prático:**
- Comercial: 100 m³ × R$ 50,00 = R$ 5.000,00
- Operacional: 40 blocos × R$ 125,00 = R$ 5.000,00
- Fator: 1 bloco = 2,5 m³

### 5.5. Criação da EAP

**IMPORTANTE - CONCEITO CORRIGIDO:**

**EAP é criada no MÓDULO OBRA, no DEPARTAMENTO COMERCIAL.**

**Fluxo:**
1. Corporativo carrega planilha analítica (dados referenciais)
2. Sistema preenche automaticamente o Comercial
3. Gerente Comercial **cria a EAP** usando dados referenciais
4. Gerente Comercial faz a **ESTRUTURAÇÃO**
5. Após estruturação, **libera para outros serviços**

### 5.6. Estado de Implementação

**Status:** ✅ **IMPLEMENTADO (Parcial)**

**Implementado:**
- ✅ Modelo de dados (EAP Comercial e Operacional)
- ✅ Modelo de Fatores de Conversão
- ✅ Interface de estruturação (tabela hierárquica)
- ✅ Cálculos automáticos
- ✅ CRUD básico

**Pendente:**
- ⚠️ Integração completa com Baseline (proposta/homologação)
- ⚠️ Validações de negócio completas

---

## 6. GATES DE GOVERNANÇA

### 6.1. Os 9 Gates Oficiais

1. **Gate 1** – Liberação da Obra (Corporativo)
2. **Gate 2** – Fechamento de Produção
3. **Gate 3** – Fechamento de Custos
4. **Gate 4** – Fechamento Comercial
5. **Gate 5** – Qualidade OK (**TRAVA**)
6. **Gate 6** – SST OK (**TRAVA**)
7. **Gate 7** – Financeiro OK
8. **Gate 8** – Gerencial OK
9. **Gate 9** – Competência Concluída

### 6.2. Regras Fundamentais

**Regra 1: Sequência**
- Gate 1 pode ser aprovado direto
- Gates 2-8: gate anterior deve estar aprovado
- Gate 9: gates 2-8 aprovados E gates 5 e 6 aprovados

**Regra 2: Travas**
- Gate 5 (Qualidade) e Gate 6 (SST) são travas
- **Sem Gate 5 e Gate 6 aprovados, Gate 9 NÃO libera**

**Regra 3: Imutabilidade**
- Competência fechada bloqueia alterações
- Reabertura só com aprovação especial

### 6.3. Estado de Implementação

**Status:** ✅ **IMPLEMENTADO (Backend Mínimo)**

**Implementado:**
- ✅ Modelo de dados (CompetenciaMensal, CompetenciaGate)
- ✅ Service completo (CompetenciaService)
- ✅ 7 endpoints REST
- ✅ Regras de negócio (sequência, travas, imutabilidade)
- ✅ Validações e tratamento de erros

**Pendente:**
- ❌ Interface frontend
- ❌ Integração com departamentos (Gates 2-8)
- ❌ Gate 1 completo (liberação da obra)

---

## 7. FECHAMENTO MENSAL (COMPETÊNCIA)

### 7.1. Conceito

Uma **Competência Mensal** representa um período de fechamento mensal de uma obra.

**Características:**
- Período: formato YYYY-MM (ex: "2026-01")
- Status: `aberta` ou `fechada`
- Uma obra pode ter apenas uma competência aberta por vez

### 7.2. Processo de Fechamento

**Fluxo:**
1. **Abertura:** Sistema cria competência + 9 gates automaticamente
2. **Processo:** Departamentos aprovam seus gates (2-8)
3. **Validação:** Gates 5 e 6 devem estar aprovados (travas)
4. **Conclusão:** Gate 9 só libera quando todos os gates 2-8 estão aprovados E gates 5 e 6 aprovados
5. **Fechamento:** Competência fecha, dados congelados

### 7.3. Regras de Negócio

**Abertura:**
- Período único por obra (não pode duplicar)
- Cria automaticamente 9 gates com nomes oficiais
- Gate 9 inicia bloqueado
- Gates 5 e 6 são marcados como travas

**Aprovação:**
- Gate 1: pode ser aprovado direto
- Gates 2-8: gate anterior deve estar aprovado
- Gate 9: todos os gates 2-8 aprovados + gates 5 e 6 aprovados

**Fechamento:**
- Dados congelados
- Reabertura só com aprovação especial
- Auditoria obrigatória

### 7.4. Estado de Implementação

**Status:** ✅ **IMPLEMENTADO (Backend Completo)**

**Implementado:**
- ✅ Modelo de dados completo
- ✅ Service com todas as regras
- ✅ Endpoints REST completos
- ✅ Validações de negócio

**Pendente:**
- ❌ Interface frontend
- ❌ Integração com departamentos

---

## 8. ARQUITETURA TÉCNICA

### 8.1. Stack Tecnológico

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (ícones)
- Recharts (gráficos)

**Backend:**
- Express.js 4.18
- TypeScript
- Prisma ORM 5.0
- PostgreSQL
- JWT (autenticação)
- bcrypt (hash de senhas)

**Deploy:**
- Vercel (frontend + API routes)
- Neon (PostgreSQL)

### 8.2. Estrutura de Pastas

```
ERP G-NESIS/
├── app/                    # Next.js App Router
│   ├── api/[...all]/        # Catch-all API Route (Express proxy)
│   ├── login/               # Página de login
│   ├── obras/               # Páginas de obras
│   ├── suprimentos/         # Página de suprimentos
│   ├── qualidade/           # Página de qualidade
│   └── page.tsx             # Intranet (página inicial)
├── src/
│   ├── api/                 # Express.js Backend
│   │   ├── app.ts           # Configuração Express
│   │   ├── middleware/      # Middlewares
│   │   └── routes/          # Rotas da API
│   ├── components/          # Componentes React
│   ├── lib/                 # Utilitários (api.ts, auth.ts)
│   ├── services/            # Services (lógica de negócio)
│   ├── types/               # Tipos TypeScript
│   └── utils/               # Utilitários (JWT, bcrypt)
├── prisma/
│   ├── schema.prisma        # Schema do banco
│   ├── migrations/          # Migrations
│   └── seed.ts              # Seed data
└── [documentação]          # Vários arquivos .md
```

### 8.3. Integração Frontend-Backend

**Arquitetura:**
- Next.js API Routes (`app/api/[...all]/route.ts`) faz proxy para Express
- Lazy loading do Express app (evita Prisma no build)
- Cliente API (`src/lib/api.ts`) com interceptors JWT
- Refresh token automático

**URLs:**
- Desenvolvimento: `http://localhost:3000/api`
- Produção (Vercel): `/api` (relativo)

---

## 9. BANCO DE DADOS

### 9.1. Modelos Principais

#### 9.1.1. Usuario
- `id`, `email`, `nome`, `senha_hash`, `perfil`, `is_ativo`
- Relações: obras_permitidas, gates, medições, baselines, competências

#### 9.1.2. Obra
- `id`, `codigo`, `nome`, `descricao`, `cliente`, `status`, `orcamento_total`
- Relações: baseline_comercial, gates, medições, competencias_mensais

#### 9.1.3. UsuarioObra
- `id`, `usuario_id`, `obra_id`, `permissao`, `is_ativo`
- Tabela N:N para permissões multi-obra

#### 9.1.4. BaselineComercial
- `id`, `obra_id`, `versao`, `valor_total`, `is_ativo`, `status`
- Campos de homologação: `proposta_por`, `homologada_por`, `rejeitada_por`
- Relações: obra, eap

#### 9.1.5. Eap
- `id`, `baseline_comercial_id`, `codigo`, `descricao`, `tipo` (comercial/operacional)
- `nivel`, `eap_pai_id`, `quantidade`, `valor_unitario`, `valor_total`
- Self-reference para hierarquia
- Relações: baseline_comercial, fatores de conversão

#### 9.1.6. EapFatorConversao
- `id`, `eap_comercial_id`, `eap_operacional_id`, `fator_quantidade`, `fator_valor`
- Conecta EAP comercial com EAP operacional

#### 9.1.7. Gate
- `id`, `obra_id`, `codigo` (enum G1-G9), `nome`, `status`, `ordem`
- Campos de aprovação: `usuario_aprovador_id`, `data_aprovacao`
- Relações: obra, usuario

#### 9.1.8. Medicao
- `id`, `obra_id`, `eap_id`, `usuario_id`, `tipo` (MP/MC), `periodo_referencia`
- `quantidade_medida`, `valor_medido`, `status`
- Relações: obra, eap, usuario

#### 9.1.9. Insumo
- `id`, `codigo`, `nome`, `unidade`, `categoria`, `preco_estimado`, `estoque`

#### 9.1.10. CompetenciaMensal
- `id`, `obra_id`, `periodo`, `status` (aberta/fechada), `aberta_em`, `fechada_em`
- Relações: obra, gates

#### 9.1.11. CompetenciaGate
- `id`, `competencia_id`, `obra_id`, `numero` (1-9), `nome`, `status`, `trava`
- Campos de aprovação: `aprovado_por_id`, `rejeitado_por_id`, `motivo_rejeicao`
- Relações: competencia, obra, usuario

### 9.2. Enums

- `CompetenciaStatus`: `aberta`, `fechada`
- `GateStatus`: `pendente`, `em_analise`, `aprovado`, `rejeitado`, `bloqueado`
- `GateCodigo`: `G1`, `G2`, `G3`, `G4`, `G5`, `G6`, `G7`, `G8`, `G9`
- `TipoMedicao`: `MP`, `MC`

### 9.3. Características

- ✅ Soft delete em todos os modelos (`deleted_at`)
- ✅ Timestamps automáticos (`created_at`, `updated_at`)
- ✅ Índices otimizados
- ✅ Constraints de unicidade
- ✅ Relações bem definidas

---

## 10. API BACKEND

### 10.1. Estrutura

**Framework:** Express.js 4.18  
**ORM:** Prisma 5.0  
**Autenticação:** JWT

### 10.2. Middlewares

#### 10.2.1. authMiddleware
- Valida token JWT
- Verifica usuário no banco
- Valida se usuário está ativo
- Injeta `req.user`

#### 10.2.2. validateObraAccess
- Extrai `obra_id` de params, body ou query
- Valida existência da obra
- Verifica permissões do usuário
- Admin tem acesso total
- Injeta `req.obra` e `req.obraId`

#### 10.2.3. errorHandler
- Tratamento centralizado de erros
- Respostas padronizadas

### 10.3. Rotas Implementadas

#### 10.3.1. Autenticação (`/api/auth`)
- ✅ `POST /api/auth/login` - Login
- ✅ `POST /api/auth/refresh` - Refresh token
- ✅ `POST /api/auth/logout` - Logout

#### 10.3.2. Obras (`/api/obras`)
- ✅ `GET /api/obras` - Lista obras
- ✅ `GET /api/obras/:id` - Detalhes da obra
- ✅ `POST /api/obras` - Criar obra
- ✅ `PUT /api/obras/:id` - Atualizar obra
- ✅ `DELETE /api/obras/:id` - Deletar obra (soft delete)

#### 10.3.3. EAP (`/api/eap`)
- ✅ `GET /api/eap/obra/:obra_id` - Lista EAP por obra
- ✅ `GET /api/eap/:id` - Detalhes da EAP
- ✅ `POST /api/eap` - Criar item EAP
- ✅ `PUT /api/eap/:id` - Atualizar item EAP
- ✅ `DELETE /api/eap/:id` - Deletar item EAP
- ✅ `GET /api/eap/obra/:obra_id/fatores` - Lista fatores de conversão

#### 10.3.4. Medições (`/api/medicoes`)
- ✅ `GET /api/medicoes/obra/:obra_id` - Lista medições por obra
- ✅ `POST /api/medicoes` - Criar medição
- ✅ `PUT /api/medicoes/:id` - Atualizar medição
- ✅ `DELETE /api/medicoes/:id` - Deletar medição

#### 10.3.5. Gates (`/api/gates`)
- ✅ `GET /api/gates/obra/:obra_id` - Lista gates por obra
- ✅ `GET /api/gates/:id` - Detalhes do gate

#### 10.3.6. Dashboard (`/api/dashboard`)
- ✅ `GET /api/dashboard/obra/:obra_id` - Dashboard com KPIs e gráficos

#### 10.3.7. Competências (`/api/obras/:obraId/competencias`)
- ✅ `GET /api/obras/:obraId/competencias/ativa` - Busca competência ativa
- ✅ `POST /api/obras/:obraId/competencias/abrir` - Abre competência + cria 9 gates
- ✅ `GET /api/obras/:obraId/competencias/:competenciaId` - Busca por ID
- ✅ `GET /api/obras/:obraId/competencias/:competenciaId/gates` - Lista gates com travas
- ✅ `POST /api/obras/:obraId/competencias/:competenciaId/gates/:numero/aprovar` - Aprova gate
- ✅ `POST /api/obras/:obraId/competencias/:competenciaId/gates/:numero/rejeitar` - Rejeita gate
- ✅ `POST /api/obras/:obraId/competencias/:competenciaId/concluir` - Conclui competência

#### 10.3.8. Insumos (`/api/insumos`)
- ✅ `GET /api/insumos` - Lista insumos
- ✅ `POST /api/insumos` - Criar insumo

### 10.4. Services (Lógica de Negócio)

#### 10.4.1. CompetenciaService
- `abrirCompetencia()` - Cria competência + 9 gates
- `getCompetenciaAtiva()` - Busca competência aberta
- `getCompetenciaById()` - Busca por ID
- `listarGatesComTravas()` - Lista gates com cálculo de travas
- `aprovarGate()` - Aprova gate (valida sequência e dependências)
- `rejeitarGate()` - Rejeita gate
- `concluirCompetencia()` - Conclui competência

#### 10.4.2. EapService
- CRUD completo de EAP
- Cálculos hierárquicos
- Fatores de conversão

#### 10.4.3. ObraService
- CRUD completo de obras
- Validações de negócio

#### 10.4.4. MedicaoService
- CRUD completo de medições
- Cálculos automáticos

#### 10.4.5. GateService
- Listagem de gates
- Validações

### 10.5. Segurança

- ✅ Todos os endpoints (exceto `/api/auth/login`) requerem autenticação
- ✅ Validação de acesso à obra em todas as rotas
- ✅ Admin tem acesso total
- ✅ Usuários têm permissões por obra (UsuarioObra)
- ✅ Soft delete implementado
- ✅ Auditoria (timestamps, usuários)

---

## 11. FRONTEND

### 11.1. Estrutura

**Framework:** Next.js 14 (App Router)  
**UI:** React 18 + Tailwind CSS  
**Ícones:** Lucide React  
**Gráficos:** Recharts

### 11.2. Páginas Implementadas

#### 11.2.1. Login (`/login`)
- ✅ Formulário de login
- ✅ Validação de campos
- ✅ Tratamento de erros
- ✅ Redirecionamento após login

#### 11.2.2. Intranet (`/`)
- ✅ Dashboard inicial
- ✅ Informações gerais
- ✅ Atalhos para departamentos
- ⚠️ Dados parcialmente mockados

#### 11.2.3. Obras (`/obras`)
- ✅ Lista de obras
- ✅ Filtros por status
- ✅ Busca
- ✅ Cards com informações

#### 11.2.4. Detalhes da Obra (`/obras/[id]`)
- ✅ Informações da obra
- ✅ Gráficos (linha e pizza)
- ✅ KPIs
- ✅ Filtros de período

#### 11.2.5. Suprimentos (`/suprimentos`)
- ✅ Lista de insumos
- ✅ Busca e filtros
- ✅ Modal para novo insumo
- ✅ Integração com API

#### 11.2.6. Qualidade (`/qualidade`)
- ⚠️ Página básica (dados mockados)
- ❌ Funcionalidades completas

### 11.3. Componentes

#### 11.3.1. MainLayout
- ✅ Sidebar com navegação
- ✅ Menu de departamentos
- ✅ Informações do projeto ativo
- ⚠️ Dados mockados (precisa buscar da API)

#### 11.3.2. ProtectedRoute
- ✅ Verifica autenticação
- ✅ Redireciona para login
- ⚠️ Não está sendo usado nas páginas

#### 11.3.3. EapEstruturacao
- ✅ Tabela hierárquica
- ✅ Drawer de edição
- ✅ Cálculos automáticos

### 11.4. Cliente API

**Arquivo:** `src/lib/api.ts`

**Funcionalidades:**
- ✅ Interceptor JWT automático
- ✅ Refresh token automático
- ✅ Redirecionamento para login se expirar
- ✅ Métodos HTTP (GET, POST, PUT, DELETE)

**Services de API:**
- ✅ `authApi.ts` - Autenticação
- ✅ `obraApi.ts` - Obras
- ✅ `eapApi.ts` - EAP
- ✅ `medicaoApi.ts` - Medições
- ✅ `gateApi.ts` - Gates
- ✅ `dashboardApi.ts` - Dashboard

---

## 12. CONCEITO DE INTERFACE

### 12.1. Fluxo de Navegação Pós-Login

**Regra Oficial (Travada):**

```
Login → Intranet (SEMPRE obrigatório) → Departamento
```

**Comportamento:**
- Após login, usuário SEMPRE cai primeiro na INTRANET
- Se 1 perfil: redirecionamento automático
- Se múltiplos perfis: escolha manual na Intranet

### 12.2. Níveis Operacional / Tático / Estratégico

**Conceito:**
- Níveis são **conceituais, NÃO visuais**
- Não aparecem como abas ou menus
- Organização por departamento/funcionalidade
- Profundidade varia por nível

**Nível Operacional:**
- Telas de execução
- Sempre tabelas
- Dados primários
- Ex: Apontamentos, Medições, Requisições

**Nível Tático:**
- Telas de controle
- Tabela + gráficos opcionais
- Comparativos, desvios
- Ex: CR/CO, MP x MC, Acompanhamento mensal

**Nível Estratégico:**
- Telas de governança
- Resumo + indicadores
- Pouca edição, muita leitura
- Ex: Gates, Fechamento Mensal, Painel Gerencial

### 12.3. Toggle Tabela / Gráficos

**Regra:**
- Tabela é SEMPRE a visualização padrão
- Gráficos são opcionais, apenas para dados consolidados
- Toggle só aparece se o gráfico fizer sentido

**Pode ter gráfico:**
- Custos mensais
- Evolução de produção
- CR/CO
- MP x MC
- Indicadores de SSMA

**Não deve ter gráfico:**
- Cadastros
- Lançamentos unitários
- Apontamentos diários
- Listas operacionais puras

### 12.4. Workflows

**Estrutura:**
```
INÍCIO → PROCESSO → FIM (com validação)
```

**Exemplos:**
- Requisição de Compra: Criar → Aprovações → Pedido gerado
- Medição de Produção: Lançar → Validação → MP fechada
- Fechamento Mensal: Abertura → 9 Gates → Competência encerrada

**Regra Crítica:**
- Qualidade e SSMA têm poder real de trava
- Sem Gate 5 e Gate 6 aprovados, Gate 9 NÃO libera

### 12.5. Template de Tela Básica

```
┌─────────────────────────────────────┐
│  Cabeçalho (Título + Descrição)    │
├─────────────────────────────────────┤
│  Botões de Ação (Novo, Exportar)   │
├─────────────────────────────────────┤
│  Filtros e Busca                     │
├─────────────────────────────────────┤
│  [Toggle: Tabela | Gráficos]        │ ← Condicional
├─────────────────────────────────────┤
│  [ÁREA DE CONTEÚDO]                 │
│  - Tabela (padrão) OU               │
│  - Gráficos (alternativa)           │
└─────────────────────────────────────┘
```

---

## 13. ESTADO ATUAL DE IMPLEMENTAÇÃO

### 13.1. ✅ Implementado (100%)

**Autenticação e Segurança:**
- ✅ Login com JWT
- ✅ Refresh tokens
- ✅ Middleware de autenticação
- ✅ Proteção de rotas
- ✅ Validação de acesso à obra

**Gestão de Obras:**
- ✅ CRUD completo
- ✅ Listagem com filtros
- ✅ Detalhes da obra
- ✅ Multi-obra

**EAP Dual:**
- ✅ EAP Comercial e Operacional
- ✅ Fatores de conversão
- ✅ Interface de estruturação
- ✅ Cálculos automáticos

**Medições Básicas:**
- ✅ Lançamento de medições
- ✅ Histórico
- ✅ Status (rascunho, enviada, aprovada)
- ✅ Cálculo automático

**Gates (Estrutura Base):**
- ✅ Modelo de dados
- ✅ Listagem de gates
- ✅ Status básico

**Competências e 9 Gates:**
- ✅ Modelo de dados completo
- ✅ Service com todas as regras
- ✅ 7 endpoints REST
- ✅ Validações de negócio

**Dashboards:**
- ✅ Gráficos (linha e pizza)
- ✅ KPIs
- ✅ Filtros de período

**Suprimentos (Básico):**
- ✅ Cadastro de insumos
- ✅ Listagem
- ✅ Integração com banco

**Interface:**
- ✅ Sidebar
- ✅ Layout responsivo
- ✅ Intranet/Dashboard

### 13.2. ⚠️ Parcialmente Implementado

**Baseline Comercial:**
- ✅ Versionamento OK
- ✅ Modelo de dados com homologação
- ❌ Falta origem corporativa clara
- ❌ Falta upload de planilha no Corporativo
- ❌ Falta fluxo de proposta/homologação

**Medições:**
- ✅ Básicas OK
- ❌ Falta separação MP/MC completa
- ❌ Falta comparativo MP x MC

**Gates:**
- ✅ Estrutura base OK
- ✅ Backend mínimo completo (Competências)
- ❌ Falta integração com departamentos
- ❌ Falta Gate 1 completo (liberação da obra)

**Interface:**
- ✅ Estrutura base OK
- ⚠️ Dados mockados em alguns componentes
- ⚠️ ProtectedRoute não está sendo usado

### 13.3. ❌ Não Implementado

**MÓDULO CORPORATIVO:**
- ❌ Cadastro de Clientes
- ❌ Cadastro de Contratos
- ❌ Abertura de Centro de Custo
- ❌ Upload de Planilha Analítica
- ❌ Homologação de Baseline
- ❌ Gate 1 (Liberação da Obra)

**COMERCIAL DA OBRA (Completo):**
- ⚠️ Estruturação (parcial)
- ❌ MP separada de MC
- ❌ Comparativo MP x MC
- ❌ Aditivos
- ❌ Glosas
- ❌ Faturamento

**OUTROS DEPARTAMENTOS:**
- ❌ Engenharia
- ❌ Planejamento e Controle
- ❌ Produção
- ❌ Custos
- ❌ Qualidade (completo)
- ❌ SST
- ❌ Meio Ambiente
- ❌ Financeiro da Obra
- ❌ Gerencial (completo)

---

## 14. PRÓXIMOS PASSOS

### 14.1. Prioridade ALTA

1. **Implementar Módulo Corporativo**
   - Cadastro de Clientes
   - Cadastro de Contratos
   - Abertura de Centro de Custo
   - Upload de Planilha Analítica
   - Homologação de Baseline
   - Gate 1 (Liberação da Obra)

2. **Completar Comercial da Obra**
   - Fluxo completo de proposta/homologação de Baseline
   - Separação MP/MC
   - Comparativo MP x MC
   - Aditivos
   - Glosas
   - Faturamento

3. **Integrar Competências com Departamentos**
   - Interface frontend para competências
   - Integração com departamentos (Gates 2-8)
   - Validações visuais

### 14.2. Prioridade MÉDIA

4. **Implementar Departamentos do Módulo Obra**
   - Produção (apontamentos, avanços)
   - Custos (apropriações, rateios)
   - Qualidade (inspeções, NCs)
   - SST (incidentes, inspeções)

5. **Melhorar Interface**
   - Remover dados mockados
   - Implementar ProtectedRoute
   - Redirecionamento automático após login
   - Toggle tabela/gráficos onde aplicável

### 14.3. Prioridade BAIXA

6. **Funcionalidades Avançadas**
   - Engenharia
   - Planejamento e Controle
   - Meio Ambiente
   - Financeiro da Obra
   - Gerencial completo

7. **Melhorias Gerais**
   - Testes automatizados
   - Documentação de API
   - Performance
   - Acessibilidade

---

## 15. CONCLUSÃO

O **ERP GENESIS** é uma **PLATAFORMA DE GESTÃO DE OBRAS REAIS** que une estratégia corporativa, execução disciplinada, governança rígida e segurança/qualidade como pré-requisito de resultado.

### Estado Atual

**✅ Base Sólida Implementada:**
- Arquitetura técnica completa
- Autenticação e segurança
- Banco de dados bem modelado
- API backend funcional
- Interface base
- Backend mínimo de Competências e 9 Gates

**⏳ Em Expansão:**
- Módulo Corporativo (não iniciado)
- Departamentos do Módulo Obra (parcial)
- Integrações completas

### Alinhamento com Conceito

O sistema está **alinhado com o conceito oficial** documentado no `MEMORIAL_DESCRITIVO_OFICIAL_VALIDADO.md` e pronto para expansão seguindo rigorosamente este documento como referência única.

---

**FIM DO MEMORIAL COMPLETO CONSOLIDADO – ERP GENESIS**

---

**Documento criado para:** Validação em Inteligência Artificial  
**Data:** Janeiro 2026  
**Versão:** 3.0 (Consolidado Completo)  
**Status:** 🟢 DOCUMENTO OFICIAL DE REFERÊNCIA COMPLETA

---

**Este documento contém:**
- ✅ Conceito completo e oficial
- ✅ Arquitetura técnica detalhada
- ✅ Estado atual de implementação
- ✅ Estrutura de banco de dados
- ✅ API endpoints
- ✅ Frontend
- ✅ Conceito de interface
- ✅ Próximos passos

**Use este documento como referência única para validação e desenvolvimento.**



