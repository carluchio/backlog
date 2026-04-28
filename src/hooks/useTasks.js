import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { sortTasks } from '../lib/urgency'

export function useTasks(user) {
  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    if (!user) return

    const { data: active } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    const { data: completed } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(50)

    if (active) setTasks(sortTasks(active))
    if (completed) setCompletedTasks(completed)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Real-time subscription
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        fetchTasks()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchTasks])

  const addTask = async ({ title, deadline, committed_to, context_note }) => {
    if (!user || !title.trim()) return

    const newTask = {
      id: crypto.randomUUID(),
      user_id: user.id,
      title: title.trim(),
      deadline: deadline || null,
      committed_to: committed_to?.trim() || null,
      context_note: context_note?.trim() || null,
      status: 'active',
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Optimistic update
    setTasks(prev => sortTasks([newTask, ...prev]))

    const { error } = await supabase.from('tasks').insert({
      id: newTask.id,
      user_id: newTask.user_id,
      title: newTask.title,
      deadline: newTask.deadline,
      committed_to: newTask.committed_to,
      context_note: newTask.context_note,
    })

    if (error) {
      setTasks(prev => prev.filter(t => t.id !== newTask.id))
      console.error('Failed to add task:', error)
    }
  }

  const completeTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== taskId))
    setCompletedTasks(prev => [{ ...task, status: 'completed', completed_at: new Date().toISOString() }, ...prev])

    const { error } = await supabase
      .from('tasks')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', taskId)

    if (error) {
      fetchTasks()
      console.error('Failed to complete task:', error)
    }
  }

  const deleteTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    setTasks(prev => prev.filter(t => t.id !== taskId))

    const { error } = await supabase
      .from('tasks')
      .update({ status: 'deleted' })
      .eq('id', taskId)

    if (error) {
      fetchTasks()
      console.error('Failed to delete task:', error)
    }
  }

  const updateTask = async (taskId, updates) => {
    // Optimistic update
    setTasks(prev => sortTasks(prev.map(t =>
      t.id === taskId ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
    )))

    const { error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', taskId)

    if (error) {
      fetchTasks()
      console.error('Failed to update task:', error)
    }
  }

  return {
    tasks,
    completedTasks,
    loading,
    addTask,
    completeTask,
    deleteTask,
    updateTask,
    refresh: fetchTasks,
  }
}
