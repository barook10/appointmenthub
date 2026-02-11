import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
)

const navItems = [
  { to: '/dashboard',   label: 'Dashboard',   icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
]
const adminItems = [
  { to: '/admin',           label: 'Admin Panel',  icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { to: '/admin/audit',     label: 'Audit Logs',   icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
]

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(true)
  const W = open ? 248 : 64

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f17', color: '#e2e8f0', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' }}>
      {/* ── sidebar ── */}
      <aside style={{
        width: W, flexShrink: 0, background: '#13131f', borderRight: '1px solid #1e1e2e',
        display: 'flex', flexDirection: 'column', transition: 'width .28s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden', position: 'relative', zIndex: 10,
      }}>
        {/* logo row */}
        <div style={{ padding: '20px 0 18px', display: 'flex', alignItems: 'center', gap: 14, paddingLeft: open ? 22 : 18, transition: 'padding .28s' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg,#6366f1,#818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 18px #6366f140',
          }}>
            <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={18} />
          </div>
          {open && <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Syne', sans-serif", background: 'linear-gradient(135deg,#818cf8,#e2e8f0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>AppointHub</span>}
        </div>

        {/* toggle btn */}
        <button onClick={() => setOpen(!open)} style={{
          position: 'absolute', top: 22, right: -1, width: 26, height: 26, borderRadius: '50% 0 0 50%',
          background: '#1e1e2e', border: '1px solid #2a2a3a', borderRight: 'none',
          color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'opacity .2s', zIndex: 2,
        }}>
          <Icon d={open ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} size={13} />
        </button>

        {/* nav links */}
        <nav style={{ flex: 1, padding: '8px 10px', overflowY: 'auto' }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 8, marginBottom: 2, textDecoration: 'none',
              color: isActive ? '#818cf8' : '#94a3b8',
              background: isActive ? '#6366f110' : 'transparent',
              transition: 'all .18s', fontWeight: isActive ? 600 : 400, fontSize: 14,
              whiteSpace: 'nowrap', overflow: 'hidden',
            })}>
              <Icon d={item.icon} size={18} />
              {open && <span>{item.label}</span>}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div style={{ height: 1, background: '#1e1e2e', margin: '14px 10px' }} />
              {open && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#475569', padding: '0 12px 6px' }}>Admin</div>}
              {adminItems.map((item) => (
                <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 8, marginBottom: 2, textDecoration: 'none',
                  color: isActive ? '#818cf8' : '#94a3b8',
                  background: isActive ? '#6366f110' : 'transparent',
                  transition: 'all .18s', fontWeight: isActive ? 600 : 400, fontSize: 14,
                  whiteSpace: 'nowrap', overflow: 'hidden',
                })}>
                  <Icon d={item.icon} size={18} />
                  {open && <span>{item.label}</span>}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* user footer */}
        <div style={{ padding: '14px 12px', borderTop: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#6366f1,#a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
          }}>{user?.name?.[0]}</div>
          {open && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: '#475569', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          )}
          <button onClick={() => { logout(); nav('/login') }} style={{
            background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 6, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color .2s',
          }} onMouseEnter={e => e.currentTarget.style.color='#ef4444'} onMouseLeave={e => e.currentTarget.style.color='#64748b'}>
            <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={18} />
          </button>
        </div>
      </aside>

      {/* ── main ── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 32, minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  )
}
