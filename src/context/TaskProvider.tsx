import { useEffect, useEffectEvent, useReducer, useState, type ReactNode } from 'react'
import { initialTasks } from '../data/initialTasks'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToasts } from '../hooks/useToasts'
import { pendingTaskIds, taskReducer, type TaskState } from '../reducers/taskReducer'
import type { TaskDraft, TaskFilter } from '../types/task'
import { readStorage, writeStorage } from '../utils/storage'
import { UNDO_DELAY_MS, activeTaskTitle, isTaskFilter, isTaskList } from '../utils/tasks'
import { TaskContext, type TaskContextValue } from './taskContext'

const TASKS_STORAGE_KEY = 'study-planner:tasks'
const FILTER_STORAGE_KEY = 'study-planner:filter'

function createInitialState(): TaskState {
  return { tasks: readStorage(TASKS_STORAGE_KEY, isTaskList) ?? initialTasks, pending: [] }
}

function createDeletionTiming() {
  const startedAt = Date.now()
  return { key: crypto.randomUUID(), startedAt, expiresAt: startedAt + UNDO_DELAY_MS }
}

interface TaskProviderProps {
  children: ReactNode
}

function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, undefined, createInitialState)
  const [filter, setFilter] = useLocalStorage<TaskFilter>(FILTER_STORAGE_KEY, 'all', isTaskFilter)
  const [search, setSearch] = useState('')
  const [prioritySort, setPrioritySort] = useState(false)
  const { toasts, showToast, dismissToast } = useToasts()

  const pendingIds = pendingTaskIds(state.pending)

  const reportSaveError = useEffectEvent(() => {
    showToast('Не вдалося зберегти завдання в браузері.', 'error')
  })

  useEffect(() => {
    if (!writeStorage(TASKS_STORAGE_KEY, state.tasks)) reportSaveError()
  }, [state.tasks])

  const activeCount = state.tasks.filter(
    (task) => !task.completed && !pendingIds.has(task.id),
  ).length

  useEffect(() => {
    document.title = activeTaskTitle(activeCount)
  }, [activeCount])

  const expireDeletion = useEffectEvent((key: string) => {
    const entry = state.pending.find((item) => item.key === key)
    if (!entry) return
    dispatch({ type: 'confirmDelete', key })
    if (entry.kind === 'completed') {
      showToast(`Видалено виконаних завдань: ${entry.taskIds.length}.`)
      return
    }
    const task = state.tasks.find((item) => item.id === entry.taskIds[0])
    showToast(task ? `Завдання «${task.title}» видалено.` : 'Завдання видалено.')
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

  function addTask(draft: TaskDraft) {
    dispatch({ type: 'add', draft })
    showToast(`Завдання «${draft.title}» додано.`)
  }

  function updateTask(id: number, changes: TaskDraft) {
    if (!state.tasks.some((task) => task.id === id)) {
      showToast('Завдання не знайдено, зміни не збережено.', 'error')
      return
    }
    dispatch({ type: 'update', id, changes })
    showToast(`Завдання «${changes.title}» оновлено.`)
  }

  function toggleTask(id: number) {
    if (pendingIds.has(id)) {
      showToast('Завдання очікує видалення, його не можна змінити.', 'error')
      return
    }
    dispatch({ type: 'toggle', id })
  }

  function requestDelete(id: number) {
    if (pendingIds.has(id)) {
      showToast('Це завдання вже очікує видалення.', 'error')
      return
    }
    dispatch({ type: 'requestDelete', id, ...createDeletionTiming() })
  }

  function undoDelete(key: string) {
    dispatch({ type: 'undoDelete', key })
    showToast('Видалення скасовано.', 'info')
  }

  function clearCompleted() {
    const hasCompleted = state.tasks.some((task) => task.completed && !pendingIds.has(task.id))
    if (!hasCompleted) {
      showToast('Немає виконаних завдань для очищення.', 'error')
      return
    }
    dispatch({ type: 'clearCompleted', ...createDeletionTiming() })
  }

  function resetTasks() {
    dispatch({ type: 'reset', tasks: initialTasks })
    showToast('Дані скинуто до початкового списку.', 'info')
  }

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
    addTask,
    updateTask,
    toggleTask,
    requestDelete,
    undoDelete,
    clearCompleted,
    resetTasks,
    toasts,
    dismissToast,
  }

  return <TaskContext value={value}>{children}</TaskContext>
}

export default TaskProvider
