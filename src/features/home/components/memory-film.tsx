import { useEffect, useRef, useState } from 'react'
import {
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { Logo } from '@/components/logo'
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'

import { useMarketingReducedMotion } from '../hooks/use-marketing-reduced-motion'

const FILM_URL = '/media/convomem-film/v4.html'
const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
type FilmState = {
  playing: boolean
  muted: boolean
  time: number
  duration: number
}

function FilmPlayer({
  suspended = false,
  onExpand,
}: {
  suspended?: boolean
  onExpand?: () => void
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const player = useRef<HTMLDivElement>(null)
  const reduced = useMarketingReducedMotion()
  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(false)
  const [visible, setVisible] = useState(true)
  const [userPaused, setUserPaused] = useState(false)
  const [state, setState] = useState<FilmState>({
    playing: false,
    muted: true,
    time: 0,
    duration: 155000,
  })
  const complete = state.time >= state.duration - 10
  const send = (action: string, time?: number) => {
    const child = frame.current?.contentWindow as
      | (Window & {
          convomemFilm?: { control: (action: string, time?: number) => void }
        })
      | null
    // A synchronous same-origin call preserves the user gesture for browsers
    // that require it when starting or unmuting media inside an iframe.
    if (child?.convomemFilm) child.convomemFilm.control(action, time)
    else
      child?.postMessage(
        { type: 'convomem-film-control', action, time },
        window.location.origin
      )
  }

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.source !== frame.current?.contentWindow ||
        event.origin !== window.location.origin ||
        event.data?.type !== 'convomem-film-state'
      )
        return
      const data = event.data
      if (
        typeof data.playing !== 'boolean' ||
        typeof data.muted !== 'boolean' ||
        !Number.isFinite(data.time) ||
        !Number.isFinite(data.duration) ||
        data.duration <= 0
      )
        return
      setReady(true)
      setState({
        playing: data.playing,
        muted: data.muted,
        time: data.time,
        duration: data.duration,
      })
    }
    const observer = new IntersectionObserver(
      ([entry]) =>
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.3),
      { threshold: 0.3 }
    )
    if (player.current) observer.observe(player.current)
    const visibility = () => setVisible(!document.hidden)
    visibility()
    window.addEventListener('message', receive)
    // SSR can load the HTML film before React hydrates and attaches onLoad.
    frame.current?.contentWindow?.postMessage(
      { type: 'convomem-film-control', action: 'status' },
      window.location.origin
    )
    document.addEventListener('visibilitychange', visibility)
    return () => {
      observer.disconnect()
      window.removeEventListener('message', receive)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    frame.current?.contentWindow?.postMessage(
      {
        type: 'convomem-film-control',
        action:
          inView &&
          visible &&
          !suspended &&
          !userPaused &&
          !complete &&
          !reduced
            ? 'play'
            : 'pause',
      },
      window.location.origin
    )
  }, [ready, inView, visible, suspended, userPaused, complete, reduced])

  const togglePlayback = () => {
    if (complete) send('replay')
    else send(state.playing ? 'pause' : 'play')
    setUserPaused(state.playing && !complete)
  }
  const playbackLabel = state.playing
    ? 'Pause film'
    : complete
      ? 'Replay film'
      : 'Play film'

  return (
    <div className="film-player" ref={player}>
      <div className="film-viewport">
        {!ready && (
          <div className="film-loading" aria-hidden="true">
            <Logo appearance="dark" />
            <span>One memory. Every channel.</span>
          </div>
        )}
        {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: load handshakes initialize the external HTML player; interaction uses the buttons below. */}
        <iframe
          ref={frame}
          src={`${FILM_URL}?embed`}
          title="ConvoMem full customer story with narration"
          allow="autoplay; fullscreen"
          allowFullScreen
          tabIndex={-1}
          onLoad={() => send('status')}
        />
        <button
          type="button"
          className="film-screen-toggle"
          data-playing={state.playing}
          onClick={togglePlayback}
          aria-label={playbackLabel}
          tabIndex={-1}
          disabled={!ready}
        >
          <span aria-hidden="true">
            {state.playing ? (
              <Pause size={25} />
            ) : complete ? (
              <RotateCcw size={25} />
            ) : (
              <Play size={25} />
            )}
          </span>
        </button>
      </div>
      <div className="film-controls">
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={playbackLabel}
          disabled={!ready}
        >
          {state.playing ? (
            <Pause size={17} />
          ) : complete ? (
            <RotateCcw size={17} />
          ) : (
            <Play size={17} />
          )}
        </button>
        <input
          className="film-seek"
          type="range"
          min={0}
          max={state.duration}
          step={100}
          value={state.time}
          aria-label="Film timeline"
          aria-valuetext={`${formatTime(state.time)} of ${formatTime(state.duration)}`}
          onChange={(event) => {
            setUserPaused(true)
            send('seek', Number(event.target.value))
          }}
          disabled={!ready}
        />
        <span className="film-time">
          {formatTime(state.time)} <span>/ {formatTime(state.duration)}</span>
        </span>
        <button
          className="film-sound"
          type="button"
          onClick={() => send('mute')}
          aria-label={state.muted ? 'Turn film sound on' : 'Mute film'}
          aria-pressed={!state.muted}
          disabled={!ready}
        >
          {state.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        {onExpand ? (
          <button type="button" onClick={onExpand} aria-label="Expand film">
            <Maximize2 size={17} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              player.current?.requestFullscreen?.().catch(() => {})
            }
            aria-label="Fullscreen film"
          >
            <Maximize2 size={17} />
          </button>
        )}
      </div>
    </div>
  )
}

export function MemoryFilm() {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <figure className="p-conversation-poster memory-film">
        <div className="film-eyebrow">
          <span>CONVOMEM IN MOTION</span>
          <span>Full film · 2:35 · Muted by default</span>
        </div>
        <FilmPlayer suspended={expanded} onExpand={() => setExpanded(true)} />
        <figcaption className="film-caption">
          <div>
            <strong>One customer. The whole story.</strong>
            <p>From conversation to memory, handoff, and insight.</p>
          </div>
          <button type="button" onClick={() => setExpanded(true)}>
            <Maximize2 size={14} /> Expand film
          </button>
        </figcaption>
      </figure>
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogPortal>
          <DialogOverlay className="film-backdrop" />
          <DialogPrimitive.Popup className="film-dialog">
            <header className="film-dialog-header">
              <DialogTitle>Context that follows your customer.</DialogTitle>
              <DialogClose aria-label="Close film">
                <X size={21} />
              </DialogClose>
            </header>
            {expanded && <FilmPlayer />}
            <div className="film-credits">
              <p>
                Illustrative customer story and product screens. Narration and
                music included; use the sound button to listen.
              </p>
              <p>
                Music: Warm Memories —{' '}
                <a
                  href="https://www.youtube.com/@KeysofMoonMusic"
                  target="_blank"
                  rel="noreferrer"
                >
                  Keys of Moon
                </a>
                .
              </p>
            </div>
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>
    </>
  )
}
