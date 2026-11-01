export const h1 = 'font-[Cambria,Georgia,serif] text-4xl font-bold leading-tight text-navy sm:text-5xl'
export const h2 = 'font-[Cambria,Georgia,serif] text-2xl font-bold text-navy'
export const wrap = 'mx-auto max-w-3xl px-5 py-8 sm:py-12'
export const btn = 'inline-block rounded-full bg-gold px-6 py-3 font-semibold text-navy transition active:scale-95'
export const card = 'rounded-3xl bg-white p-5 shadow-sm ring-1 ring-navy/5'
export const initials = (name?: string | null) =>
  (name ?? '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('') || '?'
