@echo off
echo Starting VERTEX Development Server...
echo.

REM Kill any existing Node.js processes
taskkill /F /IM node.exe >nul 2>&1

REM Clear Next.js cache
rmdir /s /q .next >nul 2>&1

REM Start development server
echo Starting fresh development server...
npm run dev

pause
