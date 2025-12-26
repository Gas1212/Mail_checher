@echo off
echo Starting Email Checker Development Environment...

echo Starting Django Backend...
start cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"

timeout /t 3 /nobreak > nul

echo Starting Next.js Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo Development servers started!
echo Backend API: http://localhost:8000
echo Frontend: http://localhost:3000
