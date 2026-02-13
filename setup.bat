@echo off
echo ========================================
echo Smart Info Platform - MERN Stack
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
call npm install
echo.

echo Step 2: Seeding Database...
call npm run seed
echo.

echo Step 3: Installing Frontend Dependencies...
cd ..\frontend
call npm install
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Open Terminal 1: cd backend && npm run dev
echo 2. Open Terminal 2: cd frontend && npm start
echo.
echo Default Admin: admin@example.com / admin123
echo Default User: john@example.com / password123
echo.
pause