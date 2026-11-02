import Link from 'next/link'
import { h1, btn } from '@/lib/ui'

export const metadata = { title: 'How joining works | Yelwa Leagues' }

const steps = [
  ['Get the brochure', 'Leave your name and contact details and download it. It explains the three phases, the courses in each one and how classes run, so you know what you are stepping into before we ever speak.'],
  ['Fill in the intake form', 'Tell us about yourself, your business and what is slowing it down. Be honest about how many hours a week you can give, whether that is 2, 4, 6 or more. There is no wrong answer. It simply helps us choose the right pace and the right pod for you.'],
  ['Have a conversation with us', 'This is a short, friendly talk where we get to know you, hear your goals and answer every question you have. It is also where we work out whether the standard phases suit you, or whether a custom track built around exactly what you want to learn would serve you better.'],
  ['Receive your details', 'After the conversation, we send you everything that fits your phase and track, including the fee. No surprises.'],
  ['Confirm and get access', 'Once your membership is confirmed, we place you in a pod of people at a similar stage and open your member account. Your classes, your materials and your community are waiting inside.'],
]

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <h1 className={h1}>How joining works</h1>
      <p className="mt-4 text-lg leading-relaxed">Joining Yelwa Leagues is a conversation, not a checkout. The process takes a week or two, and that is deliberate. We want to know who is joining, understand where your business is today, and place you where you will do well. Here is exactly what to expect.</p>
      <ol className="mt-8 space-y-4">
        {steps.map(([t, d], i) => (
          <li key={t} className="flex gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-navy/5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1B2A4A,#0D210D)] font-bold text-gold">{i + 1}</span>
            <div><h2 className="text-lg font-bold text-navy">{t}</h2><p className="mt-1 leading-relaxed">{d}</p></div>
          </li>
        ))}
      </ol>
      <div className="mt-8"><Link href="/brochure" className={btn}>Start with the brochure</Link></div>
    </div>
  )
}
