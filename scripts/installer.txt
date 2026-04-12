@echo off
echo === BACKEND CSOMAGOK TELEPÍTÉSE ===
cd backend
pip install -r requirements.txt

echo.
echo === FRONTEND CSOMAGOK TELEPÍTÉSE ===
cd ../frontend
npm install

echo.
echo TELEPÍTÉS KÉSZ!
pause
