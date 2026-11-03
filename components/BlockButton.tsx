'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BlockButton({ userId, partnerId, blocked }: { userId: string; partnerId: string; blocked: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  async function toggle() {
    if (!blocked && !confirm('Block this member? Neither of you will be able to send messages in this conversation.')) return
    setBusy(true)
    const supabase = createClient()
    if (blocked) await supabase.from('dm_blocks').delete().eq('blocker_id', userId).eq('blocked_id', partnerId)
    else await supabase.from('dm_blocks').insert({ blocker_id: userId, blocked_id: partnerId })
    router.refresh(); setBusy(false)
  }
  return <button type="button" onClick={toggle} disabled={busy} className="text-sm text-red-700 underline">{blocked ? 'Unblock this member' : 'Block this member'}</button>
}
