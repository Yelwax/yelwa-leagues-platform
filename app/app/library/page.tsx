import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { card, wrap } from '@/lib/ui'

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
  const chip = (on: boolean) => `shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${on ? 'bg-navy text-cream' : 'bg-white text-navy ring-1 ring-navy/10'}`
  const item = (r: R) => (
    <li key={r.id}><Link href={`/app/library/${r.id}`} className={`${card} flex items-center gap-4 !p-4 transition active:scale-[0.98]`}>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-[10px] font-bold text-gold">{r.file_type === 'pdf' ? 'PDF' : r.file_type === 'video' ? 'VIDEO' : 'LINK'}</span>
      <span className="min-w-0"><span className="block font-semibold text-navy">{r.title}</span>{r.description && <span className="block truncate text-xs text-navy/60">{r.description}</span>}</span>
    </Link></li>
  )
  const byPhase = phases.map((p) => ({ p, items: rows.filter((r) => r.phase === p) })).filter((g) => g.items.length)
  const loose = rows.filter((r) => !r.phase)
  return (
    <div className={wrap}>
      <h1 className="font-[Cambria,Georgia,serif] text-3xl font-bold text-navy">Library</h1>
      <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {shelves.map(([k, label]) => <Link key={k} href={`/app/library?shelf=${k}`} className={chip(shelf === k)}>{label}</Link>)}
      </div>
      <form className="mt-4 flex gap-2">
        <input type="hidden" name="shelf" value={shelf} />
        <input name="q" defaultValue={q} placeholder="Search titles" className="w-full rounded-full border-0 bg-white px-5 py-3 ring-1 ring-navy/10" />
        <button type="submit" className="rounded-full bg-navy px-5 py-2 font-semibold text-cream">Search</button>
      </form>
      {canUpload && <p className="mt-3"><Link href="/app/library/upload" className="font-semibold text-navy underline">Add to the library</Link></p>}
      {!rows.length && <p className="mt-8">Nothing here yet.</p>}
      {byPhase.map(({ p, items }) => {
        const courses = [...new Set(items.map((r) => r.course ?? 'General'))]
        return (
          <section key={p} className="mt-8">
            <h2 className="font-[Cambria,Georgia,serif] text-2xl font-bold capitalize text-navy">{p}</h2>
            {courses.map((c) => (
              <div key={c} className="mt-3">
                <h3 className="font-bold text-forest">{c}</h3>
                <ul className="mt-2 space-y-3">{items.filter((r) => (r.course ?? 'General') === c).map((r) => item({ ...r, title: r.module ? `${r.module}: ${r.title}` : r.title }))}</ul>
              </div>
            ))}
          </section>
        )
      })}
      {loose.length > 0 && <ul className="mt-6 space-y-3">{loose.map(item)}</ul>}
    </div>
  )
}
export default function Page({ searchParams }: { searchParams: Promise<{ shelf?: string; q?: string }> }) {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content searchParams={searchParams} /></Suspense>
}
