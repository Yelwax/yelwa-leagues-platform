import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { wat } from '@/lib/events'
import { card, initials, wrap } from '@/lib/ui'

const tile = `${card} flex flex-col gap-3 transition active:scale-[0.97]`
const hour = () => Number(new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos', hour: 'numeric', hour12: false }))
const icons: Record<string, string> = {
  Library: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 1 2-2h13',
  Calendar: 'M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18M8 2v4M16 2v4',
  Chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
}
const kind = (t: string) => (t === 'pdf' ? 'PDF' : t === 'video' ? 'VIDEO' : 'LINK')

async function Content() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: p } = await supabase.from('profiles').select('full_name, role').eq('id', user!.id).single()
  const isTutor = p?.role === 'tutor'
  const { data: mp } = await supabase.from('member_profiles').select('avatar_url, display_name').eq('profile_id', user!.id).maybeSingle()
  const [{ data: mine }, { data: next }, { data: recent }] = await Promise.all([
    isTutor
      ? supabase.from('pods').select('id, name, phase, commitment_hours, track, pod_members(profiles!student_id(full_name))').eq('tutor_id', user!.id)
      : supabase.from('pod_members').select('pods(id, name, phase, commitment_hours, track, tutor:profiles!tutor_id(full_name))').eq('student_id', user!.id),
    supabase.from('events').select('id, title, starts_at, ends_at, audience_type, pods(name)').gte('ends_at', new Date().toISOString()).order('starts_at').limit(1),
    supabase.from('resources').select('id, title, course, module, file_type').in('shelf', ['curriculum', 'replays']).order('created_at', { ascending: false }).limit(3),
  ])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pods = (mine ?? []).map((r: any) => (isTutor ? r : Array.isArray(r.pods) ? r.pods[0] : r.pods)).filter(Boolean)
  const ev = next?.[0]
  const evPod = ev ? (Array.isArray(ev.pods) ? ev.pods[0] : ev.pods) : null
  const live = ev && new Date(ev.starts_at).getTime() - 15 * 60000 <= Date.now()
  const h = hour()
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  const first = (mp?.display_name || p?.full_name || '').split(' ')[0] || 'there'

  return (
    <div className={wrap}>
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-navy/60">{greeting}</p>
          <h1 className="font-[Cambria,Georgia,serif] text-3xl font-bold text-navy">{first}</h1>
        </div>
        <Link href="/app/profile" aria-label="Your profile">
          {mp?.avatar_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={mp.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover ring-4 ring-gold/30" />
            : <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy font-bold text-gold ring-4 ring-gold/30">{initials(p?.full_name)}</span>}
        </Link>
      </header>

      <section className="mt-6 overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_92%_0%,rgba(201,168,76,0.38),transparent_55%),linear-gradient(135deg,#1A5C2A,#0D210D)] p-6 text-cream shadow-lg">
        <p className="text-sm font-semibold text-gold">{live ? 'Happening soon' : 'Your next class'}</p>
        {ev ? (
          <>
            <h2 className="mt-2 font-[Cambria,Georgia,serif] text-2xl font-bold leading-snug">{ev.title}</h2>
            <p className="mt-1 text-cream/80">{wat(ev.starts_at)}{evPod?.name ? ` · ${evPod.name}` : ''}</p>
            <Link href={`/app/calendar/${ev.id}`} className="mt-5 inline-block rounded-full bg-gold px-6 py-3 font-semibold text-navy transition active:scale-95">{live ? 'Join class' : 'View class'}</Link>
          </>
        ) : (
          <>
            <h2 className="mt-2 font-[Cambria,Georgia,serif] text-2xl font-bold leading-snug">No classes scheduled yet</h2>
            <p className="mt-1 text-cream/80">When your tutor schedules one, it will show up here.</p>
          </>
        )}
      </section>

      <section className="mt-5 grid grid-cols-3 gap-3">
        {[['Library', '/app/library', 'Manuals, slides, replays'], ['Calendar', '/app/calendar', 'Your classes'], ['Chat', '/app/chat', 'Pod and community']].map(([t, href, sub]) => (
          <Link key={t} href={href} className={tile}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/30 text-navy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d={icons[t]} /></svg>
            </span>
            <span><span className="block font-bold text-navy">{t}</span><span className="block text-xs text-navy/60">{sub}</span></span>
          </Link>
        ))}
      </section>

      <h2 className="mt-8 font-[Cambria,Georgia,serif] text-xl font-bold text-navy">{isTutor ? 'Your pods' : 'Your pod'}</h2>
      {!pods.length && <p className={`${card} mt-3 text-navy/70`}>You have not been placed in a pod yet. The team will do this shortly.</p>}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {pods.map((pod: any) => {
        const tutor = Array.isArray(pod.tutor) ? pod.tutor[0] : pod.tutor
        const names: string[] = isTutor
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? (pod.pod_members ?? []).map((m: any) => (Array.isArray(m.profiles) ? m.profiles[0] : m.profiles)?.full_name).filter(Boolean)
          : [tutor?.full_name].filter(Boolean)
        return (
          <div key={pod.id} className={`${card} mt-3`}>
            <p className="text-lg font-bold text-navy">{pod.name}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-forest/10 px-3 py-1 capitalize text-forest">{pod.phase}</span>
              <span className="rounded-full bg-navy/10 px-3 py-1 text-navy">{pod.commitment_hours}h a week</span>
              <span className="rounded-full bg-gold/30 px-3 py-1 capitalize text-navy">{pod.track}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex -space-x-2">{names.slice(0, 5).map((n) => <span key={n} className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-gold ring-2 ring-white">{initials(n)}</span>)}</div>
              <p className="text-sm text-navy/70">{isTutor ? `${names.length} student${names.length === 1 ? '' : 's'}` : `Tutor: ${names[0] ?? 'to be assigned'}`}</p>
            </div>
          </div>
        )
      })}

      {!!recent?.length && (
        <>
          <h2 className="mt-8 font-[Cambria,Georgia,serif] text-xl font-bold text-navy">New in the library</h2>
          <ul className="mt-3 space-y-3">
            {recent.map((r) => (
              <li key={r.id}><Link href={`/app/library/${r.id}`} className={`${card} flex items-center gap-4 !p-4 transition active:scale-[0.98]`}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-[10px] font-bold text-gold">{kind(r.file_type)}</span>
                <span><span className="block font-semibold text-navy">{r.title}</span><span className="block text-xs text-navy/60">{[r.course, r.module].filter(Boolean).join(' · ') || 'Library'}</span></span>
              </Link></li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
export default function Page() {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content /></Suspense>
}
