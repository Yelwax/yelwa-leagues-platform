import LegalDoc, { type Section } from '@/components/LegalDoc'
import { site } from '@/lib/site'

export const metadata = { title: 'Privacy Policy | Yelwa Leagues' }

// TODO: put the registered office address here when you have it
const ADDRESS = ''
const email = site.email || '[email to be added]'
const address = ADDRESS || '[address to be added]'

const sections: Section[] = [
  { title: '1. Who we are', blocks: [`Yelwa Leagues is a program of Yelwax Solutions Inc. (“Yelwax”, “we”, “us” or “our”). For the purposes of the Nigeria Data Protection Act 2023, we are the data controller of the personal information described in this policy, which means we decide why and how it is collected and used. Contact: ${email}. Address: ${address}.`] },
  { title: '2. What we collect', blocks: [{ items: [
    ['When you request the brochure:', 'your name, email address and WhatsApp number, and, if you choose to share them, your business stage and the challenge you face.'],
    ['When you create an account:', 'your name, email address and password. Your password is stored in protected form, and we cannot read it.'],
    ['When you apply:', 'your answers on the intake form, such as your age range, location, education, business experience, goals and the time you can commit each week.'],
    ['When you build a member profile:', 'your display name, photo, business name, what your business does, your location and a short bio. Every part of the profile is optional.'],
    ['When you are a member:', 'your pod, your class schedule, the messages you post in chat rooms and which learning materials you open.'],
    ['Automatically:', 'basic technical information needed to run and secure the platform, such as login activity, IP address, and browser and device information, recorded in the standard logs of our hosting and database providers.'],
  ] }, 'We do not knowingly collect sensitive personal data, such as health or religious information, and we ask that you do not share it with us in chat rooms or on your profile.'] },
  { title: '3. Why we use your information', blocks: ['We use your personal information only for the purposes below, and only where we have a lawful basis to do so.', { items: [
    ['', 'To respond to your enquiry and send the brochure. Basis: your consent, given when you submit the brochure form.'],
    ['', 'To assess your application and place you in the right pod. Basis: steps taken at your request before joining, and our legitimate interest in placing members where they will do well.'],
    ['', 'To provide your membership: running classes and chat, scheduling, and giving you access to learning materials. Basis: performance of our agreement with you.'],
    ['', 'To keep the platform safe and fair, including preventing misuse, enforcing our Terms of Use and handling reports of abuse. Basis: our legitimate interests and, where required, legal obligations.'],
    ['', 'To contact you about Yelwa Leagues, such as class updates and relevant announcements. Basis: your consent or our legitimate interest, and you can opt out at any time.'],
    ['', 'To meet legal obligations, such as record-keeping and responding to lawful requests from authorities.'],
  ] }, 'We do not sell your personal information.', 'How we assess applications. Our team reviews and scores every application, and a person makes every decision about whether and where you join. We may use AI tools as a second check, for example to review an application or our own scoring for consistency. These tools support our team and do not make decisions about you on their own.'] },
  { title: '4. Who can see your information', blocks: [{ items: [
    ['Our team.', 'Authorised members of our team can see your application, your contact details and where you are in our joining process. Our internal scoring notes about applicants are never shown to applicants.'],
    ['Other members.', 'Your member profile is shown to other signed-in Yelwa Leagues members. Your email address, phone number and application answers are never shown on it.'],
    ['Your pod and community.', 'Your tutor and the other members of your pod can see your name and your messages in your pod chat. Everyone in the community room can see your name and messages there. Please share only what you are comfortable with others seeing.'],
    ['Moderation.', 'Our team does not read pod chats. We see a message only when someone reports it, together with the few messages before it, so we can understand the context.'],
    ['Access controls.', 'We limit access to your information to the people who need it to do their jobs.'],
  ] }] },
  { title: '5. Who we share it with', blocks: ['We do not sell your personal information. We share it only with the service providers who help us run Yelwa Leagues, and only as much as they need to do their job. Each one is bound to protect it.', { items: [
    ['Supabase:', 'stores our database and handles member login.'],
    ['Vercel:', 'hosts our website and platform.'],
    ['Google:', 'runs our online class meetings.'],
    ['Anthropic:', 'provides the AI tool we sometimes use as a second check when reviewing applications and our own scoring. This may involve sharing the details in an application, which can include your name. The AI supports our team and never makes decisions about you on its own.'],
  ] }, 'We may also disclose your information where the law requires it, such as to a court, regulator or law enforcement body acting lawfully, or to protect the rights and safety of our members and others. If our business is ever restructured or transferred, your information may pass to the new owner, who must continue to protect it under this policy.'] },
  { title: '6. Where your information is stored, and how we protect it', blocks: [{ items: [
    ['International transfers.', 'Our main database and login system are hosted in Ireland, and some of our other providers (listed in section 5) may store or process information in other countries. Where your information leaves Nigeria, we take steps to make sure it stays protected to a standard comparable to Nigerian law, including written agreements with our providers.'],
    ['Security.', 'We use appropriate technical and organisational measures to protect your information against loss, misuse and unauthorised access. These include encrypted connections, protected password storage, and limiting access to those who need it.'],
    ['If something goes wrong.', 'If a data breach puts your rights at risk, we will notify the Nigeria Data Protection Commission within 72 hours of becoming aware of it, and we will tell you without delay where the risk to you is high.'],
  ] }, 'No system is completely secure, and we cannot guarantee absolute security. Please keep your password private.'] },
  { title: '7. How long we keep it', blocks: [{ items: [
    ['Brochure requests:', '12 months after your request, unless you apply or ask us to delete it sooner.'],
    ['Applications that do not proceed:', '12 months after our decision.'],
    ['Members:', 'while your membership is active, and 3 years afterwards for our records and legal obligations.'],
  ] }, 'When the period ends, we delete or anonymise your information.'] },
  { title: '8. Your rights', blocks: [`You have the right to ask us to show you the information we hold about you, correct it, delete it, restrict how we use it, and object to certain uses, including direct marketing. You may also withdraw your consent at any time, and ask for your information in a portable format where the law allows. Withdrawing consent does not affect what we did before. Write to us using the contact details above. We will respond promptly and within the time the law requires. We may need to confirm your identity first.`] },
  { title: '9. Young people under 18', blocks: ['Yelwa Leagues welcomes secondary school students aged 12 and above. Under Nigerian law, anyone under 18 is a child for data protection purposes, so we need a parent or legal guardian’s consent before we collect or use their information. If you are under 18, a parent or guardian must give consent as part of the application, and we will confirm it before opening a member account, for example by speaking with them or by asking for a signed consent form. We collect only what we need from members under 18, and we do not use their information for marketing without a parent or guardian’s consent. A parent or guardian can ask to see, correct or delete their child’s information, or withdraw consent, at any time by contacting us.'] },
  { title: '10. Cookies and similar technology', blocks: ['We use only the cookies needed to keep you signed in and the platform secure. We do not use advertising cookies.'] },
  { title: '11. Complaints', blocks: ['If you have a concern, please contact us first and we will try to put it right. You also have the right to complain to the Nigeria Data Protection Commission.'] },
  { title: '12. Changes to this policy', blocks: ['If we change this policy, we will update the date at the top of this page and, for important changes, tell you directly.'] },
  { title: '13. Contact us', blocks: [`${email} · ${address}`] },
]

export default function Privacy() {
  return <LegalDoc title="Privacy Policy" updated="2 November 2026" sections={sections} />
}
