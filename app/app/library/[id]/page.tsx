import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PdfViewer from '@/components/PdfViewer'
import { deleteResource } from '@/app/app/library/actions'
import { h1, wrap } from '@/lib/ui'

function youtubeId(u: string) {
  try {
    const x = new URL(u)
    if (x.hostname === 'youtu.be') return x.pathname.slice(1)
    return x.searchParams.get('v') ?? x.pathname.split('/').pop() ?? ''
  } catch { return '' }
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [{ data: r }, { data: me }] = await Promise.all([
    supabase.from('resources').select('*').eq('id', id).maybeSingle(),
    supabase.from('profiles').select('full_name, email, role').eq('id', user!.id).single(),
  ])
  if (!r) notFound()
  const watermark = `${me?.full_name || ''} · ${me?.email || ''}`
  let signed: string | null = null
  if (r.storage_path) {
    const { data } = await supabase.storage.from('library').createSignedUrl(r.storage_path, 60)
    signed = data?.signedUrl ?? null
  }
  const vid = r.video_url ? youtubeId(r.video_url) : ''
  const canDelete = me?.role === 'owner' || me?.role === 'team' || (me?.role === 'tutor' && r.uploaded_by === user!.id)
  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <p><Link href={`/app/library?shelf=${r.shelf}`} className="text-navy underline">Back to the library</Link></p>
      <h1 className={`${h1} mt-3`}>{r.title}</h1>
      {(r.course || r.module) && <p className="mt-1 text-forest">{[r.course, r.module].filter(Boolean).join(' · ')}</p>}
      {r.description && <p className="mt-3 leading-relaxed">{r.description}</p>}
      <div className="mt-6">
        {signed && <PdfViewer url={signed} watermark={watermark} />}
        {vid && (
          <div className="relative aspect-video w-full">
            <iframe src={`https://www.youtube-nocookie.com/embed/${vid}`} title={r.title} allowFullScreen className="absolute inset-0 h-full w-full" />
            <span className="pointer-events-none absolute bottom-12 left-3 text-sm text-white/60">{watermark}</span>
          </div>
        )}
        {r.external_url && <a href={r.external_url} className="inline-block rounded bg-gold px-5 py-3 font-semibold text-navy" target="_blank" rel="noopener noreferrer">Buy or borrow this book</a>}
        {!signed && !vid && !r.external_url && r.shelf === 'books' && <p>Add a link when you have one.</p>}
      </div>
      {canDelete && (
        <form action={deleteResource.bind(null, id)} className="mt-10">
          <button type="submit" className="text-sm text-red-700 underline">Delete this item</button>
        </form>
      )}
    </div>
  )
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content params={params} /></Suspense>
}
