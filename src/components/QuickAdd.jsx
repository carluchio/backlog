import { useState, useRef } from 'react'

export default function QuickAdd({ onAdd }) {
  const [title, setTitle] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [deadline, setDeadline] = useState('')
  const [committedTo, setCommittedTo] = useState('')
  const [contextNote, setContextNote] = useState('')
  const inputRef = useRef(null)

  const reset = () => {
    setTitle('')
    setDeadline('')
    setCommittedTo('')
    setContextNote('')
    setExpanded(false)
  }

  const handleSubmit = () => {
    if (!title.trim()) return
    onAdd({
      title: title.trim(),
      deadline: deadline || null,
      committed_to: committedTo.trim() || null,
      context_note: contextNote.trim() || null,
    })
    reset()
    inputRef.current?.blur()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className="sticky top-0 z-20 px-4 pt-4 pb-3"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Main input row */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a task..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-opacity cursor-pointer"
          style={{
            background: 'var(--color-accent)',
            opacity: title.trim() ? 1 : 0.3,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Expanded optional fields */}
      {expanded && (
        <div
          className="mt-2 p-3 rounded-xl space-y-2 transition-all"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center gap-2">
            <label className="text-xs w-20 shrink-0" style={{ color: 'var(--color-text-dim)' }}>Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                colorScheme: 'dark',
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs w-20 shrink-0" style={{ color: 'var(--color-text-dim)' }}>Promised to</label>
            <input
              type="text"
              placeholder="Person's name"
              value={committedTo}
              onChange={e => setCommittedTo(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs w-20 shrink-0" style={{ color: 'var(--color-text-dim)' }}>Context</label>
            <input
              type="text"
              placeholder="Why it matters"
              value={contextNote}
              onChange={e => setContextNote(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="text-xs cursor-pointer bg-transparent border-none pt-1"
            style={{ color: 'var(--color-text-dim)' }}
          >
            Collapse
          </button>
        </div>
      )}
    </div>
  )
}
