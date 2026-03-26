import { useState, useMemo } from 'react'
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

  const groupedResults = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    return categories
      .map((cat) => ({
        category: cat,
        links: cat.links.filter(
          (link) =>
            link.name.toLowerCase().includes(q) ||
            link.description.toLowerCase().includes(q)
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
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      >
        {/* Soft glow accent */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-suss-red/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Unofficial · Student-built · Free to use
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              All your SUSS portals<br className="hidden md:block" /> in one place
            </h1>
            <p className="text-white/60 mt-3 text-sm md:text-base">
              The unofficial student link directory for SUSS
            </p>
          </div>
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </section>

      <main className="flex-1">
        {/* Search results */}
        {isSearching && (
          <section className="max-w-6xl mx-auto px-4 py-8">
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
                        {links.map((link) => (
                          <LinkCard key={`${link.name}-${link.href}`} link={link} />
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Browse by Category
                </h2>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {categories.reduce((sum, c) => sum + c.links.length, 0)} links across {categories.length} categories
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <CategoryCard key={cat.slug} category={cat} />
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
