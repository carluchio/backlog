function groupByDate(tasks) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today - 86400000)
  const weekAgo = new Date(today - 7 * 86400000)

  const groups = { 'Today': [], 'Yesterday': [], 'This Week': [], 'Older': [] }

  tasks.forEach(task => {
    const completed = new Date(task.completed_at)
    const completedDay = new Date(completed.getFullYear(), completed.getMonth(), completed.getDate())
    if (completedDay >= today) groups['Today'].push(task)
    else if (completedDay >= yesterday) groups['Yesterday'].push(task)
    else if (completedDay >= weekAgo) groups['This Week'].push(task)
    else groups['Older'].push(task)
  })

  return Object.entries(groups).filter(([, tasks]) => tasks.length > 0)
}

export default function CompletedList({ tasks }) {
  if (tasks.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-dim)' }}>
          Nothing completed yet
        </p>
      </div>
    )
  }

  const groups = groupByDate(tasks)

  return (
    <div style={{ paddingBottom: '96px', paddingTop: '8px' }}>
      {groups.map(([label, groupTasks]) => (
        <div key={label} style={{ marginBottom: '8px' }}>
          <p style={{
            padding: '8px 20px 6px',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-dim)',
            fontFamily: "'Geist Mono', monospace",
          }}>
            {label}
          </p>
          {groupTasks.map(task => (
            <div
              key={task.id}
              style={{
                margin: '0 16px 6px',
                padding: '12px 16px',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{
                flexShrink: 0,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'var(--success-muted)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                color: 'var(--color-success)',
              }}>
                ✓
              </span>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-dim)',
                textDecoration: 'line-through',
                textDecorationColor: 'var(--color-border-strong)',
                lineHeight: 1.4,
              }}>
                {task.title}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
