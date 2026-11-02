'use client'
import { useEffect, useRef, useState } from 'react'

// Photo with a slanted edge that slides into place as it scrolls into view.
const shapes = {
  mobile: { start: 'polygon(0 0, 100% 0, 100% 52%, 0 100%)', end: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)' },
  left: { start: 'polygon(0 0, 100% 0, 45% 100%, 0 100%)', end: 'polygon(0 0, 100% 0, 86% 100%, 0 100%)' },
  right: { start: 'polygon(55% 0, 100% 0, 100% 100%, 0 100%)', end: 'polygon(14% 0, 100% 0, 100% 100%, 0 100%)' },
}

export default function DiagonalPhoto({ photo, name, flip }: { photo?: string; name: string; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [wide, setWide] = useState(false)
  const [calm, setCalm] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => setWide(mq.matches)
    sync(); mq.addEventListener('change', sync)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setCalm(reduce)
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting || reduce) { setShown(true); io.disconnect() } }, { threshold: 0.25 })
    if (ref.current) io.observe(ref.current)
    return () => { mq.removeEventListener('change', sync); io.disconnect() }
  }, [])

  const s = !wide ? shapes.mobile : flip ? shapes.right : shapes.left
  const initials = name.split(' ').map((w) => w[0]).slice(0, 3).join('')
  return (
    <div ref={ref} className={`relative h-80 md:h-auto md:min-h-[30rem] ${flip ? 'md:order-2' : ''}`}
      style={{ clipPath: shown || calm ? s.end : s.start, transition: calm ? 'none' : 'clip-path 1100ms cubic-bezier(.2,.7,.2,1)' }}>
      {photo
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={photo} alt={name} className="h-full w-full object-cover" />
        : <div role="img" aria-label={name} className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#C9A84C,transparent_55%),linear-gradient(135deg,#1B2A4A,#0D210D)] font-[Cambria,Georgia,serif] text-6xl font-bold text-gold/90">{initials}</div>}
    </div>
  )
}
