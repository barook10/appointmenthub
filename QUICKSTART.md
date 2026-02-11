# 📚 Quick Start Guide

## GitHub Upload Instructions

### 1. Create GitHub Repository

```bash
# Go to GitHub.com and create new repository "appointhub"
# Don't initialize with README (we already have one)
```

### 2. Upload Project

```bash
# Extract the zip file
unzip appointhub.zip
cd appointhub

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Full-stack appointment management system"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/appointhub.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Local Development Setup

### Option 1: Automatic (Recommended)

```bash
./setup.sh
```

### Option 2: Manual

```bash
# 1. Database
createdb appointhub

# 2. Backend
cd server
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev

# 3. Frontend (in new terminal)
cd client
npm install
npm run dev
```

## Environment Variables

Edit `server/.env`:

```bash
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appointhub
DB_USER=postgres           # or your Mac username
DB_PASSWORD=               # leave empty on Mac or set your password
JWT_SECRET=change-this-to-random-string
CORS_ORIGIN=http://localhost:5173
```

## Testing

```bash
# Backend running: http://localhost:5000
# Frontend running: http://localhost:5173

# Login with:
admin@example.com / admin123
```

## Deployment

See [README.md](README.md) for deployment instructions to:
- Heroku / Railway / Render (backend)
- Vercel / Netlify (frontend)

## Troubleshooting

**PostgreSQL not found:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Database connection error:**
- Check PostgreSQL is running: `brew services list`
- Verify database exists: `psql -l | grep appointhub`
- Check .env credentials match your setup

## Project Structure

```
appointhub/
├── .github/workflows/    # CI/CD
├── server/              # Backend API
├── client/              # Frontend SPA
├── .gitignore
├── LICENSE
├── README.md
├── CONTRIBUTING.md
└── setup.sh
```

## Features

✅ JWT Authentication
✅ Role-based Access (User/Admin)
✅ PostgreSQL Database
✅ RESTful API
✅ React SPA
✅ Audit Logging
✅ Dark Theme UI

## Tech Stack

- **Backend:** Node.js, Express, PostgreSQL, JWT
- **Frontend:** React, Vite, Axios
- **Database:** PostgreSQL 16

---

Need help? Check the [main README](README.md) or open an issue!
