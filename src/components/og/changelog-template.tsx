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
        <h1 tw="text-[#172037] text-6xl font-bold leading-tight">
          {clampTitle(title, 40)}
        </h1>
        {formattedDate && (
          <span
            tw="text-[#627087] text-lg"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {formattedDate}
          </span>
        )}
      </div>
      {description && (
        <p tw="text-[#627087] text-2xl max-w-[760px] leading-relaxed">
          {description}
        </p>
      )}
    </Frame>
  )
}
