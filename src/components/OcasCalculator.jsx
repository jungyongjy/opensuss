import { useState, useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { scoreToGrade } from '../utils/gradeScale'

function newComponent(weight = 0) {
  return { id: crypto.randomUUID(), name: '', weight, score: '' }
}

function ResultBadge({ pass, passLabel, failLabel }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
      pass
        ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
        : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
    }`}>
      {pass ? passLabel : failLabel}
    </span>
  )
}

export default function OcasCalculator() {
  const [caWeight, setCaWeight] = useState(40)
  const [components, setComponents] = useState([
    { id: crypto.randomUUID(), name: 'Assignment', weight: 60, score: '' },
    { id: crypto.randomUUID(), name: 'Participation', weight: 40, score: '' },
  ])
  const [examScore, setExamScore] = useState('')

  const examWeight = 100 - Number(caWeight)
  const totalCompWeight = components.reduce((sum, c) => sum + Number(c.weight), 0)
  const weightsValid = totalCompWeight === 100

  // Components with scores filled
  const scoredComponents = components.filter(c => c.score !== '' && c.score !== null)
  const unscoredWeight = components
    .filter(c => c.score === '' || c.score === null)
    .reduce((sum, c) => sum + Number(c.weight), 0)
  const allScored = scoredComponents.length === components.length && components.length > 0

  // Partial OCAS from scored components
  const partialOCAS = useMemo(() => {
    if (scoredComponents.length === 0) return null
    return scoredComponents.reduce((sum, c) => sum + Number(c.score) * Number(c.weight) / 100, 0)
  }, [scoredComponents])

  // Full OCAS (only when all scored)
  const ocas = allScored ? partialOCAS : null

  // What score is needed on remaining components to pass OCAS (>=40)
  const neededOnRemaining = useMemo(() => {
    if (allScored || partialOCAS === null || unscoredWeight === 0) return null
    const needed = (40 - partialOCAS) / (unscoredWeight / 100)
    return needed
  }, [allScored, partialOCAS, unscoredWeight])

  const ocasPass = ocas !== null ? ocas >= 40 : null
  const examPass = examScore !== '' ? Number(examScore) >= 40 : null

  const finalScore = useMemo(() => {
    if (ocas === null || examScore === '') return null
    return ocas * (Number(caWeight) / 100) + Number(examScore) * (examWeight / 100)
  }, [ocas, examScore, caWeight, examWeight])

  const finalGrade = finalScore !== null ? scoreToGrade(finalScore) : null
  const modulePassed = finalGrade && ocasPass && examPass

  function updateComponent(id, field, value) {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }
  function addComponent() { setComponents(prev => [...prev, newComponent()]) }
  function removeComponent(id) {
    if (components.length === 1) return
    setComponents(prev => prev.filter(c => c.id !== id))
  }
  function reset() {
    setComponents([
      { id: crypto.randomUUID(), name: 'Assignment', weight: 60, score: '' },
      { id: crypto.randomUUID(), name: 'Participation', weight: 40, score: '' },
    ])
    setCaWeight(40)
    setExamScore('')
  }

  return (
    <div className="space-y-6">
      {/* Module split */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Module Weightings</h3>
          <button onClick={reset} className="text-xs text-gray-400 hover:text-suss-red transition-colors">Reset</button>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                CA component (%)
              </label>
              <input
                type="number" min="1" max="99"
                value={caWeight}
                onChange={e => setCaWeight(Math.min(99, Math.max(1, Number(e.target.value))))}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                Exam component (%)
              </label>
              <input
                type="number" disabled value={examWeight}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Visual split bar */}
          <div className="mt-4 h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex">
            <div
              className="bg-navy dark:bg-blue-500 transition-all duration-200"
              style={{ width: `${caWeight}%` }}
            />
            <div className="flex-1 bg-suss-red/70" />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>CA {caWeight}%</span>
            <span>Exam {examWeight}%</span>
          </div>
        </div>
      </div>

      {/* CA components */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">CA Components</h3>
            <p className="text-xs text-gray-400 mt-0.5">Weights = % of the CA portion (must sum to 100%)</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            weightsValid
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
          }`}>
            {totalCompWeight}% / 100%
          </span>
        </div>

        <div className="p-4 space-y-2">
          <div className="grid grid-cols-[1fr_90px_90px_32px] gap-2 px-1">
            <p className="text-xs font-medium text-gray-400">Component</p>
            <p className="text-xs font-medium text-gray-400 text-center">Weight (%)</p>
            <p className="text-xs font-medium text-gray-400 text-center">Score (/100)</p>
            <span />
          </div>

          {components.map(comp => (
            <div key={comp.id} className="grid grid-cols-[1fr_90px_90px_32px] gap-2 items-center">
              <input
                type="text"
                value={comp.name}
                onChange={e => updateComponent(comp.id, 'name', e.target.value)}
                placeholder="e.g. Assignment 1"
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
              />
              <input
                type="number" min="0" max="100"
                value={comp.weight}
                onChange={e => updateComponent(comp.id, 'weight', Number(e.target.value))}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
              />
              <input
                type="number" min="0" max="100" step="0.1"
                value={comp.score}
                onChange={e => updateComponent(comp.id, 'score', e.target.value)}
                placeholder="—"
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
              />
              <button
                onClick={() => removeComponent(comp.id)}
                disabled={components.length === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-suss-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <button
            onClick={addComponent}
            className="flex items-center gap-1.5 text-sm text-navy dark:text-blue-400 hover:opacity-75 font-medium transition-opacity mt-1"
          >
            <Plus size={16} />
            Add component
          </button>
        </div>
      </div>

      {/* OCAS result */}
      {(ocas !== null || (partialOCAS !== null && !allScored)) && (
        <div className={`rounded-xl border p-5 ${
          ocas !== null
            ? ocasPass
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                {allScored ? 'OCAS Score' : 'Partial OCAS (so far)'}
              </p>
              <p className={`text-4xl font-bold ${
                ocas !== null
                  ? ocasPass ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-400'
                  : 'text-amber-700 dark:text-amber-300'
              }`}>
                {(ocas ?? partialOCAS).toFixed(1)}%
              </p>
            </div>
            {ocasPass !== null && (
              <ResultBadge
                pass={ocasPass}
                passLabel="✓ Eligible to sit exam"
                failLabel="✗ Barred from exam"
              />
            )}
          </div>

          {!allScored && neededOnRemaining !== null && (
            <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-700">
              {neededOnRemaining > 100 ? (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  ⚠ Even scoring 100% on remaining components won't bring OCAS to 40%.
                </p>
              ) : neededOnRemaining <= 0 ? (
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  ✓ You'll pass OCAS regardless of remaining component scores.
                </p>
              ) : (
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  You need an average of <strong>{neededOnRemaining.toFixed(1)}%</strong> on your remaining unscored components to meet the OCAS threshold.
                </p>
              )}
            </div>
          )}

          {ocas !== null && !ocasPass && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
              OCAS must be ≥ 40% to sit the final exam. You cannot pass this module.
            </p>
          )}
        </div>
      )}

      {/* Exam score */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Exam Score</h3>
          {examPass !== null && (
            <ResultBadge
              pass={examPass}
              passLabel="✓ Pass threshold met"
              failLabel="✗ Below 40% — module fail"
            />
          )}
        </div>
        <input
          type="number" min="0" max="100" step="0.1"
          value={examScore}
          onChange={e => setExamScore(e.target.value)}
          placeholder="Enter your exam score (0–100)"
          className="w-full sm:w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
        />
      </div>

      {/* Final result */}
      {finalScore !== null && (
        <div
          className="rounded-xl text-white p-6 relative overflow-hidden"
          style={{
            background: modulePassed
              ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
              : 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
          }}
        >
          <p className="text-white/60 text-sm mb-1">Final Module Score</p>
          <div className="flex items-end gap-4 flex-wrap">
            <p className="text-5xl font-bold tracking-tight">{finalScore.toFixed(1)}%</p>
            {finalGrade && (
              <div className="mb-0.5">
                <span className="text-3xl font-bold text-white/90">{finalGrade.grade}</span>
                <span className="text-white/50 text-sm ml-2">{finalGrade.points.toFixed(1)} pts</span>
              </div>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-white/20">
            {modulePassed ? (
              <p className="text-sm text-white/80 font-medium">✓ Module passed</p>
            ) : (
              <p className="text-sm text-red-200 font-medium">
                ✗ Module not passed —{' '}
                {!ocasPass && !examPass ? 'OCAS and exam both below 40%' :
                  !ocasPass ? 'OCAS below 40%' : 'Exam score below 40%'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
