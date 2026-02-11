# Client - AppointHub Frontend

React + Vite single-page application

## 🚀 Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Runs on **http://localhost:5173**

## 🏗️ Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Structure

```
src/
├── services/
│   ├── api.js              # Axios HTTP client
│   ├── auth.js             # Auth API calls
│   └── appointments.js     # Appointment CRUD
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── AppointmentList.jsx
│   ├── AppointmentForm.jsx
│   ├── AppointmentDetail.jsx
│   ├── AdminDashboard.jsx
│   └── AuditLogs.jsx
│
├── components/
│   ├── Layout.jsx
│   ├── StatusBadge.jsx
│   ├── Toast.jsx
│   └── Loader.jsx
│
├── context/
│   └── AuthContext.jsx
│
└── hooks/
    └── useToast.js
```

## 🔧 Configuration

Backend API URL is in `src/services/api.js`:

```javascript
baseURL: 'http://localhost:5000/api'
```

Change this for production deployment.

## 🎨 Features

- JWT authentication flow
- Role-based routing (user/admin)
- Optimistic UI updates
- Toast notifications
- Dark theme design
- Responsive layout
- Google Calendar integration

## 📦 Production

Deploy `dist/` folder to:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
