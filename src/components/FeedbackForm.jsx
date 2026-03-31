import { useState } from 'react'

const FORMSPREE_URL = 'https://formspree.io/f/mqegklop'

export default function FeedbackForm() {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, message }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="max-w-xl mx-auto px-4 py-10">
      <h2 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
        Suggest a link
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Found something missing? Let us know.
      </p>

      {status === 'success' ? (
        <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-5 py-4 text-sm font-medium">
          Thanks for your feedback!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {status === 'error' && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-5 py-3 text-sm">
              Something went wrong. Please try again.
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === 'submitting'}
              placeholder="Your name"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Suggestion or feedback <span className="text-suss-red">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={status === 'submitting'}
              rows={4}
              placeholder="e.g. Add a link to the SUSS alumni portal"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50 resize-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="self-start flex items-center gap-2 bg-navy dark:bg-blue-700 hover:bg-navy/90 dark:hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {status === 'submitting' ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Sending…
              </>
            ) : (
              'Send feedback'
            )}
          </button>
        </form>
      )}
    </section>
  )
}
