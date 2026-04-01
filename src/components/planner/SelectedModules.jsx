import { X, ChevronDown, Check } from 'lucide-react'

export default function SelectedModules({ modules, onRemove, onPickCRN }) {
  if (modules.length === 0) {
    return (
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">
        Search for a module above to add it
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {modules.map(({ courseCode, name, crn, color }) => (
        <li
          key={courseCode}
          className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 flex items-start gap-2"
        >
          <span className="mt-0.5 shrink-0 w-3 h-3 rounded-full" style={{ backgroundColor: color }} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{courseCode}</span>
            </div>
            {name && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{name}</p>}

            <button
              onClick={() => onPickCRN(courseCode)}
              className={`mt-1.5 inline-flex items-center gap-1 text-xs rounded px-2 py-0.5 transition-colors ${
                crn
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
              }`}
            >
              {crn ? (
                <>
                  <Check size={10} />
                  {crn}
                </>
              ) : (
                <>
                  Pick CRN
                  <ChevronDown size={10} />
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => onRemove(courseCode)}
            className="shrink-0 p-0.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded"
            aria-label={`Remove ${courseCode}`}
          >
            <X size={14} />
          </button>
        </li>
      ))}
    </ul>
  )
}
