import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useTasks } from './hooks/useTasks'
import AuthForm from './components/AuthForm'
import QuickAdd from './components/QuickAdd'
import BacklogList from './components/BacklogList'
import CompletedList from './components/CompletedList'

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const { tasks, completedTasks, loading: tasksLoading, addTask, completeTask, deleteTask, updateTask } = useTasks(user)
  const [view, setView] = useState('backlog')

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-app)',
      }}>
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

  if (!user) return <AuthForm onSignIn={signIn} onSignUp={signUp} />

  const tabs = [
    { id: 'backlog', label: 'Active', count: tasks.length },
    { id: 'done',    label: 'Done',   count: completedTasks.length },
  ]

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg-app)',
    }}>

      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 20px 8px',
      }}>
        <h1 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--color-text-primary)',
          lineHeight: 1,
        }}>
          Backlog
        </h1>
        <button
          onClick={signOut}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-dim)',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '8px 0 8px 16px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Sign out
        </button>
      </header>

      {view === 'backlog' && <QuickAdd onAdd={addTask} />}

      {/* Tab bar */}
      <nav style={{
        display: 'flex',
        padding: `${view === 'done' ? '8px' : '0'} 20px 0`,
        borderBottom: '1px solid var(--color-border-subtle)',
      }}>
        {tabs.map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            style={{
              padding: '10px 0 9px',
              marginRight: '28px',
              marginBottom: '-1px',
              background: 'none',
              border: 'none',
              borderBottom: view === id
                ? '2px solid var(--color-accent)'
                : '2px solid transparent',
              color: view === id
                ? 'var(--color-text-primary)'
                : 'var(--color-text-muted)',
              fontSize: 'var(--text-sm)',
              fontWeight: view === id ? 600 : 400,
              cursor: 'pointer',
              transition: `color var(--dur-fast), border-color var(--dur-fast)`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              lineHeight: 1,
              minHeight: '44px',
            }}
          >
            {label}
            {count > 0 && (
              <span style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: '10px',
                color: view === id ? 'var(--color-text-muted)' : 'var(--color-text-dim)',
              }}>
                {count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {view === 'backlog' ? (
          <BacklogList
            tasks={tasks}
            loading={tasksLoading}
            onComplete={completeTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        ) : (
          <CompletedList tasks={completedTasks} />
        )}
      </main>
    </div>
  )
}
