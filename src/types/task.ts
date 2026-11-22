export type TaskPriority = 'low' | 'medium' | 'high'

export type TaskFilter = 'all' | 'active' | 'completed'

export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  priority: TaskPriority
  category: string
}

export type TaskDraft = Omit<Task, 'id' | 'completed'>

export type PendingDeletionKind = 'single' | 'completed'

export interface PendingDeletion {
  key: string
  kind: PendingDeletionKind
  taskIds: number[]
  expiresAt: number
}
