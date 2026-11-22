@echo off
title AI Resume Analyzer 2026 Launcher
echo ========================================================
echo        Starting AI Resume Analyzer (2026 Edition)
echo ========================================================
echo.

echo [1/3] Starting Backend API Server (Port 5000)...
start "AI Resume Analyzer - Backend" cmd /k "cd /d %~dp0backend && npm start"

echo Waiting 3 seconds for backend initialization...
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Dev Server (Port 5173)...
start "AI Resume Analyzer - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Waiting 3 seconds for frontend server...
timeout /t 3 /nobreak >nul

echo [3/3] Opening web page in your default browser...
start http://localhost:5173

echo.
echo ========================================================
echo Both servers are active!
echo Frontend URL: http://localhost:5173
echo Backend API:  http://localhost:5000/api/health
echo ========================================================
