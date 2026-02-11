import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const nav                   = useNavigate()

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await login(email, password)
      nav('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const fill = (em, pw) => { setEmail(em); setPassword(pw) }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f17', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      {/* blobs */}
      <style>{`
        @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-30px) scale(1.08)} }
        .blob { position:absolute; border-radius:50%; filter:blur(100px); opacity:.35; animation:blobFloat 18s ease-in-out infinite; }
      `}</style>
      <div className="blob" style={{ width:520, height:520, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', top:'-180px', left:'-180px', animationDelay:'0s' }} />
      <div className="blob" style={{ width:420, height:420, background:'linear-gradient(135deg,#10b981,#3b82f6)', bottom:'-140px', right:'-140px', animationDelay:'6s' }} />
      <div className="blob" style={{ width:300, height:300, background:'linear-gradient(135deg,#f59e0b,#ef4444)', top:'55%', left:'45%', animationDelay:'12s' }} />

      {/* card */}
      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 420,
        background: 'rgba(19,19,31,.94)', backdropFilter: 'blur(24px)',
        border: '1px solid #1e1e2e', borderRadius: 20, padding: '44px 36px 36px',
        boxShadow: '0 24px 80px #00000070',
      }}>
        {/* logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, margin: '0 auto 18px',
            background: 'linear-gradient(135deg,#6366f1,#818cf8)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px #6366f150',
          }}>
            <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#e2e8f0', margin: 0 }}>Welcome Back</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0' }}>Sign in to manage your appointments</p>
        </div>

        {/* error */}
        {error && (
          <div style={{ background: '#ef444415', border: '1px solid #ef444440', borderRadius: 8, padding: '10px 14px', marginBottom: 18, color: '#f87171', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width={16} height={16} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            {error}
          </div>
        )}

        {/* form */}
        <form onSubmit={submit}>
          {[
            { label: 'Email', type: 'email', val: email, set: setEmail, ph: 'you@example.com' },
            { label: 'Password', type: 'password', val: password, set: setPassword, ph: '••••••••' },
          ].map(({ label, type, val, set, ph }) => (
            <div key={label} style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>{label}</label>
              <input
                type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph} required disabled={loading}
                style={{
                  width: '100%', padding: '11px 14px', background: '#1a1a2e', border: '1px solid #2a2a3a',
                  borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  transition: 'border .2s',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur  ={e => e.target.style.borderColor = '#2a2a3a'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px 0', marginTop: 8,
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px #6366f140', opacity: loading ? .6 : 1, transition: 'all .2s',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, margin: '22px 0 0' }}>
          Don't have an account? <Link to="/register" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
        </p>

        {/* demo creds */}
        <div style={{ marginTop: 24, padding: 16, background: '#6366f108', border: '1px solid #6366f120', borderRadius: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', textAlign: 'center', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '.1em' }}>Demo Credentials</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Admin', email: 'admin@example.com', pw: 'admin123' },
              { label: 'User',  email: 'user@example.com',  pw: 'user123' },
            ].map((c) => (
              <button key={c.label} onClick={() => fill(c.email, c.pw)} style={{
                background: '#1a1a2e', border: '1px solid #2a2a3a', borderRadius: 8,
                padding: '10px 12px', cursor: 'pointer', textAlign: 'left', transition: 'border .2s',
              }} onMouseEnter={e => e.currentTarget.style.borderColor='#6366f1'} onMouseLeave={e => e.currentTarget.style.borderColor='#2a2a3a'}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{c.label}</div>
                <div style={{ fontSize: 10, color: '#64748b', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>{c.email}<br/>{c.pw}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
