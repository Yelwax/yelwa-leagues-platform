import { h1, wrap } from '@/lib/ui'

export default function About() {
  return (
    <div className={wrap}>
      <h1 className={h1}>About Yelwa Leagues</h1>
      <div className="mt-6 space-y-4 leading-relaxed">
        <p>Yelwa Leagues is a program of Yelwax Solutions. It teaches business the way it is actually done in Nigeria, with Nigerian examples, Nigerian money and Nigerian customers.</p>
        <p>Students learn in small accountability pods. Each pod has its own tutor, its own class timetable and its own chat room. Between classes, every student has a private library of manuals, slides and recordings.</p>
        <p>The programme was founded and is led by Muhammad Inuwa Abubakar, Founder of Yelwax Solutions and Lead Speaker of Yelwa Leagues.</p>
        {/* TODO: add a short founder note and your own story here */}
      </div>
    </div>
  )
}
