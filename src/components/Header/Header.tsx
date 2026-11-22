import { useTheme } from '../../hooks/useTheme'
import Button from '../Button/Button'
import './Header.scss'

function Header() {
  const { theme, toggleTheme: onToggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo" aria-hidden="true">
          SP
        </span>
        <div>
          <h1 className="header__title">Study Planner</h1>
          <p className="header__subtitle">Планувальник навчальних завдань</p>
        </div>
      </div>
      <Button size="small" aria-pressed={isDark} onClick={onToggleTheme}>
        {isDark ? 'Світла тема' : 'Темна тема'}
      </Button>
    </header>
  )
}

export default Header
