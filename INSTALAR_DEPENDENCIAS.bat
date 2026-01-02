@echo off
echo ========================================
echo   INSTALACAO DE DEPENDENCIAS - ERP G-NESIS
echo ========================================
echo.

echo [1/3] Instalando todas as dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias
    echo Certifique-se de que o Node.js esta instalado
    pause
    exit /b 1
)
echo.

echo [2/3] Instalando tipos do TypeScript...
call npm install -D @types/express @types/node
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar tipos
    pause
    exit /b 1
)
echo.

echo [3/3] Gerando cliente do Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERRO: Falha ao gerar cliente Prisma
    echo Certifique-se de que o PostgreSQL esta configurado
    pause
    exit /b 1
)
echo.

echo ========================================
echo   INSTALACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo Proximos passos:
echo 1. Configure o arquivo .env com as variaveis de ambiente
echo 2. Execute: npx prisma migrate dev
echo.
pause


