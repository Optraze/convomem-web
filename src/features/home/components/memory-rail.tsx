import { SECTIONS } from '../data.ts'

export function MemoryRail({
  active,
  onJump,
}: {
  active: string
  onJump: (id: string) => void
}) {
  return (
    <aside className="fixed top-1/2 left-5 z-40 hidden w-14 -translate-y-1/2 select-none xl:block 2xl:left-8">
      <ol className="flex flex-col gap-4">
        {SECTIONS.map((section, index) => {
          const isActive = active === section.id

          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => onJump(section.id)}
                className="group flex w-full items-center gap-2.5 text-left"
                title={section.label}
                aria-label={`Jump to ${section.label}`}
              >
                <span
                  className={`tnum font-mono text-[10px] transition-colors ${
                    isActive
                      ? 'text-foreground'
                      : 'text-hint/70 group-hover:text-hint'
                  }`}
                >
                  {String(index).padStart(2, '0')}
                </span>
                <span
                  className={`h-px transition-all duration-300 ${
                    isActive
                      ? 'w-6 bg-foreground'
                      : 'w-3 bg-foreground/15 group-hover:w-5 group-hover:bg-foreground/35'
                  }`}
                />
              </button>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
