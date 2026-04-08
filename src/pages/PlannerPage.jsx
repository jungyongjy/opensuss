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

export default function PlannerPage() {
  const [selectedModules, setSelectedModules] = useState([])
  const [pickerTarget, setPickerTarget] = useState(null)
  const [gateTarget, setGateTarget] = useState(null)

  useEffect(() => {
    document.title = 'Module Planner | OpenSUSS'
  }, [])

  const lockedEntries = useMemo(
    () => selectedModules.filter(m => m.crn && m.timetableEntry).map(m => m.timetableEntry),
    [selectedModules]
  )

  const overridesMap = useMemo(() => parseOverridesCsv(overridesCsv), [])

  const excludedCodes = selectedModules.map(m => m.courseCode)

  function addModule(courseCode, name) {
    const color = MODULE_COLORS[selectedModules.length % MODULE_COLORS.length]
    setSelectedModules(prev => [...prev, { courseCode, name, crn: null, color, timetableEntry: null }])
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
            <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
              <SelectedModules modules={selectedModules} onRemove={handleRemove} onPickCRN={setPickerTarget} />
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
