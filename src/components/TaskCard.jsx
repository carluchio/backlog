import { useState, useRef } from 'react'
import { getUrgency } from '../lib/urgency'
import UrgencyTag from './UrgencyTag'

const urgencyBorderMap = {
  danger:     'var(--color-danger)',
  warning:    'var(--color-warning)',
  caution:    'var(--color-caution)',
  'text-dim': null,
}

export default function TaskCard({ task, onComplete, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDeadline, setEditDeadline] = useState(task.deadline ? task.deadline.split('T')[0] : '')
  const [editCommittedTo, setEditCommittedTo] = useState(task.committed_to || '')
  const [editContextNote, setEditContextNote] = useState(task.context_note || '')
  const [swipeX, setSwipeX] = useState(0)
  const [confirming, setConfirming] = useState(null)
  const touchStartX = useRef(0)

  const urgency = getUrgency(task)
  const leftBorderColor = urgencyBorderMap[urgency.color]

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientX - touchStartX.current
    if (diff > 0) setSwipeX(Math.min(diff, 100))
    else setSwipeX(Math.max(diff, -100))
  }
  const handleTouchEnd = () => {
    if (swipeX > 60) setConfirming('delete')
    else if (swipeX < -60) setConfirming('complete')
    setSwipeX(0)
  }

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle.trim() || task.title,
      deadline: editDeadline || null,
      committed_to: editCommittedTo.trim() || null,
      context_note: editContextNote.trim() || null,
    })
    setEditing(false)
  }

  const cardWrap = {
    margin: '0 16px 8px',
    borderRadius: '10px',
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    background: 'var(--color-bg-raised)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '6px',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
  }

  const labelStyle = {
    width: '76px',
    flexShrink: 0,
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--color-text-dim)',
  }

  if (editing) {
    return (
      <div style={{
        ...cardWrap,
        padding: '14px 16px',
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-accent)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <input
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          style={{ ...inputStyle, fontSize: 'var(--text-base)', fontWeight: 500 }}
          autoFocus
          onFocus={e => e.target.style.borderColor = 'var(--color-border-strong)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-border-subtle)'}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={labelStyle}>Deadline</label>
          <input
            type="date"
            value={editDeadline}
            onChange={e => setEditDeadline(e.target.value)}
            style={{ ...inputStyle, flex: 1, colorScheme: 'dark' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={labelStyle}>Promised to</label>
          <input
            type="text"
            value={editCommittedTo}
            onChange={e => setEditCommittedTo(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={labelStyle}>Context</label>
          <input
            type="text"
            value={editContextNote}
            onChange={e => setEditContextNote(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button
            onClick={handleSave}
            style={{
              height: '32px',
              padding: '0 16px',
              background: 'var(--color-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            style={{
              height: '32px',
              padding: '0 16px',
              background: 'var(--color-bg-elevated)',
              color: 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: '6px',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (confirming) {
    const isComplete = confirming === 'complete'
    return (
      <div style={{
        ...cardWrap,
        padding: '14px 16px',
        background: isComplete ? 'var(--success-muted)' : 'var(--danger-muted)',
        border: `1px solid ${isComplete ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          color: isComplete ? 'var(--color-success)' : 'var(--color-danger)',
        }}>
          {isComplete ? 'Mark as done?' : 'Delete this task?'}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => isComplete ? onComplete(task.id) : onDelete(task.id)}
            style={{
              height: '32px',
              padding: '0 14px',
              background: isComplete ? 'var(--color-success)' : 'var(--color-danger)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Yes
          </button>
          <button
            onClick={() => setConfirming(null)}
            style={{
              height: '32px',
              padding: '0 14px',
              background: 'var(--color-bg-elevated)',
              color: 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: '6px',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
            }}
          >
            No
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        ...cardWrap,
        padding: '14px 16px',
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
        ...(leftBorderColor ? { borderLeft: `3px solid ${leftBorderColor}` } : {}),
        cursor: 'pointer',
        transform: `translateX(${swipeX}px)`,
        transition: swipeX === 0 ? `transform 0.2s var(--ease-out)` : 'none',
      }}
      onClick={() => setEditing(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <p style={{
        fontSize: 'var(--text-base)',
        fontWeight: 500,
        lineHeight: 1.4,
        color: 'var(--color-text-primary)',
        letterSpacing: '-0.01em',
      }}>
        {task.title}
      </p>

      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <UrgencyTag urgency={urgency} />
        {task.committed_to && urgency.color !== 'warning' && urgency.color !== 'caution' && (
          <span style={{
            display: 'inline-block',
            padding: '2px 7px',
            borderRadius: '4px',
            background: 'var(--accent-muted)',
            color: 'var(--color-accent)',
            fontFamily: "'Geist Mono', monospace",
            fontSize: '12px',
            fontWeight: 500,
            verticalAlign: 'middle',
          }}>
            {task.committed_to}
          </span>
        )}
      </div>

      {task.context_note && (
        <p style={{
          marginTop: '6px',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
        }}>
          {task.context_note}
        </p>
      )}

      <div style={{
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid var(--color-border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={e => { e.stopPropagation(); setConfirming('complete') }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-success)',
            fontFamily: "'Geist Mono', monospace",
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            letterSpacing: '0.04em',
            padding: '6px 0',
            minHeight: '32px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          ✓ Done
        </button>
        <button
          onClick={e => { e.stopPropagation(); setConfirming('delete') }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-dim)',
            fontSize: 'var(--text-xs)',
            padding: '6px 0',
            minHeight: '32px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
