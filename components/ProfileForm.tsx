'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { initials } from '@/lib/ui'

type P = { display_name: string; business_name: string; business_summary: string; location: string; bio: string; avatar_url: string }
const box = 'mt-1 w-full rounded-2xl border-0 bg-white px-4 py-3 text-base font-normal ring-1 ring-navy/15'

async function squarePhoto(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file)
  const s = Math.min(bmp.width, bmp.height)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 400
  canvas.getContext('2d')!.drawImage(bmp, (bmp.width - s) / 2, (bmp.height - s) / 2, s, s, 0, 0, 400, 400)
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('Could not read the image'))), 'image/jpeg', 0.85))
}

export default function ProfileForm({ userId, fullName, initial }: { userId: string; fullName: string; initial: P }) {
  const [p, setP] = useState<P>(initial)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const set = (k: keyof P, v: string) => { setP((x) => ({ ...x, [k]: v })); setMsg('') }

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true); setMsg('')
    try {
      const blob = await squarePhoto(file)
      const supabase = createClient()
      const path = `${userId}/${crypto.randomUUID()}.jpg`
      const { error } = await supabase.storage.from('avatars').upload(path, blob, { contentType: 'image/jpeg' })
      if (error) throw error
      set('avatar_url', supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl)
      setMsg('Photo added. Press Save to keep it.')
    } catch { setMsg('We could not use that photo. Try a different one.') }
    setBusy(false)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg('')
    const clean = (s: string) => s.trim() || null
    const { error } = await createClient().from('member_profiles').upsert({
      profile_id: userId, display_name: clean(p.display_name), business_name: clean(p.business_name),
      business_summary: clean(p.business_summary), location: clean(p.location), bio: clean(p.bio),
      avatar_url: p.avatar_url || null, updated_at: new Date().toISOString(),
    }, { onConflict: 'profile_id' })
    setMsg(error ? 'We could not save. Please try again.' : 'Saved.')
    setBusy(false)
  }

  return (
    <form onSubmit={save} className="mt-6 space-y-5">
      <div className="flex items-center gap-4">
        {p.avatar_url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={p.avatar_url} alt="Your profile photo" className="h-24 w-24 rounded-full object-cover ring-4 ring-gold/40" />
          : <span className="flex h-24 w-24 items-center justify-center rounded-full bg-navy text-3xl font-bold text-gold ring-4 ring-gold/40">{initials(p.display_name || fullName)}</span>}
        <label className="cursor-pointer rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-cream transition active:scale-95">
          {p.avatar_url ? 'Change photo' : 'Add a photo'}
          <input type="file" accept="image/*" onChange={pick} className="sr-only" />
        </label>
      </div>
      <label className="block font-semibold text-navy">Name others see<input value={p.display_name} onChange={(e) => set('display_name', e.target.value)} maxLength={80} placeholder={fullName} className={box} /></label>
      <label className="block font-semibold text-navy">Business name<input value={p.business_name} onChange={(e) => set('business_name', e.target.value)} maxLength={100} className={box} /></label>
      <label className="block font-semibold text-navy">What your business does<textarea value={p.business_summary} onChange={(e) => set('business_summary', e.target.value)} maxLength={300} rows={2} className={box} /></label>
      <label className="block font-semibold text-navy">Where you are<input value={p.location} onChange={(e) => set('location', e.target.value)} maxLength={80} placeholder="e.g. Zaria, Kaduna" className={box} /></label>
      <label className="block font-semibold text-navy">About you<textarea value={p.bio} onChange={(e) => set('bio', e.target.value)} maxLength={600} rows={4} placeholder="What should other members know about you?" className={box} /></label>
      <p className="text-sm text-navy/60">Your profile is shown to other Yelwa Leagues members only. Your email, phone number and application answers are never shown.</p>
      {msg && <p role="status" className="font-semibold text-forest">{msg}</p>}
      <button type="submit" disabled={busy} className="rounded-full bg-gold px-8 py-3 font-semibold text-navy transition active:scale-95 disabled:opacity-60">{busy ? 'Please wait...' : 'Save profile'}</button>
    </form>
  )
}
