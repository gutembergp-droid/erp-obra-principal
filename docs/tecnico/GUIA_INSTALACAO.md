# Guia de Instalação - ERP G-NESIS

## ⚠️ Problema: npm não encontrado

Se você está vendo o erro "npm não é reconhecido", siga estas instruções:

## 📋 Solução Passo a Passo

### 1. Instalar Node.js

1. **Baixe o Node.js:**
   - Acesse: https://nodejs.org/
   - Baixe a versão **LTS** (recomendada)

2. **Instale o Node.js:**
   - Execute o instalador baixado
   - ⚠️ **IMPORTANTE**: Marque a opção **"Add to PATH"** durante a instalação
   - Siga todas as etapas do instalador

3. **Reinicie o VS Code:**
   - Feche completamente o VS Code
   - Abra novamente

### 2. Verificar Instalação

Abra um **novo terminal** no VS Code (`Ctrl + '`) e execute:

```bash
node --version
npm --version
```

Se ambos os comandos retornarem versões, está tudo certo! ✅

### 3. Executar Instalação

No terminal do VS Code, execute os comandos na ordem:

```bash
# 1. Instalar todas as dependências
npm install

# 2. Instalar os tipos do Express (já está no package.json, mas vamos garantir)
npm install -D @types/express @types/node

# 3. Gerar o cliente do Prisma
npx prisma generate
```

### 4. Alternativa: Usar Scripts Automáticos

Se preferir, você pode usar os scripts criados:

#### Windows (duplo clique):
- `INSTALAR_DEPENDENCIAS.bat`

#### PowerShell:
```powershell
.\INSTALAR_DEPENDENCIAS.ps1
```

## 🔧 Se o npm ainda não funcionar

### Opção 1: Adicionar Node.js ao PATH manualmente

1. Encontre onde o Node.js foi instalado (geralmente: `C:\Program Files\nodejs\`)
2. Adicione ao PATH do Windows:
   - Pressione `Win + R`
   - Digite: `sysdm.cpl`
   - Vá em "Avançado" → "Variáveis de Ambiente"
   - Em "Variáveis do sistema", edite "Path"
   - Adicione: `C:\Program Files\nodejs\`
   - Clique em "OK" em todas as janelas
   - **Reinicie o VS Code**

### Opção 2: Usar o Terminal Integrado do VS Code

1. No VS Code, abra o terminal integrado:
   - `Ctrl + '` (aspas simples)
   - Ou: Menu → Terminal → New Terminal

2. O terminal do VS Code geralmente tem o PATH configurado corretamente

## ✅ Verificação Final

Após a instalação, verifique:

1. **Pasta `node_modules` criada?**
   - Deve aparecer na raiz do projeto

2. **Erros do TypeScript desapareceram?**
   - Os erros de "Cannot find module" devem sumir

3. **Prisma Client gerado?**
   - Execute: `npx prisma generate`
   - Deve criar a pasta `node_modules/.prisma/client`

## 📝 Próximos Passos

Após instalar as dependências:

1. **Configure o `.env`:**
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/erp_genesis?schema=public"
   JWT_SECRET="seu-secret-jwt-super-seguro"
   JWT_REFRESH_SECRET="seu-refresh-secret-jwt-super-seguro"
   PORT=3000
   NEXT_PUBLIC_API_URL="http://localhost:3000/api"
   ```

2. **Execute as migrations:**
   ```bash
   npx prisma migrate dev
   ```

3. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

## 🆘 Ainda com problemas?

Se após seguir todos os passos o npm ainda não funcionar:

1. Verifique se o Node.js está realmente instalado
2. Tente reiniciar o computador
3. Use o terminal integrado do VS Code (não o PowerShell externo)
4. Verifique se há múltiplas versões do Node.js instaladas

---

**Última atualização:** Janeiro 2026



