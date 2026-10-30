import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { stages, stageLabel } from '@/lib/stages'
import { h1 } from '@/lib/ui'

async function Content({ searchParams }: { searchParams: Promise<{ stage?: string }> }) {
  const { stage } = await searchParams
  const supabase = await createClient()
  let q = supabase.from('profiles').select('id, full_name, email, pipeline_stage, created_at').eq('role', 'applicant').order('created_at', { ascending: false })
  if (stage && stages.some((s) => s.id === stage)) q = q.eq('pipeline_stage', stage)
  const { data: rows } = await q
  const chip = (on: boolean) => `rounded border px-3 py-1 text-sm ${on ? 'border-navy bg-navy text-cream' : 'border-navy/30 bg-white text-navy'}`
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className={h1}>Applicants</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link href="/admin/applicants" className={chip(!stage)}>All</Link>
        {stages.filter((s) => s.id !== 'active').map((s) => <Link key={s.id} href={`/admin/applicants?stage=${s.id}`} className={chip(stage === s.id)}>{s.label}</Link>)}
      </div>
      <ul className="mt-6 divide-y divide-navy/15 border-y border-navy/15">
        {(rows ?? []).map((r) => (
          <li key={r.id}>
            <Link href={`/admin/applicants/${r.id}`} className="block py-3">
              <span className="font-semibold text-navy">{r.full_name || r.email}</span>
              <span className="block text-sm">{stageLabel(r.pipeline_stage)} · joined {new Date(r.created_at).toLocaleDateString('en-GB', { timeZone: 'Africa/Lagos' })}</span>
            </Link>
          </li>
        ))}
        {!rows?.length && <li className="py-4">No applicants here yet.</li>}
      </ul>
      <p className="mt-6"><Link href="/admin" className="text-navy underline">Back to admin</Link></p>
    </div>
  )
}
export default function Page({ searchParams }: { searchParams: Promise<{ stage?: string }> }) {
  return <Suspense fallback={<div className="mx-auto max-w-3xl px-5 py-12"><p>Loading...</p></div>}><Content searchParams={searchParams} /></Suspense>
}
