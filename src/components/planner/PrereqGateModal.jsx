import { X } from 'lucide-react'

function renderCodeList(codes, conjunction = 'and') {
  if (!codes || codes.length === 0) return null
  if (codes.length === 1) return <strong>{codes[0]}</strong>
  if (codes.length === 2) {
    return (
      <>
        <strong>{codes[0]}</strong> {conjunction} <strong>{codes[1]}</strong>
      </>
    )
  }
  return (
    <>
      {codes.map((code, idx) => (
        <span key={code}>
          <strong>{code}</strong>
          {idx < codes.length - 2 ? ', ' : idx === codes.length - 2 ? ` ${conjunction} ` : ''}
        </span>
      ))}
    </>
  )
}

export default function PrereqGateModal({
  courseCode,
  moduleName,
  prereqs = [],
  excludedCombinations = [],
  onConfirm,
  onClose,
}) {
  const detected = Array.from(new Set([...(prereqs || []), ...(excludedCombinations || [])]))

  function handleAddAnyway() {
    onConfirm()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-start justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="font-display text-base font-bold text-gray-900 dark:text-gray-100">
              Prerequisite or excluded combination detected
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Adding <strong>{courseCode}</strong>
              {moduleName ? ` - ${moduleName}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-3">
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              Either a prerequisite or excluded combination was detected for <strong>{courseCode}</strong>.
            </p>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <p>
                <strong>Prerequisite:</strong> Modules that must be taken before this course.
              </p>
              <p>
                <strong>Excluded combination:</strong> If you have taken this, you cannot take this selected course.
              </p>
            </div>
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              Detected related modules: {renderCodeList(detected, 'or')}.
            </p>
          </div>

          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Please check your{' '}
            <a
              href="https://www.suss.edu.sg/academics/why-suss/new-suss-curriculum"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-gray-700 dark:hover:text-gray-200"
            >
              curriculum plan
            </a>{' '}
            to confirm whether this module is required before finalising your selection.
          </p>

          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handleAddAnyway}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-navy dark:bg-blue-700 hover:bg-navy/90 dark:hover:bg-blue-600 text-white transition-colors"
            >
              Add module anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
