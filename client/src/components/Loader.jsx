export default function Loader({ full = true }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
      ...(full ? { position: 'fixed', inset: 0, background: '#0f0f17', zIndex: 8888 } : { padding: 60 }),
    }}>
      <style>{`
        @keyframes loaderPulse { 0%,100%{transform:scale(.6);opacity:.4} 50%{transform:scale(1);opacity:1} }
        .loader-dot { width:12px; height:12px; border-radius:50%; background:#6366f1; animation: loaderPulse 1.4s ease-in-out infinite; }
        .loader-dot:nth-child(2){animation-delay:.2s}
        .loader-dot:nth-child(3){animation-delay:.4s}
      `}</style>
      <div style={{ display: 'flex', gap: 10 }}>
        <div className="loader-dot" />
        <div className="loader-dot" />
        <div className="loader-dot" />
      </div>
      <span style={{ color: '#64748b', fontSize: 14, fontFamily: "'DM Sans', sans-serif", letterSpacing: '.08em', textTransform: 'uppercase' }}>Loading</span>
    </div>
  )
}
