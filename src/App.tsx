import Header from './components/Header/Header'
import TaskFilters from './components/TaskFilters/TaskFilters'
import TaskForm from './components/TaskForm/TaskForm'
import TaskList from './components/TaskList/TaskList'
import TaskStats from './components/TaskStats/TaskStats'
import TaskToolbar from './components/TaskToolbar/TaskToolbar'
import ToastViewport from './components/Toast/ToastViewport'
import { useTaskContext } from './hooks/useTaskContext'
import { useTheme } from './hooks/useTheme'
import { getCategories } from './utils/tasks'
import './App.scss'

function App() {
  const { tasks, addTask } = useTaskContext()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const categories = getCategories(tasks)

  return (
    <div className={`app${isDark ? ' app--dark' : ''}`}>
      <div className="app__container">
        <Header />
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
      <ToastViewport />
    </div>
  )
}

export default App
