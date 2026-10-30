'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { stages } from '@/lib/stages'

async function requireTeam() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')
  const { data: ok } = await supabase.rpc('is_team')
  if (!ok) throw new Error('Not allowed')
  return { supabase, user }
}

export async function moveStage(profileId: string, formData: FormData) {
  const { supabase, user } = await requireTeam()
  const to = String(formData.get('stage') ?? '')
  if (!stages.some((s) => s.id === to)) return
  const { data: before } = await supabase.from('profiles').select('pipeline_stage').eq('id', profileId).single()
  if (before?.pipeline_stage === to) return
  const { error } = await supabase.from('profiles').update({ pipeline_stage: to }).eq('id', profileId)
  if (error) throw new Error(error.message)
  await supabase.from('audit_log').insert({ actor_id: user.id, action: 'stage_changed', target_profile_id: profileId, details: { from: before?.pipeline_stage, to } })
  revalidatePath(`/admin/applicants/${profileId}`)
}

export async function saveReview(profileId: string, formData: FormData) {
  const { supabase, user } = await requireTeam()
  const s = (k: string) => String(formData.get(k) ?? '').trim() || null
  const amount = Number(formData.get('pricing_proposal_amount'))
  const row = {
    profile_id: profileId,
    knowledge_level: s('knowledge_level'), digital_readiness: s('digital_readiness'),
    commitment_level: s('commitment_level'), audience_category: s('audience_category'),
    recommended_phase: s('recommended_phase'), timetable_track: s('timetable_track'),
    pricing_proposal_amount: formData.get('pricing_proposal_amount') && !Number.isNaN(amount) ? amount : null,
    notes: s('notes'),
    welcome_message_sent: formData.get('welcome_message_sent') === 'on',
    welcome_sent_on: s('welcome_sent_on'),
    intake_complete: formData.get('intake_complete') === 'on',
    reviewed_by: user.id, reviewed_on: new Date().toISOString().slice(0, 10),
  }
  const { error } = await supabase.from('internal_review').upsert(row, { onConflict: 'profile_id' })
  if (error) throw new Error(error.message)
  await supabase.from('audit_log').insert({ actor_id: user.id, action: 'review_saved', target_profile_id: profileId })
  revalidatePath(`/admin/applicants/${profileId}`)
}
