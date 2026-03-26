import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Home, Calculator, CalendarDays } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isTools = location.pathname === '/tools'
  const isCalendar = location.pathname === '/academic-calendar'
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

  return (
    <nav className="sticky top-0 z-50 bg-navy dark:bg-gray-900 shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-lg tracking-tight">
          OpenS<span className="text-suss-red">U</span>SS
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/academic-calendar"
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
              isCalendar
                ? 'bg-white/15 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <CalendarDays size={15} />
            <span className="hidden sm:inline">Calendar</span>
          </Link>
          <Link
            to="/tools"
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
              isTools
                ? 'bg-white/15 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Calculator size={15} />
            <span className="hidden sm:inline">Tools</span>
          </Link>
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
