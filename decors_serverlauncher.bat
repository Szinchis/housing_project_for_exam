@echo off
echo === BACKEND INDITASA ===
cd backend
start cmd /k "cd /d %cd% && python manage.py runserver"

echo.
echo === FRONTEND INDITASA ===
cd ../frontend
start cmd /k "cd /d %cd% && npm run dev"

echo.
echo Bongeszo inditasa...
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo Have Fun, vagymi..!