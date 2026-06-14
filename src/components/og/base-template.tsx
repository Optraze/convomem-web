interface BaseTemplateProps {
  title: string
  description?: string
  siteName?: string
}

export function BaseTemplate({
  title,
  description,
  siteName = 'ConvoMem',
}: BaseTemplateProps) {
  return (
    <div
      tw="w-full h-full flex flex-col justify-between p-12"
      style={{
        background:
          'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div tw="flex items-center gap-3">
        <div
          tw="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: '#fafafa' }}
        >
          <div tw="w-3 h-3 rounded-full" style={{ background: '#0a0a0a' }} />
        </div>
        <span tw="text-white text-xl font-semibold">{siteName}</span>
      </div>

      <div>
        <h1 tw="text-white text-5xl font-bold leading-tight mb-4 max-w-[900px]">
          {title}
        </h1>
        {description && (
          <p tw="text-gray-400 text-xl max-w-[700px] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div tw="flex items-center gap-2">
        <div tw="w-2 h-2 rounded-full bg-green-400" />
        <span tw="text-gray-500 text-sm font-mono">convomem.com</span>
      </div>
    </div>
  )
}
