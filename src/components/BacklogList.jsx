import TaskCard from './TaskCard'

export default function BacklogList({ tasks, loading, onComplete, onDelete, onUpdate }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-6 h-6 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }}
        />
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="text-4xl mb-4 opacity-30">—</div>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
          Backlog is clear
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>
          Add a task above to get started
        </p>
      </div>
    )
  }

  return (
    <div className="pb-24 pt-2">
      <p className="px-5 pb-2 text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--color-text-dim)' }}>
        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
      </p>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  )
}
