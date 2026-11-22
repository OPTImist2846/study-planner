import { useState } from 'react'
import Header from './components/Header/Header'
import TaskFilters from './components/TaskFilters/TaskFilters'
import TaskForm from './components/TaskForm/TaskForm'
import TaskList from './components/TaskList/TaskList'
import TaskStats from './components/TaskStats/TaskStats'
import TaskToolbar from './components/TaskToolbar/TaskToolbar'
import { useTaskContext } from './hooks/useTaskContext'
import './App.scss'

function App() {
  const { tasks, addTask } = useTaskContext()
  const [isDark, setIsDark] = useState(false)

  const categories = [...new Set(tasks.map((task) => task.category))].sort()

  return (
    <div className={`app${isDark ? ' app--dark' : ''}`}>
      <div className="app__container">
        <Header isDark={isDark} onToggleTheme={() => setIsDark((previous) => !previous)} />
        <main className="app__main">
          <TaskForm categories={categories} onSubmit={addTask} />
          <TaskStats />
          <section className="app__section" aria-labelledby="tasks-title">
            <h2 id="tasks-title" className="app__section-title">
              Завдання
            </h2>
            <TaskFilters />
            <TaskToolbar />
            <TaskList />
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
