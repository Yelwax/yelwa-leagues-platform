'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'

const LEVELS = [1, 1.25, 1.5, 2, 2.5, 3]
const MAX_SIDE = 4096
const MAX_PIXELS = 12_000_000

export default function PdfViewer({ url, watermark }: { url: string; watermark: string }) {
  const scroller = useRef<HTMLDivElement>(null)
  const pagesEl = useRef<HTMLDivElement>(null)
  const doc = useRef<PDFDocumentProxy | null>(null)
  const gen = useRef(0)
  const [level, setLevel] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const zoom = LEVELS[level]

  // Draws every page again at the sharpness the current zoom needs, so text and lines stay crisp.
  const renderAll = useCallback(async (z: number) => {
    const pdf = doc.current, el = pagesEl.current, sc = scroller.current
    if (!pdf || !el || !sc) return
    const me = ++gen.current
    const cssWidth = sc.clientWidth * z
    const dpr = Math.max(window.devicePixelRatio || 1, 2)
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n)
      if (gen.current !== me) return
      const base = page.getViewport({ scale: 1 })
      let k = (cssWidth / base.width) * dpr
      const pw = base.width * k, ph = base.height * k
      k *= Math.min(1, MAX_SIDE / pw, Math.sqrt(MAX_PIXELS / (pw * ph)))
      const viewport = page.getViewport({ scale: k })
      const canvas = document.createElement('canvas')
      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      canvas.style.cssText = 'width:100%;height:auto;display:block;margin-bottom:8px;background:#fff'
      await page.render({ canvas, viewport }).promise
      if (gen.current !== me) return
      const old = el.children[n - 1]
      if (old) el.replaceChild(canvas, old); else el.appendChild(canvas)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
        const pdf = await pdfjs.getDocument({ url }).promise
        if (cancelled) return
        doc.current = pdf
        await renderAll(1)
        if (!cancelled) setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    })()
    return () => { cancelled = true; gen.current++ }
  }, [url, renderAll])

  useEffect(() => { if (status === 'ready') renderAll(zoom) }, [zoom, status, renderAll])

  const esc = watermark.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><text x="20" y="120" transform="rotate(-25 180 100)" font-family="Arial" font-size="15" fill="rgba(27,42,74,0.16)">${esc}</text></svg>`
  const btn = 'flex h-10 min-w-10 items-center justify-center rounded-full bg-navy px-3 font-bold text-cream transition active:scale-95 disabled:opacity-40'
  return (
    <div className="pdf-protect select-none" onContextMenu={(e) => e.preventDefault()}>
      <style>{'@media print { .pdf-protect { display: none !important } }'}</style>
      {status === 'loading' && <p className="py-6">Loading the document...</p>}
      {status === 'error' && <p role="alert" className="py-6 font-semibold text-red-700">We could not open this document. Please go back and try again.</p>}
      {status === 'ready' && (
        <div className="sticky top-2 z-10 mb-3 flex items-center justify-center gap-2 rounded-full bg-white/95 p-1.5 shadow-md ring-1 ring-navy/10 backdrop-blur">
          <button type="button" aria-label="Zoom out" className={btn} disabled={level === 0} onClick={() => setLevel((l) => Math.max(0, l - 1))}>−</button>
          <button type="button" aria-label="Fit to width" className={`${btn} !bg-gold !text-navy`} onClick={() => setLevel(0)}>{Math.round(zoom * 100)}%</button>
          <button type="button" aria-label="Zoom in" className={btn} disabled={level === LEVELS.length - 1} onClick={() => setLevel((l) => Math.min(LEVELS.length - 1, l + 1))}>+</button>
        </div>
      )}
      <div ref={scroller} className="overflow-x-auto">
        <div className="relative" style={{ width: `${zoom * 100}%` }}>
          <div ref={pagesEl} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")` }} />
        </div>
      </div>
    </div>
  )
}
