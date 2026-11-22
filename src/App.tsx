import { useState } from 'react'
import Header from './components/Header/Header'
import TaskList from './components/TaskList/TaskList'
import TaskStats from './components/TaskStats/TaskStats'
import { initialTasks } from './data/initialTasks'
import type { Task } from './types/task'
import './App.scss'

function App() {
  const [tasks] = useState<Task[]>(initialTasks)

  return (
    <div className="app">
      <div className="app__container">
        <Header />
        <main className="app__main">
          <TaskStats tasks={tasks} />
          <section className="app__section" aria-labelledby="tasks-title">
            <h2 id="tasks-title" className="app__section-title">
              Завдання
            </h2>
            <TaskList tasks={tasks} />
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
