import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updatePod, addMember, removeMember } from '@/app/admin/actions'
import { h1, h2 } from '@/lib/ui'

const box = 'mt-1 w-full rounded border border-navy/30 bg-white px-3 py-2 text-base font-normal'

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: pod } = await supabase.from('pods').select('id, name, phase, commitment_hours, track, active, tutor_id').eq('id', id).maybeSingle()
  if (!pod) notFound()
  const [{ data: tutors }, { data: students }, { data: members }] = await Promise.all([
    supabase.from('profiles').select('id, full_name').eq('role', 'tutor'),
    supabase.from('profiles').select('id, full_name, email').eq('role', 'student').order('full_name'),
    supabase.from('pod_members').select('student_id, profiles!student_id(full_name, email)').eq('pod_id', id),
  ])
  const inPod = new Set((members ?? []).map((m) => m.student_id))
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p><Link href="/admin/pods" className="text-navy underline">All pods</Link></p>
      <h1 className={`${h1} mt-3`}>{pod.name}</h1>
      <p className="mt-1 capitalize">{pod.phase} · {pod.commitment_hours}h a week · {pod.track}</p>

      <form action={updatePod.bind(null, id)} className="mt-6 space-y-4">
        <label className="block font-semibold text-navy">Tutor
          <select name="tutor_id" defaultValue={pod.tutor_id ?? ''} className={box}><option value="">Not set</option>{(tutors ?? []).map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}</select></label>
        <label className="flex items-center gap-3"><input type="checkbox" name="active" defaultChecked={pod.active} className="h-5 w-5" />Pod is active</label>
        <button type="submit" className="rounded bg-navy px-4 py-2 font-semibold text-cream">Save</button>
      </form>

      <h2 className={`${h2} mt-10`}>Students ({members?.length ?? 0})</h2>
      <ul className="mt-3 divide-y divide-navy/15 border-y border-navy/15">
        {(members ?? []).map((m) => {
          const pr = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles
          return (
            <li key={m.student_id} className="flex items-center justify-between gap-3 py-2">
              <Link href={`/admin/applicants/${m.student_id}`} className="text-navy underline">{pr?.full_name || pr?.email}</Link>
              <form action={removeMember.bind(null, id, m.student_id)}><button type="submit" className="text-sm text-red-700 underline">Remove</button></form>
            </li>
          )
        })}
        {!members?.length && <li className="py-3">No students yet.</li>}
      </ul>

      <form action={addMember.bind(null, id)} className="mt-5 flex flex-wrap items-end gap-3">
        <label className="font-semibold text-navy">Add a student
          <select name="student_id" className={box}><option value="">Choose...</option>{(students ?? []).filter((s) => !inPod.has(s.id)).map((s) => <option key={s.id} value={s.id}>{s.full_name || s.email}</option>)}</select></label>
        <button type="submit" className="rounded bg-gold px-4 py-2 font-semibold text-navy">Add</button>
      </form>
    </div>
  )
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<div className="mx-auto max-w-3xl px-5 py-12"><p>Loading...</p></div>}><Content params={params} /></Suspense>
}
