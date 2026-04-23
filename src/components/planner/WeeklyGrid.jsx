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

function TimeColumn() {
  return (
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
  )
}

function DayColumn({ dayLabel, dateLabel, sessions }) {
  return (
    <div className="flex-1 flex flex-col min-w-0 border-l border-gray-100 dark:border-gray-800">
      <div className="text-center py-1.5 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{dayLabel}</span>
        <div className="text-xs text-gray-400 dark:text-gray-500">{dateLabel}</div>
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

        {sessions.map((session, j) => {
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
  )
}

export default function WeeklyGrid({ modules }) {
  const [week, setWeek] = useState(0)
  const [dayOffset, setDayOffset] = useState(0)
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

  const canShiftLeft = dayOffset > 0
  const canShiftRight = dayOffset < DAY_LABELS.length - 2
  const visibleDayIndexes = [dayOffset, dayOffset + 1]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-2 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <button
          onClick={() => {
            setWeek(w => Math.max(0, w - 1))
            setDayOffset(0)
          }}
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
          onClick={() => {
            setWeek(w => w + 1)
            setDayOffset(0)
          }}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/50">
        <button
          type="button"
          onClick={() => setDayOffset(v => Math.max(0, v - 1))}
          disabled={!canShiftLeft}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Show earlier days"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {DAY_LABELS[visibleDayIndexes[0]]} to {DAY_LABELS[visibleDayIndexes[1]]}
        </div>

        <button
          type="button"
          onClick={() => setDayOffset(v => Math.min(DAY_LABELS.length - 2, v + 1))}
          disabled={!canShiftRight}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Show later days"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="hidden md:flex min-w-[640px]">
          <TimeColumn />
          {DAY_LABELS.map((dayLabel, i) => (
            <DayColumn
              key={dayLabel}
              dayLabel={dayLabel}
              dateLabel={weekDates[i] ? weekDates[i].slice(0, 5) : ''}
              sessions={sessionsPerDay[i]}
            />
          ))}
        </div>

        <div className="md:hidden flex">
          <TimeColumn />
          <div className="flex-1 grid grid-cols-2">
            {visibleDayIndexes.map(i => {
              const dayLabel = DAY_LABELS[i]
              return (
                <DayColumn
                  key={dayLabel}
                  dayLabel={dayLabel}
                  dateLabel={weekDates[i] ? weekDates[i].slice(0, 5) : ''}
                  sessions={sessionsPerDay[i]}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
