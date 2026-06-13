import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

/* ─────────────────────────────────────────────────────────────────────────
   Waveform — a thin monochrome signal line drawn on <canvas>. Voice and chat
   are the product's input, so a live audio-style waveform is the honest motif
   (not a decorative gradient). Uses currentColor so it adapts to the theme.

   `live` drives a travelling amplitude envelope so the line looks like it is
   actively "recording". When reduced-motion is set, it renders one static
   frame. ──────────────────────────────────────────────────────────────── */

export function Waveform({
  height = 48,
  bars = false,
  live = true,
  className = '',
  opacity = 1,
}: {
  height?: number
  bars?: boolean // discrete bars (hero) vs continuous line (dividers)
  live?: boolean
  className?: string
  opacity?: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let t = 0
    let w = 0
    let h = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Deterministic pseudo-random amplitudes — stable, no Math.random.
    const seed = (i: number) => {
      const s = Math.sin(i * 12.9898) * 43758.5453
      return s - Math.floor(s)
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const color = getComputedStyle(canvas).color || '#000'
      const mid = h / 2

      if (bars) {
        const gap = 5
        const bw = 2
        const n = Math.floor(w / gap)
        for (let i = 0; i < n; i++) {
          const env = reduce ? 1 : 0.55 + 0.45 * Math.sin(i * 0.25 - t * 0.05)
          const base = (0.25 + seed(i) * 0.75) * env
          const amp = base * (h * 0.46)
          ctx.fillStyle = color
          ctx.globalAlpha = (0.35 + 0.65 * base) * opacity
          ctx.fillRect(i * gap, mid - amp, bw, amp * 2)
        }
        ctx.globalAlpha = 1
      } else {
        ctx.beginPath()
        const step = 2
        for (let x = 0; x <= w; x += step) {
          const phase = reduce ? 0 : t * 0.03
          const env = Math.exp(
            -(((x / w - (((t * 0.004) % 1.4) - 0.2)) * 3.2) ** 2)
          )
          const y =
            mid +
            Math.sin(x * 0.05 + phase) * (h * 0.12) * (0.3 + env) +
            Math.sin(x * 0.013 - phase * 1.7) * (h * 0.18) * env
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = color
        ctx.globalAlpha = opacity
        ctx.lineWidth = 1.25
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      if (!reduce && live) {
        t += 1
        raf = requestAnimationFrame(draw)
      }
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [bars, live, reduce, opacity])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ width: '100%', height, display: 'block' }}
    />
  )
}
