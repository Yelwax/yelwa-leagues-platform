import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { setRole } from '@/app/admin/actions'
import { h1 } from '@/lib/ui'

async function Content() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: owner } = await supabase.rpc('is_owner')
  if (!owner) redirect('/not-allowed')
  const { data: people } = await supabase.from('profiles').select('id, full_name, email, role').order('created_at', { ascending: false })
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className={h1}>People and roles</h1>
      <p className="mt-3">Only you, the owner, can change roles. Tutors must be given the tutor role here before they can be assigned to a pod.</p>
      <ul className="mt-6 divide-y divide-navy/15 border-y border-navy/15">
        {(people ?? []).map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <span><span className="font-semibold text-navy">{p.full_name || p.email}</span><span className="block text-sm">{p.email}</span></span>
            {p.id === user!.id || p.role === 'owner' ? <span className="text-sm capitalize">{p.role}</span> : (
              <form action={setRole.bind(null, p.id)} className="flex items-center gap-2">
                <select name="role" defaultValue={p.role} className="rounded border border-navy/30 bg-white px-2 py-1">
                  {['applicant', 'student', 'tutor', 'team'].map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
                </select>
                <button type="submit" className="rounded bg-navy px-3 py-1 text-sm font-semibold text-cream">Save</button>
              </form>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-6"><Link href="/admin" className="text-navy underline">Back to admin</Link></p>
    </div>
  )
}
export default function Page() {
  return <Suspense fallback={<div className="mx-auto max-w-3xl px-5 py-12"><p>Loading...</p></div>}><Content /></Suspense>
}
