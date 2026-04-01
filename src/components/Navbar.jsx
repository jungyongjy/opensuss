import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Home, Calculator, CalendarDays, CalendarRange } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isTools = location.pathname === '/tools'
  const isCalendar = location.pathname === '/academic-calendar'
  const isPlanner = location.pathname === '/planner'
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const navLink = (to, Icon, label, active) => (
    <Link
      to={to}
      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
        active
          ? 'bg-suss-red/15 border border-suss-red/25 text-white'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon size={15} />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  )

  return (
    <nav className="md:sticky top-0 z-50 bg-navy dark:bg-gray-900 shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-lg tracking-tight text-white">
          OpenS<span className="text-suss-red">U</span>SS
        </Link>
        <div className="flex items-center gap-1">
          {navLink('/academic-calendar', CalendarDays, 'Calendar', isCalendar)}
          {navLink('/planner', CalendarRange, 'Planner', isPlanner)}
          {navLink('/tools', Calculator, 'Tools', isTools)}
          <button
            onClick={() => setDark(d => !d)}
            className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {!isHome && (
            <Link
              to="/"
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Home</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
