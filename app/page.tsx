import Link from 'next/link'
import StageSelector from '@/components/StageSelector'
import { h1, h2, btn } from '@/lib/ui'
import { site } from '@/lib/site'
import { team } from '@/lib/team'

const phases = [
  ['Incubation', 'border-forest', 'text-forest', 'sm:min-h-[11rem]', 'The foundation. How business really works, how to read your numbers, and how to build on what you already have.'],
  ['Momentum', 'border-gold', 'text-[#8a6a14]', 'sm:min-h-[13.5rem]', 'Hands-on work on your own business, with a mentor beside you.'],
  ['Acceleration', 'border-navy', 'text-navy', 'sm:min-h-[16rem]', 'Scaling, pitching and investor access, for businesses ready for the next level.'],
]

const faqs = [
  ['Is this for me?', 'If you’re a serious Nigerian business owner or founder, or you’re ready to build something of your own, yes. If you have an idea, a young business or one that’s stuck, there’s a place for you to start. And if you’re simply curious about business and want to learn it for its own sake, you’re welcome here too. Curiosity is often where it begins, and as you learn, you’ll see for yourself where you want to take part.'],
  ['How do the classes actually work?', 'Muhammad leads live sessions built around real Nigerian businesses. You learn, apply it to your own business, and work alongside a pod of people at a similar stage.'],
  ['Can I focus on just what I need?', 'Yes. With the custom track, you tell us what you want to learn, and we shape your journey around it: your schedule, your timetable and your handouts.'],
  ['Will I have time for this?', 'Choose the pace that fits your week: 2, 4, 6 or 6+ hours a week, including live sessions and practice. Tell us how much time you have and we’ll place you accordingly.'],
  ['Is there a fee?', 'Yes, membership is paid. We don’t believe in surprises, so we walk you through the details in your conversation with us, before you commit to anything.'],
  ['How quickly can I get started?', 'Joining is a conversation, not a checkout. You read the brochure, fill in a short form, and talk with us. Then we place you in the right pod.'],
  ['Do I need to have a business already?', 'No. If you have an idea, Incubation is where you begin. If you already run something, we’ll point you to the phase that fits.'],
]

export default function Home() {
  const founder = team[0]
  const photo = founder.photo || site.founderPhoto
  return (
    <>
      <style>{'@keyframes drift{from{transform:translate3d(0,0,0)}to{transform:translate3d(-40px,30px,0)}}.glow{animation:drift 16s ease-in-out infinite alternate}@media (prefers-reduced-motion:reduce){.glow{animation:none}}'}</style>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#F4F1EA,#EDE6D3)]">
        <div aria-hidden="true" className="glow pointer-events-none absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.5),transparent_65%)]" />
        <div aria-hidden="true" className="glow pointer-events-none absolute -bottom-40 -left-32 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(26,92,42,0.22),transparent_65%)]" />
        <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-16 sm:pt-24">
          <h1 className={`${h1} max-w-3xl sm:text-6xl`}>Most Nigerians build businesses to survive.</h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed sm:text-2xl">
            Yelwa Leagues gives serious Nigerian business owners the skills, systems and mentorship to build businesses that scale.
          </p>
          <div className="mt-8"><Link href="/how-it-works" className={btn}>See how Yelwa Leagues works</Link></div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-navy/5 sm:p-8">
          <h2 className={h2}>Where is your business today?</h2>
          <p className="mt-2 max-w-xl leading-relaxed">Tell us where you are and what’s slowing you down. We’ll point you to the right place to start.</p>
          <StageSelector />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10">
        <h2 className={h2}>Three phases, one path</h2>
        <svg viewBox="0 0 300 190" role="img" aria-label="Three ascending peaks: Incubation, Momentum, Acceleration" className="mt-6 w-full max-w-md">
          <defs>
            <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2C8A44" /><stop offset="1" stopColor="#1A5C2A" /></linearGradient>
            <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E3C877" /><stop offset="1" stopColor="#C9A84C" /></linearGradient>
            <linearGradient id="gn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#34497A" /><stop offset="1" stopColor="#1B2A4A" /></linearGradient>
          </defs>
          <polygon points="5,150 65,85 125,150" fill="url(#gf)" />
          <polygon points="100,150 165,55 230,150" fill="url(#gg)" />
          <polygon points="195,150 255,15 315,150" fill="url(#gn)" />
          <line x1="0" y1="150" x2="300" y2="150" stroke="#1B2A4A" strokeWidth="1.5" />
          <text x="65" y="172" textAnchor="middle" fontSize="11" fill="#1B2A4A">Incubation</text>
          <text x="165" y="172" textAnchor="middle" fontSize="11" fill="#1B2A4A">Momentum</text>
          <text x="255" y="172" textAnchor="middle" fontSize="11" fill="#1B2A4A">Acceleration</text>
        </svg>
        <div className="mt-6 grid items-end gap-4 sm:grid-cols-3">
          {phases.map(([name, border, color, height, text]) => (
            <div key={name} className={`rounded-3xl border-t-4 bg-white p-5 shadow-sm ring-1 ring-navy/5 ${border} ${height}`}>
              <h3 className={`text-lg font-bold ${color}`}>{name}</h3>
              <p className="mt-1 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <Link href="/programs" className="mt-6 inline-block font-semibold text-navy underline">See the programs</Link>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-6">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-[linear-gradient(135deg,#1B2A4A,#0D210D)] p-6 text-cream shadow-lg sm:flex-row sm:items-center sm:p-8">
          {photo
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={photo} alt={founder.name} className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-gold/50" />
            : <div aria-hidden="true" className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gold/20 font-[Cambria,Georgia,serif] text-3xl font-bold text-gold ring-4 ring-gold/50">MIA</div>}
          <div>
            <h2 className="font-[Cambria,Georgia,serif] text-2xl font-bold text-gold">{founder.name}</h2>
            <p className="text-sm font-semibold text-cream/80">{founder.role}</p>
            <p className="mt-3 max-w-xl leading-relaxed">Muhammad leads the live sessions and built the curriculum around real Nigerian businesses, real customers and real challenges. He started Yelwa Leagues because too many talented Nigerians with good ideas never get to actualise or scale them, a bottleneck he knows first-hand.</p>
            <Link href="/team" className="mt-4 inline-block font-semibold text-gold underline">Meet the team</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-12">
        <h2 className={h2}>Questions people ask</h2>
        <div className="mt-4 space-y-3">
          {faqs.map(([q, a]) => (
            <details key={q} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-navy/5">
              <summary className="cursor-pointer font-semibold text-navy">{q}</summary>
              <p className="mt-2 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#1A5C2A,#0D210D)] text-cream">
        <div aria-hidden="true" className="glow pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.4),transparent_65%)]" />
        <div className="relative mx-auto max-w-5xl px-5 py-14">
          <h2 className="font-[Cambria,Georgia,serif] text-3xl font-bold text-gold">Joining is a conversation, not a checkout</h2>
          <p className="mt-3 max-w-xl leading-relaxed">You read the brochure, fill in a short form, and talk with us before anything else happens, so we can place you in the right pod.</p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Link href="/brochure" className={btn}>Get the brochure</Link>
            <Link href="/how-it-works" className="font-semibold text-gold underline">See how joining works</Link>
          </div>
        </div>
      </section>
    </>
  )
}
