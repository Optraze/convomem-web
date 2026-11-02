import { useEffect } from 'react'

/** Load optional analytics only after an explicit opt-in, including returning visits. */
export function AnalyticsConsent() {
  useEffect(() => {
    const load = () => {
      try {
        if (localStorage.getItem('cm-cookie-consent') !== 'all') return
      } catch {
        return
      }
      if (document.getElementById('cm-analytics')) return
      const bootstrap = document.createElement('script')
      bootstrap.id = 'cm-analytics'
      bootstrap.textContent =
        "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-47DNQJVNV6');"
      document.head.appendChild(bootstrap)
      const script = document.createElement('script')
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-47DNQJVNV6'
      script.async = true
      document.head.appendChild(script)
    }
    load()
    window.addEventListener('cm-consent-change', load)
    return () => window.removeEventListener('cm-consent-change', load)
  }, [])
  return null
}
