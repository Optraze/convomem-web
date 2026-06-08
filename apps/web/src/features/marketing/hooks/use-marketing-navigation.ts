import { useNavigate } from '@tanstack/react-router'

type UseMarketingNavigationOptions = {
  onNavigate?: () => void
}

export function useMarketingNavigation({
  onNavigate,
}: UseMarketingNavigationOptions = {}) {
  const navigate = useNavigate()

  const jumpToSection = (id: string) => {
    onNavigate?.()

    if (id === 'top') {
      if (window.location.pathname !== '/') {
        void navigate({ href: '/' })
        return
      }

      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const section = document.getElementById(id)

    if (!section) {
      void navigate({ href: `/#${id}` })
      return
    }

    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return { jumpToSection }
}
