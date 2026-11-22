import { useCallback, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ThemeContext, type Theme } from './themeContext'

const THEME_STORAGE_KEY = 'study-planner:theme'

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

function preferredTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

interface ThemeProviderProps {
  children: ReactNode
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>(THEME_STORAGE_KEY, preferredTheme(), isTheme)

  const toggleTheme = useCallback(
    () => setTheme((previous) => (previous === 'dark' ? 'light' : 'dark')),
    [setTheme],
  )

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export default ThemeProvider
