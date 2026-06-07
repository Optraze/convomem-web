import { useEffect, useState } from 'react'

export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0] ?? 'top')

  useEffect(() => {
    const observers = ids.map((id) => {
      const element = document.getElementById(id)
      if (!element) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActive(id)
        },
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
      )

      observer.observe(element)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [ids])

  return active
}
