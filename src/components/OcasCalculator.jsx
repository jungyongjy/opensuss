import { useState, useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { scoreToGrade } from '../utils/gradeScale'

const COMPONENT_TYPES = [
  'TMA',
  'GBA',
  'PCQ',
  'Quiz',
  'Class Participation',
  'Class Test',
  'ECA',
  'Others',
]

function newComponent() {
  return { id: crypto.randomUUID(), type: 'TMA', customName: '', weight: 20, score: '' }
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
  const [components, setComponents] = useState([
    { id: crypto.randomUUID(), type: 'TMA', customName: '', weight: 20, score: '' },
    { id: crypto.randomUUID(), type: 'TMA', customName: '', weight: 20, score: '' },
    { id: crypto.randomUUID(), type: 'Class Participation', customName: '', weight: 10, score: '' },
  ])
  const [examScore, setExamScore] = useState('')

  // Total CA weight = sum of all component weights
  const totalCAWeight = components.reduce((sum, c) => sum + Number(c.weight), 0)
  const examWeight = Math.max(0, 100 - totalCAWeight)
  const is100CA = totalCAWeight >= 100
  const is0CA = totalCAWeight === 0

  const scoredComponents = components.filter(c => c.score !== '' && c.score !== null)
  const allScored = scoredComponents.length === components.length && components.length > 0

  // OCAS = Σ(score × weight) / Σ(weight), rounded to nearest integer
  // Partial OCAS from scored components only (same formula)
  const { ocas, partialOCAS, partialWeight } = useMemo(() => {
    if (scoredComponents.length === 0) return { ocas: null, partialOCAS: null, partialWeight: 0 }
    const sumScoreWeight = scoredComponents.reduce((sum, c) => sum + Number(c.score) * Number(c.weight), 0)
    const sumWeight = scoredComponents.reduce((sum, c) => sum + Number(c.weight), 0)
    const raw = sumWeight > 0 ? sumScoreWeight / sumWeight : 0
    const rounded = Math.round(raw)
    return {
      ocas: allScored ? rounded : null,
      partialOCAS: rounded,
      partialWeight: sumWeight,
    }
  }, [scoredComponents, allScored])

  const ocasPass = ocas !== null && !is0CA ? ocas >= 40 : null
  const examPass = examScore !== '' ? Number(examScore) >= 40 : null

  // Needed on remaining unscored components to pass OCAS
  const unscoredWeight = totalCAWeight - partialWeight
  const neededOnRemaining = useMemo(() => {
    if (allScored || scoredComponents.length === 0 || unscoredWeight <= 0) return null
    // OCAS target = 40: Σ(score×weight)/totalCAWeight = 40
    // scored contribution + needed × unscoredWeight / totalCAWeight = 40
    // needed = (40 × totalCAWeight - Σ(score×weight of scored)) / unscoredWeight
    const scoredContrib = scoredComponents.reduce((sum, c) => sum + Number(c.score) * Number(c.weight), 0)
    return (40 * totalCAWeight - scoredContrib) / unscoredWeight
  }, [allScored, scoredComponents, unscoredWeight, totalCAWeight])

  // Final score = Σ(score_i × weight_i / 100) + examScore × examWeight / 100
  const finalScore = useMemo(() => {
    if (!allScored) return null
    if (!is100CA && examScore === '') return null
    const caContrib = components.reduce((sum, c) => sum + Number(c.score) * Number(c.weight) / 100, 0)
    const examContrib = is100CA ? 0 : Number(examScore) * examWeight / 100
    return Math.round((caContrib + examContrib) * 10) / 10
  }, [allScored, components, examScore, examWeight, is100CA])

  const finalGrade = finalScore !== null ? scoreToGrade(finalScore) : null
  const modulePassed = finalGrade && (is0CA || ocasPass) && (is100CA || examPass)

  function updateComponent(id, field, value) {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }
  function addComponent() { setComponents(prev => [...prev, newComponent()]) }
  function removeComponent(id) {
    setComponents(prev => prev.filter(c => c.id !== id))
  }
  function reset() {
    setComponents([
      { id: crypto.randomUUID(), type: 'TMA', customName: '', weight: 20, score: '' },
      { id: crypto.randomUUID(), type: 'TMA', customName: '', weight: 20, score: '' },
      { id: crypto.randomUUID(), type: 'Class Participation', customName: '', weight: 10, score: '' },
    ])
    setExamScore('')
  }

  const displayName = (c) => c.type === 'Others' ? (c.customName || 'Others') : c.type

  return (
    <div className="space-y-6">

      {/* Module weight overview bar */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Module Breakdown</h3>
          <button onClick={reset} className="text-xs text-gray-400 hover:text-suss-red transition-colors">Reset</button>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              CA: <span className={totalCAWeight > 100 ? 'text-suss-red' : 'text-navy dark:text-blue-400'}>{totalCAWeight}%</span>
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Exam: {examWeight}%
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex">
            <div
              className={`transition-all duration-200 ${totalCAWeight > 100 ? 'bg-suss-red' : 'bg-navy dark:bg-blue-500'}`}
              style={{ width: `${Math.min(totalCAWeight, 100)}%` }}
            />
            {examWeight > 0 && (
              <div className="flex-1 bg-suss-red/60" />
            )}
          </div>
          {totalCAWeight > 100 && (
            <p className="text-xs text-suss-red mt-1.5">Component weights exceed 100% — please adjust.</p>
          )}
        </div>
      </div>

      {/* CA components table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">CA Components</h3>
            <p className="text-xs text-gray-400 mt-0.5">Weights = % of total module mark</p>
          </div>
        </div>

        <div className="p-4 space-y-2">
          {/* Headers */}
          <div className="grid grid-cols-[1fr_80px_90px_32px] gap-2 px-1">
            <p className="text-xs font-medium text-gray-400">Component</p>
            <p className="text-xs font-medium text-gray-400 text-center">Weight (%)</p>
            <p className="text-xs font-medium text-gray-400 text-center">Score (/100)</p>
            <span />
          </div>

          {components.map(comp => (
            <div key={comp.id} className="space-y-1.5">
              <div className="grid grid-cols-[1fr_80px_90px_32px] gap-2 items-start">
                {/* Component type select */}
                <select
                  value={comp.type}
                  onChange={e => updateComponent(comp.id, 'type', e.target.value)}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
                >
                  {COMPONENT_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <input
                  type="number" min="0" max="100" step="1"
                  value={comp.weight}
                  onChange={e => updateComponent(comp.id, 'weight', Number(e.target.value))}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
                />
                <input
                  type="number" min="0" max="100" step="1"
                  value={comp.score}
                  onChange={e => updateComponent(comp.id, 'score', e.target.value)}
                  placeholder="—"
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
                />
                <button
                  onClick={() => removeComponent(comp.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-suss-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-0.5"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {/* Custom name input for Others */}
              {comp.type === 'Others' && (
                <input
                  type="text"
                  value={comp.customName}
                  onChange={e => updateComponent(comp.id, 'customName', e.target.value)}
                  placeholder="Enter component name"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
                />
              )}
              {/* Score slider */}
              <div className="flex items-center gap-3 pl-1 pr-10">
                <input
                  type="range"
                  min="0" max="100" step="1"
                  value={comp.score === '' ? 0 : Number(comp.score)}
                  onChange={e => updateComponent(comp.id, 'score', e.target.value)}
                  className="flex-1 h-1.5 appearance-none rounded-full cursor-pointer accent-navy dark:accent-blue-400 bg-gray-200 dark:bg-gray-700"
                />
                <span className="text-xs text-gray-400 w-8 text-right tabular-nums">
                  {comp.score === '' ? '—' : Number(comp.score).toFixed(0)}
                </span>
              </div>
              {/* Live contribution preview */}
              {comp.score !== '' && (
                <p className="text-xs text-gray-400 dark:text-gray-500 pl-1">
                  {displayName(comp)}: {Number(comp.score)} × {comp.weight}% = <strong className="text-gray-600 dark:text-gray-300">{(Number(comp.score) * Number(comp.weight) / 100).toFixed(2)} marks</strong>
                </p>
              )}
            </div>
          ))}

          <button
            onClick={addComponent}
            className="flex items-center gap-1.5 text-sm text-navy dark:text-blue-400 hover:opacity-75 font-medium transition-opacity mt-2"
          >
            <Plus size={16} />
            Add component
          </button>
        </div>
      </div>

      {/* OCAS result */}
      {partialOCAS !== null && (
        <div className={`rounded-xl border p-5 ${
          ocas !== null
            ? ocasPass
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
        }`}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                {allScored ? 'OCAS Score' : `Partial OCAS (${scoredComponents.length}/${components.length} components)`}
              </p>
              <p className={`text-4xl font-bold ${
                ocas !== null
                  ? ocasPass ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-400'
                  : 'text-amber-700 dark:text-amber-300'
              }`}>
                {partialOCAS}
                <span className="text-lg font-normal ml-1">/ 100</span>
              </p>
              {scoredComponents.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {scoredComponents.reduce((sum, c) => sum + Number(c.score) * Number(c.weight) / 100, 0).toFixed(2)} ÷ {partialWeight}% × 100 = {partialOCAS}
                </p>
              )}
            </div>
            {ocasPass !== null && (
              <ResultBadge
                pass={ocasPass}
                passLabel="✓ Eligible to sit exam"
                failLabel="✗ Barred from exam"
              />
            )}
          </div>

          {/* Hint for partial OCAS */}
          {!allScored && neededOnRemaining !== null && (
            <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-700/50">
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
                  You need an average of <strong>{Math.ceil(neededOnRemaining)}%</strong> on remaining unscored components to meet the 40% OCAS threshold.
                </p>
              )}
            </div>
          )}

          {ocas !== null && !ocasPass && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
              OCAS must be ≥ 40 to sit the final exam.
            </p>
          )}
        </div>
      )}

      {/* Exam score — hidden for 100% CA modules */}
      {!is100CA && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Exam Score
              <span className="text-gray-400 font-normal text-sm ml-2">({examWeight}% of module)</span>
            </h3>
            {examPass !== null && (
              <ResultBadge
                pass={examPass}
                passLabel="✓ Pass threshold met"
                failLabel="✗ Below 40% — module fail"
              />
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number" min="0" max="100" step="1"
              value={examScore}
              onChange={e => setExamScore(e.target.value)}
              placeholder="—"
              className="w-24 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
            />
            <input
              type="range"
              min="0" max="100" step="1"
              value={examScore === '' ? 0 : Number(examScore)}
              onChange={e => setExamScore(e.target.value)}
              className="flex-1 h-1.5 appearance-none rounded-full cursor-pointer accent-navy dark:accent-blue-400 bg-gray-200 dark:bg-gray-700"
            />
            <span className="text-xs text-gray-400 w-8 text-right tabular-nums">
              {examScore === '' ? '—' : Number(examScore).toFixed(0)}
            </span>
          </div>
        </div>
      )}

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
                {!ocasPass && !examPass ? 'OCAS and exam both below 40' :
                  !ocasPass ? 'OCAS below 40' : 'Exam score below 40%'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* How it's calculated */}
      <details className="rounded-xl border border-gray-200 dark:border-gray-700">
        <summary className="px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
          How OCAS is calculated
        </summary>
        <div className="px-5 pb-4 pt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>OCAS = <strong>Σ(score × weight) ÷ Σ(weight)</strong>, rounded to nearest integer</p>
          <p className="text-xs bg-gray-50 dark:bg-gray-800 rounded-lg p-3 font-mono">
            e.g. TMA01 83×20% + TMA02 75×20% + CP 73×10%<br />
            = (16.6 + 15 + 7.3) ÷ 50 × 100 = <strong>77.8 → 78</strong>
          </p>
          <p>Final score = Σ(score × weight ÷ 100) + exam × exam%</p>
          <p className="text-xs text-gray-400">Pass conditions: OCAS ≥ 40 and exam ≥ 40% (where applicable)</p>
        </div>
      </details>
    </div>
  )
}
