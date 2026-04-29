const urgencyConfig = {
  danger:     { color: 'var(--color-danger)',       bg: 'var(--danger-muted)' },
  warning:    { color: 'var(--color-warning)',      bg: 'var(--warning-muted)' },
  caution:    { color: 'var(--color-caution)',      bg: 'var(--caution-muted)' },
  'text-dim': { color: 'var(--color-text-muted)',   bg: 'var(--neutral-muted)' },
}

export default function UrgencyTag({ urgency }) {
  const config = urgencyConfig[urgency.color] || urgencyConfig['text-dim']

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 7px',
      borderRadius: '4px',
      background: config.bg,
      color: config.color,
      fontFamily: "'Geist Mono', monospace",
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: 1.5,
      verticalAlign: 'middle',
    }}>
      {urgency.label}
    </span>
  )
}
