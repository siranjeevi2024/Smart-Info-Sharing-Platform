@echo off
echo ========================================
echo Starting Smart Info Platform
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Login credentials:
echo Admin: admin@example.com / admin123
echo User: john@example.com / password123
echo.
echo Press any key to exit this window...
pause > nul