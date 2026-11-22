import { useState } from 'react'
import Header from './components/Header/Header'
import TaskFilters from './components/TaskFilters/TaskFilters'
import TaskForm from './components/TaskForm/TaskForm'
import TaskList from './components/TaskList/TaskList'
import TaskStats from './components/TaskStats/TaskStats'
import TaskToolbar from './components/TaskToolbar/TaskToolbar'
import { initialTasks } from './data/initialTasks'
import type { Task, TaskDraft, TaskFilter } from './types/task'
import { countTasks, createTask, matchesFilter, matchesSearch, sortByPriority } from './utils/tasks'
import './App.scss'

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const [filter, setFilter] = useState<TaskFilter>('all')

  const [isDark, setIsDark] = useState(false)
  const [search, setSearch] = useState('')
  const [prioritySort, setPrioritySort] = useState(false)

  const filteredTasks = tasks.filter(
    (task) => matchesFilter(task, filter) && matchesSearch(task, search),
  )
  const visibleTasks = prioritySort ? sortByPriority(filteredTasks) : filteredTasks
  const { total, completed, active } = countTasks(tasks)
  const categories = [...new Set(tasks.map((task) => task.category))].sort()

  function addTask(draft: TaskDraft) {
    setTasks((previous) => [createTask(previous, draft), ...previous])
  }

  function toggleTask(id: number) {
    setTasks((previous) =>
      previous.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    )
  }

  function deleteTask(id: number) {
    setTasks((previous) => previous.filter((task) => task.id !== id))
  }

  function clearCompleted() {
    setTasks((previous) => previous.filter((task) => !task.completed))
  }

  return (
    <div className={`app${isDark ? ' app--dark' : ''}`}>
      <div className="app__container">
        <Header isDark={isDark} onToggleTheme={() => setIsDark((previous) => !previous)} />
        <main className="app__main">
          <TaskForm categories={categories} onAdd={addTask} />
          <TaskStats tasks={tasks} />
          <section className="app__section" aria-labelledby="tasks-title">
            <h2 id="tasks-title" className="app__section-title">
              Завдання
            </h2>
            <TaskFilters
              value={filter}
              counts={{ all: total, completed, active }}
              onChange={setFilter}
            />
            <TaskToolbar
              search={search}
              sortByPriority={prioritySort}
              completedCount={completed}
              onSearchChange={setSearch}
              onSortChange={setPrioritySort}
              onClearCompleted={clearCompleted}
            />
            <TaskList
              tasks={visibleTasks}
              totalCount={tasks.length}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
