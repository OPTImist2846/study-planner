import type { PendingDeletion, Task, TaskDraft } from '../types/task'
import { createTask } from '../utils/tasks'

export interface TaskState {
  tasks: Task[]
  pending: PendingDeletion[]
}

export type TaskAction =
  | { type: 'add'; draft: TaskDraft }
  | { type: 'toggle'; id: number }
  | { type: 'update'; id: number; changes: TaskDraft }
  | { type: 'requestDelete'; key: string; id: number; expiresAt: number }
  | { type: 'confirmDelete'; key: string }
  | { type: 'undoDelete'; key: string }
  | { type: 'clearCompleted'; key: string; expiresAt: number }
  | { type: 'reset'; tasks: Task[] }
  | { type: 'sync'; tasks: Task[] }

export function pendingTaskIds(pending: readonly PendingDeletion[]): Set<number> {
  return new Set(pending.flatMap((entry) => entry.taskIds))
}

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add':
      return { ...state, tasks: [createTask(state.tasks, action.draft), ...state.tasks] }

    case 'toggle':
      if (pendingTaskIds(state.pending).has(action.id)) return state
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, completed: !task.completed } : task,
        ),
      }

    case 'update':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, ...action.changes } : task,
        ),
      }

    case 'requestDelete': {
      const exists = state.tasks.some((task) => task.id === action.id)
      if (!exists || pendingTaskIds(state.pending).has(action.id)) return state
      return {
        ...state,
        pending: [
          ...state.pending,
          { key: action.key, kind: 'single', taskIds: [action.id], expiresAt: action.expiresAt },
        ],
      }
    }

    case 'clearCompleted': {
      const pendingIds = pendingTaskIds(state.pending)
      const taskIds = state.tasks
        .filter((task) => task.completed && !pendingIds.has(task.id))
        .map((task) => task.id)
      if (taskIds.length === 0) return state
      return {
        ...state,
        pending: [
          ...state.pending,
          { key: action.key, kind: 'completed', taskIds, expiresAt: action.expiresAt },
        ],
      }
    }

    case 'confirmDelete': {
      const entry = state.pending.find((item) => item.key === action.key)
      if (!entry) return state
      const removed = new Set(entry.taskIds)
      return {
        tasks: state.tasks.filter((task) => !removed.has(task.id)),
        pending: state.pending.filter((item) => item.key !== action.key),
      }
    }

    case 'undoDelete':
      return { ...state, pending: state.pending.filter((item) => item.key !== action.key) }

    case 'reset':
      return { tasks: action.tasks, pending: [] }

    case 'sync': {
      const ids = new Set(action.tasks.map((task) => task.id))
      const pending = state.pending
        .map((entry) => ({ ...entry, taskIds: entry.taskIds.filter((id) => ids.has(id)) }))
        .filter((entry) => entry.taskIds.length > 0)
      return { tasks: action.tasks, pending }
    }

    default: {
      const unknownAction: never = action
      return unknownAction
    }
  }
}
