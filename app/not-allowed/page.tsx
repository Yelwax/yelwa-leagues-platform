import Link from 'next/link'
import { h1, wrap, btn } from '@/lib/ui'

export default function NotAllowed() {
  return (
    <div className={wrap}>
      <h1 className={h1}>This page is not for your account</h1>
      <p className="mt-4 leading-relaxed">You do not have access to this area. If you think that is a mistake, please contact the Yelwa Leagues team.</p>
      <div className="mt-8"><Link href="/" className={btn}>Back to home</Link></div>
    </div>
  )
}
