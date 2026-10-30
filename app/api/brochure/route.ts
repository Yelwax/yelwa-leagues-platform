import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status })

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return fail('Invalid request.')
  }

  // Honeypot: real people never fill this hidden field.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const full_name = String(body.fullName ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  const whatsapp = String(body.whatsapp ?? '').replace(/[\s-]/g, '')

  const stages = ['idea', 'started', 'running', 'stuck', 'scale']
  const stageRaw = String(body.stage ?? '')
  const stage = stages.includes(stageRaw) ? stageRaw : null
  const challenge = String(body.challenge ?? '').trim().slice(0, 300) || null

  if (full_name.length < 2 || full_name.length > 100) return fail('Please enter your full name.')
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail('Please enter a valid email address.')
  if (!/^(?:\+?234|0)[789][01]\d{8}$/.test(whatsapp)) return fail('Please enter a valid Nigerian WhatsApp number.')
  if (body.consent !== true) return fail('Please tick the consent box to continue.')

  const supabase = await createClient()
  const { error } = await supabase
    .from('leads')
    .insert({ full_name, email, whatsapp, consent: true, source: 'brochure', stage, challenge })

  // 23505 = this email is already on the list. Treat as success so they still get the brochure.
  if (error && error.code !== '23505') {
    console.error('Lead insert failed:', error.message)
    return fail('We could not save your details. Please try again.', 500)
  }
  return NextResponse.json({ ok: true })
}
