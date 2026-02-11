import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStats, getAppointments } from '../services/appointments'

const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
)

export default function AdminDashboard() {
  const [stats, setStats]     = useState({})
  const [apts, setApts]       = useState([])

  useEffect(() => {
    setStats(getStats())
    setApts(getAppointments('admin', null))
  }, [])

  const pending  = apts.filter(a => a.status === 'pending')
  const recent   = [...apts].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)

  const statCards = [
    { label: 'Total',     val: stats.total,     color: '#6366f1', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Pending',   val: stats.pending,   color: '#f59e0b', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',  badge: stats.pending > 0 ? stats.pending : null },
    { label: 'Approved',  val: stats.approved,  color: '#10b981', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Users',     val: stats.users,     color: '#3b82f6', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ]

  const statusDot = { pending:'#f59e0b', approved:'#10b981', rejected:'#ef4444', completed:'#8b5cf6' }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      {/* header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#e2e8f0', margin: 0 }}>Admin Panel</h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0' }}>Overview of all appointments & system activity</p>
      </div>

      {/* stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px,1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{
            background: '#13131f', border: '1px solid #1e1e2e', borderRadius: 14, padding: '22px 20px',
            position: 'relative', transition: 'transform .2s, box-shadow .2s, border-color .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 28px #00000050'; e.currentTarget.style.borderColor=s.color+'40' }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';  e.currentTarget.style.boxShadow='none';                 e.currentTarget.style.borderColor='#1e1e2e' }}>
            {s.badge && (
              <div style={{ position:'absolute', top:14, right:14, background:s.color, color:'#fff', width:24, height:24, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, boxShadow:`0 2px 8px ${s.color}60` }}>{s.badge}</div>
            )}
            <div style={{ display:'flex', alignItems:'center', marginBottom:14 }}>
              <div style={{ width:44, height:44, borderRadius:11, background:s.color+'18', display:'flex', alignItems:'center', justifyContent:'center', color:s.color }}>
                <Icon d={s.icon} size={21} />
              </div>
            </div>
            <div style={{ fontSize:34, fontWeight:800, color:s.color, fontFamily:"'Syne', sans-serif", lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:13, color:'#64748b', marginTop:6, fontWeight:500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* two-col content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* pending approvals */}
        <div style={{ background:'#13131f', border:'1px solid #1e1e2e', borderRadius:16, padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <h2 style={{ fontSize:17, fontWeight:700, fontFamily:"'Syne', sans-serif", color:'#e2e8f0', margin:0 }}>Pending Approvals</h2>
            {pending.length > 0 && <span style={{ background:'#6366f1', color:'#fff', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:12 }}>{pending.length}</span>}
          </div>
          {pending.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px 0', color:'#475569' }}>
              <Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size={36} />
              <p style={{ fontSize:13, color:'#64748b', margin:'10px 0 0' }}>All caught up!</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {pending.map((apt) => (
                <Link key={apt.id} to={`/appointments/${apt.id}`} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'#1a1a2e', border:'1px solid #1e1e2e', borderRadius:9, textDecoration:'none', transition:'border .2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='#6366f140'} onMouseLeave={e => e.currentTarget.style.borderColor='#1e1e2e'}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:'#f59e0b', boxShadow:'0 0 6px #f59e0b', flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{apt.title}</div>
                    <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{apt.userName} · {new Date(apt.date).toLocaleDateString()}</div>
                  </div>
                  <Icon d="M9 5l7 7-7 7" size={16} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* recent activity */}
        <div style={{ background:'#13131f', border:'1px solid #1e1e2e', borderRadius:16, padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <h2 style={{ fontSize:17, fontWeight:700, fontFamily:"'Syne', sans-serif", color:'#e2e8f0', margin:0 }}>Recent Activity</h2>
            <Link to="/appointments" style={{ color:'#818cf8', fontSize:12, fontWeight:600, textDecoration:'none' }}>View all →</Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {recent.map((apt) => (
              <Link key={apt.id} to={`/appointments/${apt.id}`} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'#1a1a2e', border:'1px solid #1e1e2e', borderRadius:9, textDecoration:'none', transition:'border .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='#2a2a3a'} onMouseLeave={e => e.currentTarget.style.borderColor='#1e1e2e'}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:statusDot[apt.status], boxShadow:`0 0 6px ${statusDot[apt.status]}`, flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{apt.title}</div>
                  <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{apt.userName} · {new Date(apt.createdAt).toLocaleDateString()}</div>
                </div>
                <span style={{ fontSize:11, fontWeight:600, color:statusDot[apt.status], textTransform:'capitalize' }}>{apt.status}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* quick actions */}
      <div style={{ marginTop:24, background:'#13131f', border:'1px solid #1e1e2e', borderRadius:16, padding:24 }}>
        <h2 style={{ fontSize:16, fontWeight:700, fontFamily:"'Syne', sans-serif", color:'#e2e8f0', margin:'0 0 16px' }}>Quick Actions</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:12 }}>
          {[
            { to:'/appointments',  label:'Manage All Appointments',  icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { to:'/admin/audit',   label:'View Audit Logs',          icon:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { to:'/appointments/new', label:'Create New Appointment', icon:'M12 4v16m8-8H4' },
          ].map((item) => (
            <Link key={item.to} to={item.to} style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px', background:'#1a1a2e', border:'1px solid #1e1e2e', borderRadius:10, textDecoration:'none', transition:'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#6366f1'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 4px 16px #00000040' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#1e1e2e'; e.currentTarget.style.transform='translateY(0)';  e.currentTarget.style.boxShadow='none' }}>
              <span style={{ color:'#818cf8' }}><Icon d={item.icon} size={22} /></span>
              <span style={{ fontSize:14, fontWeight:600, color:'#e2e8f0' }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
