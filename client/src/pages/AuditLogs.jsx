import { useState, useEffect } from 'react'
import { getAuditLogs } from '../services/appointments'

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
)

const actionMeta = {
  CREATE: { color:'#10b981', bg:'#10b98118', border:'#10b98140', emoji:'＋', label:'Created' },
  UPDATE: { color:'#f59e0b', bg:'#f59e0b18', border:'#f59e0b40', emoji:'✎', label:'Updated' },
  DELETE: { color:'#ef4444', bg:'#ef444418', border:'#ef444440', emoji:'✕', label:'Deleted' },
}

export default function AuditLogs() {
  const [logs,   setLogs]   = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => { setLogs(getAuditLogs()) }, [])

  const filtered = logs
    .filter(l => filter === 'all' || l.action === filter)
    .filter(l => {
      if (!search) return true
      const userName = l.user_name || 'Unknown'
      return userName.toLowerCase().includes(search.toLowerCase())
    })

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      {/* header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#e2e8f0', margin: 0 }}>Audit Logs</h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0' }}>Complete history of every change in the system</p>
      </div>

      {/* search + filters */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 260px', position: 'relative' }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#475569' }}><Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={17} /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user…"
            style={{ width:'100%', padding:'10px 14px 10px 36px', background:'#13131f', border:'1px solid #1e1e2e', borderRadius:8, color:'#e2e8f0', fontSize:14, outline:'none', boxSizing:'border-box', transition:'border .2s' }}
            onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor='#1e1e2e'}
          />
        </div>
        <div style={{ display:'flex', gap:6, background:'#13131f', border:'1px solid #1e1e2e', borderRadius:8, padding:4 }}>
          {['all','CREATE','UPDATE','DELETE'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'7px 14px', background:filter===f?'#6366f1':'transparent',
              color:filter===f?'#fff':'#94a3b8', border:'none', borderRadius:6,
              fontSize:12, fontWeight:600, cursor:'pointer', textTransform:'capitalize',
              transition:'all .18s', boxShadow:filter===f?'0 2px 8px #6366f140':'none',
            }}>{f === 'all' ? 'All' : f.charAt(0)+f.slice(1).toLowerCase()+'d'}</button>
          ))}
        </div>
      </div>

      {/* logs */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 0', color:'#475569' }}>
          <Icon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size={44} />
          <p style={{ color:'#64748b', fontSize:15, marginTop:14 }}>No audit logs found</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map((log) => {
            const userName = log.user_name || 'Unknown'
            const meta = actionMeta[log.action] || actionMeta.CREATE
            const old  = log.old_snapshot || log.oldSnapshot
            const nw   = log.new_snapshot || log.newSnapshot

            // compute visible diffs
            const diffs = []
            if (log.action === 'UPDATE' && old && nw) {
              if (old.status !== nw.status) diffs.push({ key:'Status', from: old.status, to: nw.status })
              if (old.title  !== nw.title  && nw.title)  diffs.push({ key:'Title',  from: old.title,  to: nw.title })
              if (old.date   !== nw.date   && nw.date)   diffs.push({ key:'Date',   from: old.date ? new Date(old.date).toLocaleString() : '—', to: new Date(nw.date).toLocaleString() })
            }

            return (
              <div key={log.id} style={{ background:'#13131f', border:'1px solid #1e1e2e', borderRadius:12, padding:'18px 20px', transition:'border .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='#2a2a3a'} onMouseLeave={e => e.currentTarget.style.borderColor='#1e1e2e'}>
                {/* top row */}
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom: diffs.length || log.action !== 'UPDATE' ? 14 : 0, flexWrap:'wrap' }}>
                  {/* action icon */}
                  <div style={{ width:40, height:40, borderRadius:10, background:meta.bg, border:`1px solid ${meta.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:meta.color, flexShrink:0 }}>
                    {meta.emoji}
                  </div>
                  {/* user */}
                  <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>
                      {userName?.[0] || '?'}
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#e2e8f0' }}>{userName}</div>
                      <div style={{ fontSize:11, color:'#475569' }}>{log.user_email || ''}</div>
                    </div>
                  </div>
                  {/* date */}
                  <div style={{ fontSize:11, color:'#475569', textAlign:'right', whiteSpace:'nowrap' }}>
                    {new Date(log.createdAt).toLocaleDateString('en',{ month:'short', day:'numeric', year:'numeric' })}<br/>
                    {new Date(log.createdAt).toLocaleTimeString('en',{ hour:'2-digit', minute:'2-digit' })}
                  </div>
                </div>

                {/* action badge + entity */}
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom: diffs.length ? 12 : 0 }}>
                  <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', background:meta.bg, border:`1px solid ${meta.border}`, borderRadius:6, fontSize:11, fontWeight:700, color:meta.color, textTransform:'uppercase', letterSpacing:'.06em' }}>
                    {log.action}
                  </span>
                  <span style={{ fontSize:12, color:'#64748b', fontFamily:"'DM Sans', sans-serif" }}>
                    {log.entity} <span style={{ color:'#475569' }}>#{log.entityId}</span>
                  </span>
                </div>

                {/* diff cards */}
                {diffs.length > 0 && (
                  <div style={{ background:'#1a1a2e', border:'1px solid #1e1e2e', borderRadius:8, padding:'10px 14px', marginTop: 4 }}>
                    {diffs.map((diff) => (
                      <div key={diff.key} style={{ display:'flex', alignItems:'center', gap:10, padding:'5px 0', borderBottom: diff !== diffs[diffs.length-1] ? '1px solid #1e1e2e' : 'none', fontSize:12 }}>
                        <span style={{ color:'#94a3b8', fontWeight:600, minWidth:52 }}>{diff.key}</span>
                        <span style={{ color:'#f87171', textDecoration:'line-through', opacity:.7 }}>{String(diff.from)}</span>
                        <span style={{ color:'#475569' }}>→</span>
                        <span style={{ color:'#34d399', fontWeight:600 }}>{String(diff.to)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* create snapshot */}
                {log.action === 'CREATE' && nw && (
                  <div style={{ background:'#1a1a2e', border:'1px solid #1e1e2e', borderRadius:8, padding:'10px 14px', marginTop:4 }}>
                    <div style={{ fontSize:11, color:'#64748b', marginBottom:6 }}>Created with:</div>
                    {nw.title  && <div style={{ fontSize:12, color:'#cbd5e1' }}><strong style={{ color:'#94a3b8' }}>Title:</strong> {nw.title}</div>}
                    {nw.status && <div style={{ fontSize:12, color:'#cbd5e1' }}><strong style={{ color:'#94a3b8' }}>Status:</strong> {nw.status}</div>}
                  </div>
                )}

                {/* delete snapshot */}
                {log.action === 'DELETE' && old && (
                  <div style={{ background:'#1a1a2e', border:'1px solid #1e1e2e', borderRadius:8, padding:'10px 14px', marginTop:4 }}>
                    <div style={{ fontSize:11, color:'#64748b', marginBottom:6 }}>Deleted:</div>
                    {old.title  && <div style={{ fontSize:12, color:'#f87171' }}><strong style={{ color:'#94a3b8' }}>Title:</strong> {old.title}</div>}
                    {old.status && <div style={{ fontSize:12, color:'#f87171' }}><strong style={{ color:'#94a3b8' }}>Status:</strong> {old.status}</div>}
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
