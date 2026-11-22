import type { Task, TaskDraft, TaskFilter, TaskPriority } from '../types/task'

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
}

export const PRIORITIES: readonly TaskPriority[] = ['high', 'medium', 'low']

export const FILTER_LABELS: Record<TaskFilter, string> = {
  all: 'Всі',
  active: 'Не виконані',
  completed: 'Виконані',
}

export const FILTERS: readonly TaskFilter[] = ['all', 'active', 'completed']

export function nextTaskId(tasks: readonly Task[]): number {
  return tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1
}

export function createTask(tasks: readonly Task[], draft: TaskDraft): Task {
  return { ...draft, id: nextTaskId(tasks), completed: false }
}

export function matchesFilter(task: Task, filter: TaskFilter): boolean {
  if (filter === 'active') return !task.completed
  if (filter === 'completed') return task.completed
  return true
}

export function countTasks(tasks: readonly Task[]) {
  const completed = tasks.filter((task) => task.completed).length
  return { total: tasks.length, completed, active: tasks.length - completed }
}
