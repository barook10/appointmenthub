const styles = {
  pending:   { bg: '#f59e0b18', text: '#fbbf24', border: '#f59e0b40' },
  approved:  { bg: '#10b98118', text: '#34d399', border: '#10b98140' },
  rejected:  { bg: '#ef444418', text: '#f87171', border: '#ef444440' },
  completed: { bg: '#8b5cf618', text: '#a78bfa', border: '#8b5cf640' },
}

export default function StatusBadge({ status }) {
  const s = styles[status] || styles.pending
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: s.bg, color: s.text, border: `1px solid ${s.border}`,
      borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600,
      textTransform: 'capitalize', letterSpacing: '.03em',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.text, boxShadow: `0 0 6px ${s.text}` }} />
      {status}
    </span>
  )
}
