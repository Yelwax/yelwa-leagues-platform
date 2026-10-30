import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import { h1, wrap } from '@/lib/ui'

async function Content() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: p } = await supabase.from('profiles').select('full_name, role').eq('id', user!.id).single()
  return (
    <div className={wrap}>
      <h1 className={h1}>Welcome{p?.full_name ? `, ${p.full_name}` : ''}</h1>
      <p className="mt-4">Signed in as <strong>{p?.role}</strong>. Your library, calendar and chat will appear here.</p>
      <LogoutButton />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}>
      <Content />
    </Suspense>
  )
}
