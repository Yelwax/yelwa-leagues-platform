import Link from 'next/link'
import DiagonalPhoto from '@/components/DiagonalPhoto'
import { team } from '@/lib/team'
import { site } from '@/lib/site'
import { h1, btn } from '@/lib/ui'

export const metadata = { title: 'Meet the Team | Yelwa Leagues' }

export default function Team() {
  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#1A5C2A,#0D210D)] text-cream">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.4),transparent_65%)]" />
        <div className="relative mx-auto max-w-4xl px-5 py-14 sm:py-20">
          <h1 className={`${h1} !text-gold`}>The people behind Yelwa Leagues</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed">A small team with a big reason to build this. We’re growing, and the right people will join us as we do.</p>
        </div>
      </section>

      {team.map((m, i) => (
        <article key={m.name} className={`md:grid md:grid-cols-2 ${i % 2 ? 'bg-white' : 'bg-cream'}`}>
          <DiagonalPhoto photo={m.photo || (i === 0 ? site.founderPhoto : '')} name={m.name} flip={i % 2 === 1} />
          <div className="flex flex-col justify-center px-6 py-10 md:px-12 md:py-16">
            <h2 className="font-[Cambria,Georgia,serif] text-3xl font-bold text-navy">{m.name}</h2>
            <p className="mt-1 font-semibold text-forest">{m.role}</p>
            <div className="mt-4 space-y-3 leading-relaxed">{m.bio.map((p) => <p key={p}>{p}</p>)}</div>
          </div>
        </article>
      ))}

      <section className="bg-[linear-gradient(135deg,#1B2A4A,#0D210D)] text-cream">
        <div className="mx-auto max-w-4xl px-5 py-12">
          <p className="max-w-xl text-lg leading-relaxed">More people will join us as the league grows. If you’d like to be one of them, we’d love to hear from you.</p>
          <div className="mt-5"><Link href="/contact" className={btn}>Get in touch</Link></div>
        </div>
      </section>
    </>
  )
}
