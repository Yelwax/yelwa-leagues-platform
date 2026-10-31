import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { wat } from '@/lib/events'
import { h1, h2, wrap } from '@/lib/ui'

type E = { id: string; title: string; starts_at: string; audience_type: string; pods: { name: string } | { name: string }[] | null }
const who = (e: E) => {
  if (e.audience_type === 'all') return 'Everyone'
  if (e.audience_type === 'user') return 'Private session'
  const p = Array.isArray(e.pods) ? e.pods[0] : e.pods
  return p?.name ?? 'Your pod'
}

async function Content() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
  const now = new Date().toISOString()
  const [{ data: up }, { data: past }] = await Promise.all([
    supabase.from('events').select('id, title, starts_at, audience_type, pods(name)').gte('ends_at', now).order('starts_at').limit(100),
    supabase.from('events').select('id, title, starts_at, audience_type, pods(name)').lt('ends_at', now).order('starts_at', { ascending: false }).limit(10),
  ])
  const canSchedule = ['owner', 'team', 'tutor'].includes(me?.role ?? '')
  const row = (e: E) => (
    <li key={e.id}><Link href={`/app/calendar/${e.id}`} className="block py-3">
      <span className="font-semibold text-navy">{e.title}</span>
      <span className="block text-sm">{wat(e.starts_at)} · {who(e)}</span>
    </Link></li>
  )
  return (
    <div className={wrap}>
      <h1 className={h1}>Calendar</h1>
      <p className="mt-2 text-sm">All times are West Africa Time (WAT).</p>
      {canSchedule && <p className="mt-3"><Link href="/app/calendar/new" className="font-semibold text-navy underline">Schedule a class</Link></p>}
      <h2 className={`${h2} mt-8`}>Upcoming</h2>
      <ul className="mt-2 divide-y divide-navy/15 border-y border-navy/15">
        {((up ?? []) as E[]).map(row)}
        {!up?.length && <li className="py-3">No upcoming classes.</li>}
      </ul>
      {!!past?.length && <>
        <h2 className={`${h2} mt-8`}>Recent classes</h2>
        <ul className="mt-2 divide-y divide-navy/15 border-y border-navy/15">{(past as E[]).map(row)}</ul>
      </>}
    </div>
  )
}
export default function Page() {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content /></Suspense>
}
