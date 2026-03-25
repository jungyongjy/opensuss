import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Home } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
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
          SUSS Links
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(d => !d)}
            className="text-white/80 hover:text-white transition-colors p-1"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {!isHome && (
            <Link
              to="/"
              className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
            >
              <Home size={16} />
              Home
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
