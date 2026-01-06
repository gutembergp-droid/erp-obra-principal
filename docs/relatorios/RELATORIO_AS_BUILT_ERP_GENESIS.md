# 📋 RELATÓRIO AS-BUILT
## ERP GENESIS - Estado Atual de Implementação

**Data:** Janeiro 2026  
**Versão do Documento:** 1.0  
**Tipo:** Documentação Técnica - Estado Real  
**Objetivo:** Documentar o estado atual do projeto para validação arquitetural externa

---

## SUMÁRIO

1. [Modelo de Dados Atual](#1-modelo-de-dados-atual)
2. [Contratos de API Existentes](#2-contratos-de-api-existentes)
3. [Arquitetura de Pastas](#3-arquitetura-de-pastas)
4. [Fluxos Implementados](#4-fluxos-implementados)
5. [Backlog Técnico Real](#5-backlog-técnico-real)

---

## 1. MODELO DE DADOS ATUAL

### 1.1. Tabelas/Models Existentes

**Total:** 8 modelos implementados no Prisma Schema (`prisma/schema.prisma`)

#### 1.1.1. Usuario
**Tabela:** `usuarios`

**Campos Principais:**
- `id` (String, UUID, PK)
- `email` (String, unique)
- `nome` (String)
- `senha_hash` (String)
- `perfil` (String, default: "usuario") - valores: admin, gestor, engenheiro, usuario
- `is_ativo` (Boolean, default: true)
- `created_at`, `updated_at`, `deleted_at` (timestamps)

**Relacionamentos:**
- 1:N com `Gate` (gates_criados, gates_aprovados)
- 1:N com `Medicao` (medicoes, medicoes_aprovadas)
- 1:N com `UsuarioObra` (obras_permitidas)
- 1:N com `Eap` (eaps_criadas)
- 1:N com `BaselineComercial` (baselines_propostas, baselines_homologadas, baselines_rejeitadas)

**Índices:** email, perfil, is_ativo

**Status:** ✅ Completo

---

#### 1.1.2. Obra
**Tabela:** `obras`

**Campos Principais:**
- `id` (String, UUID, PK)
- `codigo` (String, unique)
- `nome` (String)
- `descricao` (String, nullable)
- `cliente` (String, nullable)
- `data_inicio` (DateTime, nullable)
- `data_fim_prevista` (DateTime, nullable)
- `data_fim_real` (DateTime, nullable)
- `status` (String, default: "planejamento") - valores: planejamento, em_andamento, pausada, concluida, cancelada
- `orcamento_total` (Decimal(15,2), nullable)
- `created_at`, `updated_at`, `deleted_at` (timestamps)

**Relacionamentos:**
- 1:N com `BaselineComercial`
- 1:N com `Gate`
- 1:N com `Medicao`
- 1:N com `UsuarioObra`

**Status:** ✅ Completo

---

#### 1.1.3. UsuarioObra
**Tabela:** `usuario_obra`

**Campos Principais:**
- `id` (String, UUID, PK)
- `usuario_id` (String, FK → Usuario)
- `obra_id` (String, FK → Obra)
- `permissao` (String, default: "leitura") - valores: leitura, escrita, administrador
- `is_ativo` (Boolean, default: true)
- `created_at`, `updated_at`, `deleted_at` (timestamps)

**Relacionamentos:**
- N:1 com `Usuario`
- N:1 com `Obra`

**Constraints:** Unique(usuario_id, obra_id)

**Status:** ✅ Completo

---

#### 1.1.4. BaselineComercial
**Tabela:** `baseline_comercial`

**Campos Principais:**
- `id` (String, UUID, PK)
- `obra_id` (String, FK → Obra)
- `versao` (Int)
- `descricao` (String, nullable)
- `valor_total` (Decimal(15,2))
- `is_ativo` (Boolean, default: false)

**Campos de Homologação (v2.1):**
- `status` (String, default: "proposta") - valores: proposta, homologada, rejeitada
- `proposta_por` (String, nullable, FK → Usuario)
- `proposta_em` (DateTime, nullable)
- `homologada_por` (String, nullable, FK → Usuario)
- `homologada_em` (DateTime, nullable)
- `rejeitada_por` (String, nullable, FK → Usuario)
- `rejeitada_em` (DateTime, nullable)
- `motivo_rejeicao` (String, nullable)

**Campos Legados (mantidos para compatibilidade):**
- `data_aprovacao` (DateTime, nullable) - Deprecated
- `aprovado_por` (String, nullable) - Deprecated

**Relacionamentos:**
- N:1 com `Obra`
- 1:N com `Eap`
- N:1 com `Usuario` (usuario_proponente, usuario_homologador, usuario_rejeitador)

**Constraints:** Unique(obra_id, versao)

**Índices:** status, proposta_por, homologada_por

**Status:** ✅ Completo (campos de homologação adicionados, mas fluxo de homologação não implementado)

---

#### 1.1.5. Eap
**Tabela:** `eap`

**Campos Principais:**
- `id` (String, UUID, PK)
- `baseline_comercial_id` (String, FK → BaselineComercial)
- `codigo` (String)
- `descricao` (String)
- `tipo` (String) - valores: "comercial" ou "operacional"
- `nivel` (Int)
- `eap_pai_id` (String, nullable, FK → Eap) - self-reference para hierarquia
- `unidade_medida` (String, nullable)
- `quantidade` (Decimal(15,4), nullable)
- `valor_unitario` (Decimal(15,2), nullable)
- `valor_total` (Decimal(15,2), nullable)
- `ordem` (Int)
- `is_folha` (Boolean, default: false)
- `usuario_id` (String, nullable, FK → Usuario)
- `created_at`, `updated_at`, `deleted_at` (timestamps)

**Relacionamentos:**
- N:1 com `BaselineComercial`
- N:1 com `Usuario` (usuario_criador)
- Self-reference N:1 (pai/filhos para hierarquia)
- 1:N com `EapFatorConversao` (fatores_como_comercial, fatores_como_operacional)
- 1:N com `Medicao`

**Constraints:** Unique(baseline_comercial_id, codigo)

**Índices:** baseline_comercial_id, eap_pai_id, tipo, usuario_id

**Status:** ✅ Completo

---

#### 1.1.6. EapFatorConversao
**Tabela:** `eap_fator_conversao`

**Campos Principais:**
- `id` (String, UUID, PK)
- `eap_comercial_id` (String, FK → Eap)
- `eap_operacional_id` (String, FK → Eap)
- `fator_quantidade` (Decimal(15,6))
- `fator_valor` (Decimal(15,6), nullable)
- `observacoes` (String, nullable)
- `is_ativo` (Boolean, default: true)
- `created_at`, `updated_at`, `deleted_at` (timestamps)

**Relacionamentos:**
- N:1 com `Eap` (eap_comercial)
- N:1 com `Eap` (eap_operacional)

**Constraints:** Unique(eap_comercial_id, eap_operacional_id)

**Índices:** eap_comercial_id, eap_operacional_id, is_ativo

**Status:** ✅ Completo

---

#### 1.1.7. Gate
**Tabela:** `gates`

**Campos Principais:**
- `id` (String, UUID, PK)
- `obra_id` (String, FK → Obra)
- `codigo` (String)
- `nome` (String)
- `descricao` (String, nullable)
- `tipo` (String, default: "meio") - valores: inicio, meio, fim, customizado
- `ordem` (Int)
- `data_prevista` (DateTime, nullable)
- `data_real` (DateTime, nullable)
- `status` (String, default: "pendente") - valores: pendente, em_analise, aprovado, rejeitado
- `usuario_id` (String, nullable, FK → Usuario)
- `aprovado_por` (String, nullable) - Deprecated
- `usuario_aprovador_id` (String, nullable, FK → Usuario)
- `data_aprovacao` (DateTime, nullable)
- `observacoes` (String, nullable)
- `criterios_aprovacao` (String, nullable) - JSON ou texto
- `created_at`, `updated_at`, `deleted_at` (timestamps)

**Relacionamentos:**
- N:1 com `Obra`
- N:1 com `Usuario` (usuario_criador, usuario_aprovador)

**Constraints:** Unique(obra_id, codigo)

**Índices:** obra_id, usuario_id, usuario_aprovador_id, status, ordem

**Status:** ⚠️ Parcial - Estrutura completa, mas lógica dos 9 gates oficiais não implementada

---

#### 1.1.8. Medicao
**Tabela:** `medicoes`

**Campos Principais:**
- `id` (String, UUID, PK)
- `obra_id` (String, FK → Obra)
- `eap_id` (String, nullable, FK → Eap)
- `usuario_id` (String, FK → Usuario)
- `periodo_referencia` (String) - formato: "2026-01", "2026-Q1"
- `data_medicao` (DateTime)
- `quantidade_medida` (Decimal(15,4))
- `valor_medido` (Decimal(15,2), nullable)
- `observacoes` (String, nullable)
- `status` (String, default: "rascunho") - valores: rascunho, enviada, aprovada, rejeitada
- `aprovado_por_id` (String, nullable, FK → Usuario)
- `data_aprovacao` (DateTime, nullable)
- `created_at`, `updated_at`, `deleted_at` (timestamps)

**Relacionamentos:**
- N:1 com `Obra`
- N:1 com `Eap` (opcional)
- N:1 com `Usuario` (usuario, aprovado_por)

**Índices:** obra_id, eap_id, usuario_id, periodo_referencia, data_medicao, status

**Status:** ⚠️ Parcial - Não há separação entre MP (Medição de Produção) e MC (Medição do Cliente)

---

#### 1.1.9. Insumo
**Tabela:** `insumos`

**Campos Principais:**
- `id` (String, UUID, PK)
- `codigo` (String, unique)
- `nome` (String)
- `unidade` (String) - valores: m³, kg, un, saco, milheiro
- `categoria` (String)
- `preco_estimado` (Decimal(15,2))
- `estoque` (Decimal(15,4), default: 0)
- `created_at`, `updated_at`, `deleted_at` (timestamps)

**Índices:** codigo, categoria

**Status:** ✅ Completo (básico)

---

### 1.2. Relacionamentos Principais

```
Usuario ←→ UsuarioObra ←→ Obra
Obra → BaselineComercial → Eap
Eap ←→ EapFatorConversao (comercial ↔ operacional)
Obra → Gate
Obra → Medicao → Eap
Usuario → BaselineComercial (proponente, homologador, rejeitador)
Usuario → Eap (criador)
Usuario → Gate (criador, aprovador)
Usuario → Medicao (realizador, aprovador)
```

---

### 1.3. Modelos Não Implementados (Conceituais)

**Módulo Corporativo:**
- ❌ Cliente
- ❌ Contrato
- ❌ CentroCusto
- ❌ PlanilhaAnalitica

**Módulo Obra:**
- ❌ CompetenciaMensal
- ❌ MedicaoProducao (separada de Medicao)
- ❌ MedicaoCliente (separada de Medicao)
- ❌ Aditivo
- ❌ Glosa

**Outros:**
- ❌ Projeto (Engenharia)
- ❌ Requisicao (Suprimentos)
- ❌ Compra (Suprimentos)
- ❌ Apropriacao (Custos)
- ❌ Inspecao (Qualidade)
- ❌ NaoConformidade (Qualidade)
- ❌ Incidente (SST)
- ❌ Licenca (Meio Ambiente)

---

## 2. CONTRATOS DE API EXISTENTES

### 2.1. Estrutura da API

**Framework:** Express.js  
**Base URL:** `/api`  
**Autenticação:** JWT (Bearer Token)  
**Middleware Global:** CORS, JSON Parser, Error Handler

**Arquivos Principais:**
- `src/api/app.ts` - Configuração Express
- `src/api/server.ts` - Servidor HTTP
- `src/api/routes/index.ts` - Agregador de rotas

---

### 2.2. Endpoints por Módulo

#### 2.2.1. Autenticação (`/api/auth`)

**Módulo:** Sistema (comum)

| Método | Endpoint | Autenticação | Responsabilidade |
|--------|----------|--------------|------------------|
| POST | `/api/auth/login` | Não | Autentica usuário, retorna access_token e refresh_token |
| POST | `/api/auth/refresh` | Não | Renova access_token usando refresh_token |
| GET | `/api/auth/me` | Sim | Retorna dados do usuário autenticado |
| POST | `/api/auth/logout` | Sim | Logout (stateless, apenas confirmação) |

**Status:** ✅ Completo

---

#### 2.2.2. Obras (`/api/obras`)

**Módulo:** Módulo Obra

| Método | Endpoint | Autenticação | Responsabilidade |
|--------|----------|--------------|------------------|
| GET | `/api/obras` | Sim | Lista obras (filtros: status, cliente, includeDeleted) |
| GET | `/api/obras/:id` | Não | Busca obra por ID |
| POST | `/api/obras` | Não | Cria nova obra |
| PUT | `/api/obras/:id` | Não | Atualiza obra |
| DELETE | `/api/obras/:id` | Não | Soft delete de obra |

**Observações:**
- GET `/api/obras` aplica filtro de permissões (multi-obra)
- Outros endpoints não têm validação de permissão implementada

**Status:** ⚠️ Parcial - CRUD completo, mas validação de permissões incompleta

---

#### 2.2.3. EAP (`/api/eap`)

**Módulo:** Módulo Obra - Comercial

| Método | Endpoint | Autenticação | Responsabilidade |
|--------|----------|--------------|------------------|
| GET | `/api/eap` | Não | Lista EAPs por baseline (query: baseline_id, tipo, includeDeleted) |
| GET | `/api/eap/obra/:obra_id` | Sim | Lista EAPs por obra (filtro multi-obra) |
| GET | `/api/eap/obra/:obra_id/folha` | Sim | Lista EAPs folha por obra |
| GET | `/api/eap/comercial-operacional/:baseline_id` | Não | EAP Comercial com Operacionais relacionadas |
| GET | `/api/eap/:id` | Não | Busca EAP por ID |
| POST | `/api/eap` | Não | Cria EAP (recalcula operacionais automaticamente) |
| PUT | `/api/eap/:id` | Não | Atualiza EAP (recalcula operacionais automaticamente) |
| DELETE | `/api/eap/:id` | Não | Soft delete de EAP |

**Fatores de Conversão:**
| Método | Endpoint | Autenticação | Responsabilidade |
|--------|----------|--------------|------------------|
| GET | `/api/eap/:eap_comercial_id/fatores` | Não | Lista fatores de conversão |
| POST | `/api/eap/fatores` | Não | Cria fator (recalcula operacional) |
| PUT | `/api/eap/fatores/:id` | Não | Atualiza fator (recalcula operacional) |
| DELETE | `/api/eap/fatores/:id` | Não | Deleta fator (recalcula operacional) |

**Status:** ✅ Completo - CRUD completo com recálculo automático de EAPs operacionais

---

#### 2.2.4. Medições (`/api/medicoes`)

**Módulo:** Módulo Obra - Comercial

| Método | Endpoint | Autenticação | Responsabilidade |
|--------|----------|--------------|------------------|
| GET | `/api/medicoes/obra/:obra_id` | Sim | Lista medições por obra (filtro obrigatório) |
| GET | `/api/medicoes` | Não | Lista todas as medições (uso administrativo) |
| GET | `/api/medicoes/:id` | Não | Busca medição por ID |
| POST | `/api/medicoes` | Sim | Cria medição (usuario_id do token) |
| PUT | `/api/medicoes/:id` | Não | Atualiza medição |
| POST | `/api/medicoes/:id/aprovar` | Não | Aprova medição |
| POST | `/api/medicoes/:id/rejeitar` | Não | Rejeita medição |
| DELETE | `/api/medicoes/:id` | Não | Soft delete de medição |

**Observações:**
- Não há separação entre MP e MC
- Aprovação requer `aprovado_por_id` no body (não extraído do token)

**Status:** ⚠️ Parcial - CRUD completo, mas sem separação MP/MC e aprovação incompleta

---

#### 2.2.5. Gates (`/api/gates`)

**Módulo:** Módulo Obra - Governança

| Método | Endpoint | Autenticação | Responsabilidade |
|--------|----------|--------------|------------------|
| GET | `/api/gates/obra/:obra_id` | Sim | Lista gates por obra (filtros: status, tipo) |
| GET | `/api/gates/:id` | Sim | Busca gate por ID |

**Observações:**
- Apenas leitura implementada
- Não há endpoints para criar/atualizar/aprovar gates
- Não há lógica dos 9 gates oficiais

**Status:** ⚠️ Parcial - Apenas consulta implementada

---

#### 2.2.6. Dashboard (`/api/dashboard`)

**Módulo:** Módulo Obra - Gerencial

| Método | Endpoint | Autenticação | Responsabilidade |
|--------|----------|--------------|------------------|
| GET | `/api/dashboard/obra/:obra_id` | Sim | Dados agregados do dashboard (query: periodo) |

**Retorna:**
- Valor total contratado (soma EAPs comerciais)
- Medições aprovadas (com filtro de período)
- Gráficos de evolução e composição

**Status:** ✅ Completo (básico)

---

#### 2.2.7. Insumos (`/api/insumos`)

**Módulo:** Módulo Obra - Suprimentos

**Tecnologia:** Next.js API Route (não Express)

| Método | Endpoint | Autenticação | Responsabilidade |
|--------|----------|--------------|------------------|
| GET | `/api/insumos` | Não | Lista insumos (sem soft delete) |
| POST | `/api/insumos` | Não | Cria insumo |

**Observações:**
- Implementado como Next.js API Route
- Não integrado com Express
- Sem autenticação

**Status:** ⚠️ Parcial - CRUD básico, sem autenticação

---

### 2.3. Middlewares Implementados

**Arquivo:** `src/api/middleware/`

#### 2.3.1. authMiddleware.ts
- Valida token JWT
- Extrai dados do usuário do token
- Adiciona `user` ao `req`
- Retorna 401 se token inválido

**Status:** ✅ Completo

#### 2.3.2. validateObra.ts
- Valida acesso do usuário à obra (multi-obra)
- Verifica permissão em `UsuarioObra`
- Admin tem acesso a todas as obras
- Retorna 403 se sem permissão

**Status:** ✅ Completo

#### 2.3.3. errorHandler.ts
- Trata erros da API
- Formata respostas de erro
- Log de erros

**Status:** ✅ Completo

---

### 2.4. Endpoints Não Implementados

**Módulo Corporativo:**
- ❌ `/api/corporativo/clientes` - CRUD de clientes
- ❌ `/api/corporativo/contratos` - CRUD de contratos
- ❌ `/api/corporativo/centro-custo` - CRUD de centro de custo
- ❌ `/api/corporativo/planilha-analitica` - Upload e processamento
- ❌ `/api/obras/:id/baseline/propor` - Propor baseline
- ❌ `/api/obras/:id/baseline/:baselineId/homologar` - Homologar baseline
- ❌ `/api/obras/:id/baseline/:baselineId/rejeitar` - Rejeitar baseline

**Módulo Obra:**
- ❌ `/api/comercial/medicao-producao` - MP separada
- ❌ `/api/comercial/medicao-cliente` - MC separada
- ❌ `/api/comercial/comparativo` - Comparativo MP x MC
- ❌ `/api/comercial/aditivos` - CRUD de aditivos
- ❌ `/api/comercial/glosas` - CRUD de glosas
- ❌ `/api/comercial/faturamento` - Faturamento
- ❌ `/api/producao/apontamentos` - Apontamentos de produção
- ❌ `/api/custos/apropriacoes` - Apropriações
- ❌ `/api/custos/rateios` - Rateios
- ❌ `/api/qualidade/inspecoes` - Inspeções
- ❌ `/api/qualidade/ncs` - Não conformidades
- ❌ `/api/sst/incidentes` - Incidentes
- ❌ `/api/meio-ambiente/licencas` - Licenças
- ❌ `/api/financeiro/fluxo-caixa` - Fluxo de caixa
- ❌ `/api/gerencial/resultado` - Análise de resultado

---

## 3. ARQUITETURA DE PASTAS

### 3.1. Estrutura Atual

```
ERP G-NESIS/
├── app/                          # Next.js App Router (Frontend)
│   ├── layout.tsx               # Layout global
│   ├── login/
│   │   ├── page.tsx             # Página de login
│   │   └── page.css
│   ├── obras/
│   │   ├── page.tsx             # Lista de obras
│   │   ├── page.css
│   │   └── [id]/
│   │       ├── page.tsx         # Detalhes da obra
│   │       ├── page.css
│   │       └── components/
│   │           ├── EvolucaoChart.tsx
│   │           ├── EvolucaoLineChart.tsx
│   │           └── ComposicaoPizzaChart.tsx
│   ├── not-found.tsx            # Página 404
│   └── not-found.css
│
├── src/
│   ├── api/                      # Backend Express
│   │   ├── app.ts               # Configuração Express
│   │   ├── server.ts            # Servidor HTTP
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validateObra.ts
│   │   └── routes/
│   │       ├── index.ts         # Agregador
│   │       ├── auth.routes.ts
│   │       ├── obras.routes.ts
│   │       ├── eap.routes.ts
│   │       ├── medicoes.routes.ts
│   │       ├── gates.routes.ts
│   │       └── dashboard.routes.ts
│   │
│   ├── app/                      # Next.js Pages (Frontend)
│   │   ├── page.tsx             # Intranet/Dashboard
│   │   ├── suprimentos/
│   │   │   └── page.tsx         # Página de suprimentos
│   │   └── api/                 # Next.js API Routes
│   │       └── insumos/
│   │           └── route.ts     # GET/POST insumos
│   │
│   ├── components/                # Componentes React
│   │   ├── MainLayout.tsx       # Layout com Sidebar
│   │   ├── ProtectedRoute.tsx   # Proteção de rotas
│   │   ├── EapEstruturacao/     # Componentes de EAP
│   │   │   ├── EapEstruturacaoTable.tsx
│   │   │   ├── EapDrawer.tsx
│   │   │   └── *.css
│   │   └── suprimentos/
│   │       └── ModalNovoInsumo.tsx
│   │
│   ├── services/                 # Services (Backend)
│   │   ├── ObraService.ts
│   │   ├── EapService.ts
│   │   ├── MedicaoService.ts
│   │   ├── GateService.ts
│   │   └── api/                 # Services (Frontend)
│   │       ├── authApi.ts
│   │       ├── obraApi.ts
│   │       ├── eapApi.ts
│   │       ├── medicaoApi.ts
│   │       ├── gateApi.ts
│   │       └── dashboardApi.ts
│   │
│   ├── types/                    # TypeScript Types
│   │   ├── usuario.ts
│   │   ├── obras.ts
│   │   ├── baseline-comercial.ts
│   │   ├── eap.ts
│   │   ├── eap-fator-conversao.ts
│   │   ├── gates.ts
│   │   ├── medicao.ts
│   │   ├── insumo.ts (implícito)
│   │   └── usuario-obra.ts
│   │
│   ├── utils/                    # Utilitários
│   │   ├── jwt.ts               # JWT (generate, verify)
│   │   └── bcrypt.ts            # Hash de senhas
│   │
│   ├── lib/                      # Bibliotecas
│   │   ├── api.ts               # Configuração Axios
│   │   └── auth.ts              # Helpers de autenticação
│   │
│   ├── pages/                    # Páginas legadas (não usadas)
│   │   └── EapEstruturacaoPage.tsx
│   │
│   └── scripts/                   # Scripts utilitários
│       └── seed-admin.ts        # Reset de senha admin
│
├── prisma/
│   ├── schema.prisma            # Schema do banco
│   ├── seed.ts                  # Seed do banco
│   └── migrations/              # Migrations
│
├── package.json
├── tsconfig.json
├── next.config.js
└── .env                         # Variáveis de ambiente
```

---

### 3.2. Separação Backend/Frontend

**Backend (Express):**
- Localização: `src/api/`
- Servidor independente (porta 3001)
- Rotas RESTful
- Services com lógica de negócio

**Frontend (Next.js):**
- Localização: `app/` e `src/app/`
- App Router do Next.js 14
- API Routes do Next.js (`src/app/api/`)
- Componentes React (`src/components/`)
- Services de API (`src/services/api/`)

**Observação:** Há duplicação - `src/app/api/insumos` (Next.js) e `src/api/routes/` (Express). Insumos usa Next.js API Route.

---

### 3.3. Organização por Módulo

**Módulo Corporativo:**
- ❌ Não existe estrutura dedicada
- ❌ Sem pastas específicas

**Módulo Obra:**
- ✅ Estrutura parcial
- ✅ Rotas por funcionalidade (obras, eap, medicoes, gates)
- ⚠️ Sem separação clara por departamento (Comercial, Produção, etc.)

**Status:** ⚠️ Estrutura genérica, não modularizada por conceito

---

## 4. FLUXOS IMPLEMENTADOS

### 4.1. Fluxos Completos

#### 4.1.1. Autenticação e Autorização
**Status:** ✅ Completo

**Fluxo:**
1. Usuário faz login (`POST /api/auth/login`)
2. Sistema retorna `access_token` e `refresh_token`
3. Frontend armazena tokens
4. Requisições incluem `Authorization: Bearer <token>`
5. `authMiddleware` valida token
6. Token pode ser renovado via `POST /api/auth/refresh`

**Implementado:**
- Login com JWT
- Refresh token
- Middleware de autenticação
- Proteção de rotas no frontend (`ProtectedRoute`)

---

#### 4.1.2. Gestão de Obras (CRUD)
**Status:** ✅ Completo (básico)

**Fluxo:**
1. Listar obras (`GET /api/obras`) - com filtros
2. Criar obra (`POST /api/obras`)
3. Visualizar obra (`GET /api/obras/:id`)
4. Editar obra (`PUT /api/obras/:id`)
5. Deletar obra (`DELETE /api/obras/:id`) - soft delete

**Frontend:**
- Página de lista (`app/obras/page.tsx`)
- Página de detalhes (`app/obras/[id]/page.tsx`)
- Drawer para criar/editar

**Implementado:**
- CRUD completo
- Filtros (status, cliente)
- Soft delete
- Multi-obra (filtro de permissões)

---

#### 4.1.3. EAP - Estruturação
**Status:** ✅ Completo

**Fluxo:**
1. Criar Baseline Comercial (via seed ou manual)
2. Criar EAP Comercial (`POST /api/eap`)
3. Sistema recalcula EAPs Operacionais automaticamente
4. Criar/atualizar Fatores de Conversão (`POST /api/eap/fatores`)
5. Sistema recalcula EAPs Operacionais automaticamente
6. Visualizar EAP Comercial com Operacionais (`GET /api/eap/comercial-operacional/:baseline_id`)

**Frontend:**
- Componente `EapEstruturacaoTable` (tabela de alta densidade)
- Componente `EapDrawer` (configurações)
- Página de estruturação (legada, não usada)

**Implementado:**
- CRUD completo de EAP
- Hierarquia (pai/filhos)
- EAP Comercial e Operacional
- Fatores de conversão
- Recálculo automático de operacionais
- Interface de estruturação

---

#### 4.1.4. Medições (Básico)
**Status:** ⚠️ Parcial

**Fluxo:**
1. Criar medição (`POST /api/medicoes`)
2. Listar medições por obra (`GET /api/medicoes/obra/:obra_id`)
3. Aprovar medição (`POST /api/medicoes/:id/aprovar`)
4. Rejeitar medição (`POST /api/medicoes/:id/rejeitar`)

**Frontend:**
- Página de detalhes da obra (aba Medições)
- Formulário de nova medição
- Histórico de medições

**Implementado:**
- CRUD básico
- Aprovação/rejeição
- Histórico

**Não Implementado:**
- Separação MP/MC
- Comparativo MP x MC
- Faturamento baseado em MC

---

#### 4.1.5. Dashboard/Gráficos
**Status:** ✅ Completo (básico)

**Fluxo:**
1. Acessar dashboard (`GET /api/dashboard/obra/:obra_id`)
2. Sistema retorna dados agregados
3. Frontend renderiza gráficos

**Frontend:**
- Componentes de gráficos (Recharts)
- Gráfico de evolução (linha)
- Gráfico de composição (pizza)

**Implementado:**
- Dados agregados
- Gráficos de evolução
- Gráficos de composição
- Filtros de período

---

#### 4.1.6. Suprimentos (Básico)
**Status:** ⚠️ Parcial

**Fluxo:**
1. Listar insumos (`GET /api/insumos`)
2. Criar insumo (`POST /api/insumos`)

**Frontend:**
- Página de suprimentos (`src/app/suprimentos/page.tsx`)
- Modal para novo insumo (`ModalNovoInsumo`)

**Implementado:**
- CRUD básico de insumos
- Interface de listagem
- Modal de criação

**Não Implementado:**
- Requisições
- Compras
- Contratos
- Estoque por obra
- Movimentações

---

### 4.2. Fluxos Parcialmente Implementados

#### 4.2.1. Gates
**Status:** ⚠️ Parcial

**Implementado:**
- Modelo de dados
- Listagem de gates por obra
- Visualização de status

**Não Implementado:**
- Criação de gates
- Aprovação de gates
- Lógica dos 9 gates oficiais
- Sequência de aprovação
- Bloqueios (Gate 5 e 6 bloqueiam Gate 9)
- Validação de Gate 1 (baseline homologada)

---

#### 4.2.2. Baseline Comercial
**Status:** ⚠️ Parcial

**Implementado:**
- Modelo de dados com campos de homologação
- Versionamento
- Campos: status, proposta_por, homologada_por, etc.

**Não Implementado:**
- Endpoint para propor baseline
- Endpoint para homologar baseline
- Endpoint para rejeitar baseline
- Interface de homologação no Corporativo
- Interface de proposta no Comercial

---

### 4.3. Fluxos Não Iniciados

**Módulo Corporativo:**
- ❌ Cadastro de Clientes
- ❌ Cadastro de Contratos
- ❌ Abertura de Centro de Custo
- ❌ Upload de Planilha Analítica
- ❌ Homologação de Baseline
- ❌ Gate 1 (Liberação da Obra)

**Módulo Obra - Comercial:**
- ❌ Estruturação completa (com proposta/homologação)
- ❌ MP separada de MC
- ❌ Comparativo MP x MC
- ❌ Aditivos
- ❌ Glosas
- ❌ Faturamento

**Módulo Obra - Outros Departamentos:**
- ❌ Engenharia (projetos, documentação)
- ❌ Planejamento e Controle (cronograma, PBS)
- ❌ Produção (apontamentos, avanços)
- ❌ Custos (apropriações, rateios)
- ❌ Qualidade (inspeções, NCs)
- ❌ SST (incidentes, inspeções)
- ❌ Meio Ambiente (licenças, monitoramentos)
- ❌ Financeiro (fluxo de caixa)
- ❌ Gerencial (análise de resultado)

**Fechamento Mensal:**
- ❌ Modelo CompetenciaMensal
- ❌ Fluxo de fechamento
- ❌ Validações dos 9 gates
- ❌ Dashboard de fechamento

---

## 5. BACKLOG TÉCNICO REAL

### 5.1. Crítico (Bloqueia Funcionalidades Core)

#### 5.1.1. Módulo Corporativo
**Prioridade:** 🔴 CRÍTICA

**Tarefas:**
1. **Modelos de Dados:**
   - [ ] Criar modelo `Cliente`
   - [ ] Criar modelo `Contrato`
   - [ ] Criar modelo `CentroCusto`
   - [ ] Criar modelo `PlanilhaAnalitica`

2. **Endpoints de API:**
   - [ ] CRUD de Clientes (`/api/corporativo/clientes`)
   - [ ] CRUD de Contratos (`/api/corporativo/contratos`)
   - [ ] CRUD de Centro de Custo (`/api/corporativo/centro-custo`)
   - [ ] Upload de Planilha Analítica (`/api/corporativo/planilha-analitica/upload`)
   - [ ] Processamento de Planilha (`/api/corporativo/planilha-analitica/processar`)

3. **Fluxo de Homologação:**
   - [ ] `POST /api/obras/:id/baseline/propor`
   - [ ] `POST /api/obras/:id/baseline/:baselineId/homologar`
   - [ ] `POST /api/obras/:id/baseline/:baselineId/rejeitar`
   - [ ] `GET /api/obras/:id/baseline`

4. **Gate 1:**
   - [ ] Validação de pré-requisitos (cliente, contrato, centro de custo, planilha, baseline homologada)
   - [ ] Endpoint de aprovação
   - [ ] Transição Corporativo → Obra

5. **Frontend:**
   - [ ] Páginas do Módulo Corporativo
   - [ ] Interface de homologação
   - [ ] Interface de upload de planilha

**Impacto:** Sem isso, não há fluxo completo Corporativo → Obra

---

#### 5.1.2. Gates de Governança
**Prioridade:** 🔴 CRÍTICA

**Tarefas:**
1. **Lógica dos 9 Gates:**
   - [ ] Implementar Gate 1 (Liberação da Obra)
   - [ ] Implementar Gate 2 (Fechamento de Produção)
   - [ ] Implementar Gate 3 (Fechamento de Custos)
   - [ ] Implementar Gate 4 (Fechamento Comercial)
   - [ ] Implementar Gate 5 (Qualidade OK)
   - [ ] Implementar Gate 6 (SST OK)
   - [ ] Implementar Gate 7 (Financeiro OK)
   - [ ] Implementar Gate 8 (Gerencial OK)
   - [ ] Implementar Gate 9 (Competência Concluída)

2. **Endpoints:**
   - [ ] `POST /api/gates` - Criar gate
   - [ ] `PUT /api/gates/:id` - Atualizar gate
   - [ ] `POST /api/gates/:id/aprovar` - Aprovar gate
   - [ ] `POST /api/gates/:id/rejeitar` - Rejeitar gate

3. **Lógica de Sequência:**
   - [ ] Validação de dependências (Gate N só após Gate N-1)
   - [ ] Bloqueio Gate 9 se Gate 5 ou Gate 6 não aprovados

4. **Fechamento Mensal:**
   - [ ] Modelo `CompetenciaMensal`
   - [ ] Fluxo de fechamento
   - [ ] Dashboard de status

**Impacto:** Sem isso, não há governança de obra

---

#### 5.1.3. Medições MP/MC
**Prioridade:** 🔴 CRÍTICA

**Tarefas:**
1. **Modelos:**
   - [ ] Separar `Medicao` em `MedicaoProducao` e `MedicaoCliente`
   - [ ] Ou adicionar campo `tipo` com valores "MP" | "MC"

2. **Endpoints:**
   - [ ] `GET /api/comercial/medicao-producao/obra/:obra_id`
   - [ ] `POST /api/comercial/medicao-producao`
   - [ ] `GET /api/comercial/medicao-cliente/obra/:obra_id`
   - [ ] `POST /api/comercial/medicao-cliente`
   - [ ] `GET /api/comercial/comparativo/obra/:obra_id` - Comparativo MP x MC

3. **Frontend:**
   - [ ] Interface de MP
   - [ ] Interface de MC
   - [ ] Interface de comparativo (acesso restrito)

**Impacto:** Sem isso, não há controle comercial completo

---

### 5.2. Importante (Funcionalidades Essenciais)

#### 5.2.1. Comercial da Obra
**Prioridade:** 🟡 IMPORTANTE

**Tarefas:**
1. **Aditivos:**
   - [ ] Modelo `Aditivo`
   - [ ] CRUD de aditivos
   - [ ] Versionamento de baseline por aditivo

2. **Glosas:**
   - [ ] Modelo `Glosa`
   - [ ] CRUD de glosas
   - [ ] Impacto em receita

3. **Faturamento:**
   - [ ] Modelo `Faturamento`
   - [ ] Geração baseada em MC aprovada
   - [ ] Integração com Financeiro

---

#### 5.2.2. Produção
**Prioridade:** 🟡 IMPORTANTE

**Tarefas:**
1. **Modelos:**
   - [ ] `Apontamento` (diário)
   - [ ] `Avanco` (consolidado)
   - [ ] `PBS` (Planejamento Baseado em Serviços)

2. **Endpoints:**
   - [ ] CRUD de apontamentos
   - [ ] Consolidação mensal
   - [ ] Integração com MP (Comercial)

3. **Frontend:**
   - [ ] Interface de apontamentos
   - [ ] Interface de avanços

---

#### 5.2.3. Custos
**Prioridade:** 🟡 IMPORTANTE

**Tarefas:**
1. **Modelos:**
   - [ ] `Apropriacao` (custos diretos)
   - [ ] `Rateio` (custos indiretos)

2. **Endpoints:**
   - [ ] CRUD de apropriações
   - [ ] CRUD de rateios
   - [ ] Cálculo CR/CO (Custo Real vs. Custo Orçado)
   - [ ] Cálculo F/CD (Faturamento vs. Custo Direto)

3. **Frontend:**
   - [ ] Interface de apropriações
   - [ ] Interface de rateios
   - [ ] Dashboards de custos

---

#### 5.2.4. Qualidade e SST
**Prioridade:** 🟡 IMPORTANTE (Poder de Trava)

**Tarefas:**
1. **Qualidade:**
   - [ ] Modelos: `Inspecao`, `NaoConformidade`, `Ensaio`
   - [ ] CRUD completo
   - [ ] Integração com Gate 5

2. **SST:**
   - [ ] Modelos: `Incidente`, `InspecaoSST`, `Treinamento`
   - [ ] CRUD completo
   - [ ] Integração com Gate 6

3. **Poder de Trava:**
   - [ ] Lógica que bloqueia Gate 9 se Gate 5 ou Gate 6 não aprovados

---

### 5.3. Futuro (Funcionalidades Complementares)

#### 5.3.1. Engenharia
**Prioridade:** 🟢 FUTURO

**Tarefas:**
- [ ] Modelos: `Projeto`, `Documento`, `LiberacaoFrente`
- [ ] CRUD completo
- [ ] Interface de projetos

---

#### 5.3.2. Planejamento e Controle
**Prioridade:** 🟢 FUTURO

**Tarefas:**
- [ ] Modelos: `Cronograma`, `CurvaS`, `PBS`, `Lookahead`
- [ ] CRUD completo
- [ ] Interface de planejamento

---

#### 5.3.3. Suprimentos (Completo)
**Prioridade:** 🟢 FUTURO

**Tarefas:**
- [ ] Modelos: `Requisicao`, `Compra`, `ContratoFornecedor`, `Estoque`
- [ ] CRUD completo
- [ ] Integração com Custos e Produção

---

#### 5.3.4. Meio Ambiente
**Prioridade:** 🟢 FUTURO

**Tarefas:**
- [ ] Modelos: `Licenca`, `Condicionante`, `Monitoramento`
- [ ] CRUD completo

---

#### 5.3.5. Financeiro da Obra
**Prioridade:** 🟢 FUTURO

**Tarefas:**
- [ ] Modelos: `FluxoCaixa`, `ContaPagar`, `ContaReceber`
- [ ] CRUD completo
- [ ] Integração com Faturamento

---

#### 5.3.6. Gerencial
**Prioridade:** 🟢 FUTURO

**Tarefas:**
- [ ] Análise de resultado
- [ ] Tendências
- [ ] Cenários
- [ ] Dashboards executivos

---

### 5.4. Melhorias Técnicas

#### 5.4.1. Autenticação e Permissões
**Prioridade:** 🟡 IMPORTANTE

**Tarefas:**
- [ ] Implementar validação de permissões em todos os endpoints
- [ ] Definir perfis de acesso por módulo
- [ ] Implementar RBAC (Role-Based Access Control)

---

#### 5.4.2. Validações
**Prioridade:** 🟡 IMPORTANTE

**Tarefas:**
- [ ] Validação de dados de entrada (DTOs)
- [ ] Validação de regras de negócio
- [ ] Tratamento de erros padronizado

---

#### 5.4.3. Testes
**Prioridade:** 🟢 FUTURO

**Tarefas:**
- [ ] Testes unitários (Services)
- [ ] Testes de integração (API)
- [ ] Testes E2E (Frontend)

---

#### 5.4.4. Documentação
**Prioridade:** 🟢 FUTURO

**Tarefas:**
- [ ] Documentação de API (Swagger/OpenAPI)
- [ ] Documentação de componentes
- [ ] Guias de uso

---

## 6. RESUMO EXECUTIVO

### 6.1. O que Está Implementado

**Modelos de Dados:** 8/20+ (40%)
- ✅ Usuario, Obra, UsuarioObra, BaselineComercial, Eap, EapFatorConversao, Gate, Medicao, Insumo

**Endpoints de API:** ~25 endpoints
- ✅ Autenticação (4)
- ✅ Obras (5)
- ✅ EAP (12)
- ✅ Medições (8)
- ✅ Gates (2)
- ✅ Dashboard (1)
- ✅ Insumos (2)

**Fluxos Completos:**
- ✅ Autenticação
- ✅ Gestão de Obras (CRUD)
- ✅ EAP (Estruturação)
- ✅ Medições (básico)
- ✅ Dashboard/Gráficos

**Fluxos Parciais:**
- ⚠️ Gates (apenas leitura)
- ⚠️ Baseline (modelo completo, fluxo de homologação não implementado)
- ⚠️ Suprimentos (apenas insumos básicos)

---

### 6.2. O que Não Está Implementado

**Módulo Corporativo:** 0%
- ❌ Nenhum endpoint
- ❌ Nenhum modelo (exceto BaselineComercial parcial)
- ❌ Nenhuma interface

**Módulo Obra - Departamentos:**
- ❌ Engenharia: 0%
- ❌ Produção: 0%
- ❌ Custos: 0%
- ❌ Qualidade: 0%
- ❌ SST: 0%
- ❌ Meio Ambiente: 0%
- ❌ Financeiro: 0%
- ❌ Gerencial: 0% (exceto dashboard básico)

**Funcionalidades Core:**
- ❌ Fechamento Mensal: 0%
- ❌ 9 Gates de Governança: 0% (estrutura existe, lógica não)
- ❌ MP/MC separadas: 0%
- ❌ Comparativo MP x MC: 0%

---

### 6.3. Arquitetura Atual

**Backend:**
- ✅ Express.js estruturado
- ✅ Prisma ORM
- ✅ JWT Authentication
- ✅ Multi-obra (parcial)
- ⚠️ Sem separação clara Módulo Corporativo vs. Módulo Obra

**Frontend:**
- ✅ Next.js 14 (App Router)
- ✅ React 18
- ✅ Tailwind CSS
- ✅ Componentes reutilizáveis
- ⚠️ Estrutura não modularizada por departamento

**Banco de Dados:**
- ✅ PostgreSQL
- ✅ Migrations do Prisma
- ✅ Soft delete implementado
- ✅ Timestamps automáticos

---

### 6.4. Métricas de Cobertura

**Modelos de Dados:** 40% (8/20+)
**Endpoints de API:** ~35% (25/70+ estimados)
**Fluxos Completos:** ~20% (5/25+ estimados)
**Módulo Corporativo:** 0%
**Módulo Obra:** ~30% (estrutura base + EAP + Medições básicas)

---

## 7. CONCLUSÃO

O projeto ERP GENESIS possui uma **base sólida implementada**:

- ✅ Autenticação e autorização funcionais
- ✅ Gestão de obras (CRUD completo)
- ✅ EAP com visão dual (comercial/operacional) e fatores de conversão
- ✅ Medições básicas
- ✅ Dashboard com gráficos
- ✅ Estrutura de gates (modelo de dados)

**Principais lacunas:**

- ❌ Módulo Corporativo completamente ausente
- ❌ Fluxo de homologação de baseline não implementado
- ❌ 9 Gates de Governança sem lógica
- ❌ Separação MP/MC não implementada
- ❌ Departamentos do Módulo Obra não implementados (exceto Comercial parcial)

**Estado Geral:** Base funcional para Módulo Obra (parcial), sem Módulo Corporativo.

---

**Documento criado em:** Janeiro 2026  
**Versão:** 1.0  
**Tipo:** AS-BUILT (Estado Real)  
**Status:** ✅ Documentação Completa






