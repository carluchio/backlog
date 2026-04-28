function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function daysUntil(deadline, now) {
  const d = new Date(deadline)
  d.setHours(0, 0, 0, 0)
  const n = new Date(now)
  n.setHours(0, 0, 0, 0)
  return Math.ceil((d - n) / (1000 * 60 * 60 * 24))
}

function daysSince(date, now) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const n = new Date(now)
  n.setHours(0, 0, 0, 0)
  return Math.floor((n - d) / (1000 * 60 * 60 * 24))
}

export function getUrgency(task) {
  const now = new Date()
  const deadline = task.deadline ? new Date(task.deadline) : null
  const ageInDays = daysSince(task.created_at, now)

  // Overdue
  if (deadline && deadline < now && !isSameDay(deadline, now)) {
    const overdueDays = daysSince(deadline, now)
    return {
      label: overdueDays === 1 ? 'Overdue by 1 day' : `Overdue by ${overdueDays} days`,
      color: 'danger',
      priority: 0,
    }
  }

  // Due today
  if (deadline && isSameDay(deadline, now)) {
    return { label: 'Due today', color: 'danger', priority: 1 }
  }

  // Due tomorrow
  if (deadline && daysUntil(deadline, now) === 1) {
    return { label: 'Due tomorrow', color: 'warning', priority: 2 }
  }

  // Commitment with deadline coming soon (within 7 days)
  if (task.committed_to && deadline && daysUntil(deadline, now) <= 7) {
    const days = daysUntil(deadline, now)
    return {
      label: `Promised to ${task.committed_to} \u2014 due in ${days} days`,
      color: 'warning',
      priority: 3,
    }
  }

  // Commitment with no deadline — urgency increases with age
  if (task.committed_to && !deadline) {
    if (ageInDays >= 7) {
      return {
        label: `Promised to ${task.committed_to} \u2014 ${ageInDays}d ago`,
        color: 'warning',
        priority: 3,
      }
    }
    if (ageInDays >= 3) {
      return {
        label: `Promised to ${task.committed_to} \u2014 ${ageInDays}d ago`,
        color: 'caution',
        priority: 4,
      }
    }
    return {
      label: `Promised to ${task.committed_to}`,
      color: 'caution',
      priority: 5,
    }
  }

  // Due this week (2-7 days)
  if (deadline && daysUntil(deadline, now) <= 7) {
    return {
      label: `Due in ${daysUntil(deadline, now)} days`,
      color: 'caution',
      priority: 6,
    }
  }

  // Commitment with a deadline further out
  if (task.committed_to && deadline) {
    return {
      label: `Promised to ${task.committed_to} \u2014 due in ${daysUntil(deadline, now)}d`,
      color: 'text-dim',
      priority: 7,
    }
  }

  // Has a deadline further out
  if (deadline) {
    return {
      label: `Due in ${daysUntil(deadline, now)} days`,
      color: 'text-dim',
      priority: 8,
    }
  }

  // No deadline, no commitment
  return { label: 'No deadline', color: 'text-dim', priority: 9 }
}

export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const ua = getUrgency(a)
    const ub = getUrgency(b)
    if (ua.priority !== ub.priority) return ua.priority - ub.priority
    // Within same priority, sort by deadline if both have one, else by creation date
    if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline)
    return new Date(b.created_at) - new Date(a.created_at)
  })
}
