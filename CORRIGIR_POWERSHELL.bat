@echo off
echo ========================================
echo Corrigindo politica de execucao do PowerShell
echo ========================================
echo.
echo Executando comando para permitir scripts...
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"
echo.
echo Politica atualizada com sucesso!
echo.
echo Agora voce pode executar: npm run dev
echo.
pause








