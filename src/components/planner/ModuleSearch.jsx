import { useState, useRef, useEffect } from 'react'
import { Search, Plus } from 'lucide-react'
import { searchModules } from '../../utils/plannerUtils'

export default function ModuleSearch({ dayData, eveningData, moduleData, excludedCodes, onAdd }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  const results = searchModules(query, dayData, eveningData, moduleData, excludedCodes)

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(courseCode, name) {
    onAdd(courseCode, name)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search module code or name..."
          className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy/30 dark:focus:ring-blue-500/30"
        />
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
          {results.map(({ courseCode, name }) => (
            <li key={courseCode}>
              <button
                onClick={() => handleSelect(courseCode, name)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus size={13} className="text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{courseCode}</span>
                  {name && <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 truncate">{name}</span>}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg px-3 py-3 text-sm text-gray-400 text-center">
          No modules found
        </div>
      )}
    </div>
  )
}
