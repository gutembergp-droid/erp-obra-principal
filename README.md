# ERP G-NESIS
## Sistema de Gestão de Obras

Sistema ERP completo para gestão de obras, com ênfase em controle de EAP (Estrutura Analítica do Projeto) com visão dual comercial/operacional, medições, gates de aprovação e relatórios visuais.

---

## 📋 Índice

- [Características](#características)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API](#api)
- [Autenticação](#autenticação)
- [Banco de Dados](#banco-de-dados)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Documentação](#documentação)

---

## ✨ Características

- ✅ **Gestão de Obras**: Controle completo do ciclo de vida de obras
- ✅ **EAP Dual**: Estrutura Analítica do Projeto com visão comercial e operacional
- ✅ **Fatores de Conversão**: Relacionamento matemático entre EAP Comercial e Operacional
- ✅ **Medições**: Lançamento de medições com cálculo automático de valores
- ✅ **Gates de Aprovação**: Controle de marcos e portões de aprovação do projeto
- ✅ **Relatórios e Dashboards**: Visualizações gráficas com Recharts
- ✅ **Multi-Obra e Multi-Usuário**: Suporte a múltiplas obras e controle de permissões
- ✅ **Autenticação JWT**: Sistema seguro de autenticação
- ✅ **Interface Dark Mode**: Tema escuro profissional

---

## 🛠 Tecnologias

### Frontend
- **Next.js 14**: Framework React com App Router
- **React 18**: Biblioteca para construção de interfaces
- **TypeScript**: Tipagem estática
- **Recharts**: Biblioteca para gráficos
- **Axios**: Cliente HTTP

### Backend
- **Express.js**: Framework Node.js para API
- **Prisma ORM**: ORM para banco de dados
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação via tokens
- **Bcrypt**: Hash de senhas

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **PostgreSQL** (versão 12 ou superior)
- **Git**

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/gutembergp-droid/erp-obra-principal.git
cd erp-obra-principal
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/erp_genesis?schema=public"

# JWT
JWT_SECRET="seu-secret-jwt-super-seguro-aqui"
JWT_REFRESH_SECRET="seu-refresh-secret-jwt-super-seguro-aqui"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# API
PORT=3000
NODE_ENV=development

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 4. Execute as migrations do Prisma

```bash
# Gerar o Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate dev

# (Opcional) Visualizar dados no Prisma Studio
npx prisma studio
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

#### Banco de Dados
- `DATABASE_URL`: URL de conexão com o PostgreSQL

#### JWT
- `JWT_SECRET`: Chave secreta para assinatura de tokens JWT
- `JWT_REFRESH_SECRET`: Chave secreta para refresh tokens
- `JWT_EXPIRES_IN`: Tempo de expiração do access token (padrão: 1h)
- `JWT_REFRESH_EXPIRES_IN`: Tempo de expiração do refresh token (padrão: 7d)

#### API
- `PORT`: Porta do servidor Express (padrão: 3000)
- `NODE_ENV`: Ambiente de execução (development, production)

#### Next.js
- `NEXT_PUBLIC_API_URL`: URL base da API (padrão: http://localhost:3000/api)

### Banco de Dados

O projeto utiliza PostgreSQL. Certifique-se de:

1. Ter o PostgreSQL instalado e rodando
2. Criar um banco de dados chamado `erp_genesis` (ou ajustar a `DATABASE_URL`)
3. Executar as migrations do Prisma

---

## 🏃 Executando o Projeto

### Modo Desenvolvimento

#### 1. Iniciar o servidor da API (Express)

Em um terminal:

```bash
npm run dev:api
# ou
cd src/api && node server.js
```

O servidor estará disponível em `http://localhost:3000`

#### 2. Iniciar o servidor Next.js

Em outro terminal:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000` (ou porta configurada)

### Modo Produção

#### 1. Build do projeto

```bash
npm run build
```

#### 2. Iniciar em produção

```bash
npm start
```

---

## 📁 Estrutura do Projeto

```
ERP G-NESIS/
├── app/                          # Páginas Next.js (App Router)
│   ├── login/                    # Página de login
│   ├── obras/                    # Páginas de obras
│   │   ├── page.tsx              # Lista de obras
│   │   └── [id]/                 # Detalhes da obra
│   │       ├── page.tsx          # Página de detalhes
│   │       └── components/       # Componentes específicos
│   └── not-found.tsx             # Página 404
│
├── prisma/                       # Schema do Prisma
│   └── schema.prisma             # Schema do banco de dados
│
├── src/
│   ├── api/                      # Backend (Express)
│   │   ├── routes/               # Rotas da API
│   │   ├── middleware/           # Middlewares (auth, validação)
│   │   ├── app.ts                # Configuração do Express
│   │   └── server.ts             # Servidor Express
│   │
│   ├── components/               # Componentes React
│   │   ├── EapEstruturacao/      # Componentes de EAP
│   │   └── ProtectedRoute.tsx    # Proteção de rotas
│   │
│   ├── lib/                      # Bibliotecas e utilitários
│   │   ├── api.ts                # Cliente HTTP (Axios)
│   │   └── auth.ts               # Utilitários de autenticação
│   │
│   ├── services/                 # Camada de serviços
│   │   ├── api/                  # Serviços de API (frontend)
│   │   ├── EapService.ts         # Serviço de EAP
│   │   ├── ObraService.ts        # Serviço de Obras
│   │   ├── MedicaoService.ts     # Serviço de Medições
│   │   └── GateService.ts        # Serviço de Gates
│   │
│   ├── types/                    # Interfaces TypeScript
│   │   ├── obras.ts
│   │   ├── eap.ts
│   │   ├── medicao.ts
│   │   └── ...
│   │
│   └── utils/                    # Utilitários
│       ├── jwt.ts                # Utilitários JWT
│       └── bcrypt.ts             # Utilitários de hash
│
├── .env                          # Variáveis de ambiente (não versionado)
├── .env.example                   # Exemplo de variáveis de ambiente
├── package.json                   # Dependências do projeto
├── tsconfig.json                 # Configuração TypeScript
└── README.md                     # Este arquivo
```

---

## 🔌 API

### Endpoints Principais

#### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Obter usuário atual

#### Obras
- `GET /api/obras` - Listar obras
- `GET /api/obras/:id` - Obter obra por ID
- `POST /api/obras` - Criar obra
- `PUT /api/obras/:id` - Atualizar obra
- `DELETE /api/obras/:id` - Excluir obra (soft delete)

#### EAP
- `GET /api/eap/obra/:obra_id` - Listar EAPs por obra
- `POST /api/eap` - Criar EAP
- `PUT /api/eap/:id` - Atualizar EAP
- `DELETE /api/eap/:id` - Excluir EAP

#### Medições
- `GET /api/medicoes/obra/:obra_id` - Listar medições por obra
- `POST /api/medicoes` - Criar medição
- `PUT /api/medicoes/:id` - Atualizar medição

#### Dashboard
- `GET /api/dashboard/obra/:obra_id` - Dados do dashboard
  - Query params: `periodo` (30, 90, todos)

### Autenticação

Todas as rotas (exceto `/api/auth/login`) requerem autenticação via JWT:

```
Authorization: Bearer <token>
```

O token é enviado automaticamente pelo interceptor do Axios no frontend.

---

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação:

1. **Login**: O usuário faz login e recebe um `access_token` e um `refresh_token`
2. **Requisições**: O `access_token` é enviado no header `Authorization: Bearer <token>`
3. **Renovação**: Quando o token expira, o sistema tenta renová-lo automaticamente usando o `refresh_token`
4. **Logout**: Os tokens são removidos do localStorage

### Criando um Usuário Inicial

Para criar um usuário inicial, você pode usar o Prisma Studio ou criar um script:

```typescript
// scripts/create-user.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hashPassword('senha123');
  
  const user = await prisma.usuario.create({
    data: {
      email: 'admin@example.com',
      nome: 'Administrador',
      senha_hash: hashedPassword,
      perfil: 'admin',
      is_ativo: true,
    },
  });
  
  console.log('Usuário criado:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## 🗄️ Banco de Dados

### Schema Principal

- **Usuario**: Usuários do sistema
- **Obra**: Obras/projetos
- **BaselineComercial**: Versões de baseline comercial
- **Eap**: Estrutura Analítica do Projeto
- **EapFatorConversao**: Fatores de conversão entre EAPs
- **Gate**: Portões de aprovação
- **Medicao**: Medições realizadas
- **UsuarioObra**: Permissões de usuários em obras

### Migrations

```bash
# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco (CUIDADO: apaga todos os dados)
npx prisma migrate reset
```

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor Next.js
npm run dev:api          # Inicia servidor Express

# Build
npm run build            # Build de produção
npm start                # Inicia em produção

# Prisma
npx prisma generate      # Gera Prisma Client
npx prisma migrate dev   # Executa migrations
npx prisma studio       # Abre Prisma Studio

# Lint
npm run lint            # Executa linter
```

---

## 📚 Documentação

- **Memorial Técnico**: `MEMORIAL_TECNICO.md` - Documentação técnica completa
- **Processo de Governança**: `PROCESSO_GOVERNANCA.md` - Processo de desenvolvimento
- **Relatórios de Execução**: `RELATORIO_EXECUCAO_*.md` - Relatórios de cada fase

### Documentação por Módulo

- **API**: `src/api/README.md`
- **Services**: `src/services/README.md`
- **Types**: `src/types/README.md`
- **Components**: `src/components/EapEstruturacao/README.md`

---

## 🐛 Troubleshooting

### Erro de conexão com banco de dados

Verifique se:
- O PostgreSQL está rodando
- A `DATABASE_URL` está correta no `.env`
- O banco de dados foi criado

### Erro de autenticação

Verifique se:
- O `JWT_SECRET` está configurado no `.env`
- O token não expirou (tente fazer login novamente)

### Erro ao executar migrations

Certifique-se de:
- Ter executado `npx prisma generate` antes
- Ter criado o banco de dados
- Ter configurado a `DATABASE_URL` corretamente

---

## 🤝 Contribuindo

Este é um projeto privado. Para contribuições, entre em contato com a equipe de desenvolvimento.

---

## 📄 Licença

Este projeto é proprietário e confidencial.

---

## 👥 Equipe

- **Desenvolvimento**: Equipe ERP G-NESIS
- **Repositório**: https://github.com/gutembergp-droid/erp-obra-principal.git

---

## 📞 Suporte

Para suporte, entre em contato com a equipe de desenvolvimento.

---

**Última Atualização**: Janeiro 2026  
**Versão**: 1.0.0



