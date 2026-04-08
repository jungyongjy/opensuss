import { Link, useLocation } from 'react-router-dom'
import { Home, CalendarDays, Calculator, CalendarRange } from 'lucide-react'

const TABS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/academic-calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/planner', icon: CalendarRange, label: 'Planner' },
  { to: '/tools', icon: Calculator, label: 'Tools' },
]

export default function MobileBottomNav() {
  const { pathname } = useLocation()

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex">
      {TABS.map(({ to, icon: Icon, label }) => {
        const active = pathname === to
        return (
          <Link
            key={to}
            to={to}
            onClick={e => {
              if (active) {
                e.preventDefault()
              }
              scrollToTop()
            }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors ${
              active
                ? 'text-navy dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
