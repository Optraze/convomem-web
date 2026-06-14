interface BlogTemplateProps {
  title: string
  description?: string
  date?: string
  author?: string
  tags?: string[]
}

export function BlogTemplate({
  title,
  description,
  date,
  author,
  tags,
}: BlogTemplateProps) {
  return (
    <div
      tw="w-full h-full flex flex-col justify-between p-12"
      style={{
        background:
          'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div tw="flex items-center justify-between">
        <div tw="flex items-center gap-3">
          <div
            tw="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: '#fafafa' }}
          >
            <div tw="w-3 h-3 rounded-full" style={{ background: '#0a0a0a' }} />
          </div>
          <span tw="text-white text-xl font-semibold">ConvoMem</span>
        </div>
        <span
          tw="text-gray-500 text-sm font-mono px-3 py-1 rounded-full"
          style={{ border: '1px solid #333' }}
        >
          Blog
        </span>
      </div>

      <div>
        <h1 tw="text-white text-5xl font-bold leading-tight mb-4 max-w-[900px]">
          {title}
        </h1>
        {description && (
          <p tw="text-gray-400 text-xl max-w-[700px] leading-relaxed mb-6">
            {description}
          </p>
        )}
        <div tw="flex items-center gap-4">
          {author && <span tw="text-gray-400 text-sm">{author}</span>}
          {date && (
            <span tw="text-gray-500 text-sm font-mono">
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
        {tags && tags.length > 0 && (
          <div tw="flex items-center gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                tw="text-xs font-mono px-2 py-1 rounded-md text-gray-400"
                style={{ background: '#1f1f2e', border: '1px solid #333' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div tw="flex items-center gap-2">
        <div tw="w-2 h-2 rounded-full bg-green-400" />
        <span tw="text-gray-500 text-sm font-mono">convomem.com</span>
      </div>
    </div>
  )
}
