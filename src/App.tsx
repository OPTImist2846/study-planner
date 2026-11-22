import { useState } from 'react'
import Header from './components/Header/Header'
import TaskForm from './components/TaskForm/TaskForm'
import TaskList from './components/TaskList/TaskList'
import TaskStats from './components/TaskStats/TaskStats'
import { initialTasks } from './data/initialTasks'
import type { Task, TaskDraft } from './types/task'
import { createTask } from './utils/tasks'
import './App.scss'

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

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

  return (
    <div className="app">
      <div className="app__container">
        <Header />
        <main className="app__main">
          <TaskForm categories={categories} onAdd={addTask} />
          <TaskStats tasks={tasks} />
          <section className="app__section" aria-labelledby="tasks-title">
            <h2 id="tasks-title" className="app__section-title">
              Завдання
            </h2>
            <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
