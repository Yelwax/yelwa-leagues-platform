'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const I = {
  home: 'M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  library: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 1 2-2h13',
  calendar: 'M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 10h18M8 2v4M16 2v4',
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
  profile: 'M20 21a8 8 0 1 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
}
const items = [
  { href: '/app', label: 'Home', icon: I.home },
  { href: '/app/library', label: 'Library', icon: I.library },
  { href: '/app/calendar', label: 'Calendar', icon: I.calendar },
  { href: '/app/chat', label: 'Chat', icon: I.chat },
  { href: '/app/profile', label: 'Profile', icon: I.profile },
]

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export default function AppNav() {
  const path = usePathname()
  const on = (href: string) => (href === '/app' ? path === '/app' : path === href || path.startsWith(href + '/'))
  return (
    <>
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white/95 backdrop-blur md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <ul className="mx-auto flex max-w-md justify-around px-2 py-1.5">
          {items.map((it) => (
            <li key={it.href} className="flex-1">
              <Link href={it.href} aria-current={on(it.href) ? 'page' : undefined} className={`flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-semibold transition active:scale-95 ${on(it.href) ? 'text-forest' : 'text-navy/50'}`}>
                <span className={`flex h-8 w-14 items-center justify-center rounded-full transition ${on(it.href) ? 'bg-gold/30' : ''}`}><Icon d={it.icon} className="h-6 w-6" /></span>
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[linear-gradient(180deg,#0D210D,#14391e)] p-6 text-cream md:flex">
        <p className="font-[Cambria,Georgia,serif] text-2xl font-bold text-gold">Yelwa Leagues</p>
        <p className="text-xs text-cream/60">A Program of Yelwax Solutions</p>
        <ul className="mt-8 space-y-1">
          {items.map((it) => (
            <li key={it.href}>
              <Link href={it.href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${on(it.href) ? 'bg-white/10 text-gold' : 'text-cream/80 hover:bg-white/5'}`}>
                <Icon d={it.icon} className="h-5 w-5" />{it.label}
              </Link>
            </li>
          ))}
        </ul>
        <form action="/auth/signout" method="post" className="mt-2 border-t border-white/10 pt-2">
          <button type="submit" className="w-full rounded-2xl px-4 py-3 text-left font-semibold text-cream/80 transition hover:bg-white/5">Log out</button>
        </form>
      </aside>
    </>
  )
}
