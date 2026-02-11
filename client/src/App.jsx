import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider, { useAuth } from './context/AuthContext'
import Loader from './components/Loader'
import Layout from './components/Layout'

// lazy imports (synchronous for simplicity — pages are small)
import Login           from './pages/Login'
import Register        from './pages/Register'
import Dashboard       from './pages/Dashboard'
import AppointmentList from './pages/AppointmentList'
import AppointmentForm from './pages/AppointmentForm'
import AppointmentDetail from './pages/AppointmentDetail'
import AdminDashboard  from './pages/AdminDashboard'
import AuditLogs       from './pages/AuditLogs'

/* ── route guards ──────────────────────────────────────────── */
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user)   return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (user)    return <Navigate to="/dashboard" replace />
  return children
}

/* ── app shell ─────────────────────────────────────────────── */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* guest */}
        <Route path="/login"    element={<GuestRoute><Login    /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* authenticated shell */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"              element={<Dashboard />} />
          <Route path="appointments"           element={<AppointmentList />} />
          <Route path="appointments/new"       element={<AppointmentForm />} />
          <Route path="appointments/:id"       element={<AppointmentDetail />} />
          <Route path="appointments/:id/edit"  element={<AppointmentForm />} />

          {/* admin-only */}
          <Route path="admin"        element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="admin/audit"  element={<ProtectedRoute adminOnly><AuditLogs      /></ProtectedRoute>} />
        </Route>

        {/* catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

/* ── export wrapped in provider ────────────────────────────── */
export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
