'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function MessageButton({ otherId }: { otherId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function go() {
    setBusy(true); setError('')
    const { data, error: err } = await createClient().rpc('start_dm', { p_other: otherId })
    if (err || !data) { setError('Direct messages are not available with this member.'); setBusy(false); return }
    router.push(`/app/chat/${data}`)
  }
  return (
    <div className="mt-6">
      <button type="button" onClick={go} disabled={busy} className="rounded-full bg-gold px-8 py-3 font-semibold text-navy transition active:scale-95 disabled:opacity-60">{busy ? 'Opening...' : 'Message'}</button>
      {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>}
    </div>
  )
}
