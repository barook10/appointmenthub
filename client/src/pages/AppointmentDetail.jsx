import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAppointment, updateAppointment, deleteAppointment, getAuditLogs } from '../services/appointments'
import StatusBadge from '../components/StatusBadge'
import ToastContainer from '../components/Toast'
import useToast from '../hooks/useToast'

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
)

export default function AppointmentDetail() {
  const { id }   = useParams()
  const nav      = useNavigate()
  const { user } = useAuth()
  const { toasts, showToast, dismiss } = useToast()

  const [apt, setApt]       = useState(null)
  const [audits, setAudits] = useState([])
  const [error, setError]   = useState('')

  const load = () => {
    try {
      setApt(getAppointment(id))
      if (user && user.role === 'admin') {
        setAudits(getAuditLogs().filter(l => l.entity === 'appointment' && l.entityId === Number(id)))
      }
    } catch (e) { setError(e.message) }
  }
  useEffect(() => {
    if (user) load()
  }, [id, user])

  const changeStatus = (status) => {
    const prev = { ...apt }
    setApt({ ...apt, status })   // optimistic
    try {
      updateAppointment(id, { status }, user.id, user.role)
      showToast(`Appointment ${status}`, 'success')
      load()   // refresh audit trail
    } catch (err) {
      setApt(prev)
      showToast(err.message, 'error')
    }
  }

  const remove = () => {
    if (!confirm('Delete this appointment?')) return
    try {
      deleteAppointment(id, user.id, user.role)
      showToast('Appointment deleted', 'success')
      setTimeout(() => nav('/appointments'), 900)
    } catch (err) { showToast(err.message, 'error') }
  }

  const addToCalendar = () => {
    const start = new Date(apt.date)
    const end   = new Date(start.getTime() + 3600000)
    const fmt   = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(apt.title)}&details=${encodeURIComponent(apt.description||'')}&dates=${fmt(start)}/${fmt(end)}`, '_blank')
  }

  if (error || !apt) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b', fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ fontSize: 16 }}>{error || 'Loading…'}</p>
        <Link to="/appointments" style={{ color: '#818cf8', textDecoration: 'none', fontSize: 14 }}>← Back to list</Link>
      </div>
    )
  }

  const d = new Date(apt.date)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      {/* breadcrumb + actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13 }}>
          <Link to="/appointments" style={{ color: '#64748b', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color='#818cf8'} onMouseLeave={e => e.target.style.color='#64748b'}>Appointments</Link>
          <span>/</span><span style={{ color: '#94a3b8' }}>{apt.title}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(user.role === 'admin' || apt.status === 'pending') && (
            <Link to={`/appointments/${id}/edit`} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', background:'#1a1a2e', border:'1px solid #2a2a3a', borderRadius:7, color:'#94a3b8', textDecoration:'none', fontSize:13, fontWeight:600, transition:'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#818cf8'; e.currentTarget.style.color='#818cf8' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#2a2a3a'; e.currentTarget.style.color='#94a3b8' }}>
              <Icon d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" size={14} /> Edit
            </Link>
          )}
          <button onClick={remove} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', background:'#ef444418', border:'1px solid #ef444440', borderRadius:7, color:'#f87171', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='#ef444428'; e.currentTarget.style.borderColor='#ef4444' }}
            onMouseLeave={e => { e.currentTarget.style.background='#ef444418'; e.currentTarget.style.borderColor='#ef444440' }}>
            <Icon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size={14} /> Delete
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* main card */}
        <div style={{ background: '#13131f', border: '1px solid #1e1e2e', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #1e1e2e', flexWrap: 'wrap', gap: 12 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#e2e8f0', margin: 0 }}>{apt.title}</h1>
            <StatusBadge status={apt.status} />
          </div>

          {/* description */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 8px' }}>Description</h3>
            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>{apt.description || 'No description provided'}</p>
          </div>

          {/* date / time */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px' }}>Date & Time</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', text: d.toLocaleDateString('en', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) },
                { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', text: d.toLocaleTimeString('en', { hour:'2-digit', minute:'2-digit' }) },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'#1a1a2e', border:'1px solid #1e1e2e', borderRadius:9 }}>
                  <span style={{ color:'#818cf8' }}><Icon d={item.icon} size={18} /></span>
                  <span style={{ fontSize:14, color:'#e2e8f0', fontWeight:500 }}>{item.text}</span>
                </div>
              ))}
            </div>
            {apt.status === 'approved' && (
              <button onClick={addToCalendar} style={{ marginTop:12, display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', background:'#6366f110', border:'1px solid #6366f130', borderRadius:7, color:'#818cf8', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='#6366f120'; e.currentTarget.style.borderColor='#6366f1' }}
                onMouseLeave={e => { e.currentTarget.style.background='#6366f110'; e.currentTarget.style.borderColor='#6366f130' }}>
                <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={14} /> Add to Google Calendar
              </button>
            )}
          </div>

          {/* user info (admin) */}
          {user.role === 'admin' && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px' }}>Requested By</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:'#fff' }}>{apt.userName?.[0]}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:600, color:'#e2e8f0' }}>{apt.userName}</div>
                  <div style={{ fontSize:12, color:'#475569' }}>{apt.userEmail}</div>
                </div>
              </div>
            </div>
          )}

          {/* admin actions */}
          {user.role === 'admin' && (
            <div style={{ paddingTop: 20, borderTop: '1px solid #1e1e2e' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 12px' }}>Admin Actions</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {apt.status === 'pending' && (
                  <>
                    <button onClick={() => changeStatus('approved')} style={{ padding:'9px 20px', background:'#10b98118', color:'#34d399', border:'1px solid #10b98140', borderRadius:7, fontSize:14, fontWeight:600, cursor:'pointer', transition:'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='#10b98128' }} onMouseLeave={e => { e.currentTarget.style.background='#10b98118' }}>
                      ✓ Approve
                    </button>
                    <button onClick={() => changeStatus('rejected')} style={{ padding:'9px 20px', background:'#ef444418', color:'#f87171', border:'1px solid #ef444440', borderRadius:7, fontSize:14, fontWeight:600, cursor:'pointer', transition:'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background='#ef444428' }} onMouseLeave={e => { e.currentTarget.style.background='#ef444418' }}>
                      ✕ Reject
                    </button>
                  </>
                )}
                {apt.status === 'approved' && (
                  <button onClick={() => changeStatus('completed')} style={{ padding:'9px 20px', background:'#6366f118', color:'#818cf8', border:'1px solid #6366f140', borderRadius:7, fontSize:14, fontWeight:600, cursor:'pointer', transition:'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background='#6366f128' }} onMouseLeave={e => { e.currentTarget.style.background='#6366f118' }}>
                    ✔ Mark Completed
                  </button>
                )}
                {(apt.status === 'rejected' || apt.status === 'completed') && (
                  <span style={{ fontSize: 13, color: '#475569', alignSelf: 'center' }}>No further actions available</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* sidebar — timeline + audit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* timeline */}
          <div style={{ background: '#13131f', border: '1px solid #1e1e2e', borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 16px' }}>Timeline</h3>
            {[
              { label: 'Created',      date: apt.createdAt, color: '#3b82f6' },
              { label: 'Last Updated', date: apt.updatedAt, color: '#f59e0b' },
              { label: `Status: ${apt.status}`, date: null,  color: apt.status === 'pending' ? '#f59e0b' : apt.status === 'approved' ? '#10b981' : apt.status === 'rejected' ? '#ef4444' : '#8b5cf6' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 2 ? 16 : 0, position: 'relative' }}>
                {i < 2 && <div style={{ position:'absolute', left:9, top:20, bottom:-16, width:2, background:'#1e1e2e' }} />}
                <div style={{ width:20, height:20, borderRadius:'50%', border:`3px solid ${item.color}`, background:'#13131f', flexShrink:0, zIndex:1 }} />
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#e2e8f0' }}>{item.label}</div>
                  {item.date && <div style={{ fontSize:11, color:'#475569', marginTop:2 }}>{new Date(item.date).toLocaleString()}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* audit trail (admin only) */}
          {user.role === 'admin' && audits.length > 0 && (
            <div style={{ background: '#13131f', border: '1px solid #1e1e2e', borderRadius: 14, padding: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 14px' }}>Activity Log</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {audits.slice(0, 6).map((log) => {
                  const actionColor = log.action === 'CREATE' ? '#10b981' : log.action === 'UPDATE' ? '#f59e0b' : '#ef4444'
                  const userName = log.user_name || 'Unknown'
                  return (
                    <div key={log.id} style={{ display:'flex', gap:10, padding:'10px 12px', background:'#1a1a2e', borderRadius:8, border:'1px solid #1e1e2e' }}>
                      <span style={{ fontSize:16 }}>{log.action === 'CREATE' ? '＋' : log.action === 'UPDATE' ? '✎' : '✕'}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, color:'#cbd5e1', fontWeight:500 }}>
                          <span style={{ color: actionColor, fontWeight:700 }}>{log.action}</span> by {userName}
                        </div>
                        <div style={{ fontSize:10, color:'#475569', marginTop:2 }}>{new Date(log.created_at || log.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
