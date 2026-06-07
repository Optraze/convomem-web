import { useNavigate } from '@tanstack/react-router'

type UseMarketingNavigationOptions = {
  onNavigate?: () => void
}

export function useMarketingNavigation({
  onNavigate,
}: UseMarketingNavigationOptions = {}) {
  const navigate = useNavigate()

  const go = (href: string) => {
    onNavigate?.()
    void navigate({ href })
  }

  const jumpToSection = (id: string) => {
    onNavigate?.()

    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return { go, jumpToSection }
}
