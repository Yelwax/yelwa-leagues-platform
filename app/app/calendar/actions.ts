'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const wat = (v: FormDataEntryValue | null) => {
  const s = String(v ?? '')
  return s ? new Date(`${s}:00+01:00`).toISOString() : ''
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')
  const audience = String(formData.get('audience_type'))
  const starts = wat(formData.get('starts_at'))
  const ends = wat(formData.get('ends_at'))
  if (!starts || !ends || ends <= starts) throw new Error('The end time must be after the start time.')
  const s = (k: string) => String(formData.get(k) ?? '').trim() || null
  const row = {
    title: s('title'), description: s('description'), starts_at: starts, ends_at: ends, meet_url: s('meet_url'),
    audience_type: audience, host_id: user.id, resource_id: s('resource_id'),
    pod_id: audience === 'pod' ? s('pod_id') : null, student_id: audience === 'user' ? s('student_id') : null,
  }
  const { error } = await supabase.from('events').insert(row)
  if (error) throw new Error(error.message)
  revalidatePath('/app/calendar')
  redirect('/app/calendar')
}

export async function setReplay(eventId: string, formData: FormData) {
  const supabase = await createClient()
  const replay = String(formData.get('replay_resource_id') ?? '') || null
  const { error } = await supabase.from('events').update({ replay_resource_id: replay }).eq('id', eventId)
  if (error) throw new Error(error.message)
  revalidatePath(`/app/calendar/${eventId}`)
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('events').delete().eq('id', eventId)
  if (error) throw new Error(error.message)
  revalidatePath('/app/calendar')
  redirect('/app/calendar')
}
