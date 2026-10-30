import { h1, wrap } from '@/lib/ui'
import { site } from '@/lib/site'

export default function Contact() {
  const has = site.whatsapp || site.email
  return (
    <div className={wrap}>
      <h1 className={h1}>Contact</h1>
      {has ? (
        <ul className="mt-6 space-y-3 text-lg">
          {site.whatsapp && (
            <li>WhatsApp: <a className="font-semibold text-navy underline" href={`https://wa.me/${site.whatsapp}`}>Message us</a></li>
          )}
          {site.email && (
            <li>Email: <a className="font-semibold text-navy underline" href={`mailto:${site.email}`}>{site.email}</a></li>
          )}
        </ul>
      ) : (
        <p className="mt-6 leading-relaxed">Contact details are coming soon. In the meantime, request the brochure and we will reach out.</p>
      )}
    </div>
  )
}
