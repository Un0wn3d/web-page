import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '/store/slices/uiSlice'

function Layout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme = useSelector(s => s.ui.theme)

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <button className="brand" onClick={() => navigate('/')}>
            <span className="brand-icon">🌿</span>
            <div>
              <span className="brand-title">EcoToloka</span>
              <span className="brand-sub">Clean-up Events</span>
            </div>
          </button>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
              Події
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>
              📊 Аналітика
            </NavLink>
            <button className="theme-toggle" onClick={() => dispatch(toggleTheme())} title="Змінити тему">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </nav>
        </div>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>© 2026 EcoToloka — разом за чисте довкілля 🌱</p>
      </footer>
    </div>
  )
}

export default Layout