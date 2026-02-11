# AppointHub 🗓️

Full-stack appointment management system with role-based access control.

![Tech Stack](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)

## 🎯 Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **Role-Based Access**: User and Admin roles with different permissions
- **CRUD Operations**: Full appointment lifecycle management
- **Status Workflow**: Pending → Approved/Rejected → Completed
- **Audit Logging**: Complete activity trail for all changes
- **Real-time Updates**: Optimistic UI updates with error rollback
- **Google Calendar**: Export appointments to Google Calendar
- **Dark Theme**: Modern, polished UI design

## 🏗️ Architecture

```
appointhub/
├── server/          # Node.js + Express + PostgreSQL backend
├── client/          # React + Vite frontend
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ ([Download](https://nodejs.org/))
- PostgreSQL 16+ ([Installation guide](#postgresql-setup))
- Git

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/appointhub.git
cd appointhub
```

### 2. Database Setup

**Mac:**
```bash
brew install postgresql@16
brew services start postgresql@16
createdb appointhub
```

**Linux:**
```bash
sudo apt install postgresql
sudo systemctl start postgresql
sudo -u postgres createdb appointhub
```

**Docker:**
```bash
docker run -d --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16
docker exec -it postgres createdb -U postgres appointhub
```

### 3. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start server
npm run dev
```

Backend runs on **http://localhost:5000**

### 4. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on **http://localhost:5173**

### 5. Login

Open http://localhost:5173

**Demo Accounts:**
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

## 📡 API Documentation

### Authentication
```
POST   /api/auth/register    Register new user
POST   /api/auth/login       Login (returns JWT)
GET    /api/auth/me          Get current user
```

### Appointments
```
GET    /api/appointments           List all
GET    /api/appointments/:id       Get one
POST   /api/appointments           Create
PUT    /api/appointments/:id       Update
DELETE /api/appointments/:id       Delete
```

### Admin Only
```
GET    /api/admin/stats      System statistics
GET    /api/admin/audit      Audit logs
```

**Authentication:** All endpoints (except register/login) require:
```
Authorization: Bearer <jwt_token>
```

## 🗄️ Database Schema

```sql
users
  - id, email, password, name, role, created_at, deleted_at

appointments
  - id, user_id, title, description, date, status
  - created_at, updated_at, deleted_at

audit_logs
  - id, user_id, action, entity, entity_id
  - old_snapshot, new_snapshot, created_at
```

## 🛠️ Tech Stack

**Backend:**
- Node.js 20
- Express 4.18
- PostgreSQL 16
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- pg (PostgreSQL client)

**Frontend:**
- React 18
- Vite 6
- React Router 6
- Axios (HTTP client)

## 📦 Deployment

### Backend (Heroku/Railway/Render)

```bash
# Set environment variables
PORT=5000
DATABASE_URL=postgres://user:pass@host:5432/appointhub
JWT_SECRET=your-random-secret
CORS_ORIGIN=https://your-frontend.com
```

### Frontend (Vercel/Netlify)

```bash
cd client
npm run build
# Deploy dist/ folder
```

Update API URL in `client/src/services/api.js`:
```javascript
baseURL: 'https://your-backend.com/api'
```

## 🧪 Testing

```bash
# Test backend
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Should return JWT token
```

## 📁 Project Structure

```
appointhub/
├── server/
│   ├── server.js              # Express app
│   ├── db.js                  # PostgreSQL connection
│   ├── middleware.js          # JWT auth
│   ├── package.json
│   └── .env.example
│
├── client/
│   ├── src/
│   │   ├── services/          # API calls
│   │   ├── pages/             # 8 React pages
│   │   ├── components/        # Reusable components
│   │   └── context/           # Auth context
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## 🔒 Security

- ✅ Bcrypt password hashing (10 rounds)
- ✅ JWT token authentication (24h expiry)
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration
- ✅ Role-based access control
- ✅ Input validation
- ✅ Soft deletes (data retention)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 👨‍💻 Author

Your Name - [GitHub](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Built with React, Node.js, and PostgreSQL
- Icons by Lucide
- Design inspired by modern SaaS applications

---

**⭐ Star this repo if you found it helpful!**
