'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function deleteResource(id: string) {
  const supabase = await createClient()
  const { data: r } = await supabase.from('resources').select('storage_path').eq('id', id).maybeSingle()
  if (r?.storage_path) await supabase.storage.from('library').remove([r.storage_path])
  const { error } = await supabase.from('resources').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/app/library')
  redirect('/app/library')
}
