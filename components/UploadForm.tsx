'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const box = 'mt-1 w-full rounded border border-navy/30 bg-white px-3 py-2 text-base font-normal'

export default function UploadForm({ userId, isTutorOnly }: { userId: string; isTutorOnly: boolean }) {
  const router = useRouter()
  const [shelf, setShelf] = useState(isTutorOnly ? 'tutor' : 'curriculum')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const needsFile = shelf === 'curriculum' || shelf === 'tutor'

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(''); setBusy(true)
    const f = new FormData(e.currentTarget)
    const supabase = createClient()
    const s = (k: string) => String(f.get(k) ?? '').trim() || null
    const row: Record<string, unknown> = {
      title: s('title'), description: s('description'), shelf, uploaded_by: userId,
      phase: shelf === 'curriculum' || shelf === 'replays' ? s('phase') : null,
      course: s('course'), module: s('module'), file_type: 'link',
    }
    if (needsFile) {
      const file = f.get('file') as File
      if (!file || !file.size) { setError('Please choose a PDF file.'); setBusy(false); return }
      if (file.type !== 'application/pdf') { setError('Only PDF files are allowed.'); setBusy(false); return }
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `${shelf === 'tutor' ? 'tutor' : 'curriculum'}/${crypto.randomUUID()}-${safe}`
      const { error: upErr } = await supabase.storage.from('library').upload(path, file, { contentType: 'application/pdf' })
      if (upErr) { setError('Upload failed: ' + upErr.message); setBusy(false); return }
      row.file_type = 'pdf'; row.storage_path = path
    } else if (shelf === 'replays') {
      row.file_type = 'video'; row.video_url = s('url')
      if (!row.video_url) { setError('Please paste the YouTube link.'); setBusy(false); return }
    } else {
      row.external_url = s('url')
    }
    const { error: insErr } = await supabase.from('resources').insert(row)
    if (insErr) { setError('Could not save: ' + insErr.message); setBusy(false); return }
    router.push(`/app/library?shelf=${shelf}`); router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {!isTutorOnly && (
        <label className="block font-semibold text-navy">Shelf
          <select value={shelf} onChange={(e) => setShelf(e.target.value)} className={box}>
            <option value="curriculum">Curriculum</option><option value="books">Books</option>
            <option value="tutor">Tutor Shelf</option><option value="replays">Class Replays</option>
          </select>
        </label>
      )}
      <label className="block font-semibold text-navy">Title<input name="title" required maxLength={150} className={box} /></label>
      <label className="block font-semibold text-navy">Short description (or why this book matters)<textarea name="description" rows={2} maxLength={500} className={box} /></label>
      {(shelf === 'curriculum' || shelf === 'replays') && (
        <label className="block font-semibold text-navy">Phase
          <select name="phase" className={box}><option value="incubation">Incubation</option><option value="momentum">Momentum</option><option value="acceleration">Acceleration</option></select>
        </label>
      )}
      {(shelf === 'curriculum' || shelf === 'replays') && <>
        <label className="block font-semibold text-navy">Course<input name="course" placeholder="e.g. Marketing and Growth" className={box} /></label>
        <label className="block font-semibold text-navy">Module<input name="module" placeholder="e.g. Module 3: Refining Your Value Proposition" className={box} /></label>
      </>}
      {needsFile && <label className="block font-semibold text-navy">PDF file (up to 50 MB)<input name="file" type="file" accept="application/pdf" className={box} /></label>}
      {shelf === 'replays' && <label className="block font-semibold text-navy">YouTube link (Unlisted)<input name="url" type="url" className={box} /></label>}
      {shelf === 'books' && <label className="block font-semibold text-navy">Link to buy or borrow (optional)<input name="url" type="url" className={box} /></label>}
      {error && <p role="alert" className="font-semibold text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="rounded bg-gold px-5 py-3 font-semibold text-navy disabled:opacity-60">{busy ? 'Uploading...' : 'Add to library'}</button>
    </form>
  )
}
