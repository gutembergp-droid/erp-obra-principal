# 🚀 Guia Rápido: Aplicar Migration no Neon

## Passo a Passo

### 1. Acesse o SQL Editor do Neon
1. No dashboard do Neon, clique no projeto **"erp-g-nesis"**
2. No menu lateral, clique em **"SQL Editor"** (ou vá direto: https://console.neon.tech/project/.../sql)

### 2. Cole o SQL
1. Abra o arquivo: `APLICAR_MIGRATION_SQL.sql`
2. **Selecione TODO o conteúdo** (Ctrl+A)
3. **Cole no SQL Editor** do Neon (Ctrl+V)

### 3. Execute
1. Clique no botão **"Run"** (ou pressione `Ctrl+Enter`)
2. Aguarde alguns segundos
3. Você verá: **"Success"** ou mensagem de sucesso

### 4. Verificar
Após executar, você deve ver as novas tabelas:
- `competencia_mensal`
- `competencia_gate`

---

## ✅ Pronto!

Após aplicar, os endpoints de competências estarão funcionando!

---

## 🧪 Testar

Depois de aplicar, você pode testar criando uma competência:

```bash
# No terminal do projeto
npm run dev:api
```

E em outro terminal, teste:
```bash
# Substitua {obraId} pelo ID real de uma obra
curl -X POST http://localhost:3001/api/obras/{obraId}/competencias/abrir \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{"periodo": "2026-01"}'
```

---

## 📁 Arquivo SQL
O arquivo completo está em: `APLICAR_MIGRATION_SQL.sql`






