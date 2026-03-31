import Icon from './Icon'
import { quickAccessLinks } from '../data/links'

const colorMap = {
  blue:   { bg: 'bg-blue-100 dark:bg-blue-900/40',    icon: 'text-blue-600 dark:text-blue-400',    cardHover: 'group-hover:border-blue-200 dark:group-hover:border-blue-700 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-950/20' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/40', icon: 'text-violet-600 dark:text-violet-400', cardHover: 'group-hover:border-violet-200 dark:group-hover:border-violet-700 group-hover:bg-violet-50/50 dark:group-hover:bg-violet-950/20' },
  sky:    { bg: 'bg-sky-100 dark:bg-sky-900/40',       icon: 'text-sky-600 dark:text-sky-400',      cardHover: 'group-hover:border-sky-200 dark:group-hover:border-sky-700 group-hover:bg-sky-50/50 dark:group-hover:bg-sky-950/20' },
  teal:   { bg: 'bg-teal-100 dark:bg-teal-900/40',    icon: 'text-teal-600 dark:text-teal-400',    cardHover: 'group-hover:border-teal-200 dark:group-hover:border-teal-700 group-hover:bg-teal-50/50 dark:group-hover:bg-teal-950/20' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-900/40', icon: 'text-orange-600 dark:text-orange-400', cardHover: 'group-hover:border-orange-200 dark:group-hover:border-orange-700 group-hover:bg-orange-50/50 dark:group-hover:bg-orange-950/20' },
  amber:  { bg: 'bg-amber-100 dark:bg-amber-900/40',  icon: 'text-amber-600 dark:text-amber-400',  cardHover: 'group-hover:border-amber-200 dark:group-hover:border-amber-700 group-hover:bg-amber-50/50 dark:group-hover:bg-amber-950/20' },
}

const fallback = { bg: 'bg-navy/10 dark:bg-blue-900/30', icon: 'text-navy dark:text-blue-400', cardHover: 'group-hover:border-navy/20 dark:group-hover:border-blue-700 group-hover:bg-navy/5 dark:group-hover:bg-blue-950/20' }

export default function QuickAccess() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-1 h-4 bg-suss-red rounded-sm shrink-0" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Quick Access
        </h2>
      </div>
      <div className="grid grid-cols-3 md:flex md:flex-wrap gap-3">
        {quickAccessLinks.map((item, i) => {
          const colors = colorMap[item.color] ?? fallback
          return (
            <a
              key={item.name}
              href={item.href}
              style={{ animationDelay: `${i * 50}ms` }}
              target="_blank"
              rel="noopener noreferrer"
              className={`animate-fade-up group flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-5 ${colors.cardHover} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center min-w-[100px] md:flex-1`}
            >
              <div className={`rounded-lg ${colors.bg} p-2.5 transition-colors duration-200`}>
                <Icon name={item.icon} size={22} className={colors.icon} />
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-tight">
                {item.name}
              </span>
              {item.sublabel && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight -mt-1">
                  {item.sublabel}
                </span>
              )}
            </a>
          )
        })}
      </div>
    </section>
  )
}
