import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import TaskProvider from './context/TaskProvider'
import ThemeProvider from './context/ThemeProvider'
import './styles/global.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </ThemeProvider>
  </StrictMode>,
)
