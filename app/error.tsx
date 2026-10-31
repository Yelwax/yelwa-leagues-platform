'use client'
import { h1, wrap, btn } from '@/lib/ui'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className={wrap}>
      <h1 className={h1}>Something went wrong</h1>
      <p className="mt-4 leading-relaxed">That was our fault, not yours. Please try again. If it keeps happening, tell the Yelwa Leagues team.</p>
      <div className="mt-8"><button type="button" onClick={reset} className={btn}>Try again</button></div>
    </div>
  )
}
