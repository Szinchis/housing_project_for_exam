@echo off
echo === BACKEND CSOMAGOK TELEPITESE ===
cd backend
pip install -r requirements.txt

echo.
echo === FRONTEND CSOMAGOK TELEPITESE ===
cd ../frontend
npm install

echo.
echo TELEPITES KESZ!
pause
