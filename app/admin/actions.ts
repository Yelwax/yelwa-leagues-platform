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

export async function createPod(formData: FormData) {
  const { supabase } = await requireTeam()
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return
  const tutor = String(formData.get('tutor_id') ?? '')
  const { error } = await supabase.from('pods').insert({
    name, phase: String(formData.get('phase')), commitment_hours: Number(formData.get('commitment_hours')),
    track: String(formData.get('track')), tutor_id: tutor || null,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/pods')
}

export async function updatePod(podId: string, formData: FormData) {
  const { supabase } = await requireTeam()
  const tutor = String(formData.get('tutor_id') ?? '')
  const { error } = await supabase.from('pods').update({ tutor_id: tutor || null, active: formData.get('active') === 'on' }).eq('id', podId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/pods/${podId}`)
}

export async function addMember(podId: string, formData: FormData) {
  const { supabase } = await requireTeam()
  const student = String(formData.get('student_id') ?? '')
  if (!student) return
  const { error } = await supabase.from('pod_members').insert({ pod_id: podId, student_id: student })
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/pods/${podId}`)
}

export async function removeMember(podId: string, studentId: string) {
  const { supabase } = await requireTeam()
  await supabase.from('pod_members').delete().eq('pod_id', podId).eq('student_id', studentId)
  revalidatePath(`/admin/pods/${podId}`)
}

export async function activateStudent(profileId: string, formData: FormData) {
  const { supabase } = await requireTeam()
  const pod = String(formData.get('pod_id') ?? '')
  if (!pod) return
  const { error } = await supabase.rpc('activate_student', { p_student: profileId, p_pod: pod })
  if (error) throw new Error(error.message)
  if (formData.get('under_18') === 'on') await supabase.from('profiles').update({ under_18: true }).eq('id', profileId)
  revalidatePath(`/admin/applicants/${profileId}`)
}

export async function setRole(profileId: string, formData: FormData) {
  const { supabase, user } = await requireTeam()
  const { data: owner } = await supabase.rpc('is_owner')
  if (!owner || profileId === user.id) throw new Error('Not allowed')
  const role = String(formData.get('role') ?? '')
  if (!['team', 'tutor', 'student', 'applicant'].includes(role)) return
  const { error } = await supabase.from('profiles').update({ role }).eq('id', profileId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/people')
}

export async function reviewReport(reportId: string) {
  const { supabase } = await requireTeam()
  await supabase.from('reports').update({ status: 'reviewed' }).eq('id', reportId)
  revalidatePath('/admin/reports')
}

export async function removeReportedMessage(reportId: string, messageId: string) {
  const { supabase } = await requireTeam()
  await supabase.from('messages').update({ deleted_at: new Date().toISOString(), body: '' }).eq('id', messageId)
  await supabase.from('reports').update({ status: 'reviewed' }).eq('id', reportId)
  revalidatePath('/admin/reports')
}

export async function muteUser(profileId: string, days: number) {
  const { supabase } = await requireTeam()
  const until = days > 0 ? new Date(Date.now() + days * 86400000).toISOString() : null
  await supabase.from('profiles').update({ muted_until: until }).eq('id', profileId)
  revalidatePath('/admin/reports')
}

export async function setUnder18(profileId: string, formData: FormData) {
  const { supabase, user } = await requireTeam()
  const flag = formData.get('under_18') === 'on'
  const { error } = await supabase.from('profiles').update({ under_18: flag }).eq('id', profileId)
  if (error) throw new Error(error.message)
  await supabase.from('audit_log').insert({ actor_id: user.id, action: 'stage_changed', target_profile_id: profileId, details: { from: flag ? 'adult' : 'under 18', to: flag ? 'under 18' : 'adult' } })
  revalidatePath(`/admin/applicants/${profileId}`)
}
