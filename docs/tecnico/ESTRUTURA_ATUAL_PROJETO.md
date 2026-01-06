# 📊 ESTRUTURA ATUAL DO PROJETO ERP G-NESIS

**Data:** Janeiro 2026  
**Status:** ✅ Em Produção (Vercel)

---

## 🔧 STACK TECNOLÓGICA ATUAL

### **Backend**
- ✅ **Express.js** - API REST customizada
- ✅ **Prisma ORM** - Gerenciamento de banco de dados
- ✅ **PostgreSQL** - Banco de dados (via `DATABASE_URL` no `.env`)
- ✅ **JWT** - Autenticação própria (jsonwebtoken)
- ✅ **Bcrypt** - Hash de senhas
- ✅ **TypeScript** - Tipagem estática

### **Frontend**
- ✅ **Next.js 14** - Framework React (App Router)
- ✅ **React 18** - Biblioteca UI
- ✅ **TypeScript** - Tipagem estática
- ✅ **Tailwind CSS** - Estilização
- ✅ **Lucide React** - Ícones
- ✅ **Recharts** - Gráficos
- ✅ **Axios** - Cliente HTTP

### **Deploy e Infraestrutura**
- ✅ **Vercel** - Hosting e deploy
- ✅ **Next.js API Routes** - Proxy para Express.js (`app/api/[...all]/route.ts`)
- ⚠️ **PostgreSQL** - Banco de dados (não especificado se é Neon, Supabase ou outro)

---

## ❌ SERVIÇOS EXTERNOS NÃO UTILIZADOS (ATUALMENTE)

### **Não Implementado:**
- ❌ **Supabase** - Não está sendo usado
  - Autenticação: Usamos JWT próprio
  - Banco de dados: Usamos PostgreSQL direto via Prisma
  
- ❌ **Neon** - Não está configurado explicitamente
  - Banco de dados: PostgreSQL genérico (pode ser Neon, mas não está explícito)
  
- ❌ **Vercel Blob** - Não está sendo usado
  - Armazenamento de arquivos: Não implementado
  
- ❌ **Stripe** - Não está sendo usado
  - Pagamentos: Não implementado

---

## 📁 ESTRUTURA DE ARQUIVOS

```
ERP G-NESIS/
├── app/                          # Next.js App Router
│   ├── api/                      # Next.js API Routes
│   │   └── [...all]/route.ts     # Catch-all proxy para Express
│   ├── login/                    # Página de login
│   ├── obras/                    # Módulo de obras
│   └── layout.tsx                # Layout principal
│
├── src/
│   ├── api/                      # Backend Express.js
│   │   ├── app.ts                # Configuração Express
│   │   ├── server.ts             # Servidor Express
│   │   ├── routes/               # Rotas da API
│   │   └── middleware/           # Middlewares (auth, error)
│   │
│   ├── components/               # Componentes React
│   │   ├── MainLayout.tsx        # Layout com sidebar
│   │   └── ProtectedRoute.tsx    # Proteção de rotas
│   │
│   ├── services/                 # Serviços frontend
│   │   ├── api/                  # Clientes API
│   │   └── *.ts                  # Serviços específicos
│   │
│   ├── types/                    # TypeScript types
│   ├── lib/                      # Utilitários
│   │   ├── api.ts                # Cliente HTTP
│   │   └── auth.ts               # Helpers de autenticação
│   │
│   └── utils/                    # Utilitários gerais
│       ├── jwt.ts                # JWT helpers
│       └── bcrypt.ts              # Bcrypt helpers
│
├── prisma/
│   ├── schema.prisma             # Schema do banco
│   ├── migrations/                # Migrations
│   └── seed.ts                   # Seed do banco
│
├── package.json                   # Dependências
├── vercel.json                    # Config Vercel
└── tsconfig.json                  # Config TypeScript
```

---

## 🔐 AUTENTICAÇÃO ATUAL

**Sistema próprio com JWT:**
- ✅ Login/Logout customizado
- ✅ Access Token + Refresh Token
- ✅ Armazenamento em `localStorage`
- ✅ Middleware de autenticação no Express
- ✅ Proteção de rotas no frontend

**Não usa:**
- ❌ Supabase Auth
- ❌ NextAuth.js
- ❌ Auth0

---

## 💾 BANCO DE DADOS

**PostgreSQL via Prisma:**
- ✅ Schema completo em `prisma/schema.prisma`
- ✅ Migrations gerenciadas pelo Prisma
- ✅ Soft delete implementado
- ✅ Timestamps automáticos
- ✅ Relações bem definidas

**Modelos principais:**
- Usuario
- Obra
- BaselineComercial
- Eap / EapFatorConversao
- Gate
- Medicao
- CompetenciaMensal / CompetenciaGate
- Insumo

**Variável de ambiente:**
- `DATABASE_URL` - String de conexão PostgreSQL

---

## 📤 ARMAZENAMENTO DE ARQUIVOS

**Status:** ❌ Não implementado

**O que falta:**
- Upload de documentos
- Upload de planilhas analíticas
- Armazenamento de arquivos de obra

**Opções futuras:**
- Vercel Blob Storage
- AWS S3
- Supabase Storage

---

## 💳 PAGAMENTOS

**Status:** ❌ Não implementado

**Não há necessidade atual** (sistema interno de gestão)

---

## 🚀 DEPLOY

**Vercel:**
- ✅ Build automático via Git
- ✅ Serverless functions
- ✅ Next.js API Routes como proxy
- ✅ Variáveis de ambiente configuradas

**Configuração:**
```json
// vercel.json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install"
}
```

---

## 📋 COMPARAÇÃO: ATUAL vs. PROPOSTA (Fase 2)

| Serviço | Status Atual | Proposta Fase 2 |
|---------|--------------|-----------------|
| **Banco de Dados** | PostgreSQL (Prisma) | Neon ou Supabase |
| **Autenticação** | JWT próprio | Supabase Auth |
| **Armazenamento** | ❌ Não implementado | Vercel Blob |
| **Pagamentos** | ❌ Não implementado | Stripe (se necessário) |

---

## ✅ CONCLUSÃO

**Stack atual é auto-suficiente:**
- ✅ Backend próprio (Express.js)
- ✅ Autenticação própria (JWT)
- ✅ Banco de dados PostgreSQL (genérico)
- ✅ Deploy no Vercel

**Não há dependência de serviços externos** como Supabase, Neon, Vercel Blob ou Stripe.

**Para Fase 2**, seria possível migrar para:
- Neon ou Supabase (banco de dados)
- Supabase Auth (autenticação)
- Vercel Blob (armazenamento)
- Stripe (pagamentos, se necessário)

Mas **não é obrigatório** - a stack atual funciona perfeitamente.

---

**Documento criado em:** Janeiro 2026  
**Versão:** 1.0


