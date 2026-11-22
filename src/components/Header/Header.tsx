import './Header.scss'

function Header() {
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
    </header>
  )
}

export default Header
