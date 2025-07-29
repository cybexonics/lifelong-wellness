@echo off
echo 🚀 Starting Lifelong Wellness Backend Server...
echo 📧 Email service will be available on http://localhost:3001
echo.

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found! Creating from template...
    echo EMAIL_USER=your-email@gmail.com > .env
    echo EMAIL_PASS=your-app-password >> .env
    echo PORT=3001 >> .env
    echo.
    echo 📝 Please edit .env file with your email credentials
    echo.
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

REM Start the backend server
echo 🔄 Starting backend server...
npm run server:dev
