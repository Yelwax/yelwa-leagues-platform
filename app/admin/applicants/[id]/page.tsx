import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { stages, stageLabel } from '@/lib/stages'
import { sections, type Answers } from '@/lib/intake'
import { moveStage, saveReview, activateStudent } from '@/app/admin/actions'
import { h1, h2 } from '@/lib/ui'

const box = 'mt-1 w-full rounded border border-navy/30 bg-white px-3 py-2 text-base font-normal'
const opts = {
  knowledge_level: ['Beginner', 'Intermediate', 'Experienced'],
  digital_readiness: ['Low', 'Medium', 'High'],
  commitment_level: ['Low (2 hrs)', 'Medium (4 hrs)', 'High (6 hrs+)'],
  audience_category: ['Youth Standard', 'Youth Premium', 'Working Class', 'Corporate'],
  recommended_phase: ['Incubation', 'Momentum', 'Acceleration'],
  timetable_track: ['General (Group)', 'Custom (Individual)'],
}
const waLink = (n?: string | null) => {
  const d = (n ?? '').replace(/\D/g, '')
  return d ? `https://wa.me/${d.startsWith('0') ? '234' + d.slice(1) : d}` : null
}
const when = (iso: string) => new Date(iso).toLocaleString('en-GB', { timeZone: 'Africa/Lagos', dateStyle: 'medium', timeStyle: 'short' })

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: p } = await supabase.from('profiles').select('id, full_name, email, pipeline_stage, created_at, leads(whatsapp, stage, challenge)').eq('id', id).maybeSingle()
  if (!p) notFound()
  await supabase.from('audit_log').insert({ actor_id: user!.id, action: 'viewed', target_profile_id: id })
  const [{ data: intake }, { data: rv }, { data: log }] = await Promise.all([
    supabase.from('intake_responses').select('answers, status, submitted_at').eq('profile_id', id).maybeSingle(),
    supabase.from('internal_review').select('*').eq('profile_id', id).maybeSingle(),
    supabase.from('audit_log').select('action, details, created_at, actor:profiles!actor_id(full_name)').eq('target_profile_id', id).order('created_at', { ascending: false }).limit(30),
  ])
  const { data: activePods } = await supabase.from('pods').select('id, name').eq('active', true)
  const lead = Array.isArray(p.leads) ? p.leads[0] : p.leads
  const wa = waLink(lead?.whatsapp)
  const ans = (intake?.answers ?? {}) as Answers

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p><Link href="/admin/applicants" className="text-navy underline">All applicants</Link></p>
      <h1 className={`${h1} mt-3`}>{p.full_name || p.email}</h1>
      <p className="mt-1">{p.email}{lead?.whatsapp ? ` · ${lead.whatsapp}` : ''}</p>
      {wa && <p className="mt-2"><a href={wa} className="inline-block rounded bg-forest px-4 py-2 font-semibold text-white">Message on WhatsApp</a></p>}

      <form action={moveStage.bind(null, id)} className="mt-6 flex flex-wrap items-end gap-3">
        <label className="font-semibold text-navy">Pipeline stage
          <select name="stage" defaultValue={p.pipeline_stage} className={box}>{stages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
        </label>
        <button type="submit" className="rounded bg-navy px-4 py-2 font-semibold text-cream">Move</button>
      </form>

      {p.pipeline_stage === 'payment_confirmed' && (
        <form action={activateStudent.bind(null, id)} className="mt-6 flex flex-wrap items-end gap-3 border-l-4 border-forest bg-white p-4">
          <label className="font-semibold text-navy">Place in pod and activate
            <select name="pod_id" required className={box}><option value="">Choose a pod...</option>{(activePods ?? []).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
          </label>
          <button type="submit" className="rounded bg-forest px-4 py-2 font-semibold text-white">Activate student</button>
        </form>
      )}

      {lead && (lead.stage || lead.challenge) && (
        <div className="mt-8 border-l-4 border-gold bg-white p-4">
          <h2 className="font-bold text-navy">From the website</h2>
          {lead.stage && <p>Said their stage was: {lead.stage}</p>}
          {lead.challenge && <p>Challenge: {lead.challenge}</p>}
        </div>
      )}

      <h2 className={`${h2} mt-10`}>Intake answers {intake ? `(${intake.status})` : ''}</h2>
      {!intake ? <p className="mt-2">Not started yet.</p> : sections.map((s) => (
        <div key={s.key} className="mt-5">
          <h3 className="font-bold text-forest">{s.title}</h3>
          <dl className="mt-1 space-y-2">
            {s.questions.filter((q) => q.id !== 'consent' && ans[q.id] && ans[q.id].length > 0).map((q) => (
              <div key={q.id}><dt className="text-sm text-navy/80">{q.label}</dt><dd>{Array.isArray(ans[q.id]) ? (ans[q.id] as string[]).join(', ') : String(ans[q.id])}</dd></div>
            ))}
          </dl>
        </div>
      ))}

      <h2 className={`${h2} mt-12`}>Scoring sheet (team only)</h2>
      <form action={saveReview.bind(null, id)} className="mt-4 space-y-4">
        {(Object.keys(opts) as (keyof typeof opts)[]).map((k) => (
          <label key={k} className="block font-semibold capitalize text-navy">{k.replace('_', ' ')}
            <select name={k} defaultValue={rv?.[k] ?? ''} className={box}><option value="">Not set</option>{opts[k].map((o) => <option key={o}>{o}</option>)}</select>
          </label>
        ))}
        <label className="block font-semibold text-navy">Pricing proposal (N)
          <input name="pricing_proposal_amount" type="number" min="0" defaultValue={rv?.pricing_proposal_amount ?? ''} className={box} />
        </label>
        <label className="block font-semibold text-navy">Notes
          <textarea name="notes" rows={3} defaultValue={rv?.notes ?? ''} className={box} />
        </label>
        <label className="flex items-center gap-3"><input type="checkbox" name="welcome_message_sent" defaultChecked={rv?.welcome_message_sent} className="h-5 w-5" />Welcome message sent</label>
        <label className="block font-semibold text-navy">Welcome sent on
          <input type="date" name="welcome_sent_on" defaultValue={rv?.welcome_sent_on ?? ''} className={box} />
        </label>
        <label className="flex items-center gap-3"><input type="checkbox" name="intake_complete" defaultChecked={rv?.intake_complete} className="h-5 w-5" />Intake complete</label>
        <button type="submit" className="rounded bg-gold px-5 py-3 font-semibold text-navy">Save scoring sheet</button>
        {rv?.reviewed_on && <p className="text-sm">Last reviewed {rv.reviewed_on}</p>}
      </form>

      <h2 className={`${h2} mt-12`}>Activity</h2>
      <ul className="mt-3 space-y-1 text-sm">
        {(log ?? []).map((l, i) => {
          const actor = Array.isArray(l.actor) ? l.actor[0] : l.actor
          const d = l.details as { from?: string; to?: string } | null
          const what = l.action === 'stage_changed' ? `moved stage from ${stageLabel(d?.from)} to ${stageLabel(d?.to)}` : l.action === 'review_saved' ? 'saved the scoring sheet' : 'viewed this record'
          return <li key={i}>{when(l.created_at)}: {actor?.full_name ?? 'A team member'} {what}</li>
        })}
      </ul>
      <p className="mt-6 text-sm">Applicant account created {when(p.created_at)} · current stage: {stageLabel(p.pipeline_stage)}</p>
    </div>
  )
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<div className="mx-auto max-w-3xl px-5 py-12"><p>Loading...</p></div>}><Content params={params} /></Suspense>
}
