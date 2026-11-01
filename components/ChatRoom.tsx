'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export type Msg = { id: string; room_id: string; sender_id: string; sender_name: string; body: string; reply_to: string | null; created_at: string; deleted_at: string | null }
const hhmm = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' })

export default function ChatRoom({ roomId, userId, initial, canModerate }: { roomId: string; userId: string; initial: Msg[]; canModerate: boolean }) {
  const [msgs, setMsgs] = useState<Msg[]>(initial)
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<Msg | null>(null)
  const [error, setError] = useState('')
  const [more, setMore] = useState(initial.length >= 50)
  const end = useRef<HTMLDivElement>(null)

  const markRead = useCallback(() => {
    createClient().from('room_reads').upsert({ profile_id: userId, room_id: roomId, last_read_at: new Date().toISOString() }, { onConflict: 'profile_id,room_id' }).then(() => {})
  }, [userId, roomId])

  const merge = (m: Msg) => setMsgs((prev) => {
    const i = prev.findIndex((x) => x.id === m.id)
    if (i >= 0) { const c = [...prev]; c[i] = m; return c }
    return [...prev, m].sort((a, b) => a.created_at.localeCompare(b.created_at))
  })

  useEffect(() => {
    markRead()
    const supabase = createClient()
    const ch = supabase.channel(`room-${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` }, (p) => {
        const m = p.new as Msg
        if (m?.id) { merge(m); if (m.sender_id !== userId) markRead() }
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [roomId, userId, markRead])

  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [msgs.length])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const body = text.trim()
    if (!body) return
    setError('')
    const { data, error: err } = await createClient().from('messages')
      .insert({ room_id: roomId, sender_id: userId, body, reply_to: replyTo?.id ?? null }).select().single()
    if (err) { setError(err.message.includes('Slow down') ? 'You are sending messages too fast. Wait a moment.' : 'You cannot post here right now.'); return }
    merge(data as Msg); setText(''); setReplyTo(null)
  }
  async function remove(m: Msg) {
    if (!confirm('Delete this message?')) return
    await createClient().from('messages').update({ deleted_at: new Date().toISOString(), body: '' }).eq('id', m.id)
  }
  async function report(m: Msg) {
    const reason = prompt('Why are you reporting this message? (optional)')
    if (reason === null) return
    const { error: err } = await createClient().rpc('report_message', { p_message: m.id, p_reason: reason })
    alert(err ? 'Could not send the report.' : 'Thank you. The team has received your report.')
  }
  async function older() {
    const first = msgs[0]
    if (!first) return
    const { data } = await createClient().from('messages').select('*').eq('room_id', roomId).lt('created_at', first.created_at).order('created_at', { ascending: false }).limit(50)
    setMsgs((p) => [...((data ?? []) as Msg[]).reverse(), ...p]); setMore((data ?? []).length >= 50)
  }

  const byId = new Map(msgs.map((m) => [m.id, m]))
  return (
    <div className="mt-4">
      <div className="h-[calc(100dvh-17rem)] min-h-[16rem] overflow-y-auto rounded-3xl bg-white/70 p-3 ring-1 ring-navy/10 md:h-[60vh]">
        {more && <button type="button" onClick={older} className="mb-3 text-sm text-navy underline">Load earlier messages</button>}
        {!msgs.length && <p className="text-sm">No messages yet. Say hello.</p>}
        {msgs.map((m) => {
          const mine = m.sender_id === userId
          const quoted = m.reply_to ? byId.get(m.reply_to) : null
          return (
            <div key={m.id} className={`mb-3 flex ${mine ? 'justify-end' : ''}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${mine ? 'rounded-br-md bg-forest text-white' : 'rounded-bl-md bg-white'}`}>
                <p className={`text-xs font-semibold ${mine ? 'text-gold' : 'text-navy'}`}>{mine ? 'You' : <Link href={`/app/members/${m.sender_id}`} className="underline decoration-dotted">{m.sender_name || 'Member'}</Link>} · {hhmm(m.created_at)}</p>
                {quoted && !m.deleted_at && <p className="mt-1 border-l-2 border-navy/40 pl-2 text-xs text-navy/70">{quoted.deleted_at ? 'Deleted message' : quoted.body.slice(0, 80)}</p>}
                {m.deleted_at ? <p className="italic text-navy/60">This message was deleted.</p> : <p className="whitespace-pre-wrap break-words">{m.body}</p>}
                {!m.deleted_at && (
                  <p className="mt-1 flex gap-3 text-xs">
                    <button type="button" onClick={() => setReplyTo(m)} className={mine ? 'py-1 text-cream underline' : 'py-1 text-navy underline'}>Reply</button>
                    {(mine || canModerate) && <button type="button" onClick={() => remove(m)} className={mine ? 'py-1 text-red-200 underline' : 'py-1 text-red-700 underline'}>Delete</button>}
                    {!mine && <button type="button" onClick={() => report(m)} className="py-1 text-navy/70 underline">Report</button>}
                  </p>
                )}
              </div>
            </div>
          )
        })}
        <div ref={end} />
      </div>
      {replyTo && <p className="mt-2 text-sm">Replying to {replyTo.sender_name}: {replyTo.body.slice(0, 60)} <button type="button" onClick={() => setReplyTo(null)} className="text-navy underline">Cancel</button></p>}
      {error && <p role="alert" className="mt-2 font-semibold text-red-700">{error}</p>}
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder="Type a message" className="w-full rounded-full border-0 bg-white px-5 py-3 text-base ring-1 ring-navy/15" />
        <button type="submit" className="rounded-full bg-gold px-6 py-3 font-semibold text-navy transition active:scale-95">Send</button>
      </form>
    </div>
  )
}
