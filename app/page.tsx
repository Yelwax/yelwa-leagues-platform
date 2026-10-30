import Link from 'next/link'
import { h1, h2, btn } from '@/lib/ui'

const phases = [
  ['Incubation', 'text-forest', 'Build the foundation: how business really works, how to read your numbers, and how to start with what you have.'],
  ['Momentum', 'text-[#9a7a1f]', 'Put systems and marketing behind your business so it grows without you doing everything.'], // TODO: confirm phase description
  ['Acceleration', 'text-navy', 'Scale with leverage, funding and a clear plan for the next level.'], // TODO: confirm phase description
]

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-14 sm:grid-cols-2">
        <div>
          <h1 className={h1}>Learn business by building yours.</h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed">
            Yelwa Leagues is a hands-on business programme for Nigerians. Live classes, a small accountability pod, and a private library, in three phases.
          </p>
          <div className="mt-7"><Link href="/brochure" className={btn}>Get the brochure</Link></div>
        </div>
        <svg viewBox="0 0 300 190" role="img" aria-label="Three ascending peaks: Incubation, Momentum, Acceleration" className="w-full">
          <polygon points="5,150 65,85 125,150" fill="#1A5C2A" />
          <polygon points="100,150 165,55 230,150" fill="#C9A84C" />
          <polygon points="195,150 255,15 315,150" fill="#1B2A4A" />
          <line x1="0" y1="150" x2="300" y2="150" stroke="#1B2A4A" strokeWidth="1.5" />
          <text x="65" y="172" textAnchor="middle" fontSize="11" fill="#1B2A4A">Incubation</text>
          <text x="165" y="172" textAnchor="middle" fontSize="11" fill="#1B2A4A">Momentum</text>
          <text x="255" y="172" textAnchor="middle" fontSize="11" fill="#1B2A4A">Acceleration</text>
        </svg>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-14">
        <h2 className={h2}>Three phases, one path</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-3">
          {phases.map(([name, color, text]) => (
            <div key={name}>
              <h3 className={`text-lg font-bold ${color}`}>{name}</h3>
              <p className="mt-1 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <Link href="/programs" className="mt-5 inline-block font-semibold text-navy underline">See the programs</Link>
      </section>

      <section className="bg-darkgreen text-cream">
        <div className="mx-auto max-w-5xl px-5 py-12">
          <h2 className="font-[Cambria,Georgia,serif] text-2xl font-bold text-gold">Joining is a conversation, not a checkout</h2>
          <p className="mt-3 max-w-xl leading-relaxed">
            You read the brochure, fill in a short form, and talk with us before anything else happens. It takes a week or two, so we can place you in the right pod.
          </p>
          <Link href="/how-it-works" className="mt-5 inline-block font-semibold text-gold underline">See how joining works</Link>
        </div>
      </section>
    </>
  )
}
