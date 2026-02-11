#!/bin/bash

echo "🚀 AppointHub Setup Script"
echo "=========================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found!"
    echo "📥 Install PostgreSQL:"
    echo "   Mac:   brew install postgresql@16"
    echo "   Linux: sudo apt install postgresql"
    exit 1
fi

echo "✅ PostgreSQL found"

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw appointhub; then
    echo "✅ Database 'appointhub' already exists"
else
    echo "📊 Creating database 'appointhub'..."
    createdb appointhub
    echo "✅ Database created"
fi

# Setup backend
echo ""
echo "📦 Setting up backend..."
cd server

if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚙️  Created .env file - please edit with your credentials"
fi

npm install
echo "✅ Backend dependencies installed"

# Setup frontend
echo ""
echo "📦 Setting up frontend..."
cd ../client
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "  1. Backend:  cd server && npm run dev"
echo "  2. Frontend: cd client && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo "Login with: admin@example.com / admin123"
