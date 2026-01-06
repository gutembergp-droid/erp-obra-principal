# Status do Seed DEMO - ERP GENESIS

## ⚠️ PROBLEMA IDENTIFICADO

O banco de dados está **desatualizado** em relação ao schema Prisma. Os seguintes campos não existem no banco:

- `baseline_comercial.status`
- `baseline_comercial.proposta_por`
- `baseline_comercial.proposta_em`
- `baseline_comercial.homologada_por`
- `baseline_comercial.homologada_em`
- E outros campos relacionados à homologação

## ✅ O QUE FOI IMPLEMENTADO

1. **Seed DEMO criado** (`prisma/seed.ts`):
   - Usuários DEMO: `admin@demo.local` e `op@demo.local` (senha: `Demo@1234`)
   - Obra DEMO: "OBRA DEMO GENESIS"
   - EAP mínima (3 níveis)
   - Competência do mês atual (OPEN)
   - 9 gates automáticos
   - Medição DRAFT
   - Idempotência (pode rodar múltiplas vezes)

2. **Schema ajustado temporariamente**:
   - Campo `status` comentado no `BaselineComercial`
   - Índice do campo `status` removido

## 🔧 PRÓXIMOS PASSOS NECESSÁRIOS

### Opção 1: Aplicar Migrações (RECOMENDADO)
```bash
# Verificar migrações pendentes
npx prisma migrate status

# Aplicar migrações faltantes
npx prisma migrate deploy
```

### Opção 2: Criar Migração para Adicionar Campos Faltantes
```bash
# Criar nova migração
npx prisma migrate dev --name add_baseline_homologacao_fields
```

### Opção 3: Ajustar Seed para Não Usar Campos Opcionais
Remover campos opcionais do seed que não existem no banco.

## 📋 CREDENCIAIS DEMO (quando seed funcionar)

- **Admin**: `admin@demo.local` / `Demo@1234`
- **Operacional**: `op@demo.local` / `Demo@1234`

## 🎯 ROTAS PARA DEMONSTRAÇÃO

### Frontend
- `/login` - Tela de login
- `/dashboard` - Dashboard com KPIs e competência
- `/obras` - Lista de obras
- `/obras/[id]` - Detalhes da obra
- `/obras/[id]/competencias` - Competências da obra
- `/obras/[id]/medicoes` - Medições da obra

### Backend (API)
- `POST /api/auth/login` - Login
- `GET /api/obras` - Listar obras
- `GET /api/competencias/atual` - Competência atual
- `GET /api/competencias/:id/gates` - Gates da competência
- `GET /api/medicoes/obra/:obra_id` - Medições da obra
- `GET /api/read/obra/resumo` - Resumo consolidado
- `GET /api/read/competencia/status` - Status da competência

## ⚠️ BLOQUEADOR ATUAL

O seed não pode ser executado até que:
1. As migrações sejam aplicadas, OU
2. O schema seja ajustado para corresponder ao banco atual


