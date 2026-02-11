import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAppointments, updateAppointment, deleteAppointment } from '../services/appointments'
import StatusBadge from '../components/StatusBadge'
import ToastContainer from '../components/Toast'
import useToast from '../hooks/useToast'

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
)

export default function AppointmentList() {
  const { user }                  = useAuth()
  const [apts, setApts]           = useState([])
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')
  const { toasts, showToast, dismiss } = useToast()

  const refresh = useCallback(async () => {
    try {
      const data = await getAppointments(user.role, user.id)
      setApts(data)
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to load appointments', 'error')
    }
  }, [user])
  
  useEffect(() => { refresh() }, [refresh])

  // ── optimistic status change ──
  const changeStatus = async (id, status) => {
    const prev = [...apts]
    setApts(apts.map(a => a.id === id ? { ...a, status } : a))   // optimistic
    try {
      await updateAppointment(id, { status }, user.id, user.role)
      showToast(`Appointment ${status}`, 'success')
      refresh()
    } catch (err) {
      setApts(prev)   // rollback
      showToast(err.response?.data?.error || 'Update failed', 'error')
    }
  }

  // ── optimistic delete ──
  const remove = async (id) => {
    if (!confirm('Delete this appointment?')) return
    const prev = [...apts]
    setApts(apts.filter(a => a.id !== id))   // optimistic
    try {
      await deleteAppointment(id, user.id, user.role)
      showToast('Appointment deleted', 'success')
    } catch (err) {
      setApts(prev)
      showToast(err.response?.data?.error || 'Delete failed', 'error')
    }
  }

  const filtered = apts
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || (a.description || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#e2e8f0', margin: 0 }}>Appointments</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0' }}>Manage and track all your appointments</p>
        </div>
        <Link to="/appointments/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff',
          padding: '10px 20px', borderRadius: 8, textDecoration: 'none',
          fontSize: 14, fontWeight: 600, boxShadow: '0 4px 18px #6366f140',
        }}>
          <Icon d="M12 4v16m8-8H4" size={15} /> New
        </Link>
      </div>

      {/* search + filters */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 260px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }}><Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={17} /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
            style={{ width: '100%', padding: '10px 14px 10px 36px', background: '#13131f', border: '1px solid #1e1e2e', borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border .2s' }}
            onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor='#1e1e2e'}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, background: '#13131f', border: '1px solid #1e1e2e', borderRadius: 8, padding: 4 }}>
          {['all','pending','approved','rejected','completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 14px', background: filter === f ? '#6366f1' : 'transparent',
              color: filter === f ? '#fff' : '#94a3b8', border: 'none', borderRadius: 6,
              fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              transition: 'all .18s', boxShadow: filter === f ? '0 2px 8px #6366f140' : 'none',
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
          <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={48} />
          <p style={{ color: '#64748b', fontSize: 15, marginTop: 16 }}>No appointments found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((apt) => {
            const d = new Date(apt.date)
            return (
              <div key={apt.id} style={{ background: '#13131f', border: '1px solid #1e1e2e', borderRadius: 14, padding: '18px 20px', transition: 'border .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='#2a2a3a'} onMouseLeave={e => e.currentTarget.style.borderColor='#1e1e2e'}>
                {/* top row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                  <StatusBadge status={apt.status} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/appointments/${apt.id}`} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:34, height:34, background:'#1a1a2e', border:'1px solid #2a2a3a', borderRadius:7, color:'#94a3b8', textDecoration:'none', transition:'all .2s' }}
                      onMouseEnter={e=>e.currentTarget.style.color='#818cf8'} onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
                      <Icon d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" size={16} />
                    </Link>
                    {(user.role === 'admin' || apt.status === 'pending') && (
                      <Link to={`/appointments/${apt.id}/edit`} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:34, height:34, background:'#1a1a2e', border:'1px solid #2a2a3a', borderRadius:7, color:'#94a3b8', textDecoration:'none', transition:'all .2s' }}
                        onMouseEnter={e=>e.currentTarget.style.color='#fbbf24'} onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
                        <Icon d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" size={16} />
                      </Link>
                    )}
                    <button onClick={() => remove(apt.id)} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:34, height:34, background:'#1a1a2e', border:'1px solid #2a2a3a', borderRadius:7, color:'#94a3b8', cursor:'pointer', transition:'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.color='#ef4444'; e.currentTarget.style.borderColor='#ef444440' }}
                      onMouseLeave={e => { e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.borderColor='#2a2a3a' }}>
                      <Icon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size={16} />
                    </button>
                  </div>
                </div>

                {/* body */}
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', margin: '0 0 6px' }}>{apt.title}</h3>
                {apt.description && <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>{apt.description}</p>}

                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: user.role === 'admin' && apt.status === 'pending' ? 14 : 0 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#64748b' }}>
                    <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={14} />
                    {d.toLocaleDateString('en', { weekday:'short', month:'short', day:'numeric', year:'numeric' })}
                  </span>
                  <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#64748b' }}>
                    <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size={14} />
                    {d.toLocaleTimeString('en', { hour:'2-digit', minute:'2-digit' })}
                  </span>
                  {user.role === 'admin' && (
                    <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#64748b' }}>
                      <Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" size={14} />
                      {apt.userName}
                    </span>
                  )}
                </div>

                {/* admin approve / reject */}
                {user.role === 'admin' && apt.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 8, paddingTop: 14, borderTop: '1px solid #1e1e2e' }}>
                    <button onClick={() => changeStatus(apt.id, 'approved')} style={{ padding:'7px 18px', background:'#10b98118', color:'#34d399', border:'1px solid #10b98140', borderRadius:6, fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='#10b98128'; e.currentTarget.style.borderColor='#10b981' }}
                      onMouseLeave={e => { e.currentTarget.style.background='#10b98118'; e.currentTarget.style.borderColor='#10b98140' }}>
                      ✓ Approve
                    </button>
                    <button onClick={() => changeStatus(apt.id, 'rejected')} style={{ padding:'7px 18px', background:'#ef444418', color:'#f87171', border:'1px solid #ef444440', borderRadius:6, fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='#ef444428'; e.currentTarget.style.borderColor='#ef4444' }}
                      onMouseLeave={e => { e.currentTarget.style.background='#ef444418'; e.currentTarget.style.borderColor='#ef444440' }}>
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
