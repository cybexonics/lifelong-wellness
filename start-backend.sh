#!/bin/bash

echo "🚀 Starting Lifelong Wellness Backend Server..."
echo "📧 Email service will be available on http://localhost:3001"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found! Creating from template..."
    cat > .env << EOL
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3001
EOL
    echo "📝 Please edit .env file with your email credentials"
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the backend server
echo "🔄 Starting backend server..."
npm run server:dev
