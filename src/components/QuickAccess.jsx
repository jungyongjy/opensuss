import Icon from './Icon'
import { quickAccessLinks } from '../data/links'

export default function QuickAccess() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
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
            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-5 hover:border-navy dark:hover:border-blue-400 hover:bg-navy/5 dark:hover:bg-blue-900/20 hover:shadow-md transition-all duration-200 text-center min-w-[100px] md:flex-1"
          >
            <div className="rounded-lg bg-navy/8 dark:bg-blue-900/30 group-hover:bg-navy/15 dark:group-hover:bg-blue-900/50 p-2.5 transition-colors duration-200">
              <Icon name={item.icon} size={22} className="text-navy dark:text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 group-hover:text-navy dark:group-hover:text-blue-400 leading-tight transition-colors duration-200">
              {item.name}
            </span>
            {item.sublabel && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight -mt-1">
                {item.sublabel}
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  )
}
