import { X, Lock } from 'lucide-react'
import { getCRNsForModule, detectClashes } from '../../utils/plannerUtils'

export default function CRNPickerModal({
  courseCode,
  moduleName,
  dayData,
  eveningData,
  lockedEntries,
  onSelect,
  onClose,
}) {
  const entries = getCRNsForModule(courseCode, dayData, eveningData)

  function getRepresentativeSlot(entry) {
    if (!entry.sessions || entry.sessions.length === 0) return { day: '-', time: '-' }
    if (entry.weekPattern === 'irregular') {
      return { day: 'Mixed', time: entry.sessions[0].start.replace(':00 ', ' ') }
    }
    const s = entry.sessions[0]
    const startTime = s.start.replace(':00:00', '').replace(':00 ', ' ')
    const endTime = s.end.replace(':00:00', '').replace(':00 ', ' ')
    return {
      day: s.day.charAt(0) + s.day.slice(1).toLowerCase(),
      time: `${startTime} - ${endTime}`,
    }
  }

  function formatMode(mode) {
    if (!mode) return '-'
    if (mode === 'FACE-TO-FACE') return 'F2F'
    if (mode === 'ONLINE') return 'Online'
    return mode
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-start justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="font-display text-base font-bold text-gray-900 dark:text-gray-100">Pick a CRN for {courseCode}</h2>
            {moduleName && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{moduleName}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
              <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                <th className="text-left px-5 py-2.5">CRN</th>
                <th className="text-left px-3 py-2.5">Day</th>
                <th className="text-left px-3 py-2.5">Time</th>
                <th className="text-left px-3 py-2.5">Mode</th>
                <th className="text-left px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {entries.map(entry => {
                const clashes = detectClashes(lockedEntries, entry)
                const hasClash = clashes.length > 0
                const slot = getRepresentativeSlot(entry)

                return (
                  <tr
                    key={entry.crn}
                    onClick={() => !hasClash && (onSelect(entry), onClose())}
                    className={`transition-colors ${
                      hasClash
                        ? 'opacity-40 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <td className="px-5 py-3 font-mono font-medium text-gray-900 dark:text-gray-100">{entry.crn}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{slot.day}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{slot.time}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{formatMode(entry.deliveryMode)}</td>
                    <td className="px-3 py-3">
                      {hasClash ? (
                        <span className="inline-flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                          <Lock size={10} />
                          {clashes[0].courseCode} {clashes[0].crn}
                        </span>
                      ) : (
                        <span className="text-xs text-green-600 dark:text-green-400">Available</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {entries.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">No CRNs available for this module</p>
          )}
        </div>
      </div>
    </div>
  )
}
