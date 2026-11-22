import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'
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

  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const reportSaveError = useEffectEvent(() => {
    showToast('Не вдалося зберегти завдання в браузері.', 'error')
  })

  useEffect(() => {
    if (!writeStorage(TASKS_STORAGE_KEY, state.tasks)) reportSaveError()
  }, [state.tasks])

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== TASKS_STORAGE_KEY) return
      const tasks = readStorage(TASKS_STORAGE_KEY, isTaskList)
      if (tasks) dispatch({ type: 'sync', tasks })
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const pendingIds = useMemo(() => pendingTaskIds(state.pending), [state.pending])

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

  const pendingKeyByTask = useMemo(
    () =>
      new Map(
        state.pending.flatMap((entry) => entry.taskIds.map((id) => [id, entry.key] as const)),
      ),
    [state.pending],
  )

  const isPending = useCallback(
    (id: number) => pendingTaskIds(stateRef.current.pending).has(id),
    [],
  )

  const addTask = useCallback(
    (draft: TaskDraft) => {
      dispatch({ type: 'add', draft })
      showToast(`Завдання «${draft.title}» додано.`)
    },
    [showToast],
  )

  const updateTask = useCallback(
    (id: number, changes: TaskDraft) => {
      if (!stateRef.current.tasks.some((task) => task.id === id)) {
        showToast('Завдання не знайдено, зміни не збережено.', 'error')
        return
      }
      dispatch({ type: 'update', id, changes })
      showToast(`Завдання «${changes.title}» оновлено.`)
    },
    [showToast],
  )

  const toggleTask = useCallback(
    (id: number) => {
      if (isPending(id)) {
        showToast('Завдання очікує видалення, його не можна змінити.', 'error')
        return
      }
      dispatch({ type: 'toggle', id })
    },
    [isPending, showToast],
  )

  const requestDelete = useCallback(
    (id: number) => {
      if (isPending(id)) {
        showToast('Це завдання вже очікує видалення.', 'error')
        return
      }
      dispatch({ type: 'requestDelete', id, ...createDeletionTiming() })
    },
    [isPending, showToast],
  )

  const undoDelete = useCallback(
    (key: string) => {
      dispatch({ type: 'undoDelete', key })
      showToast('Видалення скасовано.', 'info')
    },
    [showToast],
  )

  const clearCompleted = useCallback(() => {
    const hasCompleted = stateRef.current.tasks.some(
      (task) => task.completed && !isPending(task.id),
    )
    if (!hasCompleted) {
      showToast('Немає виконаних завдань для очищення.', 'error')
      return
    }
    dispatch({ type: 'clearCompleted', ...createDeletionTiming() })
  }, [isPending, showToast])

  const resetTasks = useCallback(() => {
    dispatch({ type: 'reset', tasks: initialTasks })
    showToast('Дані скинуто до початкового списку.', 'info')
  }, [showToast])

  const value = useMemo<TaskContextValue>(
    () => ({
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
    }),
    [
      state.tasks,
      state.pending,
      pendingKeyByTask,
      filter,
      setFilter,
      search,
      prioritySort,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
      toasts,
      dismissToast,
    ],
  )

  return <TaskContext value={value}>{children}</TaskContext>
}

export default TaskProvider
