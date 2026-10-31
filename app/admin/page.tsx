import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import { h1, wrap, btn } from '@/lib/ui'

async function Content() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: p } = await supabase.from('profiles').select('full_name, role').eq('id', user!.id).single()
  return (
    <div className={wrap}>
      <h1 className={h1}>Admin</h1>
      <p className="mt-4">Signed in as <strong>{p?.full_name}</strong> ({p?.role}).</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/applicants" className={btn}>Applicants</Link>
        <Link href="/admin/pods" className={btn}>Pods</Link>
        {p?.role === 'owner' && <Link href="/admin/people" className={btn}>People and roles</Link>}
      </div>
      <LogoutButton />
    </div>
  )
}
export default function Page() {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content /></Suspense>
}
