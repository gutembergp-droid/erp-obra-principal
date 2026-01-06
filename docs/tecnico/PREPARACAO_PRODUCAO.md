================================================================================
MEMORIAL / RELATÓRIO / DOCUMENTO – ERP GENESIS
================================================================================
Produto................: ERP GENESIS
Versão.................: v1.0
Status.................: OFICIAL
Data...................: 2026-01-05
Hora...................: 17:20 (UTC-3)
IA Autora..............: Auto (Cursor AI)
Solicitante............: Proprietário do Produto / GC
Arquitetura............: ChatGPT + Cursor + v0 + Vercel
Origem do Documento....: Nova Criação
Documento Substitui....: —
Documento Substituído Por: —
Objetivo...............: Gestão de Alta Performance por Micro-Unidades de Resultado
================================================================================

# PREPARAÇÃO PARA PRODUÇÃO - GO-LIVE BUILD
## Checklist Completo e Configurações

## RESUMO EXECUTIVO

Preparação completa do projeto ERP GENESIS para deploy em produção, incluindo configuração de variáveis de ambiente, segurança, migrations, seed e healthcheck.

## ARQUIVOS CRIADOS/MODIFICADOS

### Criados
1. **`.env.example`** - Template de variáveis de ambiente
2. **`docs/tecnico/DEPLOY_PRODUCAO.md`** - Guia completo de deploy
3. **`docs/tecnico/PREPARACAO_PRODUCAO.md`** - Este documento

### Modificados
1. **`src/api/app.ts`** - CORS configurado, healthcheck em formato canônico
2. **`src/utils/jwt.ts`** - Validação de variáveis críticas em produção
3. **`src/api/server.ts`** - Validação de variáveis críticas
4. **`prisma/seed.ts`** - Adicionado definição de obra ativa para admin
5. **`package.json`** - Scripts adicionados (seed, migrate:deploy, build:api)
6. **`vercel.json`** - Build command atualizado com migrate deploy

## VARIÁVEIS DE AMBIENTE

### Template (.env.example)
Criado arquivo `.env.example` com todas as variáveis necessárias:

#### Críticas (obrigatórias em produção)
- `DATABASE_URL` - URL de conexão PostgreSQL
- `JWT_ACCESS_SECRET` - Secret para Access Tokens
- `JWT_REFRESH_SECRET` - Secret para Refresh Tokens
- `NEXT_PUBLIC_API_URL` - URL base da API
- `CORS_ORIGIN` - Domínio permitido para CORS

#### Opcionais (com defaults)
- `PORT` - Porta do servidor (default: 3000)
- `JWT_ACCESS_EXPIRES_IN` - Expiração Access Token (default: 15m)
- `JWT_REFRESH_EXPIRES_IN` - Expiração Refresh Token (default: 7d)
- `NODE_ENV` - Ambiente (default: development)

### Validações Implementadas
- **JWT**: Valida que secrets existem e são diferentes em produção
- **Database**: Valida que DATABASE_URL existe em produção
- **Erros claros**: Mensagens específicas para cada variável faltante

## CORS E SEGURANÇA

### Configuração
- **Desenvolvimento**: Permite `localhost:3000` e `localhost:3001`
- **Produção**: Apenas domínio configurado em `CORS_ORIGIN`
- **Headers permitidos**: `Content-Type`, `Authorization`
- **Métodos permitidos**: GET, POST, PUT, DELETE, PATCH, OPTIONS

### Implementação
```typescript
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : process.env.NODE_ENV === 'production' 
      ? false // Bloqueia tudo em produção se não configurado
      : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

## PRISMA: MIGRATIONS E DEPLOY

### Scripts Adicionados
- `npm run migrate:deploy` - Aplica migrations em produção
- `npm run migrate:dev` - Cria e aplica migrations em dev
- `npm run build:api` - Build com migrations
- `npm run seed` - Executa seed do banco

### Build Command (Vercel)
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

### Postinstall
```json
{
  "postinstall": "prisma generate"
}
```

## SEED OPERACIONAL

### Conteúdo do Seed
- **Usuário Admin**: `admin@genesis.com` / `123456`
- **Usuário Engenheiro**: `eng@genesis.com` / `123456`
- **Obra Demo**: "Duplicação Rodovia BR-101 - Lote 2"
- **Baseline Comercial**: Homologada e ativa
- **EAP**: 8 itens hierárquicos
- **Medições**: 2 medições aprovadas
- **Obra Ativa**: Definida para admin

### Avisos de Segurança
- Seed exibe aviso: "⚠️ ATENÇÃO: Em produção, altere as senhas padrão imediatamente!"
- Senhas padrão documentadas apenas para desenvolvimento

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
    "timestamp": "2026-01-05T17:20:00.000Z",
    "environment": "production",
    "version": "1.0.0"
  },
  "meta": null,
  "error": null
}
```

## CHECKLIST PRÉ-DEPLOY

### Variáveis de Ambiente
- [x] `.env.example` criado
- [x] Validação de variáveis críticas implementada
- [x] Fallbacks seguros para desenvolvimento

### Segurança
- [x] CORS configurado para produção
- [x] Headers permitidos definidos
- [x] Validação de JWT secrets em produção

### Prisma
- [x] Scripts de migration adicionados
- [x] Build command atualizado
- [x] Postinstall configurado

### Seed
- [x] Seed atualizado com obra ativa
- [x] Avisos de segurança adicionados
- [x] Credenciais documentadas

### Healthcheck
- [x] Endpoint criado
- [x] Formato canônico implementado
- [x] Informações de ambiente incluídas

## RESULTADO DOS TESTES

### TypeScript
- ✅ Compilação OK (sem erros)

### Lint
- ⚠️ Requer configuração inicial do ESLint (não crítico)

### Build
- ✅ Scripts configurados corretamente

## PRÓXIMOS PASSOS PARA DEPLOY

1. **Configurar variáveis no ambiente de produção**
   - DATABASE_URL
   - JWT_ACCESS_SECRET (gerar com `openssl rand -base64 32`)
   - JWT_REFRESH_SECRET (gerar com `openssl rand -base64 32`)
   - NEXT_PUBLIC_API_URL
   - CORS_ORIGIN

2. **Executar migrations**
   ```bash
   npm run migrate:deploy
   ```

3. **Executar seed (se necessário)**
   ```bash
   npm run seed
   ```
   ⚠️ Alterar senhas padrão imediatamente após seed!

4. **Verificar healthcheck**
   ```bash
   curl http://seu-dominio.com/health
   ```

5. **Testar autenticação**
   - Login com credenciais do seed
   - Verificar tokens JWT

## NOTAS IMPORTANTES

1. **Senhas Padrão**: Apenas para desenvolvimento. Em produção, alterar imediatamente.
2. **JWT Secrets**: Devem ser diferentes e fortes. Gerar com `openssl rand -base64 32`.
3. **CORS**: Em produção, permitir apenas domínio do frontend.
4. **Database**: Usar banco de produção separado do desenvolvimento.
5. **Migrations**: Sempre executar `migrate:deploy` em produção (não `migrate:dev`).

---

**Documento gerado automaticamente durante preparação para produção.**



