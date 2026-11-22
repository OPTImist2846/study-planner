import { useEffect, useEffectEvent, useReducer, useState, type ReactNode } from 'react'
import { initialTasks } from '../data/initialTasks'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { taskReducer, type TaskState } from '../reducers/taskReducer'
import type { TaskDraft, TaskFilter } from '../types/task'
import { readStorage, writeStorage } from '../utils/storage'
import { UNDO_DELAY_MS, activeTaskTitle, isTaskFilter, isTaskList } from '../utils/tasks'
import { TaskContext, type TaskContextValue } from './taskContext'

const TASKS_STORAGE_KEY = 'study-planner:tasks'
const FILTER_STORAGE_KEY = 'study-planner:filter'

function createInitialState(): TaskState {
  return { tasks: readStorage(TASKS_STORAGE_KEY, isTaskList) ?? initialTasks, pending: [] }
}

function createKey(): string {
  return crypto.randomUUID()
}

interface TaskProviderProps {
  children: ReactNode
}

function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, undefined, createInitialState)
  const [filter, setFilter] = useLocalStorage<TaskFilter>(FILTER_STORAGE_KEY, 'all', isTaskFilter)
  const [search, setSearch] = useState('')
  const [prioritySort, setPrioritySort] = useState(false)

  useEffect(() => {
    writeStorage(TASKS_STORAGE_KEY, state.tasks)
  }, [state.tasks])

  const activeCount = state.tasks.filter(
    (task) => !task.completed && !state.pending.some((entry) => entry.taskIds.includes(task.id)),
  ).length

  useEffect(() => {
    document.title = activeTaskTitle(activeCount)
  }, [activeCount])

  const expireDeletion = useEffectEvent((key: string) => {
    dispatch({ type: 'confirmDelete', key })
  })

  useEffect(() => {
    const timers = state.pending.map((entry) =>
      window.setTimeout(() => expireDeletion(entry.key), Math.max(0, entry.expiresAt - Date.now())),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [state.pending])

  const pendingKeyByTask = new Map(
    state.pending.flatMap((entry) => entry.taskIds.map((id) => [id, entry.key] as const)),
  )

  const value: TaskContextValue = {
    tasks: state.tasks,
    pending: state.pending,
    pendingKeyByTask,
    filter,
    setFilter,
    search,
    setSearch,
    prioritySort,
    setPrioritySort,
    addTask: (draft: TaskDraft) => dispatch({ type: 'add', draft }),
    updateTask: (id: number, changes: TaskDraft) => dispatch({ type: 'update', id, changes }),
    toggleTask: (id: number) => dispatch({ type: 'toggle', id }),
    requestDelete: (id: number) =>
      dispatch({
        type: 'requestDelete',
        id,
        key: createKey(),
        expiresAt: Date.now() + UNDO_DELAY_MS,
      }),
    undoDelete: (key: string) => dispatch({ type: 'undoDelete', key }),
    clearCompleted: () =>
      dispatch({ type: 'clearCompleted', key: createKey(), expiresAt: Date.now() + UNDO_DELAY_MS }),
    resetTasks: () => dispatch({ type: 'reset', tasks: initialTasks }),
  }

  return <TaskContext value={value}>{children}</TaskContext>
}

export default TaskProvider
