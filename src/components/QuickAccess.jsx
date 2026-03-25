import Icon from './Icon'
import { quickAccessLinks } from '../data/links'

export default function QuickAccess() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
        Quick Access
      </h2>
      <div className="grid grid-cols-3 md:flex md:flex-wrap gap-3">
        {quickAccessLinks.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:border-navy dark:hover:border-blue-400 hover:shadow-md transition-all text-center min-w-[100px] md:flex-1"
          >
            <Icon name={item.icon} size={24} className="text-navy dark:text-blue-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-tight">
              {item.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
