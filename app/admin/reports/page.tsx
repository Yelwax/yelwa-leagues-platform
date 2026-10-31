import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { reviewReport, removeReportedMessage, muteUser } from '@/app/admin/actions'
import { wat } from '@/lib/events'
import { h1 } from '@/lib/ui'

type Ctx = { room_type: string; room_name: string; reported_id: string; reported_sender_id: string; messages: { id: string; sender_name: string; body: string; created_at: string }[] }

async function Content() {
  const supabase = await createClient()
  const { data: reports } = await supabase.from('reports').select('id, message_id, reason, context, status, created_at, reporter:profiles!reporter_id(full_name)').order('created_at', { ascending: false }).limit(50)
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className={h1}>Reported messages</h1>
      <p className="mt-3 text-sm">You only see a message when someone reports it, along with the ten before it. Pod chats are otherwise private.</p>
      {(reports ?? []).map((r) => {
        const c = r.context as Ctx
        const reporter = Array.isArray(r.reporter) ? r.reporter[0] : r.reporter
        const community = c.room_type === 'community'
        return (
          <div key={r.id} className={`mt-6 border-l-4 p-4 ${r.status === 'open' ? 'border-red-600 bg-white' : 'border-navy/30 bg-white/60'}`}>
            <p className="font-semibold text-navy">{c.room_name} ({c.room_type}) · {wat(r.created_at)} · {r.status}</p>
            <p className="text-sm">Reported by {reporter?.full_name ?? 'a member'}{r.reason ? `: ${r.reason}` : ''}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {c.messages.map((m) => <li key={m.id} className={m.id === c.reported_id ? 'font-bold text-red-700' : ''}>{m.sender_name}: {m.body || '(deleted)'}</li>)}
            </ul>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {r.status === 'open' && <form action={reviewReport.bind(null, r.id)}><button type="submit" className="rounded bg-navy px-3 py-1 font-semibold text-cream">Mark reviewed</button></form>}
              {community && <form action={removeReportedMessage.bind(null, r.id, r.message_id)}><button type="submit" className="rounded bg-red-700 px-3 py-1 font-semibold text-white">Delete message</button></form>}
              {community && <form action={muteUser.bind(null, c.reported_sender_id, 7)}><button type="submit" className="rounded bg-gold px-3 py-1 font-semibold text-navy">Mute sender 7 days</button></form>}
              {community && <form action={muteUser.bind(null, c.reported_sender_id, 0)}><button type="submit" className="px-3 py-1 text-navy underline">Lift mute</button></form>}
            </div>
            {!community && <p className="mt-3 text-sm">This is a pod chat. Talk to the pod's tutor, who can delete messages in their own room.</p>}
          </div>
        )
      })}
      {!reports?.length && <p className="mt-6">No reports.</p>}
      <p className="mt-8"><Link href="/admin" className="text-navy underline">Back to admin</Link></p>
    </div>
  )
}
export default function Page() {
  return <Suspense fallback={<div className="mx-auto max-w-3xl px-5 py-12"><p>Loading...</p></div>}><Content /></Suspense>
}
