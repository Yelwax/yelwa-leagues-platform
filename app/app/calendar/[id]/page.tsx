import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import JoinButton from '@/components/JoinButton'
import { wat, googleCalendarLink } from '@/lib/events'
import { setReplay, deleteEvent } from '@/app/app/calendar/actions'
import { h1, h2, wrap } from '@/lib/ui'

const box = 'mt-1 w-full rounded border border-navy/30 bg-white px-3 py-2 text-base font-normal'

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: e } = await supabase.from('events')
    .select('*, resource:resources!resource_id(id, title), replay:resources!replay_resource_id(id, title)').eq('id', id).maybeSingle()
  if (!e) notFound()
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
  const canManage = me?.role === 'owner' || me?.role === 'team' || e.host_id === user!.id
  const { data: replays } = canManage ? await supabase.from('resources').select('id, title').eq('shelf', 'replays').order('created_at', { ascending: false }) : { data: [] }
  const resource = Array.isArray(e.resource) ? e.resource[0] : e.resource
  const replay = Array.isArray(e.replay) ? e.replay[0] : e.replay
  return (
    <div className={wrap}>
      <p><Link href="/app/calendar" className="text-navy underline">Back to the calendar</Link></p>
      <h1 className={`${h1} mt-3`}>{e.title}</h1>
      <p className="mt-2 text-lg">{wat(e.starts_at)} to {wat(e.ends_at).replace(/^.*?(\d\d:\d\d WAT)$/, '$1')}</p>
      {e.description && <p className="mt-3 leading-relaxed">{e.description}</p>}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <JoinButton startsAt={e.starts_at} endsAt={e.ends_at} url={e.meet_url} />
        <a href={googleCalendarLink(e)} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy underline">Add to Google Calendar</a>
      </div>
      {resource && <p className="mt-6">Study material: <Link href={`/app/library/${resource.id}`} className="font-semibold text-navy underline">{resource.title}</Link></p>}
      {replay && <p className="mt-3">Replay: <Link href={`/app/library/${replay.id}`} className="font-semibold text-navy underline">{replay.title}</Link></p>}
      {canManage && (
        <>
          <h2 className={`${h2} mt-10`}>Manage this class</h2>
          <form action={setReplay.bind(null, id)} className="mt-3 flex flex-wrap items-end gap-3">
            <label className="font-semibold text-navy">Link the replay
              <select name="replay_resource_id" defaultValue={e.replay_resource_id ?? ''} className={box}><option value="">None</option>{(replays ?? []).map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}</select>
            </label>
            <button type="submit" className="rounded bg-navy px-4 py-2 font-semibold text-cream">Save</button>
          </form>
          <form action={deleteEvent.bind(null, id)} className="mt-6"><button type="submit" className="text-sm text-red-700 underline">Delete this class</button></form>
        </>
      )}
    </div>
  )
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content params={params} /></Suspense>
}
