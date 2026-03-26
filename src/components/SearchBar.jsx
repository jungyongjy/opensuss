import { Search, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const PHRASES = [
  'Search all SUSS portals and tools...',
  'Try "iStudy"...',
  'Try "grade calculator"...',
  'Try "exam timetable"...',
  'Try "library booking"...',
  'Try "course registration"...',
  'Try "STARS"...',
  'Try "financial aid"...',
]

function useTypingPlaceholder(active) {
  const [display, setDisplay] = useState(PHRASES[0])
  const phraseIndex = useRef(0)
  const charIndex = useRef(PHRASES[0].length)
  const deleting = useRef(false)
  const timeout = useRef(null)

  useEffect(() => {
    if (!active) {
      setDisplay(PHRASES[0])
      phraseIndex.current = 0
      charIndex.current = PHRASES[0].length
      deleting.current = false
      return
    }

    function tick() {
      const current = PHRASES[phraseIndex.current]
      if (deleting.current) {
        charIndex.current -= 1
        setDisplay(current.slice(0, charIndex.current))
        if (charIndex.current === 0) {
          deleting.current = false
          phraseIndex.current = (phraseIndex.current + 1) % PHRASES.length
          timeout.current = setTimeout(tick, 400)
        } else {
          timeout.current = setTimeout(tick, 35)
        }
      } else {
        charIndex.current += 1
        setDisplay(current.slice(0, charIndex.current))
        if (charIndex.current === current.length) {
          timeout.current = setTimeout(() => {
            deleting.current = true
            tick()
          }, 2000)
        } else {
          timeout.current = setTimeout(tick, 60)
        }
      }
    }

    timeout.current = setTimeout(tick, 1200)
    return () => clearTimeout(timeout.current)
  }, [active])

  return display
}

export default function SearchBar({ value, onChange }) {
  const [focused, setFocused] = useState(false)
  const animating = !value && !focused
  const placeholder = useTypingPlaceholder(animating)

  return (
    <div className="relative max-w-xl w-full mx-auto">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400 focus:border-transparent shadow-sm transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
