# 🚀 Solução Rápida - Erro PowerShell

## Problema
PowerShell está bloqueando a execução do npm.

## Solução Imediata (3 opções)

### ✅ Opção 1: Usar CMD ao invés de PowerShell (MAIS RÁPIDO)

1. No VS Code, clique no **dropdown do terminal** (ao lado do "+")
2. Selecione **"Command Prompt"** ou **"cmd"**
3. Execute:
   ```
   npm run dev
   ```

---

### ✅ Opção 2: Duplo clique no arquivo

1. No explorador de arquivos, dê **duplo clique** em:
   ```
   INICIAR_SERVIDOR_CMD.bat
   ```
2. Aguarde o servidor iniciar
3. Acesse: `http://localhost:3000/login`

---

### ✅ Opção 3: Usar npm.cmd diretamente

No terminal PowerShell, use:
```
npm.cmd run dev
```

---

## Por que isso acontece?

O PowerShell tem uma política de segurança que bloqueia scripts. O CMD não tem essa restrição.

---

## Depois que o servidor iniciar:

1. Aguarde aparecer: `✓ Ready in X seconds`
2. Acesse: `http://localhost:3000/login`
3. Faça **Hard Refresh**: `Ctrl + Shift + R`

---

## Você verá:

✅ Fundo roxo-acinzentado claro  
✅ Logo "G-NESIS" (G- vermelho-laranja, NESIS cinza escuro)  
✅ Botão "Entrar" vermelho escuro  






