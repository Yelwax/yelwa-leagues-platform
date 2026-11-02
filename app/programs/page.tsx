import Link from 'next/link'
import { h1, h2, btn } from '@/lib/ui'

export const metadata = { title: 'Programs | Yelwa Leagues' }

export default function Programs() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <h1 className={h1}>Programs</h1>
      <p className="mt-4 text-lg leading-relaxed">Every member starts in the phase that fits where they are, based on their intake form and a short conversation with us.</p>

      <div className="mt-8 rounded-3xl border-l-8 border-forest bg-white p-6 shadow-sm ring-1 ring-navy/5">
        <h2 className={h2}>Incubation</h2>
        <p className="mt-2 leading-relaxed">The foundation level, made up of three core courses:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5"><li>Business Awareness and Financial Literacy</li><li>Automation and Systems</li><li>Marketing and Growth</li></ul>
      </div>
      <div className="mt-5 rounded-3xl border-l-8 border-gold bg-white p-6 shadow-sm ring-1 ring-navy/5">
        <h2 className={h2}>Momentum</h2>
        <p className="mt-2 leading-relaxed">Hands-on work on your own business, with a mentor beside you. Three advanced courses sit at this level:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5"><li>AI Leverage</li><li>Capital</li><li>Management, taught to MBA standard</li></ul>
      </div>
      <div className="mt-5 rounded-3xl border-l-8 border-navy bg-white p-6 shadow-sm ring-1 ring-navy/5">
        <h2 className={h2}>Acceleration</h2>
        <p className="mt-2 leading-relaxed">Scaling, pitching and investor access, for businesses ready for the next level.</p>
        {/* TODO: add the Acceleration course list when confirmed */}
      </div>
      <div className="mt-5 rounded-3xl bg-[linear-gradient(135deg,#1A5C2A,#0D210D)] p-6 text-cream shadow-lg">
        <h2 className="font-[Cambria,Georgia,serif] text-2xl font-bold text-gold">Your own track</h2>
        <p className="mt-2 leading-relaxed">Know exactly what you want to learn? Tell us, and we’ll shape your journey, schedule and handouts around it.</p>
      </div>
      <div className="mt-8"><Link href="/how-it-works" className={btn}>See how joining works</Link></div>
    </div>
  )
}
