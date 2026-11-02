'use client'
import { useState } from 'react'
import Link from 'next/link'
import { btn } from '@/lib/ui'

const stages = [
  { id: 'idea', label: 'I have an idea', note: 'Incubation is your starting point: how business really works, and how to build on what you have.' },
  { id: 'started', label: "I've just started", note: 'Incubation helps you build real foundations under what you have already begun.' },
  { id: 'running', label: 'I run a business', note: 'You may start in Incubation or Momentum, depending on how solid your foundations are.' },
  { id: 'stuck', label: "I'm stuck or not growing", note: 'Momentum is built for this: hands-on work on your own business, with a mentor beside you.' },
  { id: 'scale', label: 'I want to scale', note: 'Acceleration covers scaling, pitching and investor access, once the foundations are in place.' },
]

export default function StageSelector() {
  const [stage, setStage] = useState('')
  const [challenge, setChallenge] = useState('')
  const current = stages.find((s) => s.id === stage)
  const href = `/brochure?stage=${stage || ''}&challenge=${encodeURIComponent(challenge.trim())}`

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {stages.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={stage === s.id}
            onClick={() => setStage(s.id)}
            className={`rounded-full border px-4 py-2 text-left text-base transition active:scale-95 ${stage === s.id ? 'border-navy bg-navy text-cream' : 'border-navy/20 bg-white text-navy'}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      {current && (
        <p className="mt-4 max-w-xl border-l-4 border-gold pl-4 leading-relaxed">
          {current.note} We confirm your phase together in your interview.
        </p>
      )}
      <label className="mt-6 block font-semibold text-navy">What’s slowing your business down?
        <textarea
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          maxLength={300}
          rows={3}
          placeholder="e.g. Customers buy once and never come back."
          className="mt-1 w-full max-w-xl rounded-2xl border-0 bg-white px-4 py-3 text-base font-normal ring-1 ring-navy/15"
        />
      </label>
      <div className="mt-5"><Link href={href} className={btn}>Show me where to start</Link></div>
    </div>
  )
}
