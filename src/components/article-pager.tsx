import { Link } from '@tanstack/react-router'

export function ArticlePager({
  section,
  prev,
  next,
}: {
  section: 'blog' | 'changelog'
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}) {
  if (!prev && !next) return null
  const route = section === 'blog' ? '/blog/$slug' : '/changelog/$slug'
  return (
    <nav
      className="article-pager"
      aria-label={section === 'blog' ? 'More articles' : 'More releases'}
    >
      {prev ? (
        <Link to={route} params={{ slug: prev.slug }}>
          <span>
            {section === 'blog' ? 'Previous article' : 'Newer release'}
          </span>
          <strong>{prev.title}</strong>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={route} params={{ slug: next.slug }}>
          <span>{section === 'blog' ? 'Next article' : 'Older release'}</span>
          <strong>{next.title}</strong>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
