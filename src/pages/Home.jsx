import { useState, useMemo, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import QuickAccess from '../components/QuickAccess'
import CategoryCard from '../components/CategoryCard'
import LinkCard from '../components/LinkCard'
import FeedbackForm from '../components/FeedbackForm'
import Footer from '../components/Footer'
import { categories } from '../data/links'

export default function Home() {
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)

  const totalLinks = categories.reduce((sum, cat) => sum + cat.links.length, 0)

  useEffect(() => {
    document.title = 'OpenSUSS: SUSS student portal directory and tools'
  }, [])

  useEffect(() => {
    function handleKey(e) {
      const tag = document.activeElement?.tagName
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable
      if (isTyping) return
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const groupedResults = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    return categories
      .map((cat) => ({
        category: cat,
        links: cat.links.filter(
          (link) =>
            link.name.toLowerCase().includes(q) ||
            link.description.toLowerCase().includes(q) ||
            (link.portalPath && link.portalPath.toLowerCase().includes(q)) ||
            (link.email && link.email.toLowerCase().includes(q)) ||
            (link.keywords && link.keywords.some((k) => k.toLowerCase().includes(q)))
        ),
      }))
      .filter((g) => g.links.length > 0)
  }, [query])

  const totalResults = groupedResults ? groupedResults.reduce((sum, g) => sum + g.links.length, 0) : 0
  const isSearching = query.trim().length > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section
        className="relative bg-navy dark:bg-gray-900 text-white py-16 px-4 overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 75% 30%, rgba(200,16,46,0.12) 0%, transparent 50%),
            radial-gradient(circle at 15% 70%, rgba(200,16,46,0.06) 0%, transparent 40%),
            radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, auto, 28px 28px',
        }}
      >
        {/* Top red strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-suss-red" />

        {/* Logo-inspired left motif */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2">
          <div className="w-0.5 h-8 bg-suss-red/40 rounded-full" />
          <div className="w-1.5 h-1.5 rounded-full bg-suss-red/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-suss-red/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-suss-red/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-suss-red/60" />
          <div className="w-0.5 h-8 bg-suss-red/40 rounded-full" />
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2">
          <div className="w-0.5 h-8 bg-white/10 rounded-full" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
          <div className="w-0.5 h-8 bg-white/10 rounded-full" />
        </div>

        {/* Bottom gradient bridge to page */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-950 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Unofficial · Student-built · Free to use
          </div>
          <div className="animate-fade-up-1">
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              All your S<span className="text-suss-red">U</span>SS portals<br className="hidden md:block" /> in one place
            </h1>
            <p className="text-white/60 mt-3 text-sm md:text-base">
              The unofficial student link directory for SUSS
            </p>
          </div>
          <div className="w-full animate-fade-up-2">
            <SearchBar ref={searchRef} value={query} onChange={setQuery} />
          </div>
          <div className="animate-fade-up-3 flex items-center gap-5 text-white/40 text-xs">
            <span><span className="text-white/70 font-semibold tabular-nums">{totalLinks}</span> links</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span><span className="text-white/70 font-semibold tabular-nums">{categories.length}</span> categories</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span><span className="text-white/70 font-semibold">2</span> tools</span>
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* Search results */}
        {isSearching && (
          <section className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
            {totalResults === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {totalResults} result{totalResults !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                </p>
                <div className="flex flex-col gap-8">
                  {groupedResults.map(({ category, links }) => (
                    <div key={category.slug}>
                      <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                        {category.name}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {links.map((link, i) => (
                          <div key={`${link.name}-${link.href}`} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                            <LinkCard link={link} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Default landing view */}
        {!isSearching && (
          <>
            <QuickAccess />

            <section className="max-w-6xl mx-auto px-4 pb-10">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-1 h-4 bg-suss-red rounded-sm shrink-0" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Browse by Category
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat, i) => (
                  <div key={cat.slug} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <CategoryCard category={cat} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <div className="border-t border-gray-200 dark:border-gray-800">
          <FeedbackForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
