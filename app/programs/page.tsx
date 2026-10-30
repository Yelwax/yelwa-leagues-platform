import Link from 'next/link'
import { h1, h2, wrap, btn } from '@/lib/ui'

export default function Programs() {
  return (
    <div className={wrap}>
      <h1 className={h1}>Programs</h1>
      <p className="mt-4 leading-relaxed">Every student starts in the phase that fits where they are, based on their intake form and interview.</p>

      <div className="mt-8 border-l-4 border-forest pl-5">
        <h2 className={h2}>Incubation</h2>
        <p className="mt-2 leading-relaxed">The foundation level, made up of three core courses:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Business Awareness and Financial Literacy</li>
          <li>Automation and Systems</li>
          <li>Marketing and Growth</li>
        </ul>
      </div>
      <div className="mt-8 border-l-4 border-gold pl-5">
        <h2 className={h2}>Momentum</h2>
        <p className="mt-2 leading-relaxed">Applied practice on your own business, with a mentor assigned to you.</p>
      </div>
      <div className="mt-8 border-l-4 border-navy pl-5">
        <h2 className={h2}>Acceleration</h2>
        <p className="mt-2 leading-relaxed">Scaling, pitching and funding access, for businesses ready for the next level.</p>
      </div>

      <div className="mt-10"><Link href="/brochure" className={btn}>Get the brochure</Link></div>
    </div>
  )
}
