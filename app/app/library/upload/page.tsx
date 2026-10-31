import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import UploadForm from '@/components/UploadForm'
import { h1, wrap } from '@/lib/ui'

async function Content() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
  if (!['owner', 'team', 'tutor'].includes(me?.role ?? '')) redirect('/not-allowed')
  return (
    <div className={wrap}>
      <p><Link href="/app/library" className="text-navy underline">Back to the library</Link></p>
      <h1 className={`${h1} mt-3`}>Add to the library</h1>
      <UploadForm userId={user!.id} isTutorOnly={me?.role === 'tutor'} />
    </div>
  )
}
export default function Page() {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content /></Suspense>
}
