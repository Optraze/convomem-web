import { clampTitle, Frame, formatOgDate } from './frame'

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
  const formattedDate = formatOgDate(date)
  return (
    <Frame badge="Blog">
      <h1 tw="text-[#172037] text-6xl font-bold leading-tight mb-4 max-w-[900px]">
        {clampTitle(title)}
      </h1>
      {description && (
        <p tw="text-[#627087] text-2xl max-w-[760px] leading-relaxed mb-6">
          {description}
        </p>
      )}
      <div tw="flex items-center gap-4">
        {author && <span tw="text-[#4f6387] text-lg">{author}</span>}
        {formattedDate && (
          <span
            tw="text-[#627087] text-lg"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {formattedDate}
          </span>
        )}
      </div>
      {tags && tags.length > 0 && (
        <div tw="flex items-center gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              tw="text-sm px-2 py-1 rounded-md text-[#627087]"
              style={{
                background: '#eaf0ff',
                border: '1px solid #ccd7f3',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Frame>
  )
}
