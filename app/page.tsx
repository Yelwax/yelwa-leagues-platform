import Link from 'next/link'
import Image from 'next/image'
import StageSelector from '@/components/StageSelector'
import { h1, h2, btn } from '@/lib/ui'
import { site } from '@/lib/site'

const phases = [
  ['Incubation', 'text-forest', 'The foundation. How business really works, how to read your numbers, and how to start with what you have.'],
  ['Momentum', 'text-[#8a6a14]', 'Applied practice on your own business, with a mentor assigned to you.'],
  ['Acceleration', 'text-navy', 'Scaling, pitching and funding access, for businesses ready for the next level.'],
]

const faqs = [
  ['Who is Yelwa Leagues for?', 'Serious young Nigerians and working professionals who want to start a business, or grow the one they already have.'],
  ['How do classes work?', 'Live online classes on Google Meet, in a small pod with its own tutor and chat room. Between classes you have a private library of manuals, slides and recordings.'],
  ['How much time does it take?', 'Pods run on 2, 4 or 6+ hours a week. We place you in the one that fits your schedule.'],
  ['How much does it cost?', 'Your fee is sent in a price list after your interview, based on your phase and track.'],
  ['How long does joining take?', 'A week or two. You get the brochure, fill in a short form, and have an interview call before anything else.'],
]

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-5 pb-10 pt-16 sm:pt-24">
        <h1 className={`${h1} max-w-3xl sm:text-6xl`}>Most Nigerians build businesses to survive.</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed sm:text-2xl">
          Yelwa Leagues exists to change that — giving every serious young Nigerian the tools to build businesses that actually scale.
        </p>
        <div className="mt-8"><Link href="/brochure" className={btn}>Get the brochure</Link></div>
      </section>

      <section className="mx-auto max-w-5xl border-t border-gold/50 px-5 py-12">
        <h2 className={h2}>Where is your business right now?</h2>
        <p className="mt-2 max-w-xl leading-relaxed">Tell us your stage and what is holding you back. We will point you to the best place to start.</p>
        <StageSelector />
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <h2 className={h2}>Three phases, one path</h2>
        <svg viewBox="0 0 300 190" role="img" aria-label="Three ascending peaks: Incubation, Momentum, Acceleration" className="mt-6 w-full max-w-md">
          <polygon points="5,150 65,85 125,150" fill="#1A5C2A" />
          <polygon points="100,150 165,55 230,150" fill="#C9A84C" />
          <polygon points="195,150 255,15 315,150" fill="#1B2A4A" />
          <line x1="0" y1="150" x2="300" y2="150" stroke="#1B2A4A" strokeWidth="1.5" />
          <text x="65" y="172" textAnchor="middle" fontSize="11" fill="#1B2A4A">Incubation</text>
          <text x="165" y="172" textAnchor="middle" fontSize="11" fill="#1B2A4A">Momentum</text>
          <text x="255" y="172" textAnchor="middle" fontSize="11" fill="#1B2A4A">Acceleration</text>
        </svg>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {phases.map(([name, color, text]) => (
            <div key={name}>
              <h3 className={`text-lg font-bold ${color}`}>{name}</h3>
              <p className="mt-1 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <Link href="/programs" className="mt-6 inline-block font-semibold text-navy underline">See the programs</Link>
      </section>

      <section className="mx-auto grid max-w-5xl items-center gap-8 border-t border-gold/50 px-5 py-12 sm:grid-cols-[220px_1fr]">
        {site.founderPhoto ? (
          <Image src={site.founderPhoto} alt="Muhammad Inuwa Abubakar" width={440} height={440} className="w-full max-w-[220px] rounded" />
        ) : (
          <div aria-hidden="true" className="flex aspect-square w-full max-w-[220px] items-center justify-center rounded bg-navy font-[Cambria,Georgia,serif] text-5xl font-bold text-gold">MIA</div>
        )}
        <div>
          <h2 className={h2}>Muhammad Inuwa Abubakar</h2>
          <p className="mt-1 font-semibold text-forest">Founder, Yelwax Solutions | Lead Speaker, Yelwa Leagues</p>
          <p className="mt-3 max-w-xl leading-relaxed">Muhammad leads the live sessions and built the curriculum around real Nigerian businesses, real prices and real customers.</p>
          {/* TODO: replace with your own short story */}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-12">
        <h2 className={h2}>Questions people ask</h2>
        <div className="mt-4 divide-y divide-navy/20 border-y border-navy/20">
          {faqs.map(([q, a]) => (
            <details key={q} className="py-3">
              <summary className="cursor-pointer font-semibold text-navy">{q}</summary>
              <p className="mt-2 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-darkgreen text-cream">
        <div className="mx-auto max-w-5xl px-5 py-12">
          <h2 className="font-[Cambria,Georgia,serif] text-2xl font-bold text-gold">Joining is a conversation, not a checkout</h2>
          <p className="mt-3 max-w-xl leading-relaxed">You read the brochure, fill in a short form, and talk with us before anything else happens, so we can place you in the right pod.</p>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            <Link href="/brochure" className={btn}>Get the brochure</Link>
            <Link href="/how-it-works" className="font-semibold text-gold underline">See how joining works</Link>
          </div>
        </div>
      </section>
    </>
  )
}
