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
    if (e.key === 'Escape') {
      setExpanded(false)
      inputRef.current?.blur()
    }
  }

  const fieldStyle = {
    flex: 1,
    height: '34px',
    padding: '0 10px',
    background: 'var(--color-bg-raised)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '6px',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
  }

  const labelStyle = {
    width: '80px',
    flexShrink: 0,
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--color-text-dim)',
  }

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 20,
      padding: '16px 16px 12px',
      background: 'var(--color-bg-app)',
      borderBottom: `1px solid ${expanded ? 'var(--color-border-subtle)' : 'transparent'}`,
      transition: `border-color var(--dur-base)`,
    }}>

      {/* Main input row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a task…"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={e => {
            setExpanded(true)
            e.target.style.borderColor = 'var(--color-accent)'
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--color-border-default)'
          }}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            height: '44px',
            padding: '0 16px',
            background: 'var(--color-bg-raised)',
            border: '1px solid var(--color-border-default)',
            borderRadius: '10px',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--text-base)',
            outline: 'none',
            transition: `border-color var(--dur-fast)`,
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          style={{
            width: '44px',
            height: '44px',
            flexShrink: 0,
            background: title.trim() ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
            border: 'none',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: title.trim() ? 'pointer' : 'default',
            transition: `background var(--dur-fast), transform var(--dur-fast)`,
          }}
          onMouseDown={e => { if (title.trim()) e.currentTarget.style.transform = 'scale(0.93)' }}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke={title.trim() ? '#fff' : 'var(--color-text-dim)'}
            strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Expanded optional fields */}
      {expanded && (
        <div
          className="quick-add-panel"
          style={{
            marginTop: '10px',
            padding: '12px',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <label style={labelStyle}>Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              style={{ ...fieldStyle, colorScheme: 'dark' }}
              onFocus={e => e.target.style.borderColor = 'var(--color-border-strong)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border-subtle)'}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <label style={labelStyle}>Promised to</label>
            <input
              type="text"
              placeholder="Person's name"
              value={committedTo}
              onChange={e => setCommittedTo(e.target.value)}
              onKeyDown={handleKeyDown}
              style={fieldStyle}
              onFocus={e => e.target.style.borderColor = 'var(--color-border-strong)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border-subtle)'}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <label style={labelStyle}>Context</label>
            <input
              type="text"
              placeholder="Why it matters"
              value={contextNote}
              onChange={e => setContextNote(e.target.value)}
              onKeyDown={handleKeyDown}
              style={fieldStyle}
              onFocus={e => e.target.style.borderColor = 'var(--color-border-strong)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border-subtle)'}
            />
          </div>
          <button
            onClick={() => setExpanded(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-text-dim)',
              padding: '2px 0',
            }}
          >
            Collapse
          </button>
        </div>
      )}
    </div>
  )
}
