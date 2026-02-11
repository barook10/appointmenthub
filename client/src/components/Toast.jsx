import { useEffect, useState } from 'react'

const icons = {
  success: (
    <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-3a1 1 0 11-2 0 1 1 0 012 0zM9 14a1 1 0 102 0v-3a1 1 0 00-2 0v3z" clipRule="evenodd"/></svg>
  ),
}

function SingleToast({ toast, onDismiss }) {
  const [out, setOut] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setOut(true), 2800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (out) {
      const t = setTimeout(() => onDismiss(toast.id), 300)
      return () => clearTimeout(t)
    }
  }, [out])

  const bg = toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : '#10b981'

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: '#1e1e2e', border: `1px solid ${bg}33`,
        borderLeft: `4px solid ${bg}`,
        borderRadius: 10, padding: '14px 18px',
        boxShadow: '0 8px 32px #00000060',
        animation: out ? 'toastOut .3s ease forwards' : 'toastIn .3s cubic-bezier(.34,1.56,.64,1) forwards',
        maxWidth: 380, width: '100%',
      }}
    >
      <span style={{ color: bg, width: 20, height: 20, flexShrink: 0 }}>{icons[toast.type]}</span>
      <span style={{ color: '#e2e8f0', fontSize: 14, fontFamily: "'DM Sans', sans-serif", flex: 1 }}>{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
    </div>
  )
}

export default function ToastContainer({ toasts, dismiss }) {
  return (
    <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
      <style>{`
        @keyframes toastIn  { from { opacity:0; transform:translateX(110%) } to { opacity:1; transform:translateX(0) } }
        @keyframes toastOut { from { opacity:1; transform:translateX(0) }   to { opacity:0; transform:translateX(110%) } }
      `}</style>
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <SingleToast toast={t} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  )
}
