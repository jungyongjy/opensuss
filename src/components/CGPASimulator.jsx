import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { GRADE_SCALE, gradeToPoints } from '../utils/gradeScale'

function newModule() {
  return { id: crypto.randomUUID(), name: '', grade: 'B', credits: 5 }
}

function GradeBadge({ grade, className = '' }) {
  const colorMap = {
    'A+': 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    'A':  'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    'A-': 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    'B+': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    'B':  'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    'B-': 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300',
    'C+': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
    'C':  'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
    'D+': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
    'D':  'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
    'F':  'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  }
  return (
    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${colorMap[grade] ?? ''} ${className}`}>
      {grade}
    </span>
  )
}

export default function CGPASimulator() {
  const [modules, setModules] = useState(() => {
    try {
      const saved = localStorage.getItem('cgpa_modules')
      return saved ? JSON.parse(saved) : [newModule()]
    } catch {
      return [newModule()]
    }
  })

  const [targetCGPA, setTargetCGPA] = useState('')
  const [extCGPA, setExtCGPA] = useState('')
  const [extCredits, setExtCredits] = useState('')
  const [remainingCredits, setRemainingCredits] = useState('')

  useEffect(() => {
    localStorage.setItem('cgpa_modules', JSON.stringify(modules))
  }, [modules])

  const { cgpa, totalCredits } = useMemo(() => {
    const valid = modules.filter(m => Number(m.credits) > 0)
    const tc = valid.reduce((sum, m) => sum + Number(m.credits), 0)
    const tp = valid.reduce((sum, m) => sum + gradeToPoints(m.grade) * Number(m.credits), 0)
    return { cgpa: tc > 0 ? tp / tc : 0, totalCredits: tc }
  }, [modules])

  const reverseResult = useMemo(() => {
    const target = parseFloat(targetCGPA)
    const rc = parseFloat(remainingCredits)
    if (!target || isNaN(target) || !rc || isNaN(rc) || rc <= 0) return null
    if (target < 0 || target > 5) return null

    const baseCGPA = extCGPA !== '' ? parseFloat(extCGPA) : cgpa
    const baseCredits = extCredits !== '' ? parseFloat(extCredits) : totalCredits

    if (isNaN(baseCGPA) || isNaN(baseCredits)) return null

    const needed = (target * (baseCredits + rc) - baseCGPA * baseCredits) / rc

    if (needed > 5) return { possible: false, needed }
    if (needed <= 0) return { possible: true, alreadyMet: true }

    // Find lowest grade whose points meet the needed threshold
    const grade = [...GRADE_SCALE].reverse().find(g => g.points >= needed)
    return { possible: true, needed, grade: grade ?? GRADE_SCALE[0] }
  }, [targetCGPA, remainingCredits, extCGPA, extCredits, cgpa, totalCredits])

  function updateModule(id, field, value) {
    setModules(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
  }
  function addModule() { setModules(prev => [...prev, newModule()]) }
  function removeModule(id) {
    if (modules.length === 1) return
    setModules(prev => prev.filter(m => m.id !== id))
  }
  function clearAll() { setModules([newModule()]) }

  const cgpaLabel =
    cgpa >= 4.5 ? 'Honours (Highest Distinction)' :
    cgpa >= 4.0 ? 'Honours (Distinction)' :
    cgpa >= 3.5 ? 'Honours (Merit)' :
    cgpa >= 3.0 ? 'Honours' :
    cgpa >= 2.0 ? 'Pass' : 'Fail'

  return (
    <div className="space-y-6">
      {/* cGPA display */}
      <div
        className="rounded-xl text-white p-6 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #002147 0%, #003580 100%)',
          backgroundImage: 'linear-gradient(135deg, #002147 0%, #003580 100%), radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: 'cover, 20px 20px',
        }}
      >
        <p className="text-white/60 text-sm mb-1">Projected cGPA</p>
        <p className={`text-6xl font-bold tracking-tight ${totalCredits > 0 ? 'text-white' : 'text-white/20'}`}>
          {totalCredits > 0 ? cgpa.toFixed(2) : '—'}
        </p>
        {totalCredits > 0 && (
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="text-white/50 text-xs">{totalCredits} credit unit{totalCredits !== 1 ? 's' : ''}</span>
            <span className="text-white/40">·</span>
            <span className="text-white/60 text-xs font-medium">{cgpaLabel}</span>
          </div>
        )}
      </div>

      {/* Module table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Modules</h3>
          <button onClick={clearAll} className="text-xs text-gray-400 hover:text-suss-red transition-colors">
            Clear all
          </button>
        </div>

        <div className="p-4 space-y-2">
          <div className="grid grid-cols-[1fr_90px_80px_32px] gap-2 px-1">
            <p className="text-xs font-medium text-gray-400">Module name</p>
            <p className="text-xs font-medium text-gray-400 text-center">Grade</p>
            <p className="text-xs font-medium text-gray-400 text-center">Credits</p>
            <span />
          </div>

          {modules.map((mod) => (
            <div key={mod.id} className="grid grid-cols-[1fr_90px_80px_32px] gap-2 items-center">
              <input
                type="text"
                value={mod.name}
                onChange={e => updateModule(mod.id, 'name', e.target.value)}
                placeholder="e.g. MKT101"
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400 focus:border-transparent"
              />
              <select
                value={mod.grade}
                onChange={e => updateModule(mod.id, 'grade', e.target.value)}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400 text-center"
              >
                {GRADE_SCALE.map(g => (
                  <option key={g.grade} value={g.grade}>{g.grade} ({g.points.toFixed(1)})</option>
                ))}
              </select>
              <input
                type="number"
                min="1" max="30"
                value={mod.credits}
                onChange={e => updateModule(mod.id, 'credits', e.target.value)}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 text-sm text-gray-900 dark:text-gray-100 text-center focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
              />
              <button
                onClick={() => removeModule(mod.id)}
                disabled={modules.length === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-suss-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={addModule}
            className="flex items-center gap-1.5 text-sm text-navy dark:text-blue-400 hover:opacity-75 font-medium transition-opacity"
          >
            <Plus size={16} />
            Add module
          </button>
        </div>
      </div>

      {/* Grade reference */}
      <details className="rounded-xl border border-gray-200 dark:border-gray-700">
        <summary className="px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
          SUSS Grade Scale
        </summary>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-5 pb-4 pt-2">
          {GRADE_SCALE.map(g => (
            <div key={g.grade} className="flex items-center justify-between text-sm">
              <GradeBadge grade={g.grade} />
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {g.min === 0 ? `< 40` : `${g.min}–${g.max}`}% · {g.points.toFixed(1)} pts
              </span>
            </div>
          ))}
        </div>
      </details>

      {/* Reverse calculator */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-0.5">What grade do I need?</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Leave current cGPA/credits blank to use the modules above.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
              Current cGPA <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="number" min="0" max="5" step="0.01"
              value={extCGPA}
              onChange={e => setExtCGPA(e.target.value)}
              placeholder={cgpa.toFixed(2)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
              Credits completed <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="number" min="0"
              value={extCredits}
              onChange={e => setExtCredits(e.target.value)}
              placeholder={String(totalCredits)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
              Target cGPA <span className="text-suss-red">*</span>
            </label>
            <input
              type="number" min="0" max="5" step="0.01"
              value={targetCGPA}
              onChange={e => setTargetCGPA(e.target.value)}
              placeholder="e.g. 3.50"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
              Remaining credit units <span className="text-suss-red">*</span>
            </label>
            <input
              type="number" min="1"
              value={remainingCredits}
              onChange={e => setRemainingCredits(e.target.value)}
              placeholder="e.g. 20"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
            />
          </div>
        </div>

        {reverseResult && (
          reverseResult.possible ? (
            reverseResult.alreadyMet ? (
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3">
                <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                  You already meet your target cGPA. Any grade will maintain it.
                </p>
              </div>
            ) : (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-3 flex items-center gap-3">
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    You need at least <strong>{reverseResult.needed.toFixed(2)} grade points</strong> per credit unit on your remaining {remainingCredits} credits.
                  </p>
                  {reverseResult.grade && (
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-0.5">
                      Minimum grade required: <GradeBadge grade={reverseResult.grade.grade} className="ml-1" />
                    </p>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3">
              <p className="text-sm text-red-800 dark:text-red-300">
                Target not achievable — would require {reverseResult.needed.toFixed(2)} grade points, exceeding the maximum of 5.0.
              </p>
            </div>
          )
        )}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        Modules are saved in your browser. Clearing browser data will reset this.
      </p>
    </div>
  )
}
