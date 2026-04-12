@echo off
echo === FRONTEND JAVÍTÁS ===
cd frontend

echo node_modules torlese...
rmdir /s /q node_modules

echo npm install futtatasa...
npm install

echo KÉSZ!
pause
