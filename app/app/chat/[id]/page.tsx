import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ChatRoom, { type Msg } from '@/components/ChatRoom'
import BlockButton from '@/components/BlockButton'
import { wrap } from '@/lib/ui'

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: room } = await supabase.from('rooms').select('id, type, name, pods(name)').eq('id', id).maybeSingle()
  if (!room) notFound()
  const [{ data: me }, { data: msgs }] = await Promise.all([
    supabase.from('profiles').select('role, muted_until').eq('id', user!.id).single(),
    supabase.from('messages').select('*').eq('room_id', id).order('created_at', { ascending: false }).limit(50),
  ])
  const pod = Array.isArray(room.pods) ? room.pods[0] : room.pods
  let partner: { partner_id: string; partner_name: string } | null = null
  let iBlocked = false
  if (room.type === 'dm') {
    const { data: dms } = await supabase.rpc('my_dms')
    partner = (dms ?? []).find((d: { room_id: string }) => d.room_id === id) ?? null
    if (partner) {
      const { data: b } = await supabase.from('dm_blocks').select('blocked_id').eq('blocker_id', user!.id).eq('blocked_id', partner.partner_id).maybeSingle()
      iBlocked = !!b
    }
  }
  const canModerate = room.type === 'pod' ? me?.role === 'tutor' : me?.role === 'owner' || me?.role === 'team'
  const muted = room.type === 'community' && me?.muted_until && new Date(me.muted_until) > new Date()
  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <p><Link href="/app/chat" className="text-navy underline">All rooms</Link></p>
      <h1 className="mt-3 font-[Cambria,Georgia,serif] text-3xl font-bold text-navy">{room.type === 'community' ? 'Community' : room.type === 'dm' ? (partner?.partner_name ?? 'Direct message') : pod?.name ?? room.name}</h1>
      {partner && <p className="mt-1 text-sm"><Link href={`/app/members/${partner.partner_id}`} className="text-navy underline">View profile</Link> · <BlockButton userId={user!.id} partnerId={partner.partner_id} blocked={iBlocked} /></p>}
      {iBlocked && <p className="mt-2 font-semibold text-red-700">You have blocked this member. Unblock them to send messages again.</p>}
      {muted && <p className="mt-3 font-semibold text-red-700">You are muted in this room for now. You can read, but not post.</p>}
      <ChatRoom roomId={id} userId={user!.id} initial={((msgs ?? []) as Msg[]).reverse()} canModerate={canModerate} />
    </div>
  )
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content params={params} /></Suspense>
}
