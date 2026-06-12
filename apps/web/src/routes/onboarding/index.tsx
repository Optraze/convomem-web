import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  UserRound,
  SlidersHorizontal,
  Globe,
  ShieldCheck,
  Headset,
  Mic,
  MessagesSquare,
  TrendingUp,
  HeartCrack,
  BarChart3,
  Sparkles,
  Check,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'

import { useCurrentUser } from '@/features/auth/lib/use-current-user.ts'
import { OnboardingShell } from '@/features/onboarding/components/onboarding-shell.tsx'
import {
  useOnboardingDraft,
  useSaveOnboardingProgress,
  useFinalizeOnboarding,
  useCreateOrg,
  useUserOrgs,
} from '@/features/onboarding/lib/hooks.ts'

type UseCase = {
  label: string
  Icon: LucideIcon
  iconClass: string
  tileClass: string
  selectedClass: string
  dotClass: string
}

const USE_CASES: UseCase[] = [
  {
    label: 'Customer support automation',
    Icon: Headset,
    iconClass: 'text-blue-500',
    tileClass: 'bg-blue-500/10',
    selectedClass: 'border-blue-500/40 bg-blue-500/[0.06]',
    dotClass: 'bg-blue-500',
  },
  {
    label: 'Voice bot memory',
    Icon: Mic,
    iconClass: 'text-violet-500',
    tileClass: 'bg-violet-500/10',
    selectedClass: 'border-violet-500/40 bg-violet-500/[0.06]',
    dotClass: 'bg-violet-500',
  },
  {
    label: 'Chatbot context persistence',
    Icon: MessagesSquare,
    iconClass: 'text-emerald-500',
    tileClass: 'bg-emerald-500/10',
    selectedClass: 'border-emerald-500/40 bg-emerald-500/[0.06]',
    dotClass: 'bg-emerald-500',
  },
  {
    label: 'Sales intelligence',
    Icon: TrendingUp,
    iconClass: 'text-amber-500',
    tileClass: 'bg-amber-500/10',
    selectedClass: 'border-amber-500/40 bg-amber-500/[0.06]',
    dotClass: 'bg-amber-500',
  },
  {
    label: 'Churn prediction',
    Icon: HeartCrack,
    iconClass: 'text-rose-500',
    tileClass: 'bg-rose-500/10',
    selectedClass: 'border-rose-500/40 bg-rose-500/[0.06]',
    dotClass: 'bg-rose-500',
  },
  {
    label: 'Multi-channel analytics',
    Icon: BarChart3,
    iconClass: 'text-cyan-500',
    tileClass: 'bg-cyan-500/10',
    selectedClass: 'border-cyan-500/40 bg-cyan-500/[0.06]',
    dotClass: 'bg-cyan-500',
  },
  {
    label: 'Other',
    Icon: Sparkles,
    iconClass: 'text-slate-400',
    tileClass: 'bg-slate-400/10',
    selectedClass: 'border-slate-400/40 bg-slate-400/[0.06]',
    dotClass: 'bg-slate-400',
  },
]

const TEAM_SIZES = ['Just me', '2–10', '11–50', '51–200', '201–1000', '1000+']

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Vancouver',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Amsterdam',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export const Route = createFileRoute('/onboarding/')({
  component: OnboardingPage,
})

function OnboardingPage() {
  const navigate = useNavigate()
  const user = useCurrentUser()
  const { data: orgsData, isLoading: orgsLoading } = useUserOrgs()
  const [step, setStep] = useState(1)
  const [hydrating, setHydrating] = useState(true)

  // Step 1: Org
  const [orgName, setOrgName] = useState('')
  const [orgError, setOrgError] = useState('')

  // Step 2: About you
  const [profession, setProfession] = useState('')
  const [professionError, setProfessionError] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [useCase, setUseCase] = useState('')

  // Step 3: Preferences
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'
  )
  const [strictPii, setStrictPii] = useState(false)

  const {
    data: draft,
    isLoading: draftLoading,
    error: draftError,
  } = useOnboardingDraft()
  const saveProgressMutation = useSaveOnboardingProgress()
  const finalizeMutation = useFinalizeOnboarding({
    onSuccess: () => navigate({ to: '/dashboard' }),
  })
  const createOrgMutation = useCreateOrg({
    onSuccess: () => setStep(2),
  })

  // Hydrate saved draft
  useEffect(() => {
    if (draftLoading || orgsLoading) return

    // Already onboarded with orgs — go to dashboard
    if (user?.onboardedAt && orgsData?.orgs && orgsData.orgs.length > 0) {
      navigate({ to: '/dashboard' })
      return
    }

    // API failed or no draft — start fresh
    if (draftError || !draft) {
      setHydrating(false)
      return
    }

    if (draft.onboardedAt && orgsData?.orgs && orgsData.orgs.length > 0) {
      navigate({ to: '/dashboard' })
      return
    }
    if (draft.profession) setProfession(draft.profession)
    if (draft.teamSize) setTeamSize(draft.teamSize)
    if (draft.primaryUseCase) setUseCase(draft.primaryUseCase)
    if (draft.timezone) setTimezone(draft.timezone)
    if (typeof draft.strictPii === 'boolean') setStrictPii(draft.strictPii)
    // Map draft step (1=about you, 2=preferences) to UI step (2, 3)
    if (draft.step) setStep(draft.step === 1 ? 2 : 3)
    setHydrating(false)
  }, [draft, draftLoading, navigate, draftError, orgsData, orgsLoading, user])

  // ── Step 1: Org setup ──
  const orgSlug = orgName ? slugify(orgName) : ''

  function handleOrgSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!orgName.trim()) {
      setOrgError('Organization name is required')
      return
    }
    setOrgError('')
    createOrgMutation.mutate({ name: orgName.trim(), slug: orgSlug })
  }

  // ── Step 2: About you ──
  function handleAboutYouContinue() {
    if (!profession.trim()) {
      setProfessionError('Please enter your profession')
      return
    }
    setProfessionError('')
    saveProgressMutation.mutate(
      {
        step: 2,
        profession: profession.trim(),
        teamSize,
        primaryUseCase: useCase,
      },
      { onSuccess: () => setStep(3) }
    )
  }

  // ── Step 3: Preferences ──
  function handleComplete() {
    finalizeMutation.mutate({ timezone, strictPii })
  }

  if (hydrating || draftLoading) {
    return (
      <div
        className="flex min-h-dvh items-center justify-center bg-background"
        role="status"
        aria-label="Loading onboarding"
      >
        <div className="size-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    )
  }

  const stepIcons: Record<number, LucideIcon> = {
    1: Building2,
    2: UserRound,
    3: SlidersHorizontal,
  }

  const stepTitles: Record<number, string> = {
    1: 'Create your organization',
    2: 'Tell us about yourself',
    3: 'Set your preferences',
  }

  const stepSubtitles: Record<number, string> = {
    1: "This is your team's workspace for conversations, customers, and analytics. You can invite teammates and adjust settings once you're in.",
    2: 'A few details so we can tailor ConvoMem to how your team works.',
    3: 'Final touches — these apply across your workspace and can be changed anytime.',
  }

  return (
    <OnboardingShell
      current={step}
      icon={stepIcons[step]}
      title={stepTitles[step]}
      subtitle={stepSubtitles[step]}
    >
      {/* ── Step 1: Organization ── */}
      {step === 1 && (
        <form onSubmit={handleOrgSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="org-name" className="text-muted-foreground text-xs">
              Organization name
            </Label>
            <Input
              id="org-name"
              type="text"
              autoFocus
              value={orgName}
              onChange={(e) => {
                setOrgName(e.target.value)
                if (e.target.value.trim()) setOrgError('')
              }}
              placeholder="Acme Corp"
              className="h-10 rounded-xl px-3 text-sm"
              aria-invalid={!!orgError}
              aria-describedby={
                orgError
                  ? 'org-name-error'
                  : orgSlug
                    ? 'org-name-slug'
                    : undefined
              }
            />
            {orgSlug && !orgError && (
              <p id="org-name-slug" className="text-muted-foreground text-xs">
                Workspace URL:{' '}
                <span className="font-medium text-foreground">{orgSlug}</span>
              </p>
            )}
            {orgError && (
              <p
                id="org-name-error"
                role="alert"
                className="text-destructive text-xs"
              >
                {orgError}
              </p>
            )}
          </div>

          {createOrgMutation.error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive text-sm"
            >
              {(createOrgMutation.error as { message?: string })?.message ||
                'Failed to create organization'}
            </div>
          )}

          <Button
            type="submit"
            disabled={createOrgMutation.isPending || !orgName.trim()}
            className="h-10 w-full rounded-xl"
          >
            {createOrgMutation.isPending ? (
              'Creating organization…'
            ) : (
              <span className="inline-flex items-center gap-1.5">
                Continue <ArrowRight className="size-4" />
              </span>
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            Includes a 7-day free trial — no credit card required.
          </p>
        </form>
      )}

      {/* ── Step 2: About you ── */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="profession"
              className="text-muted-foreground text-xs"
            >
              What's your role?
            </Label>
            <Input
              id="profession"
              type="text"
              autoFocus
              value={profession}
              onChange={(e) => {
                setProfession(e.target.value)
                setProfessionError('')
              }}
              placeholder="e.g. VP Engineering, Head of Support…"
              className="h-10 rounded-xl px-3 text-sm"
              aria-invalid={!!professionError}
              aria-describedby={
                professionError ? 'profession-error' : undefined
              }
            />
            {professionError && (
              <p
                id="profession-error"
                role="alert"
                className="text-destructive text-xs"
              >
                {professionError}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">Team size</Label>
            <div className="grid grid-cols-3 gap-2.5">
              {TEAM_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={teamSize === size}
                  onClick={() => setTeamSize(size)}
                  className={`cursor-pointer rounded-lg border px-3 py-2.5 text-center text-[12.5px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                    teamSize === size
                      ? 'border-primary/70 bg-accent text-foreground shadow-sm shadow-black/[0.04]'
                      : 'border-border bg-surface text-muted-foreground hover:-translate-y-0.5 hover:border-border hover:bg-accent/40 hover:text-foreground hover:shadow-sm hover:shadow-black/[0.04]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">
              Primary use case
            </Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {USE_CASES.map(
                ({
                  label,
                  Icon,
                  iconClass,
                  tileClass,
                  selectedClass,
                  dotClass,
                }) => {
                  const active = useCase === label
                  return (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setUseCase(label)}
                      className={`group flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[12.5px] leading-tight transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                        active
                          ? `${selectedClass} text-foreground shadow-sm shadow-black/[0.04]`
                          : 'border-border bg-surface text-muted-foreground hover:-translate-y-0.5 hover:border-border hover:bg-accent/40 hover:text-foreground hover:shadow-sm hover:shadow-black/[0.04]'
                      }`}
                    >
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          active ? 'bg-background' : tileClass
                        }`}
                      >
                        <Icon size={14} className={iconClass} strokeWidth={2} />
                      </span>
                      <span className="flex-1">{label}</span>
                      <span
                        className={`flex size-4 shrink-0 items-center justify-center rounded-full transition-transform ${
                          active ? `${dotClass} scale-100` : 'scale-0'
                        }`}
                      >
                        <Check
                          size={10}
                          className="text-white"
                          strokeWidth={3}
                        />
                      </span>
                    </button>
                  )
                }
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="gap-1.5"
            >
              <ArrowLeft className="size-4" /> Back
            </Button>
            <Button
              type="button"
              onClick={handleAboutYouContinue}
              disabled={saveProgressMutation.isPending}
              className="h-10 flex-1 rounded-xl"
            >
              {saveProgressMutation.isPending ? (
                'Saving…'
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  Continue <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Preferences ── */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs">Timezone</Label>
            <div className="relative">
              <Globe
                size={14}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
              />
              <Select
                value={timezone}
                onValueChange={(value) => value && setTimezone(value)}
              >
                <SelectTrigger className="h-10 rounded-xl pl-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz} className="text-sm">
                      {tz.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-muted-foreground text-xs">
              Used for reports, schedules, and activity timestamps.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setStrictPii(!strictPii)}
            aria-pressed={strictPii}
            className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
              strictPii
                ? 'border-primary/40 bg-primary/[0.05]'
                : 'border-border bg-surface hover:border-border'
            }`}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={17}
                className={`mt-0.5 ${strictPii ? 'text-emerald-500' : 'text-muted-foreground'}`}
              />
              <div>
                <div className="text-[13.5px] font-medium text-foreground">
                  Strict PII filtering
                </div>
                <div className="text-xs leading-relaxed text-muted-foreground">
                  Automatically redact phone numbers, emails, SSNs, and card
                  numbers before storage.
                </div>
              </div>
            </div>
            <span
              className={`relative size-6 shrink-0 rounded-full transition-colors ${
                strictPii ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`absolute top-1 size-4 rounded-full bg-background shadow-sm transition-transform ${
                  strictPii ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </span>
          </button>

          {finalizeMutation.error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive text-sm"
            >
              {(finalizeMutation.error as { message?: string })?.message ||
                'Failed to complete onboarding'}
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(2)}
              className="gap-1.5"
            >
              <ArrowLeft className="size-4" /> Back
            </Button>
            <Button
              type="button"
              onClick={handleComplete}
              disabled={finalizeMutation.isPending}
              className="h-10 flex-1 rounded-xl"
            >
              {finalizeMutation.isPending ? (
                'Finalizing…'
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  Enter workspace <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </OnboardingShell>
  )
}
