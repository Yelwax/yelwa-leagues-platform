'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { btn } from '@/lib/ui'

type Mode = 'login' | 'signup' | 'forgot' | 'reset'
const input = 'mt-1 w-full rounded border border-navy/30 bg-white px-3 py-2 text-base font-normal'

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setMessage('')
    const f = new FormData(e.currentTarget)
    const email = String(f.get('email') ?? '').trim()
    const password = String(f.get('password') ?? '')
    const supabase = createClient()
    setBusy(true)

    if (mode === 'signup' || mode === 'reset') {
      if (password.length < 8) { setError('Your password must be at least 8 characters.'); setBusy(false); return }
    }

    let err: string | null = null
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      err = error ? (/invalid login/i.test(error.message) ? 'Wrong email or password.' : error.message) : null
    } else if (mode === 'signup') {
      const fullName = String(f.get('fullName') ?? '').trim()
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth/callback?next=/pending` } })
      if (error) err = error.message
      else if (!data.session) { setMessage('Check your email to confirm your account, then log in.'); setBusy(false); return }
    } else if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })
      if (error) err = error.message
      else { setMessage('If that email has an account, a reset link is on its way.'); setBusy(false); return }
    } else {
      const { error } = await supabase.auth.updateUser({ password })
      err = error ? error.message : null
    }

    if (err) { setError(err); setBusy(false); return }
    router.push('/pending')
    router.refresh()
  }

  const label: Record<Mode, string> = { login: 'Log in', signup: 'Create account', forgot: 'Send reset link', reset: 'Save new password' }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      {mode === 'signup' && (
        <label className="block font-semibold text-navy">Full name
          <input name="fullName" required minLength={2} maxLength={100} autoComplete="name" className={input} />
        </label>
      )}
      {mode !== 'reset' && (
        <label className="block font-semibold text-navy">Email
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
      )}
      {mode !== 'forgot' && (
        <label className="block font-semibold text-navy">{mode === 'reset' ? 'New password' : 'Password'}
          <input name="password" type="password" required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className={input} />
        </label>
      )}
      {error && <p role="alert" className="font-semibold text-red-700">{error}</p>}
      {message && <p role="status" className="font-semibold text-forest">{message}</p>}
      <button type="submit" disabled={busy} className={`${btn} disabled:opacity-60`}>{busy ? 'Please wait...' : label[mode]}</button>
      <div className="space-y-1 text-sm">
        {mode === 'login' && (<>
          <p><Link href="/forgot-password" className="text-navy underline">Forgot your password?</Link></p>
          <p>New here? <Link href="/signup" className="text-navy underline">Create an account</Link></p>
        </>)}
        {mode === 'signup' && <p>By creating an account you agree to our <Link href="/terms" className="text-navy underline">Terms</Link> and <Link href="/privacy" className="text-navy underline">Privacy Policy</Link>.</p>}
        {mode === 'signup' && <p>Already have an account? <Link href="/login" className="text-navy underline">Log in</Link></p>}
        {mode === 'forgot' && <p><Link href="/login" className="text-navy underline">Back to log in</Link></p>}
      </div>
    </form>
  )
}
