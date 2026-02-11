import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createAppointment, getAppointment, updateAppointment } from '../services/appointments'
import ToastContainer from '../components/Toast'
import useToast from '../hooks/useToast'

export default function AppointmentForm() {
  const { id }     = useParams()
  const nav        = useNavigate()
  const { user }   = useAuth()
  const isEdit     = Boolean(id)
  const { toasts, showToast, dismiss } = useToast()

  const [title, setTitle]           = useState('')
  const [description, setDesc]      = useState('')
  const [date, setDate]             = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  useEffect(() => {
    if (isEdit) {
      try {
        const apt = getAppointment(id)
        setTitle(apt.title)
        setDesc(apt.description || '')
        // format for datetime-local
        setDate(new Date(apt.date).toISOString().slice(0, 16))
      } catch (e) {
        setError('Appointment not found')
      }
    }
  }, [id])

  const submit = (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      if (isEdit) {
        updateAppointment(id, { title, description, date }, user.id, user.role)
        showToast('Appointment updated', 'success')
      } else {
        createAppointment(user.id, { title, description, date })
        showToast('Appointment created', 'success')
      }
      setTimeout(() => nav('/appointments'), 900)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      {/* breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13, marginBottom: 20 }}>
        <Link to="/appointments" style={{ color: '#64748b', textDecoration: 'none', transition: 'color .2s' }}
          onMouseEnter={e => e.target.style.color='#818cf8'} onMouseLeave={e => e.target.style.color='#64748b'}>Appointments</Link>
        <span>/</span>
        <span style={{ color: '#94a3b8' }}>{isEdit ? 'Edit' : 'New'}</span>
      </div>

      {/* header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#e2e8f0', margin: 0 }}>
          {isEdit ? 'Edit Appointment' : 'New Appointment'}
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0' }}>
          {isEdit ? 'Update the details below' : 'Fill in the details to book your appointment'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        {/* form card */}
        <div style={{ background: '#13131f', border: '1px solid #1e1e2e', borderRadius: 16, padding: 28 }}>
          {error && (
            <div style={{ background: '#ef444415', border: '1px solid #ef444440', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#f87171', fontSize: 13 }}>{error}</div>
          )}

          <form onSubmit={submit}>
            {/* title */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Doctor check-up" required disabled={loading}
                style={{ width: '100%', padding: '11px 14px', background: '#1a1a2e', border: '1px solid #2a2a3a', borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border .2s' }}
                onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor='#2a2a3a'}
              />
            </div>

            {/* description */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Description</label>
              <textarea value={description} onChange={e => setDesc(e.target.value)} placeholder="Any additional details…" rows={3} disabled={loading}
                style={{ width: '100%', padding: '11px 14px', background: '#1a1a2e', border: '1px solid #2a2a3a', borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', transition: 'border .2s', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor='#2a2a3a'}
              />
            </div>

            {/* date */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                Date & Time <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required disabled={loading}
                style={{ width: '100%', padding: '11px 14px', background: '#1a1a2e', border: '1px solid #2a2a3a', borderRadius: 8, color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border .2s', colorScheme: 'dark' }}
                onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor='#2a2a3a'}
              />
              <p style={{ fontSize: 12, color: '#475569', margin: '6px 0 0' }}>Select the date and time for your appointment</p>
            </div>

            {/* actions */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 20, borderTop: '1px solid #1e1e2e' }}>
              <button type="button" onClick={() => nav('/appointments')} disabled={loading}
                style={{ padding: '10px 22px', background: '#1a1a2e', border: '1px solid #2a2a3a', borderRadius: 8, color: '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='#1e1e2e'; e.currentTarget.style.color='#e2e8f0' }}
                onMouseLeave={e => { e.currentTarget.style.background='#1a1a2e'; e.currentTarget.style.color='#94a3b8' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                style={{
                  padding: '10px 28px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff',
                  border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 18px #6366f140', opacity: loading ? .6 : 1, transition: 'all .2s',
                }}>
                {loading ? 'Saving…' : isEdit ? 'Update' : 'Create Appointment'}
              </button>
            </div>
          </form>
        </div>

        {/* info sidebar */}
        <div style={{ background: '#6366f108', border: '1px solid #6366f120', borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ color: '#818cf8', flexShrink: 0, marginTop: 2 }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>What happens next?</h4>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                Once submitted, your appointment enters <strong style={{ color: '#fbbf24' }}>Pending</strong> status and an admin will review it.
                You'll receive a notification when it's approved or rejected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
