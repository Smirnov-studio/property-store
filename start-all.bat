@echo off
echo ========================================
echo   Запуск Property Store - Полный функционал
echo ========================================
echo.

echo 1. Останавливаем старые процессы...
taskkill /F /IM node.exe 2>nul

echo 2. Запускаем бэкенд сервер...
start "Property Store Backend" cmd /k "cd backend && npm run dev"

echo Ждем 5 секунд для запуска бэкенда...
timeout /t 5 /nobreak >nul

echo 3. Запускаем фронтенд...
start "Property Store Frontend" cmd /k "cd frontend && npm start"

echo Ждем 5 секунд для запуска фронтенда...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   ✅ Приложение запущено успешно!
echo ========================================
echo.
echo 📍 Фронтенд: http://localhost:3000
echo ⚙️  Бэкенд API: http://localhost:3001/api
echo 📊 Health Check: http://localhost:3001/api/health
echo 🏢 Комплексы: http://localhost:3001/api/complexes
echo.
echo 👑 Админ доступ:
echo Email: admin@example.com
echo Пароль: password123
echo.
echo 👤 Пользовательский доступ:
echo Email: user@example.com
echo Пароль: password123
echo.
echo Нажмите любую клавишу для выхода...
pause >nul