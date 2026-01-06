# 🔄 Como Forçar Atualização da Página de Login

## Problema
As mudanças visuais não aparecem porque o navegador está usando versão em cache.

## Solução Rápida

### 1. Hard Refresh no Navegador

**Windows/Linux:**
- `Ctrl + Shift + R` ou `Ctrl + F5`

**Mac:**
- `Cmd + Shift + R`

### 2. Limpar Cache do Navegador

1. Abra as Ferramentas de Desenvolvedor:
   - `F12` ou `Ctrl + Shift + I` (Windows)
   - `Cmd + Option + I` (Mac)

2. Clique com botão direito no botão de atualizar
3. Selecione "Esvaziar cache e atualizar forçadamente"

### 3. Reiniciar o Servidor Next.js

Se ainda não funcionar, reinicie o servidor:

1. Pare o servidor (Ctrl + C no terminal)
2. Execute novamente:
   ```powershell
   npm run dev
   ```

### 4. Abrir em Modo Anônimo

Abra uma janela anônima/privada:
- `Ctrl + Shift + N` (Chrome/Edge)
- `Ctrl + Shift + P` (Firefox)

E acesse: `http://localhost:3000/login`

---

## O que você DEVE ver após atualizar:

✅ Fundo roxo-acinzentado claro (#e8e4e8)  
✅ Logo "G-NESIS" com "G-" em vermelho-laranja e "NESIS" em cinza escuro  
✅ Campos com borda vermelha clara  
✅ Checkbox "Mostrar a senha" à esquerda  
✅ Link "Esqueci a senha" à direita  
✅ Botão "Entrar" vermelho escuro (não azul!)  

---

## Se ainda não funcionar:

1. Verifique se está acessando a URL correta: `http://localhost:3000/login`
2. Verifique se o servidor está rodando (deve aparecer "Ready" no terminal)
3. Tente fechar completamente o navegador e abrir novamente






