import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  GRID_START_MIN,
  GRID_TOTAL_MIN,
  getWeekDates,
  getWeekStart,
  formatShortDate,
  parseTimeStr,
} from '../../utils/plannerUtils'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const HOUR_LABELS = Array.from({ length: 15 }, (_, i) => {
  const h = 8 + i
  const label = h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`
  return { label, minutes: h * 60 }
})

const GRID_HEIGHT = GRID_TOTAL_MIN

export default function WeeklyGrid({ modules }) {
  const [week, setWeek] = useState(0)
  const weekDates = getWeekDates(week)
  const weekStart = getWeekStart(week)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const sessionsPerDay = Array.from({ length: 7 }, () => [])

  for (const mod of modules) {
    if (!mod.crn || !mod.timetableEntry) continue
    for (const session of mod.timetableEntry.sessions) {
      const dayIndex = weekDates.indexOf(session.date)
      if (dayIndex === -1) continue
      sessionsPerDay[dayIndex].push({
        courseCode: mod.courseCode,
        crn: mod.crn,
        color: mod.color,
        startMin: parseTimeStr(session.start) - GRID_START_MIN,
        endMin: parseTimeStr(session.end) - GRID_START_MIN,
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-2 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <button
          onClick={() => setWeek(w => Math.max(0, w - 1))}
          disabled={week === 0}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="text-center">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Week {week}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            {formatShortDate(weekStart)} - {formatShortDate(weekEnd)}
          </span>
        </div>

        <button
          onClick={() => setWeek(w => w + 1)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex min-w-[640px]">
          <div className="w-12 shrink-0 flex flex-col">
            <div className="text-center py-1.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 invisible">Mon</span>
              <div className="text-xs text-gray-400 dark:text-gray-500 invisible">00/00</div>
            </div>
            <div className="relative" style={{ height: GRID_HEIGHT }}>
              {HOUR_LABELS.map(({ label, minutes }) => {
                const top = ((minutes - GRID_START_MIN) / GRID_TOTAL_MIN) * GRID_HEIGHT
                return (
                  <div key={label} className="absolute right-1 text-right" style={{ top: top - 8 }}>
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {DAY_LABELS.map((dayLabel, i) => (
            <div key={dayLabel} className="flex-1 flex flex-col min-w-0 border-l border-gray-100 dark:border-gray-800">
              <div className="text-center py-1.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{dayLabel}</span>
                <div className="text-xs text-gray-400 dark:text-gray-500">{weekDates[i] ? weekDates[i].slice(0, 5) : ''}</div>
              </div>

              <div className="relative flex-1" style={{ height: GRID_HEIGHT }}>
                {HOUR_LABELS.map(({ minutes }) => {
                  const top = ((minutes - GRID_START_MIN) / GRID_TOTAL_MIN) * GRID_HEIGHT
                  return (
                    <div
                      key={minutes}
                      className="absolute left-0 right-0 border-t border-gray-100 dark:border-gray-800"
                      style={{ top }}
                    />
                  )
                })}

                {sessionsPerDay[i].map((session, j) => {
                  const top = (session.startMin / GRID_TOTAL_MIN) * GRID_HEIGHT
                  const height = ((session.endMin - session.startMin) / GRID_TOTAL_MIN) * GRID_HEIGHT
                  return (
                    <div
                      key={j}
                      className="absolute rounded overflow-hidden flex flex-col justify-start p-1"
                      style={{
                        top,
                        height: Math.max(height, 20),
                        left: 2,
                        right: 2,
                        backgroundColor: session.color,
                        opacity: 0.9,
                      }}
                    >
                      <span className="text-white text-xs font-semibold leading-tight truncate">{session.courseCode}</span>
                      {height > 30 && <span className="text-white/80 text-xs leading-tight truncate">{session.crn}</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
