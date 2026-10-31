'use client'
import { useEffect, useRef, useState } from 'react'

export default function PdfViewer({ url, watermark }: { url: string; watermark: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
        const pdf = await pdfjs.getDocument({ url }).promise
        const el = box.current
        if (!el || cancelled) return
        el.innerHTML = ''
        const ratio = window.devicePixelRatio || 1
        for (let n = 1; n <= pdf.numPages; n++) {
          const page = await pdf.getPage(n)
          if (cancelled) return
          const base = page.getViewport({ scale: 1 })
          const viewport = page.getViewport({ scale: (el.clientWidth / base.width) * ratio })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.cssText = 'width:100%;display:block;margin-bottom:8px;background:#fff'
          el.appendChild(canvas)
          await page.render({ canvas, viewport }).promise
        }
        if (!cancelled) setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    })()
    return () => { cancelled = true }
  }, [url])

  const esc = watermark.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><text x="20" y="120" transform="rotate(-25 180 100)" font-family="Arial" font-size="15" fill="rgba(27,42,74,0.16)">${esc}</text></svg>`
  return (
    <div className="pdf-protect relative select-none" onContextMenu={(e) => e.preventDefault()}>
      <style>{'@media print { .pdf-protect { display: none !important } }'}</style>
      {status === 'loading' && <p className="py-6">Loading the document...</p>}
      {status === 'error' && <p role="alert" className="py-6 font-semibold text-red-700">We could not open this document. Please go back and try again.</p>}
      <div ref={box} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")` }} />
    </div>
  )
}
