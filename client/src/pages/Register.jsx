import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)
  const { register }              = useAuth()
  const nav                       = useNavigate()

  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (password !== confirm) return setError('Passwords do not match')
    setLoading(true)
    try {
      await register(name, email, password)
      setSuccess(true)
      setTimeout(() => nav('/login'), 2200)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f17', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, margin: '0 auto 20px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#10b981,#059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px #10b98150', animation: 'scaleIn .4s cubic-bezier(.34,1.56,.64,1)',
          }}>
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
          </div>
          <style>{'@keyframes scaleIn{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}'}</style>
          <h2 style={{ color: '#10b981', fontFamily: "'Syne', sans-serif", fontSize: 24, margin: '0 0 8px' }}>Account Created!</h2>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Redirecting to login…</p>
        </div>
      </div>
    )
  }

  const fields = [
    { label: 'Full Name',        type: 'text',     val: name,     set: setName,     ph: 'Alex Morgan' },
    { label: 'Email',           type: 'email',    val: email,    set: setEmail,    ph: 'you@example.com' },
    { label: 'Password',        type: 'password', val: password, set: setPassword, ph: '••••••••' },
    { label: 'Confirm Password', type: 'password', val: confirm,  set: setConfirm,  ph: '••••••••' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f17', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{'@keyframes blobFloat{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-30px) scale(1.08)}} .blob{position:absolute;border-radius:50%;filter:blur(100px);opacity:.35;animation:blobFloat 18s ease-in-out infinite;}'}</style>
      <div className="blob" style={{ width:520, height:520, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', top:'-180px', left:'-180px' }} />
      <div className="blob" style={{ width:420, height:420, background:'linear-gradient(135deg,#10b981,#3b82f6)', bottom:'-140px', right:'-140px', animationDelay:'6s' }} />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 440,
        background: 'rgba(19,19,31,.94)', backdropFilter: 'blur(24px)',
        border: '1px solid #1e1e2e', borderRadius: 20, padding: '40px 36px 36px',
        boxShadow: '0 24px 80px #00000070',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{
            width: 64, height: 64, margin: '0 auto 16px',
            background: 'linear-gradient(135deg,#6366f1,#818cf8)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 28px #6366f150',
          }}>
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx={11} cy={7} r={4}/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#e2e8f0', margin: 0 }}>Create Account</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0' }}>Join to manage your appointments</p>
        </div>

        {error && (
          <div style={{ background: '#ef444415', border: '1px solid #ef444440', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width={16} height={16} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          {fields.map(({ label, type, val, set, ph }) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 5 }}>{label}</label>
              <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph} required disabled={loading}
                style={{ width: '100%', padding: '11px 14px', background: '#1a1a2e', border: '1px solid #2a2a3a', borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border .2s' }}
                onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor='#2a2a3a'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px 0', marginTop: 10,
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px #6366f140',
            opacity: loading ? .6 : 1, transition: 'all .2s', fontFamily: "'DM Sans', sans-serif",
          }}>
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, margin: '20px 0 0' }}>
          Already have an account? <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
