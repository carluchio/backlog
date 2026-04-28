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
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>
          No completed tasks yet
        </p>
      </div>
    )
  }

  const groups = groupByDate(tasks)

  return (
    <div className="pb-24 pt-2">
      {groups.map(([label, groupTasks]) => (
        <div key={label} className="mb-4">
          <p className="px-5 pb-2 pt-2 text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--color-text-dim)' }}>
            {label}
          </p>
          {groupTasks.map(task => (
            <div
              key={task.id}
              className="mx-4 mb-1.5 px-4 py-3 rounded-xl"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                opacity: 0.6,
              }}
            >
              <p className="text-sm line-through" style={{ color: 'var(--color-text-muted)' }}>
                {task.title}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
