import { createContext } from 'react'
import type { PendingDeletion, Task, TaskDraft, TaskFilter, ToastMessage } from '../types/task'

export interface TaskContextValue {
  tasks: Task[]
  pending: PendingDeletion[]
  pendingKeyByTask: ReadonlyMap<number, string>
  filter: TaskFilter
  setFilter: (filter: TaskFilter) => void
  search: string
  setSearch: (search: string) => void
  prioritySort: boolean
  setPrioritySort: (value: boolean) => void
  addTask: (draft: TaskDraft) => void
  updateTask: (id: number, changes: TaskDraft) => void
  toggleTask: (id: number) => void
  requestDelete: (id: number) => void
  undoDelete: (key: string) => void
  clearCompleted: () => void
  resetTasks: () => void
  toasts: ToastMessage[]
  dismissToast: (id: number) => void
}

export const TaskContext = createContext<TaskContextValue | null>(null)
