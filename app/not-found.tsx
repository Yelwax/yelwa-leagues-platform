import Link from 'next/link'
import { h1, wrap, btn } from '@/lib/ui'

export default function NotFound() {
  return (
    <div className={wrap}>
      <h1 className={h1}>We could not find that page</h1>
      <p className="mt-4 leading-relaxed">The page may have moved, or the address may be wrong.</p>
      <div className="mt-8"><Link href="/" className={btn}>Back to home</Link></div>
    </div>
  )
}
