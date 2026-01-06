# 📝 Como Fazer Commit e Push

## Passo a Passo

### 1. Adicionar arquivos ao Git

Adicione apenas os arquivos importantes (ignore `.next` que é gerado automaticamente):

```bash
git add app/
git add src/
git add prisma/
git add package.json
git add package-lock.json
git add tsconfig.json
git add next.config.js
git add .gitignore
```

**OU** adicione tudo de uma vez (exceto `.next`):

```bash
git add .
git reset .next/
```

### 2. Verificar o que será commitado

```bash
git status
```

Você deve ver os arquivos listados como "Changes to be committed".

### 3. Fazer o Commit

```bash
git commit -m "Fix: Corrigir import do MainLayout e erros de build"
```

### 4. Fazer Push para o GitHub

```bash
git push origin master
```

**OU** se sua branch principal for `main`:

```bash
git push origin main
```

---

## ⚠️ Se Der Erro

### Erro: "fatal: not a git repository"
Você precisa inicializar o Git primeiro:
```bash
git init
```

### Erro: "fatal: No configured push target"
Configure o repositório remoto:
```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
```

### Erro: "Permission denied"
Você precisa configurar suas credenciais do GitHub ou usar SSH.

---

## 🚀 Depois do Push

1. O Vercel detectará automaticamente o push
2. Um novo deploy será iniciado
3. Aguarde 2-3 minutos
4. Teste a URL do projeto

---

## 💡 Dica Rápida

Se quiser fazer tudo de uma vez:

```bash
git add app/ src/ prisma/ package.json package-lock.json tsconfig.json next.config.js
git commit -m "Fix: Corrigir import do MainLayout e erros de build"
git push origin master
```






