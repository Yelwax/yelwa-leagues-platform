import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { h1, wrap } from '@/lib/ui'

async function Content() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [{ data: rooms }, { data: reads }] = await Promise.all([
    supabase.from('rooms').select('id, type, name, pods(name)'),
    supabase.from('room_reads').select('room_id, last_read_at').eq('profile_id', user!.id),
  ])
  const last = new Map((reads ?? []).map((r) => [r.room_id, r.last_read_at]))
  const list = await Promise.all((rooms ?? []).map(async (r) => {
    let q = supabase.from('messages').select('id', { count: 'exact', head: true }).eq('room_id', r.id).neq('sender_id', user!.id).is('deleted_at', null)
    const since = last.get(r.id)
    if (since) q = q.gt('created_at', since)
    const { count } = await q
    const pod = Array.isArray(r.pods) ? r.pods[0] : r.pods
    return { id: r.id, type: r.type, title: r.type === 'community' ? 'Community' : `${pod?.name ?? r.name} (pod)`, unread: count ?? 0 }
  }))
  list.sort((a, b) => (a.type === 'community' ? 1 : 0) - (b.type === 'community' ? 1 : 0))
  return (
    <div className={wrap}>
      <h1 className={h1}>Chat</h1>
      <ul className="mt-6 divide-y divide-navy/15 border-y border-navy/15">
        {list.map((r) => (
          <li key={r.id}><Link href={`/app/chat/${r.id}`} className="flex items-center justify-between py-4">
            <span className="font-semibold text-navy">{r.title}</span>
            {r.unread > 0 && <span className="rounded-full bg-forest px-3 py-1 text-sm font-semibold text-white">{r.unread} new</span>}
          </Link></li>
        ))}
        {!list.length && <li className="py-4">No rooms yet.</li>}
      </ul>
    </div>
  )
}
export default function Page() {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content /></Suspense>
}
