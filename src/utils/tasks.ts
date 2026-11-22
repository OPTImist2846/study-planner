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

export const UNDO_DELAY_MS = 5000

const PRIORITY_VALUES: readonly string[] = ['low', 'medium', 'high']

export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'number' &&
    Number.isInteger(task.id) &&
    typeof task.title === 'string' &&
    task.title.trim() !== '' &&
    typeof task.description === 'string' &&
    typeof task.completed === 'boolean' &&
    typeof task.priority === 'string' &&
    PRIORITY_VALUES.includes(task.priority) &&
    typeof task.category === 'string'
  )
}

export function isTaskList(value: unknown): value is Task[] {
  return (
    Array.isArray(value) &&
    value.every(isTask) &&
    new Set(value.map((task) => task.id)).size === value.length
  )
}

export function activeTaskTitle(activeCount: number): string {
  const noun = activeCount === 1 ? 'active task' : 'active tasks'
  return `Study Planner — ${activeCount} ${noun}`
}

export function isTaskFilter(value: unknown): value is TaskFilter {
  return typeof value === 'string' && (FILTERS as readonly string[]).includes(value)
}

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

const PRIORITY_WEIGHT: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 }

export function matchesSearch(task: Task, query: string): boolean {
  const needle = query.trim().toLocaleLowerCase()
  return needle === '' || task.title.toLocaleLowerCase().includes(needle)
}

export function sortByPriority(tasks: readonly Task[]): Task[] {
  return [...tasks].sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority])
}

export function categoryHue(category: string): number {
  let hash = 0
  for (const char of category.toLocaleLowerCase()) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360
  }
  return hash
}

export function countTasks(tasks: readonly Task[]) {
  const completed = tasks.filter((task) => task.completed).length
  return { total: tasks.length, completed, active: tasks.length - completed }
}

export interface VisibleTaskOptions {
  filter: TaskFilter
  search: string
  prioritySort: boolean
}

export function getVisibleTasks(
  tasks: readonly Task[],
  { filter, search, prioritySort }: VisibleTaskOptions,
): Task[] {
  const filtered = tasks.filter(
    (task) => matchesFilter(task, filter) && matchesSearch(task, search),
  )
  return prioritySort ? sortByPriority(filtered) : filtered
}
