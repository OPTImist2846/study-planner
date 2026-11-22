import { createContext } from 'react'
import type { PendingDeletion, Task, TaskDraft, TaskFilter } from '../types/task'

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
}

export const TaskContext = createContext<TaskContextValue | null>(null)
