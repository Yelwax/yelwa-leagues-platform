'use client'
import { useEffect, useState } from 'react'

export default function JoinButton({ startsAt, endsAt, url }: { startsAt: string; endsAt: string; url: string | null }) {
  const [state, setState] = useState<'wait' | 'open' | 'over'>('wait')
  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      const s = new Date(startsAt).getTime() - 15 * 60 * 1000
      setState(now > new Date(endsAt).getTime() ? 'over' : now >= s ? 'open' : 'wait')
    }
    tick()
    const t = setInterval(tick, 30000)
    return () => clearInterval(t)
  }, [startsAt, endsAt])
  if (!url) return <span className="text-sm">The class link will be added soon.</span>
  if (state === 'open') return <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block rounded bg-forest px-5 py-3 font-semibold text-white">Join class</a>
  return <span className="inline-block rounded bg-navy/15 px-5 py-3 font-semibold text-navy/60">{state === 'over' ? 'Class has ended' : 'Join opens 15 minutes before'}</span>
}
