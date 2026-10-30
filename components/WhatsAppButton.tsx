import { site } from '@/lib/site'

export default function WhatsAppButton() {
  if (!site.whatsapp) return null
  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      className="fixed right-4 z-50 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white shadow-lg"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
    >
      Chat on WhatsApp
    </a>
  )
}
