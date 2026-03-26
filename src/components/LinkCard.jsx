import { useState } from 'react'
import { ExternalLink, Phone, Mail, Copy, Check, Flag } from 'lucide-react'

const FORMSPREE_URL = 'https://formspree.io/f/mqegklop'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function handleCopy(e) {
    e.preventDefault()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy email'}
      className="ml-1 p-0.5 rounded text-gray-400 hover:text-navy dark:hover:text-blue-400 transition-colors"
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
    </button>
  )
}

function ReportButton({ link }) {
  const [reported, setReported] = useState(false)
  function handleReport(e) {
    e.preventDefault()
    e.stopPropagation()
    if (reported) return
    setReported(true)
    fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ message: `Broken link: ${link.name} — ${link.href || 'no href'}` }),
    })
  }
  return (
    <button
      onClick={handleReport}
      title={reported ? 'Reported — thanks!' : 'Report broken link'}
      className={`shrink-0 p-0.5 rounded transition-all ${
        reported
          ? 'text-green-500 dark:text-green-400'
          : 'opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-600 hover:text-suss-red dark:hover:text-red-400'
      }`}
    >
      {reported ? <Check size={12} /> : <Flag size={12} />}
    </button>
  )
}

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
  // New-style card: has phone/email fields directly (no contactType)
  if (link.contactType == null) {
    const HeaderIcon = link.phone != null ? Phone : Mail
    return (
      <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-navy/10 dark:bg-blue-900/30 p-2 shrink-0">
            <HeaderIcon size={16} className="text-navy dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-snug">
              {link.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {link.description}
            </p>
            <div className="mt-2 space-y-1">
              {link.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-gray-400 dark:text-gray-500 shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">{link.phone}</span>
                </div>
              )}
              {link.email && (
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-gray-400 dark:text-gray-500 shrink-0" />
                  <a href={`mailto:${link.email}`} className="text-sm text-navy dark:text-blue-400 hover:underline break-all">
                    {link.email}
                  </a>
                  <CopyButton text={link.email} />
                </div>
              )}
            </div>
            {link.hours && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                {link.hours}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Legacy single-contact card
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
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <ReportButton link={link} />
            <ExternalLink
              size={14}
              className="text-gray-400 dark:text-gray-500 group-hover:text-navy dark:group-hover:text-blue-400 transition-colors"
            />
          </div>
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
