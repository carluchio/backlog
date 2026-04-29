import TaskCard from './TaskCard'

export default function BacklogList({ tasks, loading, onComplete, onDelete, onUpdate }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <div
          className="animate-spin"
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid var(--color-border-default)',
            borderTopColor: 'var(--color-accent)',
          }}
        />
      </div>
    )
  }

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
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1.5px solid var(--color-border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          color: 'var(--color-text-dim)',
          fontSize: '14px',
        }}>
          ✓
        </div>
        <p style={{
          fontSize: 'var(--text-base)',
          fontWeight: 500,
          color: 'var(--color-text-muted)',
        }}>
          All clear
        </p>
        <p style={{
          marginTop: '4px',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-dim)',
        }}>
          Add a task above to begin
        </p>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: '96px', paddingTop: '8px' }}>
      <p style={{
        padding: '0 20px 8px',
        fontSize: 'var(--text-xs)',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--color-text-dim)',
        fontFamily: "'Geist Mono', monospace",
      }}>
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
