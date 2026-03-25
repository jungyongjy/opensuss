import { Link } from 'react-router-dom'
import Icon from './Icon'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:border-navy dark:hover:border-blue-400 hover:shadow-md transition-all"
    >
      <div className="rounded-lg bg-navy/10 dark:bg-blue-900/30 p-2.5">
        <Icon name={category.icon} size={22} className="text-navy dark:text-blue-400" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-navy dark:group-hover:text-blue-400 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {category.description}
        </p>
      </div>
    </Link>
  )
}
