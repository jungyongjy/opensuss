import { ExternalLink, Phone, Mail } from 'lucide-react'

function Breadcrumb({ path }) {
  const parts = path.split(' → ')
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
            i === 0
              ? 'bg-navy/10 dark:bg-blue-900/40 text-navy dark:text-blue-300'
              : i === parts.length - 1
              ? 'bg-suss-red/10 dark:bg-red-900/30 text-suss-red dark:text-red-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}>
            {part}
          </span>
          {i < parts.length - 1 && (
            <span className="text-gray-400 dark:text-gray-500 text-xs">›</span>
          )}
        </span>
      ))}
    </div>
  )
}

function ContactCard({ link }) {
  const isEmail = link.contactType === 'email'
  const IconComponent = isEmail ? Mail : Phone

  if (isEmail) {
    return (
      <a
        href={link.href}
        className="group flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:border-navy dark:hover:border-blue-400 hover:shadow-md transition-all"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-navy/10 dark:bg-blue-900/30 p-2 shrink-0">
            <IconComponent size={16} className="text-navy dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-navy dark:group-hover:text-blue-400 transition-colors leading-snug">
              {link.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {link.description}
            </p>
          </div>
          <ExternalLink size={14} className="shrink-0 mt-0.5 ml-auto text-gray-400 dark:text-gray-500 group-hover:text-navy dark:group-hover:text-blue-400 transition-colors" />
        </div>
      </a>
    )
  }

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-navy/10 dark:bg-blue-900/30 p-2 shrink-0">
          <IconComponent size={16} className="text-navy dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-snug">
            {link.name}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-200 mt-1 font-medium">
            {link.description}
          </p>
          {link.hours && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {link.hours}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function getHostname(href) {
  try {
    return new URL(href).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export default function LinkCard({ link }) {
  if (link.type === 'contact') {
    return <ContactCard link={link} />
  }

  const isPortalCard = link.portalPath != null
  const showUrl = !isPortalCard && link.href && !link.href.startsWith('mailto:')
  const hostname = showUrl ? getHostname(link.href) : null

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col justify-between rounded-xl border bg-white dark:bg-gray-800 p-5 hover:shadow-lg transition-all duration-200 ${
        isPortalCard
          ? 'border-l-2 border-l-navy/40 dark:border-l-blue-600/60 border-t border-r border-b border-gray-200 dark:border-gray-700 hover:border-l-navy dark:hover:border-l-blue-400 hover:border-t-gray-300 hover:border-r-gray-300 hover:border-b-gray-300 dark:hover:border-t-gray-600 dark:hover:border-r-gray-600 dark:hover:border-b-gray-600'
          : 'border-gray-200 dark:border-gray-700 hover:border-navy dark:hover:border-blue-400'
      }`}
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
        {link.note && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 italic">
            {link.note}
          </p>
        )}
        {isPortalCard && <Breadcrumb path={link.portalPath} />}
      </div>
      {hostname && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-600 truncate">
          {hostname}
        </p>
      )}
    </a>
  )
}
