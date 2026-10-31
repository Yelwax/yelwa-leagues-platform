import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createPod } from '@/app/admin/actions'
import { h1, h2 } from '@/lib/ui'

const box = 'mt-1 w-full rounded border border-navy/30 bg-white px-3 py-2 text-base font-normal'

async function Content() {
  const supabase = await createClient()
  const [{ data: pods }, { data: tutors }] = await Promise.all([
    supabase.from('pods').select('id, name, phase, commitment_hours, track, active, tutor:profiles!tutor_id(full_name), pod_members(count)').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, full_name').eq('role', 'tutor'),
  ])
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className={h1}>Pods</h1>
      <ul className="mt-6 divide-y divide-navy/15 border-y border-navy/15">
        {(pods ?? []).map((p) => {
          const tutor = Array.isArray(p.tutor) ? p.tutor[0] : p.tutor
          return (
            <li key={p.id}><Link href={`/admin/pods/${p.id}`} className="block py-3">
              <span className="font-semibold text-navy">{p.name}{p.active ? '' : ' (inactive)'}</span>
              <span className="block text-sm capitalize">{p.phase} · {p.commitment_hours}h a week · {p.track} · tutor: {tutor?.full_name ?? 'not set'} · {p.pod_members?.[0]?.count ?? 0} students</span>
            </Link></li>
          )
        })}
        {!pods?.length && <li className="py-4">No pods yet. Create the first one below.</li>}
      </ul>
      <h2 className={`${h2} mt-10`}>Create a pod</h2>
      <form action={createPod} className="mt-4 space-y-4">
        <label className="block font-semibold text-navy">Pod name<input name="name" required maxLength={80} className={box} /></label>
        <label className="block font-semibold text-navy">Phase
          <select name="phase" className={box}><option value="incubation">Incubation</option><option value="momentum">Momentum</option><option value="acceleration">Acceleration</option></select></label>
        <label className="block font-semibold text-navy">Weekly commitment
          <select name="commitment_hours" className={box}><option value="2">2 hours</option><option value="4">4 hours</option><option value="6">6+ hours</option></select></label>
        <label className="block font-semibold text-navy">Track
          <select name="track" className={box}><option value="general">General (group)</option><option value="private">Private tutoring</option></select></label>
        <label className="block font-semibold text-navy">Tutor (optional)
          <select name="tutor_id" className={box}><option value="">Not set</option>{(tutors ?? []).map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}</select></label>
        <button type="submit" className="rounded bg-gold px-5 py-3 font-semibold text-navy">Create pod</button>
      </form>
      <p className="mt-8"><Link href="/admin" className="text-navy underline">Back to admin</Link></p>
    </div>
  )
}
export default function Page() {
  return <Suspense fallback={<div className="mx-auto max-w-3xl px-5 py-12"><p>Loading...</p></div>}><Content /></Suspense>
}
