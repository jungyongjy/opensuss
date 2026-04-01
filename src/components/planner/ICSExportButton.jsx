import { Download } from 'lucide-react'
import { generateICS } from '../../utils/plannerUtils'

export default function ICSExportButton({ modules }) {
  const lockedCount = modules.filter(m => m.crn).length
  const disabled = lockedCount === 0

  function handleExport() {
    const icsContent = generateICS(modules)
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'opensuss-planner-jul2026.ics'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
        disabled
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          : 'bg-navy dark:bg-blue-700 hover:bg-navy/90 dark:hover:bg-blue-600 text-white'
      }`}
    >
      <Download size={14} />
      Export to Calendar
      {lockedCount > 0 && (
        <span className="text-xs opacity-70">({lockedCount} module{lockedCount > 1 ? 's' : ''})</span>
      )}
    </button>
  )
}
