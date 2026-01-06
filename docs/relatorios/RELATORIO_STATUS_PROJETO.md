# 📊 RELATÓRIO DE STATUS DO PROJETO ERP G-NESIS

**Data:** Janeiro 2026  
**Versão do Projeto:** 1.0.0  
**Status Geral:** 🟡 Em Desenvolvimento (Fase 1)

---

## 📋 ÍNDICE

1. [Arquitetura Atual do Projeto](#1-arquitetura-atual-do-projeto)
2. [Backend](#2-backend)
3. [Banco de Dados](#3-banco-de-dados)
4. [Frontend](#4-frontend)
5. [Integrações](#5-integrações)
6. [Lista Objetiva: PRONTO / EM ANDAMENTO / NÃO FEITO](#6-lista-objetiva-pronto--em-andamento--não-feito)

---

## 1. ARQUITETURA ATUAL DO PROJETO

### 1.1 Estrutura de Pastas

```
ERP G-NESIS/
├── app/                          # Next.js App Router (Frontend)
│   ├── api/                      # Next.js API Routes
│   │   ├── [...all]/route.ts    # Catch-all proxy para Express
│   │   └── insumos/route.ts     # API Route específica (insumos)
│   ├── login/                    # Página de login
│   ├── obras/                    # Módulo de obras
│   │   ├── page.tsx              # Lista de obras
│   │   └── [id]/page.tsx         # Detalhes da obra
│   ├── qualidade/                # Módulo de qualidade (layout)
│   ├── suprimentos/              # Módulo de suprimentos
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página inicial (Intranet)
│
├── src/
│   ├── api/                      # Backend Express.js
│   │   ├── app.ts                # Configuração Express
│   │   ├── server.ts             # Servidor Express (standalone)
│   │   ├── routes/               # Rotas da API
│   │   │   ├── auth.routes.ts
│   │   │   ├── obras.routes.ts
│   │   │   ├── eap.routes.ts
│   │   │   ├── medicoes.routes.ts
│   │   │   ├── gates.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   ├── competencias.routes.ts
│   │   │   └── comercial.routes.ts (NÃO USADO)
│   │   └── middleware/           # Middlewares
│   │       ├── authMiddleware.ts
│   │       ├── errorHandler.ts
│   │       └── validateObra.ts
│   │
│   ├── components/               # Componentes React
│   │   ├── MainLayout.tsx        # Layout com sidebar
│   │   ├── ProtectedRoute.tsx    # Proteção de rotas
│   │   └── EapEstruturacao/      # Componentes EAP
│   │
│   ├── services/                 # Serviços (Frontend)
│   │   ├── api/                  # Clientes API
│   │   │   ├── authApi.ts
│   │   │   ├── obraApi.ts
│   │   │   ├── eapApi.ts
│   │   │   ├── medicaoApi.ts
│   │   │   ├── gateApi.ts
│   │   │   └── dashboardApi.ts
│   │   └── *.ts                  # Serviços backend (Prisma)
│   │
│   ├── types/                    # TypeScript types
│   └── lib/                      # Utilitários
│       ├── api.ts                # Cliente HTTP
│       └── auth.ts               # Helpers de autenticação
│
└── prisma/
    ├── schema.prisma             # Schema do banco
    ├── migrations/                # Migrations
    └── seed.ts                   # Seed do banco
```

### 1.2 Separação Frontend / Backend

**Frontend:**
- **Framework:** Next.js 14 (App Router)
- **Bibliotecas:** React 18, TypeScript, Tailwind CSS
- **Localização:** `/app` (páginas) e `/src/components` (componentes)
- **Serviços:** `/src/services/api` (clientes HTTP)

**Backend:**
- **Framework:** Express.js
- **Localização:** `/src/api`
- **ORM:** Prisma
- **Integração:** Proxy via Next.js API Routes (`app/api/[...all]/route.ts`)

### 1.3 Tecnologias em Uso

**Frontend:**
- ✅ Next.js 14 (App Router)
- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Lucide React (ícones)
- ✅ Recharts (gráficos)
- ✅ Axios (HTTP client)

**Backend:**
- ✅ Express.js
- ✅ Prisma ORM
- ✅ PostgreSQL
- ✅ JWT (jsonwebtoken)
- ✅ Bcrypt
- ✅ TypeScript

**Deploy:**
- ✅ Vercel (hosting)
- ✅ Next.js API Routes (proxy)

---

## 2. BACKEND

### 2.1 APIs Existentes (Endpoints)

#### ✅ **Autenticação** (`/api/auth`)
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Obter usuário logado
- `POST /api/auth/logout` - Logout

#### ✅ **Obras** (`/api/obras`)
- `GET /api/obras` - Listar obras (com filtros)
- `GET /api/obras/:id` - Obter obra por ID
- `POST /api/obras` - Criar obra
- `PUT /api/obras/:id` - Atualizar obra
- `DELETE /api/obras/:id` - Deletar obra

#### ✅ **EAP** (`/api/eap`)
- `GET /api/eap` - Listar EAPs por baseline
- `GET /api/eap/obra/:obra_id` - Listar EAPs por obra
- `GET /api/eap/obra/:obra_id/folha` - Listar EAPs folha
- `GET /api/eap/comercial-operacional/:baseline_id` - Listar EAPs comercial/operacional
- `GET /api/eap/:id` - Obter EAP por ID
- `POST /api/eap` - Criar EAP
- `PUT /api/eap/:id` - Atualizar EAP
- `DELETE /api/eap/:id` - Deletar EAP
- `GET /api/eap/:eap_comercial_id/fatores` - Listar fatores de conversão
- `POST /api/eap/fatores` - Criar fator de conversão
- `PUT /api/eap/fatores/:id` - Atualizar fator de conversão
- `DELETE /api/eap/fatores/:id` - Deletar fator de conversão

#### ✅ **Medições** (`/api/medicoes`)
- `GET /api/medicoes/obra/:obra_id` - Listar medições por obra
- `GET /api/medicoes` - Listar medições (geral)
- `GET /api/medicoes/:id` - Obter medição por ID
- `POST /api/medicoes` - Criar medição
- `PUT /api/medicoes/:id` - Atualizar medição
- `POST /api/medicoes/:id/aprovar` - Aprovar medição
- `POST /api/medicoes/:id/rejeitar` - Rejeitar medição
- `DELETE /api/medicoes/:id` - Deletar medição

#### ✅ **Gates** (`/api/gates`)
- `GET /api/gates/obra/:obra_id` - Listar gates por obra
- `GET /api/gates/:id` - Obter gate por ID

#### ✅ **Dashboard** (`/api/dashboard`)
- `GET /api/dashboard/obra/:obra_id` - Obter dados do dashboard

#### ✅ **Competências** (`/api`)
- `GET /api/obras/:obraId/competencias/ativa` - Obter competência ativa
- `POST /api/obras/:obraId/competencias/abrir` - Abrir competência
- `GET /api/obras/:obraId/competencias` - Listar competências
- `GET /api/obras/:obraId/competencias/:competenciaId` - Obter competência
- `GET /api/obras/:obraId/competencias/:competenciaId/gates` - Listar gates da competência
- `POST /api/obras/:obraId/competencias/:competenciaId/gates/:gateNumero/aprovar` - Aprovar gate
- `POST /api/obras/:obraId/competencias/:competenciaId/gates/:gateNumero/rejeitar` - Rejeitar gate

#### ⚠️ **Comercial** (`/api/comercial`)
- ❌ **ROTAS EXISTEM MAS NÃO ESTÃO REGISTRADAS NO app.ts**
- `GET /api/comercial/medicao-producao/obra/:obra_id` - Listar MP
- `POST /api/comercial/medicao-producao` - Criar MP
- `GET /api/comercial/medicao-cliente/obra/:obra_id` - Listar MC
- `POST /api/comercial/medicao-cliente` - Criar MC
- `GET /api/comercial/comparativo/obra/:obra_id` - Comparativo MP x MC

#### ✅ **Insumos** (`/api/insumos`)
- `GET /api/insumos` - Listar insumos (Next.js API Route)

**Total de Endpoints:** ~45 endpoints

### 2.2 Regras de Negócio Implementadas

#### ✅ **Autenticação e Autorização**
- ✅ Login com email/senha
- ✅ JWT (access token + refresh token)
- ✅ Middleware de autenticação
- ✅ Validação de acesso por obra (UsuarioObra)
- ✅ Perfis de usuário (admin, gestor, engenheiro, usuario)

#### ✅ **Obras**
- ✅ CRUD completo
- ✅ Filtros (status, cliente)
- ✅ Soft delete
- ✅ Permissões por obra (UsuarioObra)

#### ✅ **EAP**
- ✅ CRUD completo
- ✅ Hierarquia (EAP pai/filho)
- ✅ Visão dual (comercial/operacional)
- ✅ Fatores de conversão
- ✅ Validação de baseline

#### ✅ **Medições**
- ✅ CRUD completo
- ✅ Separação MP/MC (tipo)
- ✅ Aprovação/rejeição
- ✅ Vinculação com EAP

#### ✅ **Gates**
- ✅ Listagem por obra
- ✅ Estrutura dos 9 gates (modelo)

#### ✅ **Competências Mensais**
- ✅ Abertura de competência
- ✅ Criação automática dos 9 gates
- ✅ Aprovação/rejeição de gates
- ✅ Validação de ordem (gates 1-9)
- ✅ Travas (gates 5 e 6)

#### ✅ **Dashboard**
- ✅ Dados agregados por obra
- ✅ Valores totais (contratado, executado, faturado)
- ✅ Percentuais de execução

### 2.3 O que Está Mockado vs Real

#### ✅ **Tudo está REAL (banco de dados)**
- ✅ Todas as rotas fazem queries no Prisma
- ✅ Todas as operações usam PostgreSQL
- ✅ Não há dados mockados no backend

#### ⚠️ **Exceções:**
- ⚠️ Rotas comerciais (`comercial.routes.ts`) existem mas **NÃO estão registradas** no `app.ts`
- ⚠️ Alguns cálculos podem usar valores padrão se dados não existirem

---

## 3. BANCO DE DADOS

### 3.1 Tabelas Existentes

#### ✅ **Usuario** (`usuarios`)
**Status:** ✅ Completa
- Campos: id, email, nome, senha_hash, perfil, is_ativo
- Relações: Gates, Medições, Obras, EAPs, Baselines
- Índices: email, perfil, is_ativo

#### ✅ **Obra** (`obras`)
**Status:** ✅ Completa
- Campos: id, codigo, nome, descricao, cliente, datas, status, orcamento_total
- Relações: Baseline, Gates, Medições, Usuários, Competências
- Índices: codigo (unique)

#### ✅ **UsuarioObra** (`usuario_obra`)
**Status:** ✅ Completa
- Campos: id, usuario_id, obra_id, permissao, is_ativo
- Relações: Usuario, Obra
- Índices: usuario_id, obra_id (unique)

#### ✅ **BaselineComercial** (`baseline_comercial`)
**Status:** ✅ Completa (com governança v2.1)
- Campos: id, obra_id, versao, descricao, valor_total, is_ativo
- Campos de Governança: status, proposta_por, proposta_em, homologada_por, homologada_em, rejeitada_por, rejeitada_em
- Relações: Obra, EAPs, Usuários
- Índices: obra_id + versao (unique), status

#### ✅ **Eap** (`eap`)
**Status:** ✅ Completa
- Campos: id, baseline_comercial_id, codigo, descricao, tipo, nivel, eap_pai_id, unidade_medida, quantidade, valor_unitario, valor_total, ordem, is_folha
- Relações: Baseline, Pai/Filho, Fatores, Medições
- Índices: baseline_comercial_id + codigo (unique), tipo

#### ✅ **EapFatorConversao** (`eap_fator_conversao`)
**Status:** ✅ Completa
- Campos: id, eap_comercial_id, eap_operacional_id, fator_quantidade, fator_valor, observacoes, is_ativo
- Relações: EAP Comercial, EAP Operacional
- Índices: eap_comercial_id + eap_operacional_id (unique)

#### ✅ **Gate** (`gates`)
**Status:** ✅ Estrutural (apenas leitura)
- Campos: id, obra_id, codigo (enum G1-G9), nome, descricao, ordem, data_prevista, data_real, status, usuario_id, usuario_aprovador_id, data_aprovacao
- Relações: Obra, Usuários
- Índices: obra_id + codigo (unique)

#### ✅ **Medicao** (`medicoes`)
**Status:** ✅ Completa
- Campos: id, obra_id, eap_id, usuario_id, tipo (enum MP/MC), periodo_referencia, data_medicao, quantidade_medida, valor_medido, observacoes, status, aprovado_por_id, data_aprovacao
- Relações: Obra, EAP, Usuários
- Índices: obra_id, tipo, periodo_referencia

#### ✅ **Insumo** (`insumos`)
**Status:** ✅ Completa
- Campos: id, codigo, nome, unidade, categoria, preco_estimado, estoque
- Relações: Nenhuma
- Índices: codigo (unique), categoria

#### ✅ **CompetenciaMensal** (`competencia_mensal`)
**Status:** ✅ Completa
- Campos: id, obra_id, periodo, status (enum), aberta_em, fechada_em, observacoes
- Relações: Obra, Gates
- Índices: obra_id + periodo (unique), status

#### ✅ **CompetenciaGate** (`competencia_gate`)
**Status:** ✅ Completa
- Campos: id, competencia_id, obra_id, numero (1-9), nome, status (enum), trava, ordem, aprovado_por_id, aprovado_em, rejeitado_por_id, rejeitado_em, motivo_rejeicao
- Relações: Competência, Obra, Usuários
- Índices: competencia_id + numero (unique)

**Total de Tabelas:** 12 tabelas

### 3.2 Status de Completude

#### ✅ **Tabelas Completas (com CRUD funcional):**
1. ✅ Usuario
2. ✅ Obra
3. ✅ UsuarioObra
4. ✅ BaselineComercial
5. ✅ Eap
6. ✅ EapFatorConversao
7. ✅ Medicao
8. ✅ Insumo
9. ✅ CompetenciaMensal
10. ✅ CompetenciaGate

#### ⚠️ **Tabelas Estruturais (apenas leitura/modelo):**
1. ⚠️ Gate (estrutura existe, mas fluxo de aprovação não está completo)

#### ❌ **Tabelas Não Implementadas (conforme conceito oficial):**
1. ❌ Cliente
2. ❌ Contrato
3. ❌ CentroCusto
4. ❌ PlanilhaAnalitica
5. ❌ Outros módulos (Engenharia, Produção, Custos, Qualidade, SST, Meio Ambiente, Financeiro)

---

## 4. FRONTEND

### 4.1 Telas Conectadas a Dados Reais

#### ✅ **Login** (`/login`)
**Status:** ✅ Conectado
- Usa: `POST /api/auth/login`
- Funcionalidades: Login, validação, redirecionamento

#### ✅ **Lista de Obras** (`/obras`)
**Status:** ✅ Conectado
- Usa: `GET /api/obras`, `POST /api/obras`, `PUT /api/obras`, `DELETE /api/obras`
- Funcionalidades: Listar, criar, editar, deletar obras
- Filtros: Status, cliente

#### ✅ **Detalhes da Obra** (`/obras/[id]`)
**Status:** ✅ Conectado (parcial)
- Usa:
  - `GET /api/obras/:id`
  - `GET /api/gates/obra/:obra_id`
  - `GET /api/eap/obra/:obra_id`
  - `GET /api/medicoes/obra/:obra_id`
  - `POST /api/medicoes`
  - `GET /api/dashboard/obra/:obra_id`
- Funcionalidades:
  - ✅ Resumo (dados da obra)
  - ✅ EAP (visualização comercial/operacional)
  - ✅ Medições (listar e criar)
  - ✅ Relatórios (dashboard com gráficos)

#### ✅ **Suprimentos** (`/suprimentos`)
**Status:** ✅ Conectado
- Usa: `GET /api/insumos` (Next.js API Route)
- Funcionalidades: Listar insumos

### 4.2 Telas Apenas Layout (Mockadas)

#### ❌ **Intranet** (`/`)
**Status:** ❌ Mockado
- Dados: Todos mockados (tarefas, comunicados, requisições, indicadores)
- Observação: "Dados mockados (serão substituídos por chamadas à API)"

#### ❌ **Qualidade** (`/qualidade`)
**Status:** ❌ Mockado
- Dados: Todos mockados (inspeções fictícias)
- Funcionalidades: Apenas visualização

### 4.3 Fluxos Funcionais Existentes

#### ✅ **Fluxo de Autenticação**
1. ✅ Login → Obter tokens
2. ✅ Salvar tokens no localStorage
3. ✅ Proteção de rotas (ProtectedRoute)
4. ✅ Renovação automática de token
5. ✅ Logout

#### ✅ **Fluxo de Obras**
1. ✅ Listar obras (com filtros)
2. ✅ Criar obra
3. ✅ Editar obra
4. ✅ Deletar obra
5. ✅ Ver detalhes da obra

#### ✅ **Fluxo de EAP**
1. ✅ Visualizar EAP comercial
2. ✅ Visualizar EAP operacional
3. ✅ Visualizar fatores de conversão
4. ⚠️ Criar/editar EAP (backend existe, frontend parcial)

#### ✅ **Fluxo de Medições**
1. ✅ Listar medições por obra
2. ✅ Criar medição (MP/MC)
3. ✅ Filtrar por tipo (MP/MC)
4. ⚠️ Aprovar/rejeitar (backend existe, frontend não implementado)

#### ✅ **Fluxo de Competências**
1. ✅ Abrir competência mensal
2. ✅ Visualizar gates da competência
3. ✅ Aprovar/rejeitar gates
4. ⚠️ Frontend não implementado (apenas backend)

#### ⚠️ **Fluxos Parciais**
- ⚠️ Dashboard (visualização OK, interação limitada)
- ⚠️ Gates (visualização OK, aprovação não implementada no frontend)

---

## 5. INTEGRAÇÕES

### 5.1 O que Está Integrado com Vercel

#### ✅ **Deploy e Build**
- ✅ Deploy automático via Git
- ✅ Build: `prisma generate && next build`
- ✅ Prisma Client generation no build
- ✅ Next.js API Routes funcionando

#### ✅ **Proxy Express → Next.js**
- ✅ Catch-all route (`app/api/[...all]/route.ts`)
- ✅ Integração Express com Next.js
- ✅ Lazy loading do Express app

#### ✅ **Configuração Vercel**
- ✅ `vercel.json` configurado
- ✅ Build command configurado
- ✅ Variáveis de ambiente suportadas

### 5.2 O que Está Apenas Local

#### ⚠️ **Servidor Express Standalone**
- ⚠️ `src/api/server.ts` existe mas não é usado no Vercel
- ⚠️ Útil apenas para desenvolvimento local (`npm run dev:api`)

#### ⚠️ **Banco de Dados**
- ⚠️ PostgreSQL pode ser local ou remoto (via `DATABASE_URL`)
- ⚠️ Não há integração específica com Vercel (usar Neon, Supabase, etc.)

#### ❌ **Serviços Externos**
- ❌ Não há integração com Supabase
- ❌ Não há integração com Neon
- ❌ Não há integração com Vercel Blob
- ❌ Não há integração com Stripe

---

## 6. LISTA OBJETIVA: PRONTO / EM ANDAMENTO / NÃO FEITO

### ✅ PRONTO

#### **Backend:**
- ✅ Autenticação JWT completa
- ✅ CRUD de Obras
- ✅ CRUD de EAP (comercial/operacional)
- ✅ CRUD de Medições (MP/MC)
- ✅ CRUD de Insumos
- ✅ Competências Mensais (abrir, aprovar/rejeitar gates)
- ✅ Dashboard (dados agregados)
- ✅ Middlewares (auth, validação, erro)
- ✅ Integração Prisma + PostgreSQL

#### **Frontend:**
- ✅ Login funcional
- ✅ Lista de obras (CRUD completo)
- ✅ Detalhes da obra (resumo, EAP, medições, relatórios)
- ✅ Suprimentos (listar insumos)
- ✅ Layout principal (MainLayout com sidebar)
- ✅ Proteção de rotas (ProtectedRoute)
- ✅ Cliente HTTP (axios com interceptors)

#### **Banco de Dados:**
- ✅ Schema completo (12 tabelas)
- ✅ Migrations configuradas
- ✅ Relações bem definidas
- ✅ Soft delete implementado
- ✅ Timestamps automáticos

#### **Deploy:**
- ✅ Vercel configurado
- ✅ Build funcionando
- ✅ API Routes funcionando
- ✅ Proxy Express → Next.js

### 🟡 EM ANDAMENTO / PARCIAL

#### **Backend:**
- 🟡 Rotas comerciais criadas mas **não registradas** no app.ts
- 🟡 Gates (estrutura existe, fluxo completo não implementado)
- 🟡 Aprovação/rejeição de medições (backend existe, frontend não)

#### **Frontend:**
- 🟡 Dashboard (visualização OK, interações limitadas)
- 🟡 EAP (visualização OK, criação/edição não completa)
- 🟡 Medições (criação OK, aprovação não implementada)
- 🟡 Competências (backend completo, frontend não implementado)

#### **Módulos:**
- 🟡 Módulo Obra (~60% completo)
- 🟡 Módulo Corporativo (0% - apenas estrutura)

### ❌ NÃO FOI FEITO

#### **Módulo Corporativo:**
- ❌ Clientes (cadastro)
- ❌ Contratos (cadastro)
- ❌ Centro de Custo
- ❌ Upload de Planilha Analítica
- ❌ Homologação de Baseline (frontend)
- ❌ Gate 1 (Liberação da Obra)

#### **Módulo Obra - Departamentos:**
- ❌ Engenharia
- ❌ Planejamento e Controle
- ❌ Produção
- ❌ Custos
- ❌ Qualidade (backend não existe, apenas layout)
- ❌ SST (Segurança e Saúde)
- ❌ Meio Ambiente
- ❌ Financeiro da Obra
- ❌ Gerencial (apenas dashboard básico)

#### **Funcionalidades Core:**
- ❌ Fechamento Mensal completo (backend existe, frontend não)
- ❌ 9 Gates de Governança (estrutura existe, fluxo não completo)
- ❌ Comparativo MP x MC (backend existe, não registrado)
- ❌ Aditivos e Glosas
- ❌ Faturamento

#### **Integrações:**
- ❌ Upload de arquivos (planilhas, documentos)
- ❌ Armazenamento de arquivos
- ❌ Notificações
- ❌ Relatórios em PDF/Excel

#### **Frontend:**
- ❌ Intranet (página inicial mockada)
- ❌ Qualidade (apenas layout mockado)
- ❌ Todas as páginas de departamentos não implementadas

---

## 📊 RESUMO EXECUTIVO

### **Progresso Geral:**
- **Backend:** ~70% completo
- **Frontend:** ~40% completo
- **Banco de Dados:** ~80% completo (estrutura base)
- **Integrações:** ~30% completo (Vercel OK, serviços externos não)

### **Principais Conquistas:**
✅ Stack moderna e funcional  
✅ Autenticação completa  
✅ CRUD básico funcionando  
✅ EAP dual implementada  
✅ Deploy no Vercel funcionando  

### **Principais Pendências:**
❌ Módulo Corporativo (0%)  
❌ Módulos de departamentos da obra  
❌ Fluxo completo de fechamento mensal  
❌ Homologação de baseline (frontend)  
❌ Frontend para competências  

### **Próximos Passos Recomendados:**
1. Registrar rotas comerciais no app.ts
2. Implementar frontend de competências
3. Implementar módulo de clientes
4. Implementar módulo de contratos
5. Implementar upload de planilha analítica
6. Implementar frontend de homologação de baseline

---

**Documento criado em:** Janeiro 2026  
**Versão:** 1.0  
**Autor:** Análise Sistemática do Projeto


