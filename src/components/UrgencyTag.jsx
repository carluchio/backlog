const colorMap = {
  danger: { text: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  warning: { text: '#F97316', bg: 'rgba(249,115,22,0.12)' },
  caution: { text: '#EAB308', bg: 'rgba(234,179,8,0.12)' },
  'text-dim': { text: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
}

export default function UrgencyTag({ urgency }) {
  const colors = colorMap[urgency.color] || colorMap['text-dim']

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ color: colors.text, background: colors.bg }}
    >
      {urgency.label}
    </span>
  )
}
