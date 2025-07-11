@echo off
echo Установка зависимостей для server...
cd server
npm install

echo Установка зависимостей для frontend...
cd ../frontend
npm install

echo Установка зависимостей для electron-app...
cd ../electron-app
npm install

echo Все зависимости установлены!
cd ..
pause
