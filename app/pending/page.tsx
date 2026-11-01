import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import { h1, wrap, btn, card } from '@/lib/ui'
import { stages as allStages } from '@/lib/stages'

const stages: Record<string, string> = {
  brochure_requested: 'We have your details. Your next step is the intake form.',
  intake_submitted: 'We have your intake form and are reviewing it.',
  interview_scheduled: 'Your interview call is scheduled.',
  interview_done: 'Your interview is done. We are preparing your next step.',
  price_list_sent: 'We have sent your price list. Please check your email or WhatsApp.',
  payment_confirmed: 'Your payment is confirmed. We are placing you in a pod and opening your account.',
}

async function Content() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('full_name, pipeline_stage').eq('id', user!.id).single()
  const first = profile?.full_name?.split(' ')[0]
  return (
    <div className={wrap}>
      <h1 className={h1}>Your application is in progress</h1>
      <p className="mt-4 text-lg">{first ? `Hello ${first}. ` : ''}Joining takes a week or two, so that we can place you in the right pod.</p>
      <p className={`${card} mt-6 leading-relaxed`}>
        <strong className="text-navy">Where you are:</strong> {stages[profile?.pipeline_stage ?? ''] ?? 'We are reviewing your application.'}
      </p>
      <ol className="mt-6 space-y-3">
        {allStages.filter((x) => x.id !== 'active').map((x, i) => {
          const cur = allStages.findIndex((y) => y.id === profile?.pipeline_stage)
          const done = i < cur, now = i === cur
          return (
            <li key={x.id} className="flex items-center gap-3">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${done ? 'bg-forest text-white' : now ? 'bg-gold text-navy ring-4 ring-gold/30' : 'bg-navy/10 text-navy/50'}`}>{done ? '✓' : i + 1}</span>
              <span className={now ? 'font-bold text-navy' : done ? 'text-navy' : 'text-navy/50'}>{x.label}</span>
            </li>
          )
        })}
      </ol>
      {profile?.pipeline_stage === 'brochure_requested' && (
        <div className="mt-6"><Link href="/intake" className={btn}>Fill in the intake form</Link></div>
      )}
      <LogoutButton />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}>
      <Content />
    </Suspense>
  )
}
