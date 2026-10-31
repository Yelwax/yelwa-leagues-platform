// Backup: exports your main tables to CSV files in backups/<date>/
// Run:  node --env-file=.env.backup scripts/export-data.mjs
// .env.backup holds NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Never commit it or share it.
import { createClient } from '@supabase/supabase-js'
import { mkdirSync, writeFileSync } from 'node:fs'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) { console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.backup'); process.exit(1) }
const supabase = createClient(url, key, { auth: { persistSession: false } })

const tables = ['leads', 'profiles', 'intake_responses', 'internal_review', 'audit_log', 'pods', 'pod_members', 'resources', 'events', 'rooms', 'messages', 'reports']
const day = new Date().toISOString().slice(0, 10)
const dir = `backups/${day}`
mkdirSync(dir, { recursive: true })

const cell = (v) => {
  if (v === null || v === undefined) return ''
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

for (const t of tables) {
  const rows = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from(t).select('*').range(from, from + 999)
    if (error) { console.error(`${t}: ${error.message}`); break }
    rows.push(...data)
    if (data.length < 1000) break
  }
  const cols = rows.length ? Object.keys(rows[0]) : []
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n')
  writeFileSync(`${dir}/${t}.csv`, csv)
  console.log(`${t}: ${rows.length} rows`)
}
console.log(`Done. Files are in ${dir}`)
