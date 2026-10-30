'use client'
import { useState } from 'react'
import { btn } from '@/lib/ui'

const input = 'mt-1 w-full rounded border border-navy/30 bg-white px-3 py-2 text-base'

export default function BrochureForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const f = new FormData(e.currentTarget)
    setStatus('sending')
    try {
      const res = await fetch('/api/brochure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: f.get('fullName'),
          email: f.get('email'),
          whatsapp: f.get('whatsapp'),
          company: f.get('company'),
          consent: f.get('consent') === 'on',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <div className="mt-8 border-l-4 border-gold bg-white p-5">
        <p className="text-lg font-bold text-navy">Thank you. Your brochure is ready.</p>
        <a href="/brochure.pdf" download className={`${btn} mt-4`}>Download the brochure</a>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <label className="block font-semibold text-navy">Full name
        <input name="fullName" required minLength={2} maxLength={100} autoComplete="name" className={input} />
      </label>
      <label className="block font-semibold text-navy">Email
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className="block font-semibold text-navy">WhatsApp number
        <input name="whatsapp" type="tel" required placeholder="08012345678" autoComplete="tel" className={input} />
      </label>
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className="flex items-start gap-3">
        <input name="consent" type="checkbox" required className="mt-1 h-5 w-5" />
        <span>I agree to be contacted by Yelwa Leagues about my enquiry.</span>
      </label>
      {error && <p role="alert" className="font-semibold text-red-700">{error}</p>}
      <button type="submit" disabled={status === 'sending'} className={`${btn} disabled:opacity-60`}>
        {status === 'sending' ? 'Sending...' : 'Get the brochure'}
      </button>
    </form>
  )
}
