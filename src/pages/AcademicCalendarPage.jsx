import { useState } from 'react'
import { ExternalLink, CalendarDays } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CALENDARS = [
  {
    id: 'ft',
    label: 'Full-time UG',
    title: 'Full-time Undergraduate',
    description: 'Academic and event calendar for full-time undergraduate students.',
    href: 'https://www.suss.edu.sg/docs/default-source/content-academics/academic-calendar_ft-2026.pdf',
  },
  {
    id: 'pt',
    label: 'Part-time UG',
    title: 'Part-time Undergraduate',
    description: 'Academic and event calendar for part-time undergraduate students.',
    href: 'https://www.suss.edu.sg/docs/default-source/dept_s-r-a/academic-calendar_pt-2026_251217.pdf',
  },
  {
    id: 'law',
    label: 'Law',
    title: 'School of Law',
    description: 'Academic and event calendar for School of Law students.',
    href: 'https://www.suss.edu.sg/docs/default-source/dept_s-r-a/academic-calendar_law-2026_250507.pdf?sfvrsn=a03271e1_14',
  },
  {
    id: 'postgrad',
    label: 'Postgrad',
    title: 'Graduate Programmes',
    description: 'Academic and event calendar for graduate and postgraduate students.',
    href: 'https://www.suss.edu.sg/docs/default-source/dept_gs/academic-calendar_grad-2026_v2.pdf',
  },
]

const ALL_CALENDARS_URL = 'https://www.suss.edu.sg/life-at-suss/onboarding/matriculation/academic-calendar'

export default function AcademicCalendarPage() {
  const [activeId, setActiveId] = useState('ft')
  const active = CALENDARS.find((c) => c.id === activeId)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />

      <header
        className="relative bg-navy dark:bg-gray-900 text-white py-10 px-4 overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-suss-red" />
        <div className="relative max-w-6xl mx-auto flex items-center gap-5">
          <div className="rounded-xl p-3.5 shrink-0 bg-white/10">
            <CalendarDays size={28} className="text-white/80" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Academic Calendar</h1>
            <p className="text-white/60 text-sm mt-1">Key dates and events for 2026</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CALENDARS.map((cal) => (
            <button
              key={cal.id}
              onClick={() => setActiveId(cal.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeId === cal.id
                  ? 'bg-navy dark:bg-blue-700 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-navy dark:hover:border-blue-400 hover:text-navy dark:hover:text-blue-400'
              }`}
            >
              {cal.label}
            </button>
          ))}
        </div>

        {/* Active tab content */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 flex flex-col gap-6 max-w-lg">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{active.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{active.description}</p>
          </div>

          <a
            href={active.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start bg-navy dark:bg-blue-700 hover:bg-navy/90 dark:hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Open Calendar
            <ExternalLink size={14} />
          </a>

          <a
            href={ALL_CALENDARS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-navy dark:hover:text-blue-400 transition-colors self-start"
          >
            View all calendars on SUSS website
            <ExternalLink size={12} />
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
