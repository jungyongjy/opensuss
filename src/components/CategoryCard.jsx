import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Icon from './Icon'

const iconStyles = {
  academics:  { bg: 'bg-blue-100 dark:bg-blue-900/40',   icon: 'text-blue-700 dark:text-blue-400' },
  admin:      { bg: 'bg-violet-100 dark:bg-violet-900/40', icon: 'text-violet-700 dark:text-violet-400' },
  library:    { bg: 'bg-teal-100 dark:bg-teal-900/40',   icon: 'text-teal-700 dark:text-teal-400' },
  career:     { bg: 'bg-orange-100 dark:bg-orange-900/40', icon: 'text-orange-700 dark:text-orange-400' },
  financial:  { bg: 'bg-green-100 dark:bg-green-900/40', icon: 'text-green-700 dark:text-green-400' },
  facilities: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', icon: 'text-indigo-700 dark:text-indigo-400' },
  forms:      { bg: 'bg-amber-100 dark:bg-amber-900/40', icon: 'text-amber-700 dark:text-amber-400' },
  notices:    { bg: 'bg-rose-100 dark:bg-rose-900/40',   icon: 'text-rose-700 dark:text-rose-400' },
}

export default function CategoryCard({ category }) {
  const style = iconStyles[category.slug] ?? { bg: 'bg-navy/10 dark:bg-blue-900/30', icon: 'text-navy dark:text-blue-400' }

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:border-navy dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className={`rounded-lg p-2.5 ${style.bg}`}>
          <Icon name={category.icon} size={22} className={style.icon} />
        </div>
        <ChevronRight
          size={16}
          className="text-gray-300 dark:text-gray-600 group-hover:text-navy dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200 mt-0.5"
        />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-navy dark:group-hover:text-blue-400 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {category.description}
        </p>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {category.links.length} link{category.links.length !== 1 ? 's' : ''}
      </p>
    </Link>
  )
}
