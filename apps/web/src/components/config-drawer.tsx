import type { SVGProps } from 'react'
import { RotateCcw, Settings } from 'lucide-react'
import { IconDir } from '@workspace/ui/assets/custom/icon-dir'
import { IconLayoutCompact } from '@workspace/ui/assets/custom/icon-layout-compact'
import { IconLayoutDefault } from '@workspace/ui/assets/custom/icon-layout-default'
import { IconLayoutFull } from '@workspace/ui/assets/custom/icon-layout-full'
import { IconSidebarFloating } from '@workspace/ui/assets/custom/icon-sidebar-floating'
import { IconSidebarInset } from '@workspace/ui/assets/custom/icon-sidebar-inset'
import { IconSidebarSidebar } from '@workspace/ui/assets/custom/icon-sidebar-sidebar'
import { IconThemeDark } from '@workspace/ui/assets/custom/icon-theme-dark'
import { IconThemeLight } from '@workspace/ui/assets/custom/icon-theme-light'
import { IconThemeSystem } from '@workspace/ui/assets/custom/icon-theme-system'
import { cn } from '@workspace/ui/lib/utils'
import { useDirection } from '@/context/direction-provider'
import type { Collapsible } from '@/context/layout-provider'
import { useLayout } from '@/context/layout-provider'
import { useTheme } from '@workspace/ui/components/theme-provider'
import { Button } from '@workspace/ui/components/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet'
import {
  RadioGroup,
  RadioGroupItem,
} from '@workspace/ui/components/radio-group'
import { useSidebar } from '@workspace/ui/components/sidebar'

export function ConfigDrawer() {
  const { setOpen } = useSidebar()
  const { resetDir } = useDirection()
  const { setTheme, defaultTheme } = useTheme()
  const { resetLayout } = useLayout()

  const handleReset = () => {
    setOpen(true)
    resetDir()
    setTheme(defaultTheme ?? 'system')
    resetLayout()
  }

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            size="icon"
            variant="ghost"
            aria-label="Open theme settings"
            className="rounded-full"
          />
        }
      >
        <Settings aria-hidden="true" />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="pb-0 text-start">
          <SheetTitle>Theme Settings</SheetTitle>
          <SheetDescription>
            Adjust the appearance and layout to suit your preferences.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 overflow-y-auto px-4">
          <ThemeConfig />
          <SidebarConfig />
          <LayoutConfig />
          <DirConfig />
        </div>
        <SheetFooter className="gap-2">
          <Button
            variant="destructive"
            onClick={handleReset}
            aria-label="Reset all settings to default values"
          >
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function SectionTitle({
  title,
  showReset = false,
  onReset,
  resetAriaLabel,
  className,
}: {
  title: string
  showReset?: boolean
  onReset?: () => void
  resetAriaLabel?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground',
        className
      )}
    >
      {title}
      {showReset && onReset && (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="size-4 rounded-full"
          onClick={onReset}
          aria-label={resetAriaLabel}
        >
          <RotateCcw className="size-3" />
        </Button>
      )}
    </div>
  )
}

function ThemeConfig() {
  const { defaultTheme, theme, setTheme } = useTheme()
  return (
    <div>
      <SectionTitle
        title="Theme"
        showReset={theme !== defaultTheme}
        onReset={() => setTheme(defaultTheme ?? 'system')}
        resetAriaLabel="Reset theme preference to default"
      />
      <RadioGroup
        value={theme}
        onValueChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}
        className="grid w-full max-w-md grid-cols-3 gap-4"
      >
        {[
          { value: 'system', label: 'System', icon: IconThemeSystem },
          { value: 'light', label: 'Light', icon: IconThemeLight },
          { value: 'dark', label: 'Dark', icon: IconThemeDark },
        ].map((item) => (
          <div key={item.value} className="flex flex-col items-center gap-1">
            <RadioGroupItem
              value={item.value}
              id={`theme-${item.value}`}
              className="peer sr-only"
            />
            <label
              htmlFor={`theme-${item.value}`}
              className="cursor-pointer rounded-[6px] ring-[1px] ring-border transition-all hover:ring-primary/50 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary"
            >
              <item.icon className="size-full" />
            </label>
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout()
  return (
    <div className="max-md:hidden">
      <SectionTitle
        title="Sidebar"
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
        resetAriaLabel="Reset sidebar style to default"
      />
      <RadioGroup
        value={variant}
        onValueChange={(v) => setVariant(v as 'inset' | 'sidebar' | 'floating')}
        className="grid w-full max-w-md grid-cols-3 gap-4"
      >
        {[
          { value: 'inset', label: 'Inset', icon: IconSidebarInset },
          { value: 'floating', label: 'Floating', icon: IconSidebarFloating },
          { value: 'sidebar', label: 'Sidebar', icon: IconSidebarSidebar },
        ].map((item) => (
          <div key={item.value} className="flex flex-col items-center gap-1">
            <RadioGroupItem
              value={item.value}
              id={`sidebar-${item.value}`}
              className="peer sr-only"
            />
            <label
              htmlFor={`sidebar-${item.value}`}
              className="cursor-pointer rounded-[6px] ring-[1px] ring-border transition-all hover:ring-primary/50 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary"
            >
              <item.icon className="size-full" />
            </label>
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

function LayoutConfig() {
  const { open, setOpen } = useSidebar()
  const { defaultCollapsible, collapsible, setCollapsible } = useLayout()

  const radioState = open ? 'default' : collapsible

  return (
    <div className="max-md:hidden">
      <SectionTitle
        title="Layout"
        showReset={radioState !== 'default'}
        onReset={() => {
          setOpen(true)
          setCollapsible(defaultCollapsible)
        }}
        resetAriaLabel="Reset layout options to default"
      />
      <RadioGroup
        value={radioState}
        onValueChange={(v) => {
          if (v === 'default') {
            setOpen(true)
            return
          }
          setOpen(false)
          setCollapsible(v as Collapsible)
        }}
        className="grid w-full max-w-md grid-cols-3 gap-4"
      >
        {[
          { value: 'default', label: 'Default', icon: IconLayoutDefault },
          { value: 'icon', label: 'Compact', icon: IconLayoutCompact },
          { value: 'offcanvas', label: 'Full layout', icon: IconLayoutFull },
        ].map((item) => (
          <div key={item.value} className="flex flex-col items-center gap-1">
            <RadioGroupItem
              value={item.value}
              id={`layout-${item.value}`}
              className="peer sr-only"
            />
            <label
              htmlFor={`layout-${item.value}`}
              className="cursor-pointer rounded-[6px] ring-[1px] ring-border transition-all hover:ring-primary/50 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary"
            >
              <item.icon className="size-full" />
            </label>
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

function DirConfig() {
  const { defaultDir, dir, setDir } = useDirection()
  return (
    <div>
      <SectionTitle
        title="Direction"
        showReset={defaultDir !== dir}
        onReset={() => setDir(defaultDir)}
        resetAriaLabel="Reset text direction to default"
      />
      <RadioGroup
        value={dir}
        onValueChange={(v) => setDir(v as 'ltr' | 'rtl')}
        className="grid w-full max-w-md grid-cols-3 gap-4"
      >
        {[
          {
            value: 'ltr',
            label: 'Left to Right',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir="ltr" {...props} />
            ),
          },
          {
            value: 'rtl',
            label: 'Right to Left',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir="rtl" {...props} />
            ),
          },
        ].map((item) => (
          <div key={item.value} className="flex flex-col items-center gap-1">
            <RadioGroupItem
              value={item.value}
              id={`dir-${item.value}`}
              className="peer sr-only"
            />
            <label
              htmlFor={`dir-${item.value}`}
              className="cursor-pointer rounded-[6px] ring-[1px] ring-border transition-all hover:ring-primary/50 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary"
            >
              <item.icon className="size-full" />
            </label>
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
