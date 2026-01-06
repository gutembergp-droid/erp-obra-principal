================================================================================
MEMORIAL / RELATÓRIO / DOCUMENTO – ERP GENESIS
================================================================================
Produto................: ERP GENESIS
Versão.................: v1.0
Status.................: OFICIAL
Data...................: 2026-01-05
Hora...................: 17:15 (UTC-3)
IA Autora..............: Auto (Cursor AI)
Solicitante............: Proprietário do Produto / GC
Arquitetura............: ChatGPT + Cursor + v0 + Vercel
Origem do Documento....: Nova Criação
Documento Substitui....: —
Documento Substituído Por: —
Objetivo...............: Gestão de Alta Performance por Micro-Unidades de Resultado
================================================================================

# GUIA DE DEPLOY PARA PRODUÇÃO
## ERP GENESIS - Preparação Go-Live

## VARIÁVEIS DE AMBIENTE OBRIGATÓRIAS

### Desenvolvimento
Copie `.env.example` para `.env` e preencha com valores de desenvolvimento.

### Produção
Configure as seguintes variáveis no ambiente de produção (Vercel, Railway, etc.):

#### Críticas (obrigatórias)
- `DATABASE_URL` - URL de conexão PostgreSQL
- `JWT_ACCESS_SECRET` - Secret para Access Tokens (gerar com `openssl rand -base64 32`)
- `JWT_REFRESH_SECRET` - Secret para Refresh Tokens (gerar com `openssl rand -base64 32`)
- `NEXT_PUBLIC_API_URL` - URL base da API em produção
- `CORS_ORIGIN` - Domínio do frontend (ex: `https://app.genesis.com`)

#### Opcionais (com defaults)
- `PORT` - Porta do servidor Express (default: 3000)
- `JWT_ACCESS_EXPIRES_IN` - Expiração Access Token (default: 15m)
- `JWT_REFRESH_EXPIRES_IN` - Expiração Refresh Token (default: 7d)
- `NODE_ENV` - Ambiente (default: development)

## SCRIPTS DE BUILD

### Desenvolvimento
```bash
npm install
npm run dev          # Frontend Next.js
npm run dev:api      # Backend Express
```

### Produção
```bash
npm install
npm run build        # Build Next.js + Prisma generate
npm run build:api    # Prisma generate + migrate deploy
npm start            # Inicia Next.js
npm run start:api    # Inicia Express
```

## MIGRATIONS DO PRISMA

### Desenvolvimento
```bash
npm run migrate:dev  # Cria e aplica migration
```

### Produção
```bash
npm run migrate:deploy  # Aplica migrations existentes (não cria novas)
```

## SEED DO BANCO DE DADOS

### Executar Seed
```bash
npm run seed
```

### Credenciais Padrão (APENAS DEV)
- **Admin**: `admin@genesis.com` / `123456`
- **Engenheiro**: `eng@genesis.com` / `123456`

⚠️ **IMPORTANTE**: Em produção, altere as senhas padrão imediatamente após o seed!

## HEALTHCHECK

### Endpoint
```
GET /health
```

### Resposta (Formato Canônico)
```json
{
  "data": {
    "status": "ok",
    "timestamp": "2026-01-05T17:15:00.000Z",
    "environment": "production",
    "version": "1.0.0"
  },
  "meta": null,
  "error": null
}
```

## CORS

### Configuração
- **Desenvolvimento**: Permite `localhost:3000` e `localhost:3001`
- **Produção**: Apenas domínio configurado em `CORS_ORIGIN`

### Headers Permitidos
- `Content-Type`
- `Authorization`

## DEPLOY NA VERCEL

### Configuração
1. Conecte o repositório à Vercel
2. Configure variáveis de ambiente no painel da Vercel
3. O `vercel.json` já está configurado com:
   - Build command: `prisma generate && prisma migrate deploy && next build`
   - Install command: `npm install`

### Variáveis no Vercel
Configure via painel ou CLI:
```bash
vercel env add DATABASE_URL
vercel env add JWT_ACCESS_SECRET
vercel env add JWT_REFRESH_SECRET
vercel env add NEXT_PUBLIC_API_URL
vercel env add CORS_ORIGIN
```

## BACKEND EXPRESS SEPARADO

Se o backend Express rodar em servidor separado:

1. Configure variáveis de ambiente no servidor
2. Execute migrations: `npm run migrate:deploy`
3. Execute seed (se necessário): `npm run seed`
4. Inicie servidor: `npm run start:api`

## CHECKLIST PRÉ-DEPLOY

- [ ] Todas as variáveis de ambiente configuradas
- [ ] `DATABASE_URL` aponta para banco de produção
- [ ] `JWT_ACCESS_SECRET` e `JWT_REFRESH_SECRET` são diferentes e fortes
- [ ] `CORS_ORIGIN` permite apenas domínio do frontend
- [ ] Migrations aplicadas (`npm run migrate:deploy`)
- [ ] Seed executado (se necessário)
- [ ] Senhas padrão alteradas (se seed foi usado)
- [ ] Healthcheck respondendo (`GET /health`)
- [ ] Build sem erros (`npm run build`)
- [ ] Lint sem erros críticos (`npm run lint`)

## TROUBLESHOOTING

### Erro: "JWT_ACCESS_SECRET é obrigatório"
- Configure `JWT_ACCESS_SECRET` no ambiente

### Erro: "DATABASE_URL é obrigatória"
- Configure `DATABASE_URL` no ambiente

### Erro de CORS
- Verifique `CORS_ORIGIN` está configurado corretamente
- Em dev, localhost é permitido automaticamente

### Migrations não aplicam
- Execute `npm run migrate:deploy` manualmente
- Verifique conexão com banco de dados

---

**Documento gerado automaticamente durante preparação para produção.**



