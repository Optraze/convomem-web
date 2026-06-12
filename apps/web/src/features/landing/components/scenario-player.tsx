import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Phone, MessageSquare, Headphones, Check } from 'lucide-react'

const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const

/* ─────────────────────────────────────────────────────────────────────────
   ScenarioPlayer — an auto-playing, looping "film" of real customer moments.
   It shows the OUTCOME the customer experiences (the AI already knows them),
   never the internal pipeline. Each scenario is a short scripted exchange that
   types itself out; a recall chip shows what the agent remembered. Scenarios
   advance automatically and can be selected manually. Honours reduced-motion
   by rendering the final state of each line immediately. ────────────────── */

interface Beat {
  who: 'customer' | 'agent'
  text: string
  recall?: string // shown as a "remembered" chip when the agent speaks
}
interface Scenario {
  key: string
  icon: typeof Phone
  channel: string
  title: string
  when: string
  beats: Beat[]
}

const SCENARIOS: Scenario[] = [
  {
    key: 'voice',
    icon: Phone,
    channel: 'Voice · inbound call',
    title: 'The returning caller',
    when: '3 weeks since last call',
    beats: [
      { who: 'customer', text: "Hi, I'm calling about my account again…" },
      {
        who: 'agent',
        text: 'Welcome back, Maria. I see your fibre install on the 14th went through — is this about the static IP you wanted to add?',
        recall: 'remembered · install date + open request',
      },
      { who: 'customer', text: 'Yes! Exactly that. How did you know?' },
      {
        who: 'agent',
        text: "It's all on file. I've already drafted the change — want me to apply it now?",
      },
    ],
  },
  {
    key: 'chat',
    icon: MessageSquare,
    channel: 'Chat · web widget',
    title: 'The frustrated customer',
    when: '2nd message this week',
    beats: [
      {
        who: 'customer',
        text: "My order STILL hasn't shipped. This is ridiculous.",
      },
      {
        who: 'agent',
        text: "I completely understand — order #4471 has been delayed twice now, and I'm sorry. I've escalated it and added a credit to your account.",
        recall: 'remembered · order #4471 · prior delay',
      },
      { who: 'customer', text: 'Oh. Okay, thank you — that actually helps.' },
      {
        who: 'agent',
        text: "You won't have to explain this again. I've noted the whole history.",
      },
    ],
  },
  {
    key: 'support',
    icon: Headphones,
    channel: 'Support · renewal',
    title: 'The expansion moment',
    when: 'renewal due · Q3',
    beats: [
      {
        who: 'customer',
        text: "We're thinking about adding more seats next quarter.",
      },
      {
        who: 'agent',
        text: 'Great timing — last quarter you mentioned scaling the support team to 20. Want me to quote 20 seats on the annual plan you preferred?',
        recall: 'remembered · team-size goal + plan preference',
      },
      { who: 'customer', text: "That's perfect. Send it over." },
      { who: 'agent', text: 'Done — invoice is on its way to billing.' },
    ],
  },
]

function useTypewriter(text: string, active: boolean, reduce: boolean) {
  const [out, setOut] = useState(reduce ? text : '')
  useEffect(() => {
    if (reduce || !active) {
      setOut(text)
      return
    }
    setOut('')
    let i = 0
    const id = window.setInterval(() => {
      i += 2
      setOut(text.slice(0, i))
      if (i >= text.length) window.clearInterval(id)
    }, 16)
    return () => window.clearInterval(id)
  }, [text, active, reduce])
  return out
}

function Bubble({
  beat,
  show,
  typing,
  reduce,
}: {
  beat: Beat
  show: boolean
  typing: boolean
  reduce: boolean
}) {
  const typed = useTypewriter(beat.text, typing, reduce)
  const isAgent = beat.who === 'agent'
  if (!show) return null
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
    >
      {isAgent && beat.recall && (
        <span
          style={MONO}
          className="mb-1.5 inline-flex items-center gap-1.5 text-hint text-[10px] tracking-[0.04em]"
        >
          <Check size={10} className="text-foreground" /> {beat.recall}
        </span>
      )}
      <div
        className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl ${
          isAgent
            ? 'bg-foreground text-background rounded-bl-sm'
            : 'bg-muted text-foreground border border-border rounded-br-sm'
        }`}
        style={{ fontSize: '13px', lineHeight: 1.55 }}
      >
        {typing ? typed : beat.text}
        {typing && typed.length < beat.text.length && (
          <span className="caret-blink">▍</span>
        )}
      </div>
    </motion.div>
  )
}

export function ScenarioPlayer() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [step, setStep] = useState(0) // how many beats are visible
  const advance = useRef<number>(0)

  const scn = SCENARIOS[active]

  // Drive the beats of the current scenario, then move to the next scenario.
  useEffect(() => {
    if (reduce) {
      setStep(scn.beats.length)
      return
    }
    setStep(0)
    let i = 0
    const tick = () => {
      i += 1
      setStep(i)
      if (i < scn.beats.length) {
        // dwell longer on agent lines (they carry the payoff)
        const delay = scn.beats[i]?.who === 'agent' ? 2200 : 1500
        advance.current = window.setTimeout(tick, delay)
      } else {
        advance.current = window.setTimeout(
          () => setActive((a) => (a + 1) % SCENARIOS.length),
          2600
        )
      }
    }
    advance.current = window.setTimeout(tick, 700)
    return () => window.clearTimeout(advance.current)
  }, [active, reduce, scn.beats.length])

  const Icon = scn.icon

  return (
    <div className="rounded-xl border border-border-strong bg-surface overflow-hidden">
      {/* scenario selector tabs */}
      <div className="flex items-stretch border-b border-border divide-x divide-border">
        {SCENARIOS.map((s, i) => {
          const on = i === active
          const TabIcon = s.icon
          return (
            <button
              key={s.key}
              onClick={() => setActive(i)}
              className={`group flex-1 flex items-center gap-2 px-3 sm:px-4 py-3 text-left transition-colors ${on ? 'bg-background' : 'hover:bg-muted/50'}`}
            >
              <TabIcon
                size={14}
                className={
                  on ? 'text-foreground' : 'text-hint group-hover:text-subtle'
                }
              />
              <span className="min-w-0 hidden sm:block">
                <span
                  className={`block truncate ${on ? 'text-foreground' : 'text-subtle'}`}
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  {s.title}
                </span>
                <span
                  style={MONO}
                  className="block text-hint text-[9px] tracking-[0.1em] uppercase truncate"
                >
                  {s.channel.split(' · ')[0]}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* stage */}
      <div className="px-4 sm:px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon size={13} className="text-subtle" />
            <span style={MONO} className="text-subtle text-[11px]">
              {scn.channel}
            </span>
          </div>
          <span
            style={MONO}
            className="text-hint text-[10px] tracking-[0.1em] uppercase"
          >
            {scn.when}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={scn.key}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 min-h-[260px]"
          >
            {scn.beats.map((b, i) => (
              <Bubble
                key={i}
                beat={b}
                show={i < step}
                typing={i === step - 1}
                reduce={!!reduce}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* progress ticks */}
      <div className="flex items-center gap-1.5 px-4 sm:px-6 pb-4">
        {SCENARIOS.map((_, i) => (
          <span
            key={i}
            className={`h-[3px] rounded-full transition-all duration-500 ${i === active ? 'w-7 bg-foreground' : 'w-3 bg-border-strong'}`}
          />
        ))}
        <span
          style={MONO}
          className="ml-auto text-hint text-[10px] tracking-[0.14em] uppercase"
        >
          auto-playing
        </span>
      </div>
    </div>
  )
}
