import Link from 'next/link'
import { h1, h2, btn } from '@/lib/ui'

export const metadata = { title: 'About | Yelwa Leagues' }

const stands = [
  ['A community of like minds', 'Business can be lonely. We bring people with the same drive into one space, so you can talk, network and grow alongside others who get it.'],
  ['A launch pad for what you want to build', 'If you have an idea but not yet the capacity, the capability or the resources, we exist to help you get it off the ground.'],
  ['Knowledge that reaches everyone', 'We would rather give practical, scalable business knowledge to many people than a handout to a few. Learn it once, and use it to build something of your own.'],
]
const company = [
  ['Where we started', 'We began with a simple, everyday problem: making utility transactions (mobile data, airtime, bill payments and more) affordable and easy for ordinary Nigerians. That work is still where our roots are.'],
  ['Where we’re going', 'We’re building toward an ecosystem of sustainable businesses, from small and medium enterprises to large corporations, supported by reliable financial and credit systems for the merchants who run them and the consumers they serve.'],
  ['What we believe', 'Nigeria doesn’t lack products or skills. What’s missing is the mechanism that helps others see that value and trust it. Build that mechanism, and good businesses stop being the exception.'],
  ['Why Yelwa Leagues', 'Because no system works without people. We built a community where founders, business owners and investors give each other feedback, mentorship, networks and a way to exchange value, so that building a business gets easier, even for a novice.'],
]

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#1A5C2A,#0D210D)] text-cream">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.4),transparent_65%)]" />
        <div className="relative mx-auto max-w-4xl px-5 py-16 sm:py-24">
          <h1 className={`${h1} !text-gold sm:text-6xl`}>Talent is everywhere. The path to scale isn’t.</h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed">We started Yelwa Leagues for the people with real ideas and real drive who never got the structure, the network or the knowledge to take them further.</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-12">
        <h2 className={h2}>Why we started</h2>
        <p className="mt-3 max-w-2xl leading-relaxed">Across Nigeria, there are people with sharp ideas and the talent to carry them out. Many of them stall at the same point: they can’t turn the idea into something real, or can’t grow it once it exists. Some of us have been stuck there ourselves. Yelwa Leagues is our answer to that bottleneck.</p>

        <h2 className={`${h2} mt-12`}>What we stand for</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {stands.map(([t, d]) => (
            <div key={t} className="rounded-3xl border-t-4 border-gold bg-white p-5 shadow-sm ring-1 ring-navy/5">
              <h3 className="font-bold text-navy">{t}</h3>
              <p className="mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>

        <h2 className={`${h2} mt-12`}>Why “Leagues”?</h2>
        <div className="mt-3 max-w-2xl space-y-3 leading-relaxed">
          <p>A league is where people compete, and also where they grow. We chose the name because we believe in healthy competition: a space where everyone is pushing toward something, and every win raises the standard for the rest.</p>
          <p>You move up through three levels, Incubation, Momentum and Acceleration. You’re not building alone, and you’re not building against each other. You’re building in the same league.</p>
        </div>

        <h2 className={`${h2} mt-12`}>The company behind it</h2>
        <p className="mt-3 max-w-2xl leading-relaxed">Yelwa Leagues is a program of Yelwax Solutions, a Nigerian company founded in 2022 by Muhammad Inuwa Abubakar and incorporated in 2025.</p>
        <div className="mt-5 space-y-5">
          {company.map(([t, d]) => (
            <div key={t} className="border-l-4 border-forest pl-4">
              <h3 className="font-bold text-forest">{t}</h3>
              <p className="mt-1 max-w-2xl leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-[linear-gradient(135deg,#1B2A4A,#0D210D)] text-cream">
        <div className="mx-auto max-w-4xl px-5 py-14">
          <p className="max-w-2xl text-lg leading-relaxed">Business is hard, and we know it. Somewhere along the way it became normal to believe that real success means going through hardship alone. It doesn’t have to be that way. Nobody should have to learn this by themselves.</p>
          <p className="mt-4 font-[Cambria,Georgia,serif] text-2xl font-bold text-gold">Yelwa Leagues is the community that cheers you on the whole way.</p>
          <div className="mt-6"><Link href="/how-it-works" className={btn}>See how Yelwa Leagues works</Link></div>
        </div>
      </section>
    </>
  )
}
