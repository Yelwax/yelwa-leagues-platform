import { h1, wrap } from '@/lib/ui'
import BrochureForm from './BrochureForm'

export default function Brochure() {
  return (
    <div className={wrap}>
      <h1 className={h1}>Get the brochure</h1>
      <p className="mt-4 leading-relaxed">Tell us who you are and download the brochure straight away. We will follow up on WhatsApp to answer any questions.</p>
      <BrochureForm />
    </div>
  )
}
