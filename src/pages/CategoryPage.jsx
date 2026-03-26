import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import LinkCard from '../components/LinkCard'
import FeaturedCard from '../components/FeaturedCard'
import Footer from '../components/Footer'
import Icon from '../components/Icon'
import { categories } from '../data/links'

const iconStyles = {
  academics:  { bg: 'bg-blue-500/20',   icon: 'text-blue-200' },
  admin:      { bg: 'bg-violet-500/20', icon: 'text-violet-200' },
  library:    { bg: 'bg-teal-500/20',   icon: 'text-teal-200' },
  career:     { bg: 'bg-orange-500/20', icon: 'text-orange-200' },
  financial:  { bg: 'bg-green-500/20',  icon: 'text-green-200' },
  facilities: { bg: 'bg-indigo-500/20', icon: 'text-indigo-200' },
  forms:      { bg: 'bg-amber-500/20',  icon: 'text-amber-200' },
  notices:    { bg: 'bg-rose-500/20',   icon: 'text-rose-200' },
}

export default function CategoryPage() {
  const { slug } = useParams()
  const category = categories.find((c) => c.slug === slug)

  useEffect(() => {
    if (category) document.title = `${category.name} | OpenSUSS`
    return () => { document.title = 'OpenSUSS' }
  }, [category])

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Page not found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            That category doesn&apos;t exist.
          </p>
          <Link
            to="/"
            className="text-sm font-medium text-navy dark:text-blue-400 hover:underline"
          >
            Go back home
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const style = iconStyles[slug] ?? { bg: 'bg-white/10', icon: 'text-white/80' }

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
        <div className="relative max-w-6xl mx-auto flex items-center gap-5">
          <div className={`rounded-xl p-3.5 shrink-0 ${style.bg}`}>
            <Icon name={category.icon} size={28} className={style.icon} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-white/60 text-sm mt-1">{category.description}</p>
            <p className="text-white/40 text-xs mt-1">{category.links.length} link{category.links.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {slug === 'library' && <FeaturedCard />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.links.map((link) => (
            <LinkCard key={`${link.name}-${link.href}`} link={link} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
