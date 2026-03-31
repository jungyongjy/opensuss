/**
 * Mobile app deep linking for Canvas and Outlook.
 *
 * On mobile, intercepts link clicks and attempts to open the native app via
 * its URL scheme. Falls back to the web URL if the app isn't installed
 * (detected by the browser window not losing focus within 1.5s).
 */

const APP_SCHEMES = {
  'canvas.suss.edu.sg': (url) =>
    `canvas-courses://${url.hostname}${url.pathname}${url.search}${url.hash}`,
  'outlook.office365.com': () => 'ms-outlook://',
  'outlook.office.com': () => 'ms-outlook://',
}

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function toAppUrl(href) {
  try {
    const url = new URL(href)
    const scheme = APP_SCHEMES[url.hostname]
    return scheme ? scheme(url) : null
  } catch {
    return null
  }
}

function tryOpenApp(appUrl, fallbackUrl) {
  let appOpened = false
  const onBlur = () => { appOpened = true }
  window.addEventListener('blur', onBlur, { once: true })

  window.location.href = appUrl

  setTimeout(() => {
    window.removeEventListener('blur', onBlur)
    if (!appOpened) {
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
    }
  }, 1500)
}

/**
 * Drop-in onClick handler for any external link.
 * On mobile, attempts the native app deep link; on desktop, does nothing
 * (lets the default <a> behaviour proceed).
 */
export function handleAppClick(e, href) {
  if (!isMobile()) return

  const appUrl = toAppUrl(href)
  if (!appUrl) return

  e.preventDefault()
  tryOpenApp(appUrl, href)
}
