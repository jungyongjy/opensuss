import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LinkCard from '../components/LinkCard'
import FeaturedCard from '../components/FeaturedCard'
import Footer from '../components/Footer'
import { categories } from '../data/links'

export default function CategoryPage() {
  const { slug } = useParams()
  const category = categories.find((c) => c.slug === slug)

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />

      <header className="bg-navy dark:bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">{category.name}</h1>
          <p className="text-white/60 text-sm mt-1">{category.description}</p>
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
