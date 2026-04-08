import { useState, useEffect, useMemo } from 'react'
import { CalendarRange } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ModuleSearch from '../components/planner/ModuleSearch'
import SelectedModules from '../components/planner/SelectedModules'
import WeeklyGrid from '../components/planner/WeeklyGrid'
import CRNPickerModal from '../components/planner/CRNPickerModal'
import ICSExportButton from '../components/planner/ICSExportButton'
import PrereqGateModal from '../components/planner/PrereqGateModal'
import { MODULE_COLORS, parseOverridesCsv, resolveGateRules } from '../utils/plannerUtils'

import dayData from '../data/timetables/jul-2026-day.json'
import eveningData from '../data/timetables/jul-2026-evening.json'
import moduleData from '../data/timetables/BAS-MAJ1.json'
import overridesCsv from '../data/timetables/BAS-MAJ1.overrides.csv?raw'

function makeSemesterLabel(index) {
  const year = Math.floor(index / 2) + 1
  const sem = (index % 2) + 1
  return `Y${year}S${sem}`
}

function createInitialSemesters(count = 8) {
  return Array.from({ length: count }, (_, i) => ({ id: `sem-${i + 1}`, label: makeSemesterLabel(i) }))
}

function toNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export default function PlannerPage() {
  const [selectedModules, setSelectedModules] = useState([])
  const [pickerTarget, setPickerTarget] = useState(null)
  const [gateTarget, setGateTarget] = useState(null)
  const [semesters, setSemesters] = useState(() => createInitialSemesters())
  const [currentCGPA, setCurrentCGPA] = useState('0.00')
  const [cuTaken, setCuTaken] = useState('0')
  const [totalCU, setTotalCU] = useState('130')

  useEffect(() => {
    document.title = 'Module Planner | OpenSUSS'
  }, [])

  const lockedEntries = useMemo(
    () => selectedModules.filter(m => m.crn && m.timetableEntry).map(m => m.timetableEntry),
    [selectedModules]
  )

  const overridesMap = useMemo(() => parseOverridesCsv(overridesCsv), [])

  const excludedCodes = selectedModules.map(m => m.courseCode)

  const plannedCU = selectedModules.reduce((sum, m) => sum + (m.cu || 0), 0)
  const totalCUValue = Math.max(toNumber(totalCU, 130), 1)
  const completedPlusPlannedCU = Math.max(0, toNumber(cuTaken, 0)) + plannedCU
  const cuLeft = Math.max(totalCUValue - completedPlusPlannedCU, 0)
  const progressPercent = Math.min((completedPlusPlannedCU / totalCUValue) * 100, 100)

  function addModule(courseCode, name) {
    const module = moduleData.find(m => m.code === courseCode)
    const firstSemesterId = semesters[0]?.id || 'sem-1'
    const semesterModules = selectedModules.filter(m => m.semesterId === firstSemesterId)
    const color = MODULE_COLORS[selectedModules.length % MODULE_COLORS.length]
    setSelectedModules(prev => [
      ...prev,
      {
        courseCode,
        name,
        crn: null,
        color,
        cu: module?.cu || 0,
        semesterId: firstSemesterId,
        semesterOrder: semesterModules.length,
        timetableEntry: null,
      },
    ])
  }

  function handleAdd(courseCode, name) {
    const rules = resolveGateRules(courseCode, moduleData, overridesMap)
    const prereqs = rules.prereqs
    const excludedCombinations = rules.excludedCombinations

    if (prereqs.length > 0 || excludedCombinations.length > 0) {
      setGateTarget({ courseCode, name, prereqs, excludedCombinations })
      return
    }

    addModule(courseCode, name)
  }

  function handleRemove(courseCode) {
    setSelectedModules(prev => prev.filter(m => m.courseCode !== courseCode))
  }

  function handleSelectCRN(timetableEntry) {
    setSelectedModules(prev =>
      prev.map(m =>
        m.courseCode === timetableEntry.courseCode ? { ...m, crn: timetableEntry.crn, timetableEntry } : m
      )
    )
  }

  function handleAddSemester() {
    setSemesters(prev => {
      const nextIndex = prev.length
      return [...prev, { id: `sem-${nextIndex + 1}`, label: makeSemesterLabel(nextIndex) }]
    })
  }

  function handleAssignSemester(courseCode, targetSemesterId) {
    setSelectedModules(prev => {
      const targetModules = prev
        .filter(m => m.semesterId === targetSemesterId && m.courseCode !== courseCode)
        .sort((a, b) => (a.semesterOrder || 0) - (b.semesterOrder || 0))

      return prev.map(m => {
        if (m.courseCode === courseCode) {
          return { ...m, semesterId: targetSemesterId, semesterOrder: targetModules.length }
        }
        return m
      })
    })
  }

  function handleMoveModule(courseCode, targetSemesterId, targetIndex) {
    setSelectedModules(prev => {
      const moving = prev.find(m => m.courseCode === courseCode)
      if (!moving) return prev

      const buckets = {}
      for (const sem of semesters) {
        buckets[sem.id] = prev
          .filter(m => m.semesterId === sem.id)
          .sort((a, b) => (a.semesterOrder || 0) - (b.semesterOrder || 0))
          .map(m => m.courseCode)
      }

      if (!buckets[targetSemesterId]) buckets[targetSemesterId] = []

      for (const semId of Object.keys(buckets)) {
        buckets[semId] = buckets[semId].filter(code => code !== courseCode)
      }

      const insertAt = targetIndex == null ? buckets[targetSemesterId].length : Math.min(Math.max(targetIndex, 0), buckets[targetSemesterId].length)
      buckets[targetSemesterId].splice(insertAt, 0, courseCode)

      const moduleMap = Object.fromEntries(prev.map(m => [m.courseCode, { ...m }]))
      for (const [semId, codes] of Object.entries(buckets)) {
        codes.forEach((code, index) => {
          if (!moduleMap[code]) return
          moduleMap[code].semesterId = semId
          moduleMap[code].semesterOrder = index
        })
      }

      return Object.values(moduleMap)
    })
  }

  const pickerModule = pickerTarget ? selectedModules.find(m => m.courseCode === pickerTarget) : null
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />

      <header
        className="relative bg-navy dark:bg-gray-900 text-white py-10 px-4 overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 70% 30%, rgba(200,16,46,0.1) 0%, transparent 50%),
            radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, 24px 24px',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-suss-red" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-suss-red/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <CalendarRange size={12} />
            Jul 2026 Semester
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Module Planner</h1>
          <p className="text-white/60 text-sm mt-1">Build a conflict-free timetable and export to your calendar</p>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 flex flex-col lg:flex-row gap-4 items-start pb-20 md:pb-6">
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4 lg:sticky lg:top-20">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex flex-col gap-4">
            <h2 className="font-display text-sm font-bold text-gray-900 dark:text-gray-100">Add Modules</h2>
            <ModuleSearch
              dayData={dayData}
              eveningData={eveningData}
              moduleData={moduleData}
              excludedCodes={excludedCodes}
              onAdd={handleAdd}
            />
            <div className="rounded-lg border border-navy/20 dark:border-blue-600/40 bg-navy dark:bg-gray-900 p-3 text-white">
              <p className="text-xs font-semibold text-white/90">Your Progress</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <label className="text-[11px] text-white/70">
                  CGPA
                  <input
                    value={currentCGPA}
                    onChange={e => setCurrentCGPA(e.target.value)}
                    className="mt-1 w-full rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-white placeholder-white/50"
                  />
                </label>
                <label className="text-[11px] text-white/70">
                  CU taken
                  <input
                    value={cuTaken}
                    onChange={e => setCuTaken(e.target.value)}
                    className="mt-1 w-full rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-white placeholder-white/50"
                  />
                </label>
                <label className="text-[11px] text-white/70">
                  Total CU
                  <input
                    value={totalCU}
                    onChange={e => setTotalCU(e.target.value)}
                    className="mt-1 w-full rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-white placeholder-white/50"
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
            <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
              <SelectedModules
                modules={selectedModules}
                semesters={semesters}
                onRemove={handleRemove}
                onPickCRN={setPickerTarget}
                onMoveModule={handleMoveModule}
                onAssignSemester={handleAssignSemester}
                onAddSemester={handleAddSemester}
              />
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
              <ICSExportButton modules={selectedModules} />
            </div>
          </div>
        </aside>

        <div className="flex-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden min-h-[500px]">
          <WeeklyGrid modules={selectedModules} />
        </div>
      </main>

      <Footer />

      {pickerTarget && pickerModule && (
        <CRNPickerModal
          courseCode={pickerTarget}
          moduleName={pickerModule.name}
          dayData={dayData}
          eveningData={eveningData}
          lockedEntries={lockedEntries}
          onSelect={handleSelectCRN}
          onClose={() => setPickerTarget(null)}
        />
      )}

      {gateTarget && (
        <PrereqGateModal
          courseCode={gateTarget.courseCode}
          moduleName={gateTarget.name}
          prereqs={gateTarget.prereqs}
          excludedCombinations={gateTarget.excludedCombinations}
          onConfirm={() => addModule(gateTarget.courseCode, gateTarget.name)}
          onClose={() => setGateTarget(null)}
        />
      )}
    </div>
  )
}
