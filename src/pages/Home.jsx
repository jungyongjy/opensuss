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

  const results = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    return categories.flatMap((cat) =>
      cat.links.filter(
        (link) =>
          link.name.toLowerCase().includes(q) ||
          link.description.toLowerCase().includes(q)
      )
    )
  }, [query])

  const isSearching = query.trim().length > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-navy dark:bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              All your SUSS portals in one place
            </h1>
            <p className="text-white/60 mt-2 text-sm md:text-base">
              Find any SUSS link instantly
            </p>
          </div>
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </section>

      <main className="flex-1">
        {/* Search results */}
        {isSearching && (
          <section className="max-w-6xl mx-auto px-4 py-8">
            {results.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((link) => (
                    <LinkCard key={`${link.name}-${link.href}`} link={link} />
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
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                Browse by Category
              </h2>
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
