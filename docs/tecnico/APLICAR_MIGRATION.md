# 🔧 Como Aplicar a Migration Manualmente

## Problema
O Prisma não permite criar migrations em ambiente não-interativo. A migration SQL foi criada manualmente.

## Solução: Aplicar Migration SQL Manualmente

### Opção 1: Via Prisma Studio (Recomendado)
1. Abra o Prisma Studio:
   ```bash
   npx prisma studio
   ```
2. Execute o SQL manualmente através do banco de dados

### Opção 2: Via Cliente PostgreSQL
Execute o arquivo SQL diretamente no banco:

```bash
psql $DATABASE_URL -f prisma/migrations/20260115000000_backend_minimo_competencia_gates/migration.sql
```

### Opção 3: Via Interface do Neon/PostgreSQL
1. Acesse o painel do Neon (ou seu provedor PostgreSQL)
2. Abra o SQL Editor
3. Cole o conteúdo de `prisma/migrations/20260115000000_backend_minimo_competencia_gates/migration.sql`
4. Execute

### Opção 4: Usar Prisma DB Push (Desenvolvimento)
⚠️ **ATENÇÃO**: Isso pode perder dados se houver conflitos.

```bash
npx prisma db push --accept-data-loss
```

---

## O que a Migration faz:

1. ✅ Cria enums: `CompetenciaStatus` e `GateStatus`
2. ✅ Cria tabela `competencia_mensal`
3. ✅ Cria tabela `competencia_gate`
4. ✅ Adiciona campo `tipo` nas medições existentes (com valor padrão 'MP')
5. ✅ Remove relação antiga do Gate com CompetenciaMensal
6. ✅ Cria índices e foreign keys

---

## Após aplicar a migration:

1. Gere o Prisma Client:
   ```bash
   npx prisma generate
   ```

2. Teste os endpoints:
   - POST `/api/obras/{obraId}/competencias/abrir`
   - GET `/api/obras/{obraId}/competencias/ativa`
   - GET `/api/obras/{obraId}/competencias/{competenciaId}/gates`

---

## Arquivo da Migration:
`prisma/migrations/20260115000000_backend_minimo_competencia_gates/migration.sql`






