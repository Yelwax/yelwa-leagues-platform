import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { h1, h2, wrap } from '@/lib/ui'

const shelves = [['curriculum', 'Curriculum'], ['books', 'Books'], ['tutor', 'Tutor Shelf'], ['replays', 'Class Replays']]
const phases = ['incubation', 'momentum', 'acceleration']
type R = { id: string; title: string; description: string | null; phase: string | null; course: string | null; module: string | null; file_type: string }

async function Content({ searchParams }: { searchParams: Promise<{ shelf?: string; q?: string }> }) {
  const { shelf: s, q = '' } = await searchParams
  const shelf = shelves.some(([k]) => k === s) ? s! : 'curriculum'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
  let query = supabase.from('resources').select('id, title, description, phase, course, module, file_type').eq('shelf', shelf).order('module').order('title')
  const term = q.replace(/[%,()]/g, ' ').trim()
  if (term) query = query.ilike('title', `%${term}%`)
  const { data } = await query
  const rows = (data ?? []) as R[]
  const canUpload = ['owner', 'team', 'tutor'].includes(me?.role ?? '')
  const chip = (on: boolean) => `rounded border px-3 py-1 text-sm ${on ? 'border-navy bg-navy text-cream' : 'border-navy/30 bg-white text-navy'}`
  const item = (r: R) => (
    <li key={r.id}><Link href={`/app/library/${r.id}`} className="block py-2">
      <span className="font-semibold text-navy">{r.title}</span>
      {r.description && <span className="block text-sm">{r.description}</span>}
    </Link></li>
  )
  const byPhase = phases.map((p) => ({ p, items: rows.filter((r) => r.phase === p) })).filter((g) => g.items.length)
  const loose = rows.filter((r) => !r.phase)
  return (
    <div className={wrap}>
      <h1 className={h1}>Library</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        {shelves.map(([k, label]) => <Link key={k} href={`/app/library?shelf=${k}`} className={chip(shelf === k)}>{label}</Link>)}
      </div>
      <form className="mt-4 flex gap-2">
        <input type="hidden" name="shelf" value={shelf} />
        <input name="q" defaultValue={q} placeholder="Search titles" className="w-full rounded border border-navy/30 bg-white px-3 py-2" />
        <button type="submit" className="rounded bg-navy px-4 py-2 font-semibold text-cream">Search</button>
      </form>
      {canUpload && <p className="mt-3"><Link href="/app/library/upload" className="font-semibold text-navy underline">Add to the library</Link></p>}
      {!rows.length && <p className="mt-8">Nothing here yet.</p>}
      {byPhase.map(({ p, items }) => {
        const courses = [...new Set(items.map((r) => r.course ?? 'General'))]
        return (
          <section key={p} className="mt-8">
            <h2 className={`${h2} capitalize`}>{p}</h2>
            {courses.map((c) => (
              <div key={c} className="mt-3">
                <h3 className="font-bold text-forest">{c}</h3>
                <ul className="divide-y divide-navy/10">{items.filter((r) => (r.course ?? 'General') === c).map((r) => item({ ...r, title: r.module ? `${r.module}: ${r.title}` : r.title }))}</ul>
              </div>
            ))}
          </section>
        )
      })}
      {loose.length > 0 && <ul className="mt-6 divide-y divide-navy/10 border-y border-navy/10">{loose.map(item)}</ul>}
    </div>
  )
}
export default function Page({ searchParams }: { searchParams: Promise<{ shelf?: string; q?: string }> }) {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content searchParams={searchParams} /></Suspense>
}
