import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { GRADE_SCALE, gradeToPoints } from '../utils/gradeScale'

const ALLOWED_MODULE_CREDITS = [2.5, 5, 10]
const CGPA_INPUT_PATTERN = /^(?:[0-4](?:\.\d{0,2})?|5(?:\.0{0,2})?)?$/
const CU_INPUT_PATTERN = /^\d*(?:\.\d{0,1})?$/

function makeSemesterLabel(index) {
  const year = Math.floor(index / 2) + 1
  const sem = (index % 2) + 1
  return `Y${year}S${sem}`
}

function createInitialSemesters() {
  return [
    { id: 'sem-1', label: 'Y1S1' },
    { id: 'sem-2', label: 'Y2S2' },
  ]
}

function newModule(semesterId, order = 0) {
  return { id: crypto.randomUUID(), name: '', grade: 'B', credits: 5, semesterId, semesterOrder: order }
}

function normaliseModuleCredits(value) {
  const numeric = Number(value)
  return ALLOWED_MODULE_CREDITS.includes(numeric) ? numeric : 5
}

function formatCredits(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function GradeBadge({ grade, className = '' }) {
  const colorMap = {
    'A+': 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    A: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    'A-': 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    'B+': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    B: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    'B-': 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300',
    'C+': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
    C: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
    'D+': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
    D: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
    F: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  }
  return <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${colorMap[grade] ?? ''} ${className}`}>{grade}</span>
}

export default function CGPASimulator() {
  const [semesters, setSemesters] = useState(() => {
    try {
      const saved = localStorage.getItem('cgpa_semesters')
      if (!saved) return createInitialSemesters()
      const parsed = JSON.parse(saved)
      const legacyLabels = ['Y1S1', 'Y1S2', 'Y2S1', 'Y2S2']
      const isLegacyDefault =
        Array.isArray(parsed) &&
        parsed.length === 4 &&
        parsed.every((s, i) => s?.id === `sem-${i + 1}` && s?.label === legacyLabels[i])

      if (isLegacyDefault) return createInitialSemesters()

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .filter(s => s && typeof s.id === 'string')
          .map((s, i) => ({ id: s.id, label: typeof s.label === 'string' && s.label.trim() ? s.label : makeSemesterLabel(i) }))
      }

      return createInitialSemesters()
    } catch {
      return createInitialSemesters()
    }
  })

  const [modules, setModules] = useState(() => {
    try {
      const saved = localStorage.getItem('cgpa_modules')
      if (!saved) return []

      const parsed = JSON.parse(saved)
      if (!Array.isArray(parsed)) return []

      return parsed
        .filter(m => m && typeof m.id === 'string')
        .map((m, index) => ({
          id: m.id,
          name: typeof m.name === 'string' ? m.name : '',
          grade: GRADE_SCALE.some(g => g.grade === m.grade) ? m.grade : 'B',
          credits: normaliseModuleCredits(m.credits),
          semesterId: typeof m.semesterId === 'string' ? m.semesterId : 'sem-1',
          semesterOrder: Number.isFinite(Number(m.semesterOrder)) ? Number(m.semesterOrder) : index,
        }))
    } catch {
      return []
    }
  })

  const [targetCGPA, setTargetCGPA] = useState('')
  const [extCGPA, setExtCGPA] = useState('')
  const [extCredits, setExtCredits] = useState('')
  const [remainingCredits, setRemainingCredits] = useState('')
  const [currentCGPA, setCurrentCGPA] = useState('')
  const [cuTaken, setCuTaken] = useState('0.0')
  const [cuLeftInput, setCuLeftInput] = useState('130.0')

  useEffect(() => {
    localStorage.setItem('cgpa_modules', JSON.stringify(modules))
  }, [modules])

  useEffect(() => {
    localStorage.setItem('cgpa_semesters', JSON.stringify(semesters))
  }, [semesters])

  const modulesBySemester = useMemo(() => {
    const map = Object.fromEntries(semesters.map(s => [s.id, []]))
    modules.forEach(mod => {
      const fallback = semesters[0]?.id
      const semId = mod.semesterId && map[mod.semesterId] ? mod.semesterId : fallback
      if (!semId) return
      map[semId].push(mod)
    })
    Object.keys(map).forEach(semId => {
      map[semId].sort((a, b) => (a.semesterOrder || 0) - (b.semesterOrder || 0))
    })
    return map
  }, [modules, semesters])

  const { moduleGradePoints, moduleCredits } = useMemo(() => {
    const valid = modules.filter(m => Number(m.credits) > 0)
    const credits = valid.reduce((sum, m) => sum + Number(m.credits), 0)
    const points = valid.reduce((sum, m) => sum + gradeToPoints(m.grade) * Number(m.credits), 0)
    return { moduleGradePoints: points, moduleCredits: credits }
  }, [modules])

  const currentCGPAValue = useMemo(() => {
    if (currentCGPA === '') return null
    const parsed = Number(currentCGPA)
    return Number.isFinite(parsed) ? parsed : null
  }, [currentCGPA])

  const cuTakenValue = Math.max(Number(cuTaken) || 0, 0)
  const cuLeftValue = Math.max(Number(cuLeftInput) || 0, 0)

  const projectedCGPA = useMemo(() => {
    if (moduleCredits === 0 && currentCGPAValue !== null) return currentCGPAValue

    const weightedCredits = cuTakenValue + moduleCredits
    if (weightedCredits <= 0) return 0

    const basePoints = (currentCGPAValue ?? 0) * cuTakenValue
    return (basePoints + moduleGradePoints) / weightedCredits
  }, [currentCGPAValue, cuTakenValue, moduleGradePoints, moduleCredits])

  const projectedCredits = cuTakenValue + moduleCredits
  const hasProjectedCGPA = currentCGPAValue !== null || moduleCredits > 0

  const completedPlusPlannedCU = projectedCredits
  const totalCUValue = Math.max(cuTakenValue + cuLeftValue, 1)
  const cuLeft = Math.max(cuLeftValue - moduleCredits, 0)
  const progressPercent = Math.min((completedPlusPlannedCU / totalCUValue) * 100, 100)

  const defaultRemainingCredits = useMemo(
    () => (cuLeft > 0 ? cuLeft.toFixed(1) : ''),
    [cuLeft]
  )

  const reverseResult = useMemo(() => {
    const target = parseFloat(targetCGPA)
    const rc = parseFloat(remainingCredits || defaultRemainingCredits)
    if (isNaN(target) || isNaN(rc) || rc <= 0) return null
    if (target < 0 || target > 5) return null

    const baseCGPA = extCGPA !== '' ? parseFloat(extCGPA) : projectedCGPA
    const baseCredits = extCredits !== '' ? parseFloat(extCredits) : projectedCredits

    if (isNaN(baseCGPA) || isNaN(baseCredits)) return null

    const needed = (target * (baseCredits + rc) - baseCGPA * baseCredits) / rc
    if (needed > 5) return { possible: false, needed }
    if (needed <= 0) return { possible: true, alreadyMet: true }
    const grade = [...GRADE_SCALE].reverse().find(g => g.points >= needed)
    return { possible: true, needed, grade: grade ?? GRADE_SCALE[0] }
  }, [targetCGPA, remainingCredits, defaultRemainingCredits, extCGPA, extCredits, projectedCGPA, projectedCredits])

  const effectiveRemainingCredits = remainingCredits || defaultRemainingCredits

  function updateModule(id, field, value) {
    setModules(prev => prev.map(m => {
      if (m.id !== id) return m
      if (field === 'credits') return { ...m, credits: normaliseModuleCredits(value) }
      return { ...m, [field]: value }
    }))
  }

  function handleCurrentCGPAChange(value) {
    if (!CGPA_INPUT_PATTERN.test(value)) return
    setCurrentCGPA(value)
  }

  function handleCurrentCGPABlur() {
    if (currentCGPA === '') return
    const numeric = Number(currentCGPA)
    if (!Number.isFinite(numeric)) {
      setCurrentCGPA('')
      return
    }
    const clamped = Math.min(5, Math.max(0, numeric))
    setCurrentCGPA(clamped.toFixed(2))
  }

  function normaliseCUInput(value, fallback = '0.0') {
    const numeric = Number(value)
    if (!Number.isFinite(numeric) || numeric < 0) return fallback
    return numeric.toFixed(1)
  }

  function handleCUTakenChange(value) {
    if (!CU_INPUT_PATTERN.test(value)) return
    setCuTaken(value)
  }

  function handleCULeftChange(value) {
    if (!CU_INPUT_PATTERN.test(value)) return
    setCuLeftInput(value)
  }

  function addSemester() {
    setSemesters(prev => {
      const nextIndex = prev.length
      return [...prev, { id: `sem-${nextIndex + 1}`, label: makeSemesterLabel(nextIndex) }]
    })
  }

  function removeSemester(semesterId) {
    if (semesters.length <= 1) return

    setSemesters(prev => {
      const remaining = prev.filter(s => s.id !== semesterId)
      return remaining.length > 0 ? remaining : prev
    })

    setModules(prev => {
      const remainingSemesters = semesters.filter(s => s.id !== semesterId)
      const fallbackSemesterId = remainingSemesters[0]?.id
      if (!fallbackSemesterId) return prev

      const reassigned = prev.map(m =>
        m.semesterId === semesterId
          ? { ...m, semesterId: fallbackSemesterId, semesterOrder: 0 }
          : m
      )

      const grouped = {}
      reassigned.forEach(m => {
        const key = m.semesterId || fallbackSemesterId
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(m)
      })

      Object.values(grouped).forEach(list => {
        list
          .sort((a, b) => (a.semesterOrder || 0) - (b.semesterOrder || 0))
          .forEach((m, idx) => {
            m.semesterOrder = idx
          })
      })

      return reassigned
    })
  }

  function renameSemester(semesterId, label) {
    setSemesters(prev =>
      prev.map(s => (s.id === semesterId ? { ...s, label } : s))
    )
  }

  function addModule(semesterId = semesters[0]?.id) {
    const semId = semesterId || semesters[0]?.id || 'sem-1'
    const current = modulesBySemester[semId] || []
    setModules(prev => [...prev, newModule(semId, current.length)])
  }

  function removeModule(id) {
    setModules(prev => prev.filter(m => m.id !== id))
  }

  function clearAll() {
    setModules([])
  }

  function moveModule(id, targetSemesterId, targetIndex) {
    setModules(prev => {
      const moving = prev.find(m => m.id === id)
      if (!moving) return prev

      const buckets = {}
      semesters.forEach(sem => {
        buckets[sem.id] = prev
          .filter(m => m.semesterId === sem.id)
          .sort((a, b) => (a.semesterOrder || 0) - (b.semesterOrder || 0))
          .map(m => m.id)
      })

      if (!buckets[targetSemesterId]) buckets[targetSemesterId] = []
      Object.keys(buckets).forEach(semId => {
        buckets[semId] = buckets[semId].filter(moduleId => moduleId !== id)
      })

      const insertAt = targetIndex == null
        ? buckets[targetSemesterId].length
        : Math.min(Math.max(targetIndex, 0), buckets[targetSemesterId].length)
      buckets[targetSemesterId].splice(insertAt, 0, id)

      return prev.map(m => {
        for (const [semId, list] of Object.entries(buckets)) {
          const idx = list.indexOf(m.id)
          if (idx !== -1) return { ...m, semesterId: semId, semesterOrder: idx }
        }
        return m
      })
    })
  }

  function assignSemester(id, semesterId) {
    const target = modulesBySemester[semesterId] || []
    setModules(prev => prev.map(m => (m.id === id ? { ...m, semesterId, semesterOrder: target.length } : m)))
  }

  function handleDropToSemester(e, semesterId) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    moveModule(id, semesterId, null)
  }

  function handleDropToIndex(e, semesterId, index) {
    e.preventDefault()
    e.stopPropagation()
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    moveModule(id, semesterId, index)
  }

  const cgpaLabel =
    projectedCGPA >= 4.5 ? 'Honours (Highest Distinction)' :
    projectedCGPA >= 4.0 ? 'Honours (Distinction)' :
    projectedCGPA >= 3.5 ? 'Honours (Merit)' :
    projectedCGPA >= 3.0 ? 'Honours' :
    projectedCGPA >= 2.0 ? 'Pass' : 'Fail'

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl text-white p-6 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #002147 0%, #003580 100%)',
          backgroundImage: 'linear-gradient(135deg, #002147 0%, #003580 100%), radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: 'cover, 20px 20px',
        }}
      >
        <p className="text-white/60 text-sm mb-1">Projected cGPA</p>
        <p className={`text-6xl font-bold tracking-tight ${hasProjectedCGPA ? 'text-white' : 'text-white/20'}`}>
          {hasProjectedCGPA ? projectedCGPA.toFixed(2) : '—'}
        </p>
        {hasProjectedCGPA && (
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="text-white/50 text-xs">{projectedCredits.toFixed(1)} credit unit{projectedCredits !== 1 ? 's' : ''}</span>
            <span className="text-white/40">·</span>
            <span className="text-white/60 text-xs font-medium">{cgpaLabel}</span>
          </div>
        )}
      </div>

      <details className="rounded-xl border border-gray-200 dark:border-gray-700">
        <summary className="px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
          SUSS Grade Scale
        </summary>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-5 pb-4 pt-2">
          {GRADE_SCALE.map(g => (
            <div key={g.grade} className="flex items-center justify-between text-sm">
              <GradeBadge grade={g.grade} />
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {g.min === 0 ? `< 40` : `${g.min}–${g.max}`}% · {g.points.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </details>

      <div className="rounded-xl border border-navy/20 dark:border-blue-600/40 bg-navy dark:bg-gray-900 p-4 text-white">
        <p className="text-xs font-semibold text-white/90">Your Progress</p>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <label className="text-[11px] text-white/70">
            Current CGPA
            <input
              type="text"
              inputMode="decimal"
              value={currentCGPA}
              onChange={e => handleCurrentCGPAChange(e.target.value)}
              onBlur={handleCurrentCGPABlur}
              placeholder="0.00"
              className="mt-1 w-full rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-white"
            />
          </label>
          <label className="text-[11px] text-white/70">
            CU completed
            <input
              type="text"
              inputMode="decimal"
              value={cuTaken}
              onChange={e => handleCUTakenChange(e.target.value)}
              onBlur={() => setCuTaken(prev => normaliseCUInput(prev, '0.0'))}
              className="mt-1 w-full rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-white"
            />
          </label>
          <label className="text-[11px] text-white/70">
            CU left
            <input
              type="text"
              inputMode="decimal"
              value={cuLeftInput}
              onChange={e => handleCULeftChange(e.target.value)}
              onBlur={() => setCuLeftInput(prev => normaliseCUInput(prev, '0.0'))}
              className="mt-1 w-full rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-white"
            />
          </label>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full bg-suss-red transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-white/70">
          <span>{completedPlusPlannedCU.toFixed(1)} / {totalCUValue} CU</span>
          <span>{cuLeft.toFixed(1)} CU left</span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Modules</h3>
          <button onClick={clearAll} className="text-xs text-gray-400 hover:text-suss-red transition-colors">
            Clear all
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Semester Planner</p>
            <button
              onClick={addSemester}
              className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              + Add semester
            </button>
          </div>

          {semesters.map(semester => {
            const semesterMods = modulesBySemester[semester.id] || []
            const semesterCredits = semesterMods.reduce((sum, m) => sum + (Number(m.credits) || 0), 0)

            return (
              <section
                key={semester.id}
                className="rounded-lg border border-gray-200 dark:border-gray-700 p-2"
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleDropToSemester(e, semester.id)}
              >
                <div className="flex items-center justify-between gap-2 px-1 pb-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="text"
                      value={semester.label}
                      onChange={e => renameSemester(semester.id, e.target.value)}
                      className="w-20 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeSemester(semester.id)}
                      disabled={semesters.length <= 1}
                      className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{semesterCredits} CU</span>
                </div>

                {semesterMods.length === 0 ? (
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">Drop modules here</p>
                ) : (
                  <div className="mt-2 space-y-2">
                    <div className="hidden sm:grid sm:grid-cols-[18px_minmax(0,1fr)_90px_80px_60px_24px] gap-2 px-1">
                      <span />
                      <p className="text-xs font-medium text-gray-400">Module name</p>
                      <p className="text-xs font-medium text-gray-400 text-center">Grade</p>
                      <p className="text-xs font-medium text-gray-400 text-center">Credits</p>
                      <p className="text-xs font-medium text-gray-400 text-center">Semester</p>
                      <span />
                    </div>

                    {semesterMods.map((mod, index) => (
                      <div
                        key={mod.id}
                        draggable
                        onDragStart={e => {
                          e.dataTransfer.effectAllowed = 'move'
                          e.dataTransfer.setData('text/plain', mod.id)
                        }}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => handleDropToIndex(e, semester.id, index)}
                        className="grid grid-cols-2 gap-2 items-start sm:grid-cols-[18px_minmax(0,1fr)_90px_80px_60px_24px] sm:items-center"
                      >
                        <div className="sm:hidden">
                          <p className="mb-1 text-[11px] font-medium text-gray-400">Reorder</p>
                          <button
                            type="button"
                            className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 flex items-center justify-center gap-1 cursor-grab active:cursor-grabbing"
                            aria-label={`Drag ${mod.name || 'module'}`}
                          >
                            <GripVertical size={14} />
                            <span className="text-xs">Drag</span>
                          </button>
                        </div>
                        <button type="button" className="hidden sm:flex text-gray-400 cursor-grab active:cursor-grabbing" aria-label={`Drag ${mod.name || 'module'}`}>
                          <GripVertical size={14} />
                        </button>
                        <div className="sm:hidden">
                          <p className="mb-1 text-[11px] font-medium text-gray-400">Actions</p>
                          <button
                            onClick={() => removeModule(mod.id)}
                            className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-suss-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-xs font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="col-span-2 sm:col-span-1 min-w-0">
                          <p className="sm:hidden mb-1 text-[11px] font-medium text-gray-400">Module name</p>
                          <input
                            type="text"
                            value={mod.name}
                            onChange={e => updateModule(mod.id, 'name', e.target.value)}
                            placeholder="e.g. MKT101"
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <p className="sm:hidden mb-1 text-[11px] font-medium text-gray-400">Grade</p>
                          <select
                            value={mod.grade}
                            onChange={e => updateModule(mod.id, 'grade', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400 text-center"
                          >
                            {GRADE_SCALE.map(g => (
                              <option key={g.grade} value={g.grade}>{g.grade} ({g.points.toFixed(1)})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <p className="sm:hidden mb-1 text-[11px] font-medium text-gray-400">Credits</p>
                          <select
                            value={String(mod.credits)}
                            onChange={e => updateModule(mod.id, 'credits', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 text-sm text-gray-900 dark:text-gray-100 text-center focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
                          >
                            {ALLOWED_MODULE_CREDITS.map(credit => (
                              <option key={credit} value={credit}>{formatCredits(credit)}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <p className="sm:hidden mb-1 text-[11px] font-medium text-gray-400">Semester</p>
                          <select
                            value={mod.semesterId || semester.id}
                            onChange={e => assignSemester(mod.id, e.target.value)}
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1 py-2 text-xs text-gray-700 dark:text-gray-200"
                          >
                            {semesters.map(s => (
                              <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => removeModule(mod.id)}
                          className="hidden sm:flex p-1 rounded text-gray-300 hover:text-suss-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-2 px-1">
                  <button
                    onClick={() => addModule(semester.id)}
                    className="flex items-center gap-1.5 text-sm text-navy dark:text-blue-400 hover:opacity-75 font-medium transition-opacity"
                  >
                    <Plus size={16} />
                    Add module to {semester.label}
                  </button>
                </div>
              </section>
            )
          })}
        </div>
      </div>

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
              type="number"
              min="0"
              max="5"
              step="0.01"
              value={extCGPA}
              onChange={e => setExtCGPA(e.target.value)}
              placeholder={projectedCGPA.toFixed(2)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
              Credits completed <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="number"
              min="0"
              value={extCredits}
              onChange={e => setExtCredits(e.target.value)}
              placeholder={projectedCredits.toFixed(1)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">
              Target cGPA <span className="text-suss-red">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.01"
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
              type="number"
              min="1"
              value={remainingCredits}
              onChange={e => setRemainingCredits(e.target.value)}
              placeholder={defaultRemainingCredits || 'e.g. 20'}
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
                    You need at least <strong>{reverseResult.needed.toFixed(2)} grade points</strong> per credit unit on your remaining {effectiveRemainingCredits} credits.
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
