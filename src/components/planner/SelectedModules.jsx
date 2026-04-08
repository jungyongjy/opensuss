import { X, ChevronDown, Check, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'

export default function SelectedModules({
  modules,
  semesters,
  onRemove,
  onPickCRN,
  onMoveModule,
  onAssignSemester,
  onAddSemester,
}) {
  const bySemester = semesters.map(semester => ({
    ...semester,
    modules: modules.filter(m => m.semesterId === semester.id).sort((a, b) => (a.semesterOrder || 0) - (b.semesterOrder || 0)),
  }))

  function handleDropToSemester(e, semesterId) {
    e.preventDefault()
    const code = e.dataTransfer.getData('text/plain')
    if (!code) return
    onMoveModule(code, semesterId, null)
  }

  function handleDropToIndex(e, semesterId, targetIndex) {
    e.preventDefault()
    e.stopPropagation()
    const code = e.dataTransfer.getData('text/plain')
    if (!code) return
    onMoveModule(code, semesterId, targetIndex)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Semester Planner</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Drag or use arrows</p>
      </div>

      {bySemester.map(({ id, label, modules: semesterModules }) => {
        const semesterCU = semesterModules.reduce((sum, m) => sum + (m.cu || 0), 0)
        return (
          <section
            key={id}
            className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDropToSemester(e, id)}
          >
            <div className="flex items-center justify-between px-1 pb-2 border-b border-gray-100 dark:border-gray-600">
              <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-100">{label}</h3>
              <span className="text-xs text-gray-500 dark:text-gray-300">{semesterCU} CU</span>
            </div>

            {semesterModules.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-3">Drop modules here</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-2">
                {semesterModules.map(({ courseCode, name, crn, color }, index) => (
                  <li
                    key={courseCode}
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.effectAllowed = 'move'
                      e.dataTransfer.setData('text/plain', courseCode)
                    }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => handleDropToIndex(e, id, index)}
                    className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 flex items-start gap-2"
                  >
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 text-gray-400 cursor-grab active:cursor-grabbing"
                      aria-label={`Drag ${courseCode}`}
                    >
                      <GripVertical size={14} />
                    </button>
                    <span className="mt-0.5 shrink-0 w-3 h-3 rounded-full" style={{ backgroundColor: color }} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{courseCode}</span>
                      </div>
                      {name && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{name}</p>}

                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => onPickCRN(courseCode)}
                          className={`inline-flex items-center gap-1 text-xs rounded px-2 py-0.5 transition-colors ${
                            crn
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                          }`}
                        >
                          {crn ? (
                            <>
                              <Check size={10} />
                              {crn}
                            </>
                          ) : (
                            <>
                              Pick CRN
                              <ChevronDown size={10} />
                            </>
                          )}
                        </button>

                        <select
                          value={id}
                          onChange={e => onAssignSemester(courseCode, e.target.value)}
                          className="text-xs rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-1.5 py-0.5"
                        >
                          {semesters.map(sem => (
                            <option key={sem.id} value={sem.id}>
                              {sem.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1">
                      <button
                        onClick={() => onMoveModule(courseCode, id, Math.max(index - 1, 0))}
                        disabled={index === 0}
                        className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label={`Move ${courseCode} up`}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => onMoveModule(courseCode, id, index + 1)}
                        disabled={index === semesterModules.length - 1}
                        className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label={`Move ${courseCode} down`}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemove(courseCode)}
                      className="shrink-0 p-0.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded"
                      aria-label={`Remove ${courseCode}`}
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}

      {modules.length === 0 && (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">Search for a module above to add it</p>
      )}

      <button
        onClick={onAddSemester}
        className="w-full rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-300 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        + Add semester
      </button>
    </div>
  )
}
