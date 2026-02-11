import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAppointments } from '../services/appointments'
import StatusBadge from '../components/StatusBadge'

const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
)

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const [apts, setApts]   = useState([])

  useEffect(() => {
    async function loadAppointments() {
      try {
        const data = await getAppointments(user.role, user.id)
        setApts(data)
      } catch (err) {
        console.error('Failed to load appointments:', err)
      }
    }
    loadAppointments()
  }, [user])

  const stats = [
    { label: 'Total',     val: apts.length,                                                      color: '#6366f1', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Pending',   val: apts.filter(a => a.status === 'pending').length,                  color: '#f59e0b', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Approved',  val: apts.filter(a => a.status === 'approved').length,                 color: '#10b981', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Completed', val: apts.filter(a => a.status === 'completed').length,                color: '#8b5cf6', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  ]

  const upcoming = apts
    .filter(a => a.status === 'approved' && new Date(a.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#e2e8f0', margin: 0 }}>
            Welcome, <span style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.name}</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0' }}>Here's what's happening today</p>
        </div>
        <Link to="/appointments/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff',
          padding: '10px 20px', borderRadius: 8, textDecoration: 'none',
          fontSize: 14, fontWeight: 600, boxShadow: '0 4px 18px #6366f140',
          transition: 'transform .2s, box-shadow .2s',
        }} onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px #6366f160' }}
           onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';  e.currentTarget.style.boxShadow='0 4px 18px #6366f140' }}>
          <Icon d="M12 4v16m8-8H4" size={16} /> New Appointment
        </Link>
      </div>

      {/* stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16, marginBottom: 36 }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: '#13131f', border: '1px solid #1e1e2e', borderRadius: 14, padding: '22px 20px',
            transition: 'transform .2s, box-shadow .2s, border-color .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 28px #00000050'; e.currentTarget.style.borderColor=s.color+'40' }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';  e.currentTarget.style.boxShadow='none';                 e.currentTarget.style.borderColor='#1e1e2e' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: s.color+'18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                <Icon d={s.icon} size={20} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* upcoming */}
      <div style={{ background: '#13131f', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: '#e2e8f0', margin: 0 }}>Upcoming Appointments</h2>
          <Link to="/appointments" style={{ color: '#818cf8', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
        </div>

        {upcoming.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ color: '#475569', marginBottom: 12 }}><Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={40} /></div>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>No upcoming appointments</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming.map((apt) => {
              const d = new Date(apt.date)
              return (
                <Link key={apt.id} to={`/appointments/${apt.id}`} style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', padding: '14px 16px', background: '#1a1a2e', borderRadius: 10, border: '1px solid #1e1e2e', transition: 'border .2s, background .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='#6366f140'; e.currentTarget.style.background='#1e1e2e' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='#1e1e2e';   e.currentTarget.style.background='#1a1a2e' }}>
                  {/* date pill */}
                  <div style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', borderRadius: 10, padding: '10px 14px', textAlign: 'center', color: '#fff', minWidth: 56, boxShadow: '0 3px 12px #6366f140' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{d.getDate()}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', opacity: .9, marginTop: 2 }}>{d.toLocaleString('en',{ month:'short' })}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{apt.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                      {d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                      {isAdmin && <span style={{ marginLeft: 10, color: '#475569' }}>— {apt.userName}</span>}
                    </div>
                  </div>
                  <StatusBadge status={apt.status} />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
