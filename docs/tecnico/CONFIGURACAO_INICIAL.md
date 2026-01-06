# 🔧 Configuração Inicial do ERP G-NESIS

## ✅ Checklist de Configuração

### 1. ✅ Dependências Instaladas
- [x] `npm install` executado com sucesso
- [x] `node_modules` presente

### 2. ⚠️ Ações Necessárias

#### 2.1. Criar arquivo `.env`
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/erp_genesis?schema=public"

# JWT - Gere chaves seguras para produção
JWT_SECRET="seu-secret-jwt-super-seguro-aqui-altere-em-producao"
JWT_REFRESH_SECRET="seu-refresh-secret-jwt-super-seguro-aqui-altere-em-producao"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# API
PORT=3000
NODE_ENV=development

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

**⚠️ IMPORTANTE:** 
- Substitua `usuario` e `senha` pelas credenciais do seu PostgreSQL
- Gere chaves JWT seguras para produção usando: `openssl rand -base64 32`

#### 2.2. Gerar Prisma Client
Execute o comando:
```bash
npx prisma generate
```

#### 2.3. Configurar Banco de Dados
1. Certifique-se de que o PostgreSQL está rodando
2. Crie o banco de dados:
   ```sql
   CREATE DATABASE erp_genesis;
   ```
3. Execute as migrations:
   ```bash
   npx prisma migrate dev
   ```

#### 2.4. Criar Usuário Inicial
Após configurar o banco, você precisará criar um usuário inicial. Você pode usar o Prisma Studio:
```bash
npx prisma studio
```

Ou criar um script de seed (veja o README.md para exemplo).

---

## 🚀 Próximos Passos

Após completar a configuração:

1. **Iniciar o servidor da API:**
   ```bash
   npm run dev:api
   ```

2. **Iniciar o servidor Next.js (em outro terminal):**
   ```bash
   npm run dev
   ```

3. **Acessar a aplicação:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api
   - Health Check: http://localhost:3000/health

---

## ✅ Correções Aplicadas

- ✅ Rotas de autenticação (`/api/auth`) adicionadas ao `app.ts`
- ✅ Rotas de dashboard (`/api/dashboard`) adicionadas ao `app.ts`
- ✅ Rotas de gates (`/api/gates`) adicionadas ao `app.ts`
- ✅ Arquivo `tsconfig.json` criado
- ✅ Arquivo `next.config.js` criado
- ✅ Script `dev:api` adicionado ao `package.json`

---

## 📝 Notas

- O arquivo `.env` não deve ser versionado (já está no `.gitignore`)
- Use o arquivo `.env.example` como referência
- Em produção, use variáveis de ambiente seguras


