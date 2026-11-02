import { clampTitle, Frame } from './frame'

interface DocsTemplateProps {
  title: string
  description?: string
}

export function DocsTemplate({ title, description }: DocsTemplateProps) {
  return (
    <Frame badge="Docs">
      <h1 tw="text-[#172037] text-6xl font-bold leading-tight mb-4 max-w-[900px]">
        {clampTitle(title)}
      </h1>
      {description && (
        <p tw="text-[#627087] text-2xl max-w-[760px] leading-relaxed">
          {description}
        </p>
      )}
    </Frame>
  )
}
