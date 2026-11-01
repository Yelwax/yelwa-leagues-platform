import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/ProfileForm'
import LogoutButton from '@/components/LogoutButton'
import { wrap } from '@/lib/ui'

async function Content() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [{ data: me }, { data: mp }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user!.id).single(),
    supabase.from('member_profiles').select('*').eq('profile_id', user!.id).maybeSingle(),
  ])
  const initial = {
    display_name: mp?.display_name ?? '', business_name: mp?.business_name ?? '', business_summary: mp?.business_summary ?? '',
    location: mp?.location ?? '', bio: mp?.bio ?? '', avatar_url: mp?.avatar_url ?? '',
  }
  return (
    <div className={wrap}>
      <h1 className="font-[Cambria,Georgia,serif] text-3xl font-bold text-navy">Your profile</h1>
      <p className="mt-1 text-sm"><Link href={`/app/members/${user!.id}`} className="font-semibold text-navy underline">See how others see it</Link></p>
      <ProfileForm userId={user!.id} fullName={me?.full_name ?? ''} initial={initial} />
      <div className="mt-10 border-t border-navy/10 pt-2"><LogoutButton /></div>
    </div>
  )
}
export default function Page() {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content /></Suspense>
}
