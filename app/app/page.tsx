import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import { wat } from '@/lib/events'
import { h1, h2, wrap } from '@/lib/ui'

const soon: string[] = []

async function Content() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: p } = await supabase.from('profiles').select('full_name, role').eq('id', user!.id).single()
  const isTutor = p?.role === 'tutor'
  const { data: mine } = isTutor
    ? await supabase.from('pods').select('id, name, phase, commitment_hours, track, pod_members(profiles!student_id(full_name))').eq('tutor_id', user!.id)
    : await supabase.from('pod_members').select('pods(id, name, phase, commitment_hours, track, tutor:profiles!tutor_id(full_name))').eq('student_id', user!.id)
  const { data: next } = await supabase.from('events').select('id, title, starts_at').gte('ends_at', new Date().toISOString()).order('starts_at').limit(1)
  const pods = (mine ?? []).map((r: any) => (isTutor ? r : Array.isArray(r.pods) ? r.pods[0] : r.pods)).filter(Boolean)
  return (
    <div className={wrap}>
      <h1 className={h1}>Welcome{p?.full_name ? `, ${p.full_name}` : ''}</h1>
      <h2 className={`${h2} mt-8`}>{isTutor ? 'Your pods' : 'Your pod'}</h2>
      {!pods.length && <p className="mt-3">You have not been placed in a pod yet. The team will do this shortly.</p>}
      {pods.map((pod: any) => {
        const tutor = Array.isArray(pod.tutor) ? pod.tutor[0] : pod.tutor
        return (
          <div key={pod.id} className="mt-4 border-l-4 border-gold bg-white p-4">
            <p className="text-lg font-bold text-navy">{pod.name}</p>
            <p className="capitalize">{pod.phase} · {pod.commitment_hours}h a week · {pod.track}</p>
            {!isTutor && <p>Tutor: {tutor?.full_name ?? 'to be assigned'}</p>}
            {isTutor && <p className="mt-1 text-sm">Students: {(pod.pod_members ?? []).map((m: any) => (Array.isArray(m.profiles) ? m.profiles[0] : m.profiles)?.full_name).filter(Boolean).join(', ') || 'none yet'}</p>}
          </div>
        )
      })}
      {next?.[0] && (
        <p className="mt-6 border-l-4 border-forest bg-white p-4">Next class: <Link href={`/app/calendar/${next[0].id}`} className="font-semibold text-navy underline">{next[0].title}</Link>, {wat(next[0].starts_at)}</p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/app/library" className="rounded bg-gold px-4 py-2 font-semibold text-navy">Library</Link>
        <Link href="/app/calendar" className="rounded bg-gold px-4 py-2 font-semibold text-navy">Calendar</Link>
        <Link href="/app/chat" className="rounded bg-gold px-4 py-2 font-semibold text-navy">Chat</Link>
        {soon.map((s) => <span key={s} className="rounded border border-navy/30 px-4 py-2 text-navy/60">{s} (coming soon)</span>)}
      </div>
      <LogoutButton />
    </div>
  )
}
export default function Page() {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content /></Suspense>
}
