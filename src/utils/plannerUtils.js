export const MODULE_COLORS = [
  '#4f46e5',
  '#0891b2',
  '#059669',
  '#d97706',
  '#dc2626',
  '#7c3aed',
  '#db2777',
  '#0284c7',
  '#65a30d',
  '#9333ea',
]

export const SEMESTER_START = new Date(2026, 7, 3)

export const GRID_START_MIN = 8 * 60
export const GRID_END_MIN = 22 * 60 + 30
export const GRID_TOTAL_MIN = GRID_END_MIN - GRID_START_MIN

export function parseTimeStr(timeStr) {
  const [timePart, period] = timeStr.split(' ')
  let [h, m] = timePart.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return h * 60 + m
}

export function parseDateStr(dateStr) {
  const [d, m, y] = dateStr.split('/').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0')
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  return `${d}/${m}/${date.getFullYear()}`
}

export function getWeekStart(weekNumber) {
  const d = new Date(SEMESTER_START)
  d.setDate(d.getDate() + weekNumber * 7)
  return d
}

export function getWeekDates(weekNumber) {
  const monday = getWeekStart(weekNumber)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return formatDate(d)
  })
}

export function formatShortDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function searchModules(query, dayData, eveningData, moduleData, excludedCodes = []) {
  if (!query.trim()) return []
  const q = query.trim().toLowerCase()

  const nameMap = {}
  for (const m of moduleData) {
    nameMap[m.code] = m.name
  }

  const seen = new Set()
  const allEntries = [...dayData, ...eveningData]
  for (const entry of allEntries) {
    seen.add(entry.courseCode)
  }

  const results = []
  for (const code of seen) {
    if (excludedCodes.includes(code)) continue
    const name = nameMap[code] || ''
    const codeMatch = code.toLowerCase().includes(q)
    const nameMatch = name.toLowerCase().includes(q)
    if (codeMatch || nameMatch) {
      results.push({ courseCode: code, name })
    }
  }

  results.sort((a, b) => {
    const aPrefix = a.courseCode.toLowerCase().startsWith(q) ? 0 : 1
    const bPrefix = b.courseCode.toLowerCase().startsWith(q) ? 0 : 1
    if (aPrefix !== bPrefix) return aPrefix - bPrefix
    return a.courseCode.localeCompare(b.courseCode)
  })

  return results.slice(0, 10)
}

export function getCRNsForModule(courseCode, dayData, eveningData) {
  return [...dayData, ...eveningData].filter(e => e.courseCode === courseCode)
}

export function detectClashes(lockedEntries, candidate) {
  const clashes = []
  for (const locked of lockedEntries) {
    for (const cs of candidate.sessions) {
      for (const ls of locked.sessions) {
        if (cs.date !== ls.date) continue
        const csStart = parseTimeStr(cs.start)
        const csEnd = parseTimeStr(cs.end)
        const lsStart = parseTimeStr(ls.start)
        const lsEnd = parseTimeStr(ls.end)
        if (!(csEnd <= lsStart || csStart >= lsEnd)) {
          clashes.push({ courseCode: locked.courseCode, crn: locked.crn })
          break
        }
      }
      if (clashes.find(c => c.courseCode === locked.courseCode && c.crn === locked.crn)) break
    }
  }
  return clashes
}

export function generateICS(selectedModules) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OpenSUSS//Module Planner//EN',
    'CALSCALE:GREGORIAN',
  ]

  for (const mod of selectedModules) {
    if (!mod.crn || !mod.timetableEntry) continue
    const { courseCode, name, crn, timetableEntry } = mod
    const school = timetableEntry.school || ''
    const mode = timetableEntry.deliveryMode || ''

    for (const session of timetableEntry.sessions) {
      const dtStart = toICSDateTime(session.date, session.start)
      const dtEnd = toICSDateTime(session.date, session.end)
      lines.push(
        'BEGIN:VEVENT',
        `SUMMARY:${courseCode} (${crn}) - ${name}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `DESCRIPTION:${school} - ${mode}`,
        `UID:${courseCode}-${crn}-${session.date.replace(/\//g, '')}@opensuss`,
        'END:VEVENT'
      )
    }
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

function toICSDateTime(dateStr, timeStr) {
  const [d, m, y] = dateStr.split('/').map(Number)
  const totalMin = parseTimeStr(timeStr)
  const h = Math.floor(totalMin / 60).toString().padStart(2, '0')
  const min = (totalMin % 60).toString().padStart(2, '0')
  return `${y}${m.toString().padStart(2, '0')}${d.toString().padStart(2, '0')}T${h}${min}00`
}
