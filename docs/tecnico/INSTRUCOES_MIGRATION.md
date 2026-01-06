# 📋 Instruções para Aplicar a Migration

## ✅ Status
- ✅ Migration SQL criada: `prisma/migrations/20260115000000_backend_minimo_competencia_gates/migration.sql`
- ✅ Script SQL seguro criado: `APLICAR_MIGRATION_SQL.sql`
- ✅ Prisma Client gerado

## 🚀 Como Aplicar

### Opção 1: Via Neon Dashboard (Mais Fácil)

1. Acesse o painel do Neon: https://console.neon.tech
2. Selecione seu projeto
3. Vá em "SQL Editor"
4. Abra o arquivo `APLICAR_MIGRATION_SQL.sql`
5. Cole todo o conteúdo no SQL Editor
6. Clique em "Run" ou pressione `Ctrl+Enter`
7. Aguarde a execução

### Opção 2: Via psql (Linha de Comando)

```bash
# Se tiver psql instalado
psql $DATABASE_URL -f APLICAR_MIGRATION_SQL.sql
```

### Opção 3: Via Prisma Studio

1. Execute:
   ```bash
   npx prisma studio
   ```
2. No Prisma Studio, vá em "Database" → "SQL Editor"
3. Cole o conteúdo de `APLICAR_MIGRATION_SQL.sql`
4. Execute

---

## ✅ Verificar se Funcionou

Após aplicar, execute:

```bash
npx prisma generate
```

E teste criando uma competência:

```bash
# Exemplo (substitua {obraId} e {token})
curl -X POST http://localhost:3001/api/obras/{obraId}/competencias/abrir \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"periodo": "2026-01"}'
```

---

## 📝 O que a Migration faz:

1. ✅ Adiciona campo `tipo` nas medições existentes (valor padrão: 'MP')
2. ✅ Remove relação antiga do Gate com CompetenciaMensal
3. ✅ Cria enums: `CompetenciaStatus` e `GateStatus`
4. ✅ Cria tabela `competencia_mensal`
5. ✅ Cria tabela `competencia_gate`
6. ✅ Cria índices e foreign keys

---

## ⚠️ Importante

- O script `APLICAR_MIGRATION_SQL.sql` é **idempotente** (pode ser executado múltiplas vezes sem erro)
- Usa `IF NOT EXISTS` e `IF EXISTS` para evitar erros
- Preserva dados existentes

---

## 🎯 Próximo Passo

Após aplicar a migration, os endpoints de competências estarão prontos para uso!






