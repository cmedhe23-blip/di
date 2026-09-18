@echo off
echo ========================================
echo Cosmic Birthday Journey - Simple Start
echo ========================================
cd /d "d:\Users\cmedh\Working Projects\did\cosmic-sister-dream-main"

echo.
echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    pause
    exit /b 1
)

echo.
echo Starting Vite dev server...
echo.
echo ========================================
echo   The URL will appear below
echo   Look for: Local: http://localhost:XXXX
echo ========================================
echo.

node node_modules\vite\bin\vite.js --host
pause
