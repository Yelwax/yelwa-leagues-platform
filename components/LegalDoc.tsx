import { h1, h2 } from '@/lib/ui'

export type Block = string | { items: [string, string][] }
export type Section = { title: string; blocks: Block[] }

export default function LegalDoc({ title, updated, sections }: { title: string; updated: string; sections: Section[] }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <h1 className={h1}>{title}</h1>
      <p className="mt-2 text-sm text-navy/60">Last updated: {updated}</p>
      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className={`${h2} !text-xl`}>{s.title}</h2>
            <div className="mt-2 space-y-3 leading-relaxed">
              {s.blocks.map((b, i) => typeof b === 'string'
                ? <p key={i}>{b}</p>
                : <ul key={i} className="list-disc space-y-2 pl-5">{b.items.map(([lead, text]) => <li key={lead + text.slice(0, 12)}>{lead && <strong className="text-navy">{lead} </strong>}{text}</li>)}</ul>)}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
