import { useState, useEffect } from 'react'
import { Calculator, BookOpen } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CGPASimulator from '../components/CGPASimulator'
import OcasCalculator from '../components/OcasCalculator'

const TABS = [
  { id: 'cgpa', label: 'cGPA Simulator', icon: Calculator, description: 'Simulate your cumulative GPA across modules' },
  { id: 'ocas', label: 'OCAS Calculator', icon: BookOpen, description: 'Calculate your CA score and final module grade' },
]

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState('cgpa')
  const active = TABS.find(t => t.id === activeTab)

  useEffect(() => { document.title = 'Academic Tools | OpenSUSS' }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />

      <header
        className="relative bg-navy dark:bg-gray-900 text-white py-10 px-4 overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Top red strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-suss-red" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-suss-red/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <Calculator size={12} />
            Academic Tools
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Academic Calculators</h1>
          <p className="text-white/60 text-sm mt-1">{active.description}</p>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {/* Tab switcher */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-navy dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'cgpa' ? <CGPASimulator /> : <OcasCalculator />}
      </main>

      <Footer />
    </div>
  )
}
