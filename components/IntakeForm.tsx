'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { sections, isEmpty, type Answers, type Q } from '@/lib/intake'
import { btn } from '@/lib/ui'

const box = 'mt-1 w-full rounded border border-navy/30 bg-white px-3 py-2 text-base font-normal'

export default function IntakeForm({ profileId, initial }: { profileId: string; initial: Answers }) {
  const router = useRouter()
  const [a, setA] = useState<Answers>(initial)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const sec = sections[step]
  const visible = (q: Q) => !q.showIf || q.showIf(a)
  const set = (id: string, v: string | string[]) => { setA((p) => ({ ...p, [id]: v })); setSaved(false) }

  async function saveDraft() {
    await createClient().from('intake_responses').upsert({ profile_id: profileId, answers: a, status: 'draft' }, { onConflict: 'profile_id' })
    setSaved(true)
  }
  const missing = () => sec.questions.filter((q) => visible(q) && q.required && isEmpty(a[q.id]))

  async function next() {
    if (missing().length) { setError('Please answer all the questions marked with *.'); return }
    setError(''); setBusy(true)
    if (step < sections.length - 1) {
      await saveDraft(); setStep(step + 1); window.scrollTo(0, 0); setBusy(false); return
    }
    const { error: err } = await createClient().rpc('submit_intake', { p_answers: a })
    if (err) { setError('We could not submit your form. Please try again.'); setBusy(false); return }
    router.push('/pending'); router.refresh()
  }

  return (
    <div className="mt-6">
      <p className="text-sm font-semibold text-forest">Section {sec.key} of {sections.length}</p>
      <div className="mt-1 h-2 w-full rounded bg-navy/15"><div className="h-2 rounded bg-gold" style={{ width: `${((step + 1) / sections.length) * 100}%` }} /></div>
      <h2 className="mt-5 font-[Cambria,Georgia,serif] text-2xl font-bold text-navy">{sec.title}</h2>
      <p className="text-sm">{sec.subtitle}</p>
      <div className="mt-5 space-y-6">
        {sec.questions.filter(visible).map((q) => (
          <fieldset key={q.id}>
            <legend className="font-semibold text-navy">{q.type === 'check' ? '' : q.label}{q.required && q.type !== 'check' ? ' *' : ''}</legend>
            {q.hint && <p className="text-sm">{q.hint}</p>}
            {q.type === 'text' && <input value={String(a[q.id] ?? '')} onChange={(e) => set(q.id, e.target.value)} maxLength={200} className={box} />}
            {q.type === 'long' && <textarea value={String(a[q.id] ?? '')} onChange={(e) => set(q.id, e.target.value)} maxLength={1000} rows={3} className={box} />}
            {q.type === 'single' && q.options!.map((o) => (
              <label key={o} className="mt-2 flex items-start gap-3"><input type="radio" name={q.id} checked={a[q.id] === o} onChange={() => set(q.id, o)} className="mt-1 h-5 w-5" /><span>{o}</span></label>
            ))}
            {q.type === 'multi' && q.options!.map((o) => {
              const cur = (a[q.id] as string[]) ?? []
              return <label key={o} className="mt-2 flex items-start gap-3"><input type="checkbox" checked={cur.includes(o)} onChange={() => set(q.id, cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o])} className="mt-1 h-5 w-5" /><span>{o}</span></label>
            })}
            {q.type === 'check' && <label className="flex items-start gap-3"><input type="checkbox" checked={a[q.id] === 'yes'} onChange={(e) => set(q.id, e.target.checked ? 'yes' : '')} className="mt-1 h-5 w-5" /><span>{q.label} *</span></label>}
          </fieldset>
        ))}
      </div>
      {error && <p role="alert" className="mt-5 font-semibold text-red-700">{error}</p>}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        {step > 0 && <button type="button" onClick={() => { setStep(step - 1); window.scrollTo(0, 0) }} className="rounded border border-navy px-4 py-3 font-semibold text-navy">Back</button>}
        <button type="button" disabled={busy} onClick={next} className={`${btn} disabled:opacity-60`}>{busy ? 'Please wait...' : step < sections.length - 1 ? 'Save and continue' : 'Submit my application'}</button>
        <button type="button" onClick={saveDraft} className="font-semibold text-navy underline">Save and finish later</button>
        {saved && <span className="text-sm text-forest">Saved</span>}
      </div>
    </div>
  )
}
