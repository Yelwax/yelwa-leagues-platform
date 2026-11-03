import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import MessageButton from '@/components/MessageButton'
import { card, initials, wrap } from '@/lib/ui'

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: mp } = await supabase.from('member_profiles').select('*').eq('profile_id', id).maybeSingle()
  const mine = user!.id === id
  return (
    <div className={wrap}>
      <p><Link href="/app" className="text-navy underline">Back</Link></p>
      {!mp ? (
        <>
          <p className={`${card} mt-4 text-navy/70`}>{mine ? 'You have not set up your profile yet.' : 'This member has not set up a profile yet.'} {mine && <Link href="/app/profile" className="font-semibold text-navy underline">Set it up</Link>}</p>
          {!mine && <div className="text-center"><MessageButton otherId={id} /></div>}
        </>
      ) : (
        <div className={`${card} mt-4 text-center`}>
          {mp.avatar_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={mp.avatar_url} alt="" className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-gold/40" />
            : <span className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-navy text-4xl font-bold text-gold ring-4 ring-gold/40">{initials(mp.display_name)}</span>}
          <h1 className="mt-4 font-[Cambria,Georgia,serif] text-3xl font-bold text-navy">{mp.display_name || 'Member'}</h1>
          {mp.location && <p className="text-sm text-navy/60">{mp.location}</p>}
          {mp.business_name && (
            <div className="mt-5 rounded-2xl bg-cream p-4 text-left">
              <p className="text-xs font-bold uppercase tracking-wide text-forest">Business</p>
              <p className="font-semibold text-navy">{mp.business_name}</p>
              {mp.business_summary && <p className="mt-1 text-sm leading-relaxed">{mp.business_summary}</p>}
            </div>
          )}
          {mp.bio && <p className="mt-5 text-left leading-relaxed">{mp.bio}</p>}
          {!mine && <MessageButton otherId={id} />}
          {mine && <p className="mt-6"><Link href="/app/profile" className="font-semibold text-navy underline">Edit profile</Link></p>}
        </div>
      )}
    </div>
  )
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<div className={wrap}><p>Loading...</p></div>}><Content params={params} /></Suspense>
}
