import Link from 'next/link'
import { h1, wrap, btn } from '@/lib/ui'

const steps = [
  ['Get the brochure', 'Leave your details and download it. It explains the phases, the courses and how classes run.'],
  ['Fill in the intake form', 'Tell us about yourself, your business and how much time you can give each week.'],
  ['Have an interview call', 'A short conversation so we can get to know you and answer your questions.'],
  ['Receive your price list', 'We send the fee that fits your phase and track.'],
  ['Confirm and get access', 'Once your payment is confirmed, we place you in a pod and open your student account.'],
]

export default function HowItWorks() {
  return (
    <div className={wrap}>
      <h1 className={h1}>How joining works</h1>
      <p className="mt-4 leading-relaxed">The process takes a week or two. That is deliberate. We want to know who is joining and place each student where they will do well.</p>
      <ol className="mt-8 space-y-6">
        {steps.map(([title, text], i) => (
          <li key={title} className="flex gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-bold text-cream">{i + 1}</span>
            <div>
              <h2 className="text-lg font-bold text-navy">{title}</h2>
              <p className="leading-relaxed">{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-10"><Link href="/brochure" className={btn}>Start with the brochure</Link></div>
    </div>
  )
}
