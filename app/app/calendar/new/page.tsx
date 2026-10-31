import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createEvent } from '@/app/app/calendar/actions'
import { h1, wrap } from '@/lib/ui'

const box = 'mt-1 w-full rounded border border-navy/30 bg-white px-3 py-2 text-base font-normal'

async function Content() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
  if (!['owner', 'team', 'tutor'].includes(me?.role ?? '')) redirect('/not-allowed')
  const isTutor = me?.role === 'tutor'
  const [{ data: pods }, { data: students }, { data: resources }] = await Promise.all([
    supabase.from('pods').select('id, name').eq('active', true),
    supabase.from('profiles').select('id, full_name, email').eq('role', 'student').order('full_name'),
    supabase.from('resources').select('id, title').eq('shelf', 'curriculum').order('title'),
  ])
  return (
    <div className={wrap}>
      <p><Link href="/app/calendar" className="text-navy underline">Back to the calendar</Link></p>
      <h1 className={`${h1} mt-3`}>Schedule a class</h1>
      <p className="mt-2 text-sm">Enter times in West Africa Time (WAT).</p>
      <form action={createEvent} className="mt-6 space-y-4">
        <label className="block font-semibold text-navy">Title<input name="title" required maxLength={150} className={box} /></label>
        <label className="block font-semibold text-navy">Description (optional)<textarea name="description" rows={2} maxLength={500} className={box} /></label>
        <label className="block font-semibold text-navy">Starts<input name="starts_at" type="datetime-local" required className={box} /></label>
        <label className="block font-semibold text-navy">Ends<input name="ends_at" type="datetime-local" required className={box} /></label>
        <label className="block font-semibold text-navy">Google Meet link<input name="meet_url" type="url" placeholder="https://meet.google.com/..." className={box} /></label>
        <label className="block font-semibold text-navy">Who is it for?
          <select name="audience_type" defaultValue="pod" className={box}>
            <option value="pod">A pod</option><option value="user">One student (private session)</option>
            {!isTutor && <option value="all">Everyone</option>}
          </select></label>
        <label className="block font-semibold text-navy">Pod (if for a pod)
          <select name="pod_id" className={box}><option value="">Choose...</option>{(pods ?? []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label className="block font-semibold text-navy">Student (if a private session)
          <select name="student_id" className={box}><option value="">Choose...</option>{(students ?? []).map((s) => <option key={s.id} value={s.id}>{s.full_name || s.email}</option>)}</select></label>
        <label className="block font-semibold text-navy">Study material (optional)
          <select name="resource_id" className={box}><option value="">None</option>{(resources ?? []).map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}</select></label>
        <button type="submit" className="rounded bg-gold px-5 py-3 font-semibold text-navy">Schedule class</button>
      </form>
    </div>
  )
}
export default function Page() {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content /></Suspense>
}
