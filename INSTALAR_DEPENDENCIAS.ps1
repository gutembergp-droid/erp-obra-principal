# Script PowerShell para instalar dependências do ERP G-NESIS

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTALACAO DE DEPENDENCIAS - ERP G-NESIS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verifica se npm está disponível
try {
    $npmVersion = npm --version
    Write-Host "npm encontrado: versão $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: npm não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Node.js de https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Certifique-se de marcar 'Add to PATH' durante a instalação" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "[1/3] Instalando todas as dependências..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao instalar dependências" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/3] Instalando tipos do TypeScript..." -ForegroundColor Yellow
npm install -D @types/express @types/node
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao instalar tipos" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[3/3] Gerando cliente do Prisma..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao gerar cliente Prisma" -ForegroundColor Red
    Write-Host "Certifique-se de que o PostgreSQL está configurado" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTALACAO CONCLUIDA COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Configure o arquivo .env com as variáveis de ambiente" -ForegroundColor White
Write-Host "2. Execute: npx prisma migrate dev" -ForegroundColor White
Write-Host ""



