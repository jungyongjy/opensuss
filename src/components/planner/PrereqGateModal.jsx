import { useMemo, useState } from 'react'
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
  const hasExclusions = excludedCombinations.length > 0
  const hasPrereqs = prereqs.length > 0
  const [step, setStep] = useState(hasExclusions ? 'exclusion' : 'prereq')

  const title = useMemo(() => {
    if (step === 'exclusion') return 'Check Excluded Combinations'
    return 'Check Prerequisites'
  }, [step])

  function handleExcludeYes() {
    onClose()
  }

  function handleExcludeNo() {
    if (hasPrereqs) {
      setStep('prereq')
      return
    }
    onConfirm()
    onClose()
  }

  function handlePrereqResponse() {
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
            <h2 className="font-display text-base font-bold text-gray-900 dark:text-gray-100">{title}</h2>
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
          {step === 'exclusion' ? (
            <>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                {excludedCombinations.length === 1 ? (
                  <>
                    <strong>{excludedCombinations[0]}</strong> was detected as a related course. Have you taken it
                    before? If yes, you may not need <strong>{courseCode}</strong>.
                  </>
                ) : (
                  <>
                    These related courses were detected: {renderCodeList(excludedCombinations, 'or')}. Have you taken
                    any of them? If yes, you may not need <strong>{courseCode}</strong>.
                  </>
                )}
              </p>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={handleExcludeYes}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Yes, I've taken one
                </button>
                <button
                  onClick={handleExcludeNo}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-navy dark:bg-blue-700 hover:bg-navy/90 dark:hover:bg-blue-600 text-white transition-colors"
                >
                  No
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                {prereqs.length === 1 ? (
                  <>
                    <strong>{prereqs[0]}</strong> was detected as a prerequisite-related course. Have you completed it?
                  </>
                ) : (
                  <>
                    {renderCodeList(prereqs)} were detected as prerequisite-related courses. Have you completed any of
                    these?
                  </>
                )}
              </p>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={handlePrereqResponse}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  No / I'm planning ahead
                </button>
                <button
                  onClick={handlePrereqResponse}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-navy dark:bg-blue-700 hover:bg-navy/90 dark:hover:bg-blue-600 text-white transition-colors"
                >
                  Yes, I've completed one or more
                </button>
              </div>
            </>
          )}
        </div>

        <div className="px-5 pb-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Note: This data is extracted from the publicly available curriculum and may not reflect recent updates. Always verify against your official curriculum plan at{' '}
            <a
              href="https://sims1.suss.edu.sg/eservice/public/viewcp/viewcp.aspx?progcd=BAS-MAJ1&viewtype=mhtml"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 dark:hover:text-gray-300"
            >
              SUSS Curriculum
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
