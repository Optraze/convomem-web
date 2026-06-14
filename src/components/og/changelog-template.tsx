import { clampTitle, Frame, formatOgDate } from './frame'

interface ChangelogTemplateProps {
  title: string
  description?: string
  date?: string
}

export function ChangelogTemplate({
  title,
  description,
  date,
}: ChangelogTemplateProps) {
  const formattedDate = formatOgDate(date)
  return (
    <Frame badge="Changelog">
      <div tw="flex items-center gap-4 mb-4">
        <h1 tw="text-white text-6xl font-bold leading-tight">
          {clampTitle(title, 40)}
        </h1>
        {formattedDate && (
          <span
            tw="text-gray-500 text-lg"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {formattedDate}
          </span>
        )}
      </div>
      {description && (
        <p tw="text-gray-400 text-2xl max-w-[760px] leading-relaxed">
          {description}
        </p>
      )}
    </Frame>
  )
}
