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
  const [view, setView] = useState('backlog') // 'backlog' | 'done'

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div
          className="w-6 h-6 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }}
        />
      </div>
    )
  }

  // Auth screen
  if (!user) {
    return <AuthForm onSignIn={signIn} onSignUp={signUp} />
  }

  // Main app
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-5 pb-1">
        <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
          Backlog
        </h1>
        <button
          onClick={signOut}
          className="text-xs cursor-pointer bg-transparent border-none"
          style={{ color: 'var(--color-text-dim)' }}
        >
          Sign out
        </button>
      </header>

      {/* Quick Add - only show on backlog view */}
      {view === 'backlog' && <QuickAdd onAdd={addTask} />}

      {/* Tab bar */}
      <div className="flex px-5 gap-1 mb-1" style={{ marginTop: view === 'done' ? '8px' : '0' }}>
        <button
          onClick={() => setView('backlog')}
          className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer border-none transition-colors"
          style={{
            background: view === 'backlog' ? 'var(--color-surface-hover)' : 'transparent',
            color: view === 'backlog' ? 'var(--color-text)' : 'var(--color-text-dim)',
          }}
        >
          Active
          {tasks.length > 0 && (
            <span className="ml-1.5 opacity-50">{tasks.length}</span>
          )}
        </button>
        <button
          onClick={() => setView('done')}
          className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer border-none transition-colors"
          style={{
            background: view === 'done' ? 'var(--color-surface-hover)' : 'transparent',
            color: view === 'done' ? 'var(--color-text)' : 'var(--color-text-dim)',
          }}
        >
          Done
          {completedTasks.length > 0 && (
            <span className="ml-1.5 opacity-50">{completedTasks.length}</span>
          )}
        </button>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
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
