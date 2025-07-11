@echo off

cd server
start cmd /k node server.js

cd ../frontend
start cmd /k npm run dev

cd ../electron-app
start cmd /k npm start

cd ..
