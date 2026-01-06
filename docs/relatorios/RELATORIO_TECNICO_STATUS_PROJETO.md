================================================================================
MEMORIAL / RELATÓRIO / DOCUMENTO – ERP GENESIS
================================================================================
Produto................: ERP GENESIS
Versão.................: v1.0
Status.................: RASCUNHO
Data...................: 2026-01-05
Hora...................: 16:30 (UTC-3)
IA Autora..............: Auto (Cursor AI)
Solicitante............: Proprietário do Produto / GC
Arquitetura............: ChatGPT + Cursor + v0 + Vercel
Origem do Documento....: Nova Criação
Documento Substitui....: —
Documento Substituído Por: —
Objetivo...............: Gestão de Alta Performance por Micro-Unidades de Resultado
================================================================================

# RELATÓRIO TÉCNICO COMPLETO DE STATUS DO PROJETO
## ERP GENESIS - Análise do Estado Atual do Repositório

---

## 1. VISÃO GERAL TÉCNICA

### 1.1. Tipo de Aplicação
- **Categoria**: Fullstack (Frontend + Backend separados)
- **Arquitetura**: Monorepo com separação clara entre frontend e backend
- **Padrão**: API REST + SPA (Single Page Application)

### 1.2. Linguagens Utilizadas
- **TypeScript**: 100% do código (frontend e backend)
- **SQL**: Migrations do Prisma e queries diretas quando necessário
- **JavaScript**: Apenas arquivos de configuração (next.config.js)

### 1.3. Frameworks e Bibliotecas Principais

#### Frontend
- **Next.js 14.0.0**: Framework React com App Router
- **React 18.0.0**: Biblioteca de interface
- **React DOM 18.0.0**: Renderização
- **Recharts 2.10.0**: Gráficos e visualizações
- **Lucide React 0.562.0**: Ícones
- **Axios 1.6.0**: Cliente HTTP (não utilizado diretamente, substituído por fetch nativo)

#### Backend
- **Express.js 4.18.0**: Framework web para Node.js
- **Prisma 5.0.0**: ORM para banco de dados
- **@prisma/client 5.0.0**: Cliente Prisma
- **jsonwebtoken 9.0.0**: Autenticação JWT
- **bcrypt 5.1.0 / bcryptjs 3.0.3**: Hash de senhas
- **cors 2.8.5**: Middleware CORS

#### Banco de Dados
- **PostgreSQL**: SGBD relacional (configurado via Prisma)

#### Ferramentas de Desenvolvimento
- **ts-node 10.9.2**: Execução de TypeScript
- **tsx 4.21.0**: Executor alternativo de TypeScript
- **TypeScript 5.0.0**: Compilador

### 1.4. Stack Principal Identificada
- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript
- **Backend**: Express.js + TypeScript + Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (Access Token + Refresh Token)
- **Deploy**: Vercel (configurado via vercel.json)

---

## 2. ESTRUTURA DO REPOSITÓRIO

### 2.1. Árvore de Pastas Atual

```
ERP G-NESIS/
├── app/                          # Next.js App Router (Frontend)
│   ├── api/                      # Next.js API Routes
│   │   ├── [...all]/            # Catch-all route
│   │   └── insumos/             # API de insumos
│   ├── comercial/
│   │   └── estruturacao/        # Página de estruturação EAP
│   ├── login/                    # Página de login
│   ├── obras/                    # Módulo de obras
│   │   ├── [id]/                # Detalhes da obra (dinâmico)
│   │   └── page.tsx             # Lista de obras
│   ├── qualidade/                # Módulo qualidade (esqueleto)
│   ├── suprimentos/              # Módulo suprimentos
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Página inicial (Intranet/Dashboard)
│   └── globals.css               # Estilos globais
│
├── src/
│   ├── api/                      # Backend Express (separado)
│   │   ├── controllers/         # Controllers (MVC)
│   │   │   ├── MedicoesController.ts
│   │   │   └── ObrasController.ts
│   │   ├── middlewares/          # Middlewares Express
│   │   │   ├── authMiddleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validateObra.ts
│   │   ├── routes/               # Rotas da API
│   │   │   ├── auth.routes.ts
│   │   │   ├── obras.routes.ts
│   │   │   ├── eap.routes.ts
│   │   │   ├── medicoes.routes.ts
│   │   │   ├── gates.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   ├── competencias.routes.ts
│   │   │   ├── contexto.routes.ts
│   │   │   └── comercial.routes.ts
│   │   ├── utils/                # Utilitários da API
│   │   ├── app.ts                # Configuração Express
│   │   └── server.ts             # Servidor HTTP
│   │
│   ├── components/               # Componentes React reutilizáveis
│   │   ├── MainLayout.tsx        # Layout principal com Sidebar
│   │   ├── ProtectedRoute.tsx    # Proteção de rotas
│   │   ├── EapEstruturacao/      # Componentes de EAP
│   │   └── suprimentos/          # Componentes de suprimentos
│   │
│   ├── hooks/                    # Hooks customizados React
│   │   ├── useAuth.ts            # Hook de autenticação
│   │   └── useObraAtiva.ts       # Hook de obra ativa
│   │
│   ├── providers/                # Context Providers React
│   │   ├── AuthProvider.tsx      # Provider de autenticação
│   │   └── ObraAtivaProvider.tsx # Provider de obra ativa
│   │
│   ├── services/                 # Camada de serviços
│   │   ├── api/                  # Serviços de API (Frontend)
│   │   │   ├── authApi.ts
│   │   │   ├── obraApi.ts
│   │   │   ├── eapApi.ts
│   │   │   ├── medicaoApi.ts
│   │   │   ├── gateApi.ts
│   │   │   ├── dashboardApi.ts
│   │   │   └── contextoApi.ts
│   │   └── [Backend Services]    # Services do backend
│   │       ├── ObraService.ts
│   │       ├── EapService.ts
│   │       ├── MedicaoService.ts
│   │       ├── GateService.ts
│   │       └── CompetenciaService.ts
│   │
│   ├── lib/                      # Bibliotecas utilitárias
│   │   ├── api.ts                # Cliente HTTP
│   │   └── auth.ts               # Utilitários de autenticação
│   │
│   ├── types/                    # Definições TypeScript
│   │   ├── obras.ts
│   │   ├── eap.ts
│   │   ├── medicao.ts
│   │   ├── gates.ts
│   │   ├── auth.ts
│   │   └── [outros tipos]
│   │
│   ├── utils/                     # Utilitários gerais
│   │   ├── jwt.ts                # Utilitários JWT
│   │   └── bcrypt.ts             # Utilitários bcrypt
│   │
│   └── pages/                    # Páginas legadas (a migrar)
│       └── EapEstruturacaoPage.tsx
│
├── prisma/                        # Prisma ORM
│   ├── schema.prisma             # Schema do banco de dados
│   ├── seed.ts                   # Script de seed
│   └── migrations/               # Migrations do banco
│       ├── 20260102044536_init/
│       ├── 20260115000000_backend_minimo_competencia_gates/
│       └── 20260116000000_add_obra_ativa_id_to_usuario/
│
├── [Documentação MD]             # 50+ arquivos de documentação
├── package.json                   # Dependências Node.js
├── tsconfig.json                  # Configuração TypeScript
├── next.config.js                 # Configuração Next.js
├── vercel.json                    # Configuração Vercel
└── README.md                      # Documentação principal
```

### 2.2. Função de Cada Diretório Relevante

#### `app/` (Next.js App Router)
- **Função**: Páginas do frontend usando App Router do Next.js 14
- **Convenção**: Cada pasta vira uma rota, `page.tsx` é a página
- **Status**: Em uso ativo

#### `src/api/` (Backend Express)
- **Função**: API REST separada do frontend
- **Arquitetura**: MVC (Models via Prisma, Views via JSON, Controllers)
- **Status**: Implementado e funcional

#### `src/components/`
- **Função**: Componentes React reutilizáveis
- **Status**: Em uso, alguns componentes legados em `src/pages/`

#### `src/hooks/`
- **Função**: Hooks customizados React para lógica reutilizável
- **Status**: Recém implementado (refatoração recente)

#### `src/providers/`
- **Função**: Context Providers para estado global
- **Status**: Recém implementado (refatoração recente)

#### `src/services/`
- **Função**: Camada de serviços (frontend e backend)
- **Status**: Implementado, separação clara entre API calls e business logic

#### `prisma/`
- **Função**: ORM e gerenciamento de banco de dados
- **Status**: Configurado e funcional

### 2.3. Arquivos de Configuração Importantes

#### `package.json`
- **Versão do projeto**: 1.0.0
- **Scripts disponíveis**:
  - `dev`: Inicia Next.js em modo desenvolvimento
  - `dev:api`: Inicia servidor Express separado
  - `build`: Build de produção
  - `start`: Inicia produção
  - `lint`: Executa linter

#### `tsconfig.json`
- **Target**: ES2020
- **Module**: esnext
- **JSX**: preserve (Next.js)
- **Paths**: `@/*` aponta para `./src/*` e `./app/*`
- **Strict**: true

#### `next.config.js`
- **React Strict Mode**: Habilitado
- **API URL**: Configurado via env `NEXT_PUBLIC_API_URL`

#### `vercel.json`
- **Build Command**: `prisma generate && next build`
- **Install Command**: `npm install`
- **Status**: Configurado para deploy na Vercel

#### `prisma/schema.prisma`
- **Provider**: PostgreSQL
- **Models identificados**: 11 modelos principais
  - Usuario
  - Obra
  - UsuarioObra
  - BaselineComercial
  - Eap
  - EapFatorConversao
  - Medicao
  - Gate
  - CompetenciaMensal
  - CompetenciaGate
  - Insumo

---

## 3. MÓDULOS EXISTENTES

### 3.1. Módulo de Autenticação
- **Localização**: `src/api/routes/auth.routes.ts`, `app/login/`
- **Status**: (X) Implementado
- **Funcionalidades**:
  - Login com email/senha
  - JWT Access Token + Refresh Token
  - Logout
  - Renovação de token
  - Middleware de autenticação
- **Frontend**: Página de login funcional
- **Backend**: Rotas de autenticação completas

### 3.2. Módulo de Obras
- **Localização**: `app/obras/`, `src/api/routes/obras.routes.ts`, `src/api/controllers/ObrasController.ts`
- **Status**: (X) Implementado
- **Funcionalidades**:
  - CRUD completo de obras
  - Listagem com filtros
  - Detalhes da obra
  - Soft delete
  - Permissões por obra (multi-obra)
- **Frontend**: Páginas de lista e detalhes implementadas
- **Backend**: Controller e rotas completos

### 3.3. Módulo de EAP (Estrutura Analítica do Projeto)
- **Localização**: `app/comercial/estruturacao/`, `src/api/routes/eap.routes.ts`
- **Status**: (X) Implementado
- **Funcionalidades**:
  - EAP Comercial e Operacional (visão dual)
  - Fatores de conversão
  - Hierarquia pai-filho
  - Recálculo automático de valores
  - CRUD completo
- **Frontend**: Tabela de estruturação implementada
- **Backend**: Rotas e lógica de negócio completas

### 3.4. Módulo de Medições
- **Localização**: `src/api/routes/medicoes.routes.ts`, `src/api/controllers/MedicoesController.ts`
- **Status**: (X) Implementado
- **Funcionalidades**:
  - Medição de Produção (MP)
  - Medição do Cliente (MC)
  - Comparativo MP x MC
  - Endpoints com obra ativa automática
  - CRUD completo
  - Aprovação/Rejeição
- **Frontend**: Integrado na página de detalhes da obra
- **Backend**: Controller e rotas completos

### 3.5. Módulo de Gates
- **Localização**: `src/api/routes/gates.routes.ts`
- **Status**: (X) Implementado
- **Funcionalidades**:
  - CRUD de gates
  - Aprovação/Rejeição
  - Relacionamento com obras
- **Frontend**: Integrado na página de detalhes da obra
- **Backend**: Rotas implementadas

### 3.6. Módulo de Competências
- **Localização**: `src/api/routes/competencias.routes.ts`
- **Status**: (X) Implementado
- **Funcionalidades**:
  - Competências mensais
  - Gates de competência
  - Abertura/fechamento de competência
- **Backend**: Rotas implementadas
- **Frontend**: A DEFINIR

### 3.7. Módulo de Dashboard
- **Localização**: `src/api/routes/dashboard.routes.ts`, `app/page.tsx`
- **Status**: (X) Implementado
- **Funcionalidades**:
  - Dashboard de obra
  - Métricas agregadas
  - Gráficos (Recharts)
- **Frontend**: Página inicial com dashboard
- **Backend**: Endpoint de dashboard implementado

### 3.8. Módulo de Suprimentos
- **Localização**: `app/suprimentos/`, `app/api/insumos/`
- **Status**: ( ) Parcial
- **Funcionalidades**:
  - Listagem de insumos (via Next.js API Route)
  - Modal de novo insumo
  - Interface básica
- **Frontend**: Página implementada com dados mockados
- **Backend**: Apenas Next.js API Route, sem integração com Prisma

### 3.9. Módulo de Qualidade
- **Localização**: `app/qualidade/`
- **Status**: ( ) Esqueleto
- **Funcionalidades**:
  - Interface básica
  - Dados fictícios hardcoded
- **Frontend**: Apenas estrutura visual
- **Backend**: Não implementado

### 3.10. Módulo de Contexto (Obra Ativa)
- **Localização**: `src/api/routes/contexto.routes.ts`, `src/hooks/useObraAtiva.ts`
- **Status**: (X) Implementado
- **Funcionalidades**:
  - Gerenciamento de obra ativa do usuário
  - Hook customizado
  - Provider de contexto
- **Frontend**: Hook e provider implementados
- **Backend**: Rotas implementadas

### 3.11. Módulo Comercial
- **Localização**: `src/api/routes/comercial.routes.ts`
- **Status**: ( ) Parcial
- **Funcionalidades**:
  - Rotas de medição produção/cliente (legadas)
  - Comparativo
- **Observação**: Funcionalidades migradas para `medicoes.routes.ts`, mantidas para compatibilidade

---

## 4. FUNCIONALIDADES JÁ IMPLEMENTADAS

### 4.1. O que Efetivamente Funciona Hoje

#### Autenticação e Autorização
- Login/logout funcional
- JWT com refresh token
- Middleware de autenticação
- Proteção de rotas no frontend
- Contexto global de autenticação

#### Gestão de Obras
- CRUD completo de obras
- Listagem com filtros
- Página de detalhes da obra
- Multi-obra com controle de permissões
- Obra ativa por usuário

#### EAP (Estrutura Analítica)
- Criação e edição de EAP comercial
- Criação e edição de EAP operacional
- Fatores de conversão
- Hierarquia pai-filho
- Recálculo automático de valores
- Tabela de alta densidade no frontend

#### Medições
- Lançamento de medições (MP e MC)
- Listagem de medições
- Comparativo MP x MC
- Endpoints com obra ativa automática
- Aprovação/rejeição de medições

#### Dashboard
- Dashboard de obra com métricas
- Gráficos de evolução
- Gráfico de composição (pizza)
- Filtros por período

#### Gates
- CRUD de gates
- Aprovação/rejeição
- Relacionamento com obras

#### Competências
- Abertura de competência mensal
- Criação automática de 9 gates
- Fechamento de competência
- Backend completo

### 4.2. O que Está Apenas Estruturado

#### Suprimentos
- Interface visual implementada
- Modal de criação
- Next.js API Route básica
- Falta integração com Prisma
- Falta backend Express completo

#### Qualidade
- Apenas estrutura visual
- Dados hardcoded
- Sem backend
- Sem integração com banco

### 4.3. O que Ainda Não Existe

#### Módulo Corporativo
- Cadastro de clientes
- Cadastro de contratos
- Abertura de centro de custo
- Upload de planilha analítica
- Padrões técnicos e econômicos
- Governança de gates globais

#### Módulos da Obra (não implementados)
- Engenharia
- Produção
- SSMA (Segurança, Saúde e Meio Ambiente)
- Meio Ambiente
- Financeiro da Obra
- Planejamento e Controle
- Painel Gerencial Integrado

#### Funcionalidades Avançadas
- Aditivos contratuais
- Glosas
- Faturamento
- Apropriações de custos
- Rateios
- Fechamento mensal completo

---

## 5. PONTOS TÉCNICOS CRÍTICOS

### 5.1. Problemas Identificados

#### Estrutura Mista de Páginas
- **Problema**: Existe `src/pages/EapEstruturacaoPage.tsx` (estrutura antiga) e `app/comercial/estruturacao/page.tsx` (nova)
- **Impacto**: Confusão sobre qual usar, possível duplicação
- **Solução**: Migrar completamente para App Router, remover `src/pages/`

#### Inconsistência em Suprimentos
- **Problema**: Módulo de suprimentos usa Next.js API Route em vez de backend Express
- **Impacto**: Inconsistência arquitetural, dificulta manutenção
- **Solução**: Criar rotas no backend Express e integrar com Prisma

#### Falta de Controllers para Todos os Módulos
- **Problema**: Apenas `MedicoesController` e `ObrasController` existem
- **Impacto**: Lógica de negócio misturada nas rotas
- **Solução**: Criar controllers para EAP, Gates, Dashboard, etc.

#### Documentação Excessiva na Raiz
- **Problema**: 50+ arquivos .md na raiz do projeto
- **Impacto**: Dificulta navegação, poluição visual
- **Solução**: Organizar em pasta `docs/` com subpastas

#### Arquivo `src/pages/` Legado
- **Problema**: Pasta `src/pages/` ainda existe com código legado
- **Impacto**: Confusão entre App Router e Pages Router
- **Solução**: Migrar conteúdo e remover pasta

### 5.2. Dívidas Técnicas

#### Testes
- **Status**: Nenhum teste implementado
- **Impacto**: Dificulta refatoração e garante qualidade
- **Prioridade**: Média

#### Validação de Dados
- **Status**: Validações básicas, sem biblioteca de validação
- **Impacto**: Possíveis erros de dados inválidos
- **Prioridade**: Média

#### Tratamento de Erros
- **Status**: Básico, sem padronização completa
- **Impacto**: Experiência do usuário pode ser melhorada
- **Prioridade**: Baixa

#### Logging
- **Status**: Apenas console.log
- **Impacto**: Dificulta debugging em produção
- **Prioridade**: Baixa

#### Documentação de API
- **Status**: Sem Swagger/OpenAPI
- **Impacto**: Dificulta integração e documentação
- **Prioridade**: Baixa

### 5.3. Inconsistências Estruturais

#### Duplicação de Funcionalidades
- **Problema**: `comercial.routes.ts` tem rotas duplicadas de `medicoes.routes.ts`
- **Status**: Mantido para compatibilidade
- **Ação**: Documentar como legado, planejar remoção

#### Mistura de Padrões
- **Problema**: Alguns módulos usam controllers, outros não
- **Status**: Em transição
- **Ação**: Completar migração para padrão MVC

#### Path Aliases
- **Problema**: Alguns imports usam `@/`, outros caminhos relativos
- **Status**: Parcialmente padronizado
- **Ação**: Padronizar todos os imports para `@/`

---

## 6. AUTOMAÇÕES E AÇÕES POSSÍVEIS

### 6.1. Melhorias Estruturais Recomendadas

#### Organização de Documentação
- **Ação**: Criar estrutura `docs/` com subpastas:
  - `docs/conceitual/` - Documentos conceituais
  - `docs/tecnico/` - Documentação técnica
  - `docs/relatorios/` - Relatórios de execução
  - `docs/governanca/` - Documentos de governança

#### Migração Completa para App Router
- **Ação**: Remover `src/pages/` e garantir tudo em `app/`
- **Benefício**: Consistência arquitetural

#### Padronização de Controllers
- **Ação**: Criar controllers para todos os módulos
- **Benefício**: Separação de responsabilidades, código mais limpo

#### Integração Completa de Suprimentos
- **Ação**: Criar rotas no backend Express, integrar com Prisma
- **Benefício**: Consistência arquitetural

### 6.2. Arquivos e Estruturas a Criar

#### Estrutura de Documentação
```
docs/
├── conceitual/
├── tecnico/
├── relatorios/
└── governanca/
```

#### Controllers Faltantes
- `src/api/controllers/EapController.ts`
- `src/api/controllers/GatesController.ts`
- `src/api/controllers/DashboardController.ts`
- `src/api/controllers/AuthController.ts`
- `src/api/controllers/CompetenciasController.ts`

#### Backend de Suprimentos
- `src/api/routes/suprimentos.routes.ts`
- `src/api/controllers/SuprimentosController.ts`
- `src/services/SuprimentosService.ts`

### 6.3. Ações Automáticas Executáveis

As seguintes ações podem ser executadas automaticamente:
1. Criar estrutura de pastas `docs/`
2. Criar controllers faltantes (esqueletos)
3. Criar rotas de suprimentos no backend
4. Padronizar imports para usar `@/`
5. Remover código legado de `src/pages/` após migração

---

## 7. RESUMO EXECUTIVO

### 7.1. Estado Geral do Projeto
- **Status**: Em desenvolvimento ativo
- **Maturidade**: Intermediária (core funcional, módulos adicionais pendentes)
- **Arquitetura**: Bem definida e seguindo padrões modernos
- **Qualidade do Código**: Boa, com algumas inconsistências menores

### 7.2. Pontos Fortes
- Arquitetura clara (MVC no backend, App Router no frontend)
- Separação adequada de responsabilidades
- TypeScript em 100% do código
- Autenticação robusta implementada
- Módulos core funcionais (Obras, EAP, Medições)

### 7.3. Pontos de Atenção
- Documentação excessiva na raiz
- Algumas inconsistências arquiteturais (suprimentos)
- Falta de testes
- Módulos adicionais ainda não implementados

### 7.4. Próximos Passos Recomendados
1. Organizar documentação em estrutura `docs/`
2. Completar migração para padrão MVC (controllers)
3. Integrar suprimentos com backend Express
4. Implementar módulos faltantes conforme roadmap
5. Adicionar testes (prioridade média)

---

**Fim do Relatório**

