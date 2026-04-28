import { useState, useRef } from 'react'
import { getUrgency } from '../lib/urgency'
import UrgencyTag from './UrgencyTag'

export default function TaskCard({ task, onComplete, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDeadline, setEditDeadline] = useState(task.deadline ? task.deadline.split('T')[0] : '')
  const [editCommittedTo, setEditCommittedTo] = useState(task.committed_to || '')
  const [editContextNote, setEditContextNote] = useState(task.context_note || '')
  const [swipeX, setSwipeX] = useState(0)
  const [confirming, setConfirming] = useState(null) // 'complete' | 'delete'
  const touchStartX = useRef(0)
  const urgency = getUrgency(task)

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientX - touchStartX.current
    // Limit swipe distance
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

  if (editing) {
    return (
      <div
        className="mx-4 mb-2 p-4 rounded-xl space-y-2"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-accent)',
        }}
      >
        <input
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm font-semibold outline-none"
          style={{
            background: 'var(--color-surface-hover)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
          autoFocus
        />
        <div className="flex items-center gap-2">
          <label className="text-xs w-20 shrink-0" style={{ color: 'var(--color-text-dim)' }}>Deadline</label>
          <input
            type="date"
            value={editDeadline}
            onChange={e => setEditDeadline(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg text-xs outline-none"
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
            value={editCommittedTo}
            onChange={e => setEditCommittedTo(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg text-xs outline-none"
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
            value={editContextNote}
            onChange={e => setEditContextNote(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg text-xs outline-none"
            style={{
              background: 'var(--color-surface-hover)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-1.5 rounded-lg text-xs cursor-pointer border-none"
            style={{ background: 'var(--color-surface-hover)', color: 'var(--color-text-muted)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // Confirmation overlay
  if (confirming) {
    const isComplete = confirming === 'complete'
    return (
      <div
        className="mx-4 mb-2 p-4 rounded-xl flex items-center justify-between"
        style={{
          background: isComplete ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${isComplete ? 'var(--color-success)' : 'var(--color-danger)'}`,
        }}
      >
        <span className="text-sm" style={{ color: isComplete ? 'var(--color-success)' : 'var(--color-danger)' }}>
          {isComplete ? 'Complete this task?' : 'Delete this task?'}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => isComplete ? onComplete(task.id) : onDelete(task.id)}
            className="px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border-none"
            style={{
              background: isComplete ? 'var(--color-success)' : 'var(--color-danger)',
              color: '#fff',
            }}
          >
            Yes
          </button>
          <button
            onClick={() => setConfirming(null)}
            className="px-3 py-1 rounded-lg text-xs cursor-pointer border-none"
            style={{ background: 'var(--color-surface-hover)', color: 'var(--color-text-muted)' }}
          >
            No
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="mx-4 mb-2 p-4 rounded-xl cursor-pointer transition-colors active:scale-[0.99]"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        transform: `translateX(${swipeX}px)`,
        transition: swipeX === 0 ? 'transform 0.2s ease' : 'none',
      }}
      onClick={() => setEditing(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Task title */}
      <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--color-text)' }}>
        {task.title}
      </p>

      {/* Urgency tag */}
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <UrgencyTag urgency={urgency} />
        {task.committed_to && urgency.color !== 'warning' && urgency.color !== 'caution' && (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-xs"
            style={{ color: 'var(--color-accent)', background: 'rgba(59,130,246,0.1)' }}
          >
            {task.committed_to}
          </span>
        )}
      </div>

      {/* Context note */}
      {task.context_note && (
        <p className="mt-1.5 text-xs italic" style={{ color: 'var(--color-text-dim)' }}>
          {task.context_note}
        </p>
      )}

      {/* Swipe hint text on mobile */}
      <div className="mt-2 flex justify-between">
        <button
          onClick={(e) => { e.stopPropagation(); setConfirming('complete') }}
          className="text-xs cursor-pointer bg-transparent border-none"
          style={{ color: 'var(--color-success)' }}
        >
          ✓ Done
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setConfirming('delete') }}
          className="text-xs cursor-pointer bg-transparent border-none"
          style={{ color: 'var(--color-text-dim)' }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
