@echo off
echo ========================================
echo Building Cosmic Birthday Journey...
echo ========================================
cd /d "d:\Users\cmedh\Working Projects\did\cosmic-sister-dream-main"

echo.
echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Building production version...
call npm run build

echo.
echo Step 3: Starting web server on port 8080...
echo.
echo ========================================
echo   Open your browser to:
echo   http://localhost:8080
echo ========================================
echo.
cd dist
python -m http.server 8080
pause
