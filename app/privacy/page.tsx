import { h1, h2, wrap } from '@/lib/ui'
import { site } from '@/lib/site'

export const metadata = { title: 'Privacy Policy | Yelwa Leagues' }

export default function Privacy() {
  return (
    <div className={wrap}>
      <h1 className={h1}>Privacy Policy</h1>
      <p className="mt-2 text-sm">Last updated: 1 November 2026</p>
      <div className="mt-6 space-y-4 leading-relaxed">
        <p>Yelwa Leagues is a program of Yelwax Solutions. This page explains what personal information we collect, why, who can see it, and what choices you have.</p>
        <h2 className={h2}>What we collect</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>When you request the brochure: your name, email address, WhatsApp number, and (if you choose to share it) your business stage and challenge.</li>
          <li>When you create an account: your name, email address and password. Passwords are stored in protected form, and we cannot read them.</li>
          <li>When you apply: your answers on the intake form, such as your age range, location, education, business experience and goals.</li>
          <li>When you are a student: your pod, class schedule, the messages you post in chat rooms, and which learning materials you open.</li>
        </ul>
        <h2 className={h2}>Why we collect it</h2>
        <p>To respond to your enquiry, assess your application, place you in the right pod, run classes and chat, and keep the platform secure. We do not sell your information.</p>
        <h2 className={h2}>Who can see it</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Our team can see your application, your contact details and your pipeline stage. Our scoring notes about applicants are never shown to applicants.</li>
          <li>Your tutor and the other students in your pod can see your name and your messages in your pod chat. Everyone in the community room can see your name and messages there.</li>
          <li>Our team does not read pod chats. We see a message only when someone reports it, together with the few messages before it.</li>
          <li>Our service providers store and process data for us: Supabase (database and login), Vercel (website hosting) and Google (class meetings).</li>
        </ul>
        <h2 className={h2}>How long we keep it</h2>
        <p>We keep your information while your application or membership is active and for as long as needed afterwards for our records and legal obligations. {/* TODO: set a specific retention period */}</p>
        <h2 className={h2}>Your rights</h2>
        <p>You can ask us to show you the information we hold about you, correct it, or delete it, and you can withdraw your consent to be contacted at any time. {site.email ? <>Write to us at <a className="font-semibold text-navy underline" href={`mailto:${site.email}`}>{site.email}</a>.</> : 'Contact details are on our Contact page.'}</p>
        <h2 className={h2}>Under 18</h2>
        <p>If you are under 18, please ask a parent or guardian to read this policy and to contact us before you apply.</p>
        <h2 className={h2}>Changes</h2>
        <p>If we change this policy, we will update the date at the top of this page.</p>
      </div>
    </div>
  )
}
