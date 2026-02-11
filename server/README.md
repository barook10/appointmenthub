# Server - AppointHub Backend

Node.js + Express + PostgreSQL REST API

## 🚀 Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run development server
npm run dev
```

## 📋 Environment Variables

Create `.env` file:

```bash
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appointhub
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=http://localhost:5173
```

## 🗄️ Database Setup

The server automatically creates tables on first run.

**Demo accounts created automatically:**
- `admin@example.com` / `admin123` (admin)
- `user@example.com` / `user123` (user)

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/auth/me` - Get current user

### Appointments
- `GET /api/appointments` - List all
- `GET /api/appointments/:id` - Get one
- `POST /api/appointments` - Create
- `PUT /api/appointments/:id` - Update
- `DELETE /api/appointments/:id` - Delete

### Admin
- `GET /api/admin/stats` - Statistics
- `GET /api/admin/audit` - Audit logs

## 🔐 Authentication

All endpoints (except register/login) require JWT token:

```bash
Authorization: Bearer <your_jwt_token>
```

## 🧪 Test

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Create appointment (with token)
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Meeting","date":"2026-02-15T10:00:00Z"}'
```

## 📦 Production

```bash
npm start
```

Set `NODE_ENV=production` in environment.
