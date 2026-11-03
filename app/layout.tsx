import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Analytics } from '@vercel/analytics/next'
import WhatsAppButton from '@/components/WhatsAppButton'
import './globals.css'

export const metadata: Metadata = {
  title: 'Yelwa Leagues | Business 101 Masterclass',
  description: 'A Nigerian business-education programme by Yelwax Solutions.',
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0D210D' }

const nav = [
  ['About', '/about'],
  ['Meet the Team', '/team'],
  ['Programs', '/programs'],
  ['How it works', '/how-it-works'],
  ['Contact', '/contact'],
  ['Log in', '/login'],
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#F4F1EA', color: '#1A1A1A', fontFamily: 'Arial, Helvetica, sans-serif', margin: 0 }}>
        <header data-site-chrome className="border-b border-gold/50">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
            <Link href="/">
              <Image src="/logo.png" alt="Yelwa Leagues" width={150} height={45} className="h-10 w-auto" />
            </Link>
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy">
              {nav.map(([label, href]) => (
                <Link key={href} href={href} className="hover:underline">{label}</Link>
              ))}
              <Link href="/brochure" className="rounded-full bg-navy px-4 py-1.5 font-semibold text-cream">Get the brochure</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer data-site-chrome className="bg-darkgreen text-sm text-cream/80">
          <div className="mx-auto max-w-5xl px-5 py-8">
            <p className="font-semibold text-gold">Yelwa Leagues</p>
            <p>A Program of Yelwax Solutions</p>
            <p className="mt-3 flex gap-5"><Link href="/privacy" className="underline">Privacy Policy</Link><Link href="/terms" className="underline">Terms of Use</Link></p>
            <p className="mt-3">© 2026 Yelwax Solutions Inc. All rights reserved.</p>
          </div>
        </footer>
        <div data-site-chrome><WhatsAppButton /></div>
        <Analytics />
      </body>
    </html>
  )
}
