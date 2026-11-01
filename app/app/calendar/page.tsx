import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { card, wrap } from '@/lib/ui'

type E = { id: string; title: string; starts_at: string; ends_at: string; audience_type: string; pods: { name: string } | { name: string }[] | null }
const who = (e: E) => e.audience_type === 'all' ? 'Everyone' : e.audience_type === 'user' ? 'Private session' : (Array.isArray(e.pods) ? e.pods[0] : e.pods)?.name ?? 'Your pod'
const day = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' })
const dayLabel = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { timeZone: 'Africa/Lagos', weekday: 'long', day: 'numeric', month: 'long' })
const clock = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' })

async function Content() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
  const now = new Date()
  const iso = now.toISOString()
  const [{ data: up }, { data: past }] = await Promise.all([
    supabase.from('events').select('id, title, starts_at, ends_at, audience_type, pods(name)').gte('ends_at', iso).order('starts_at').limit(100),
    supabase.from('events').select('id, title, starts_at, ends_at, audience_type, pods(name)').lt('ends_at', iso).order('starts_at', { ascending: false }).limit(10),
  ])
  const canSchedule = ['owner', 'team', 'tutor'].includes(me?.role ?? '')
  const groups = new Map<string, E[]>()
  ;((up ?? []) as E[]).forEach((e) => { const k = day(e.starts_at); groups.set(k, [...(groups.get(k) ?? []), e]) })
  const item = (e: E, ended = false) => {
    const live = !ended && new Date(e.starts_at) <= now && new Date(e.ends_at) >= now
    return (
      <li key={e.id}><Link href={`/app/calendar/${e.id}`} className={`${card} flex gap-4 !p-4 transition active:scale-[0.98] ${ended ? 'opacity-70' : ''}`}>
        <span className="w-14 shrink-0 text-center"><span className="block text-lg font-bold text-navy">{clock(e.starts_at)}</span><span className="block text-[11px] text-navy/50">WAT</span></span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-navy">{e.title}</span>
          <span className="mt-1 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-forest">{who(e)}</span>
            {live && <span className="rounded-full bg-gold px-2.5 py-0.5 text-navy">Live now</span>}
            {ended && <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-navy/60">Ended</span>}
          </span>
        </span>
      </Link></li>
    )
  }
  return (
    <div className={wrap}>
      <div className="flex items-end justify-between">
        <h1 className="font-[Cambria,Georgia,serif] text-3xl font-bold text-navy">Calendar</h1>
        {canSchedule && <Link href="/app/calendar/new" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-cream transition active:scale-95">+ Schedule</Link>}
      </div>
      <p className="mt-1 text-sm text-navy/60">All times are West Africa Time (WAT).</p>
      {!groups.size && <p className={`${card} mt-6 text-navy/70`}>No upcoming classes.</p>}
      {[...groups.entries()].map(([k, list]) => (
        <section key={k} className="mt-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-forest">{dayLabel(list[0].starts_at)}</h2>
          <ul className="space-y-3">{list.map((e) => item(e))}</ul>
        </section>
      ))}
      {!!past?.length && (
        <section className="mt-10">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-navy/50">Recent classes</h2>
          <ul className="space-y-3">{(past as E[]).map((e) => item(e, true))}</ul>
        </section>
      )}
    </div>
  )
}
export default function Page() {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content /></Suspense>
}
