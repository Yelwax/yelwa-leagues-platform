import LegalDoc, { type Section } from '@/components/LegalDoc'
import { site } from '@/lib/site'

export const metadata = { title: 'Terms of Use | Yelwa Leagues' }

// TODO: put the registered office address here, and the state whose courts have jurisdiction
const ADDRESS = ''
const COURT_STATE = ''
const email = site.email || '[email to be added]'
const address = ADDRESS || '[address to be added]'

const sections: Section[] = [
  { title: '1. Agreement', blocks: ['These terms apply when you use the Yelwa Leagues website and member platform, a program of Yelwax Solutions Inc. (“we”, “us”). By creating an account you agree to them and to our Privacy Policy.'] },
  { title: '2. Who can join', blocks: ['Members must be 12 or older. If you are under 18, a parent or legal guardian must consent to these terms on your behalf before your account is opened.'] },
  { title: '3. Your account', blocks: ['Your account is personal to you. Do not share your login. Give us accurate information, keep your password private, and tell us promptly if you think someone else has used your account. You are responsible for activity on it.'] },
  { title: '4. Joining, fees and cancellation', blocks: [{ items: [
    ['Joining.', 'Membership follows our joining process: brochure, intake form, conversation, fee details and payment confirmation. Your member account opens only after payment is confirmed, and fees are always communicated to you before you pay.'],
    ['Cancelling before your first class.', 'If you cancel before your first class takes place, we will refund 80% of what you paid. The remaining 20% covers the administrative costs we have already incurred in setting up your place. Opening your account or accessing the library does not count as starting.'],
    ['Cancelling after your first class.', 'Once you have attended a class, fees are not refundable, because the costs of your place (tutors, library, platform, community and maintenance) have already been committed.'],
    ['Stopping at any time.', 'You may cancel your membership whenever you wish. You will not be charged again, and your account will close at the end of the period you have already paid for.'],
    ['Trial access.', 'From time to time we may offer free or promotional access so you can experience Yelwa Leagues before deciding. The terms of any trial are stated when it is offered, and we may end a trial that is misused.'],
  ] }] },
  { title: '5. Learning materials', blocks: ['The manuals, slides, recordings and other materials belong to Yelwa Leagues or its tutors. They are provided for your own learning and are view-only. You must not download, copy, record, share or sell them. Materials carry your name as a watermark.'] },
  { title: '6. Conduct', blocks: ['Be respectful in classes and chat. Do not post spam, adverts, abuse, hate, harassment, or anything unlawful. Do not impersonate others or disrupt classes.'] },
  { title: '7. Community and chat', blocks: ['Messages you post are visible as described in our Privacy Policy. You keep ownership of what you write, and you give us permission to host and display it on the platform. We do not routinely read pod chats, but we may review reported messages and remove content that breaks these terms.'] },
  { title: '8. Classes', blocks: ['Class times and pods are set by our team. We may reschedule or change tutors where needed. Classes may be recorded for member use.'] },
  { title: '9. Education only', blocks: ['Our content is for education and general information. It is not financial, investment, legal or tax advice, and you should take professional advice before making major business decisions.'] },
  { title: '10. No guarantee of results', blocks: ['We teach business skills and cannot promise any particular income, growth or business outcome. Results depend on your own effort and circumstances.'] },
  { title: '11. Suspension and ending membership', blocks: ['We may delete content, mute you, or suspend or end your account if you break these terms. You may stop at any time by telling us.'] },
  { title: '12. Our liability', blocks: ['We work to keep the platform available but cannot promise it will never be interrupted. To the fullest extent the law allows, we are not liable for indirect or consequential loss. Nothing in these terms limits any right you have that the law does not allow us to limit.'] },
  { title: '13. Changes', blocks: ['We may update these terms. We will change the date at the top and tell you about important changes.'] },
  { title: '14. Governing law and disputes', blocks: [`These terms are governed by the laws of the Federal Republic of Nigeria. We will try to resolve disputes amicably first, and failing that, the courts of ${COURT_STATE || '[state to be confirmed]'} have jurisdiction.`] },
  { title: '15. Contact', blocks: [`${email} · ${address}`] },
]

export default function Terms() {
  return <LegalDoc title="Terms of Use" updated="2 November 2026" sections={sections} />
}
