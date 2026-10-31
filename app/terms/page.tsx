import { h1, h2, wrap } from '@/lib/ui'
import { site } from '@/lib/site'

export const metadata = { title: 'Terms of Use | Yelwa Leagues' }

export default function Terms() {
  return (
    <div className={wrap}>
      <h1 className={h1}>Terms of Use</h1>
      <p className="mt-2 text-sm">Last updated: 1 November 2026</p>
      <div className="mt-6 space-y-4 leading-relaxed">
        <p>These terms apply when you use the Yelwa Leagues website and student platform, a program of Yelwax Solutions. By creating an account you agree to them.</p>
        <h2 className={h2}>Your account</h2>
        <p>Your account is personal to you. Do not share your login with anyone. Give us accurate information, and tell us if you think someone else has used your account.</p>
        <h2 className={h2}>Joining and fees</h2>
        <p>Membership follows our joining process: brochure, intake form, interview, price list and payment confirmation. Your account is opened as a student account only after your payment is confirmed. {/* TODO: add your refund and instalment policy here */}</p>
        <h2 className={h2}>Learning materials</h2>
        <p>The manuals, slides, recordings and other materials belong to Yelwa Leagues or its tutors. They are provided to you for your own learning and are view-only. You must not download, copy, record, share or sell them. Materials carry your name as a watermark.</p>
        <h2 className={h2}>Conduct</h2>
        <p>Be respectful in classes and in chat. Do not post spam, adverts, abuse, hate or anything unlawful. We may delete messages, mute you, or suspend your account if these rules are broken.</p>
        <h2 className={h2}>Our responsibility</h2>
        <p>We teach business skills and cannot promise any particular income or business result. We work to keep the platform available but cannot promise it will never be interrupted.</p>
        <h2 className={h2}>Governing law</h2>
        <p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>
        <h2 className={h2}>Contact</h2>
        <p>{site.email ? <>Questions about these terms: <a className="font-semibold text-navy underline" href={`mailto:${site.email}`}>{site.email}</a>.</> : 'Contact details are on our Contact page.'}</p>
      </div>
    </div>
  )
}
