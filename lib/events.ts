export const wat = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { timeZone: 'Africa/Lagos', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' WAT'

export function googleCalendarLink(e: { title: string; starts_at: string; ends_at: string; meet_url?: string | null; description?: string | null }) {
  const f = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '')
  const p = new URLSearchParams({ action: 'TEMPLATE', text: e.title, dates: `${f(e.starts_at)}/${f(e.ends_at)}`, details: e.description ?? '', location: e.meet_url ?? '' })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}
