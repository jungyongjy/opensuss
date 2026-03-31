import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Icon from './Icon'

const iconStyles = {
  academics:  { bg: 'bg-blue-100 dark:bg-blue-900/40',    icon: 'text-blue-700 dark:text-blue-400',    hover: 'hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20' },
  admin:      { bg: 'bg-violet-100 dark:bg-violet-900/40', icon: 'text-violet-700 dark:text-violet-400', hover: 'hover:border-violet-300 dark:hover:border-violet-500 hover:bg-violet-50/40 dark:hover:bg-violet-950/20' },
  library:    { bg: 'bg-teal-100 dark:bg-teal-900/40',    icon: 'text-teal-700 dark:text-teal-400',    hover: 'hover:border-teal-300 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/20' },
  career:     { bg: 'bg-orange-100 dark:bg-orange-900/40', icon: 'text-orange-700 dark:text-orange-400', hover: 'hover:border-orange-300 dark:hover:border-orange-500 hover:bg-orange-50/40 dark:hover:bg-orange-950/20' },
  financial:  { bg: 'bg-green-100 dark:bg-green-900/40',  icon: 'text-green-700 dark:text-green-400',  hover: 'hover:border-green-300 dark:hover:border-green-500 hover:bg-green-50/40 dark:hover:bg-green-950/20' },
  facilities: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', icon: 'text-indigo-700 dark:text-indigo-400', hover: 'hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20' },
  forms:      { bg: 'bg-amber-100 dark:bg-amber-900/40',  icon: 'text-amber-700 dark:text-amber-400',  hover: 'hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50/40 dark:hover:bg-amber-950/20' },
  notices:    { bg: 'bg-rose-100 dark:bg-rose-900/40',    icon: 'text-rose-700 dark:text-rose-400',    hover: 'hover:border-rose-300 dark:hover:border-rose-500 hover:bg-rose-50/40 dark:hover:bg-rose-950/20' },
}

export default function CategoryCard({ category }) {
  const style = iconStyles[category.slug] ?? {
    bg: 'bg-navy/10 dark:bg-blue-900/30',
    icon: 'text-navy dark:text-blue-400',
    hover: 'hover:border-navy/30 dark:hover:border-blue-500 hover:bg-navy/5 dark:hover:bg-blue-950/20',
  }

  return (
    <Link
      to={`/category/${category.slug}`}
      className={`group flex flex-col justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 ${style.hover} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className={`rounded-lg p-2.5 ${style.bg}`}>
          <Icon name={category.icon} size={22} className={style.icon} />
        </div>
        <ChevronRight
          size={16}
          className="text-gray-300 dark:text-gray-600 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 mt-0.5"
        />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {category.description}
        </p>
      </div>
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
        {category.links.length} link{category.links.length !== 1 ? 's' : ''}
      </p>
    </Link>
  )
}
