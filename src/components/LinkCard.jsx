import { ExternalLink } from 'lucide-react'

export default function LinkCard({ link }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:border-navy dark:hover:border-blue-400 hover:shadow-md transition-all"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-navy dark:group-hover:text-blue-400 transition-colors leading-snug">
            {link.name}
          </h3>
          <ExternalLink
            size={14}
            className="shrink-0 mt-0.5 text-gray-400 dark:text-gray-500 group-hover:text-navy dark:group-hover:text-blue-400 transition-colors"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {link.description}
        </p>
      </div>
      {link.portalPath && (
        <span className="mt-3 inline-block text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-full px-2.5 py-1 leading-snug">
          {link.portalPath}
        </span>
      )}
    </a>
  )
}
