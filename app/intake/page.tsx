import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import IntakeForm from '@/components/IntakeForm'
import { h1, wrap } from '@/lib/ui'
import type { Answers } from '@/lib/intake'

async function Content() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [{ data: profile }, { data: intake }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user!.id).single(),
    supabase.from('intake_responses').select('answers, status').eq('profile_id', user!.id).maybeSingle(),
  ])
  if (intake?.status === 'submitted') {
    return (
      <div className={wrap}>
        <h1 className={h1}>Intake form submitted</h1>
        <p className="mt-4 leading-relaxed">Thank you. We have your answers and will be in touch about the next step.</p>
        <p className="mt-6"><Link href="/pending" className="font-semibold text-navy underline">Back to my application</Link></p>
      </div>
    )
  }
  const initial: Answers = { A1: profile?.full_name ?? '', ...((intake?.answers as Answers) ?? {}) }
  return (
    <div className={wrap}>
      <h1 className={h1}>Member intake form</h1>
      <p className="mt-4 leading-relaxed">This helps us understand who you are and where you are starting from. It takes about 10 minutes. Fields marked * are required. Read how we use your information in our <Link href="/privacy" className="font-semibold text-navy underline">Privacy Policy</Link>.</p>
      <IntakeForm profileId={user!.id} initial={initial} />
    </div>
  )
}

export default function Page() {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content /></Suspense>
}
