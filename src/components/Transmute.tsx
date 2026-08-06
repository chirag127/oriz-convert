import { useState } from 'react'

export function TransmuteButton({ busy, onClick, title }: { busy: boolean; onClick: () => void; title: string }) {
  return (
    <button className="transmute" data-busy={busy} onClick={onClick} disabled={busy} title={title} aria-label={title}>
      <svg className="transmute__ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="none" stroke="var(--violet-500)" strokeWidth="1" strokeDasharray="4 6" />
        <polygon points="50,10 85,72 15,72" fill="none" stroke="var(--gold-500)" strokeWidth="1.2" opacity="0.8" />
      </svg>
      <svg className="transmute__ring transmute__ring--2" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--gold-400)" strokeWidth="0.8" strokeDasharray="2 8" />
        <polygon points="50,90 85,28 15,28" fill="none" stroke="var(--violet-400)" strokeWidth="1" opacity="0.7" />
      </svg>
      <span className="transmute__glyph" aria-hidden="true">
        {busy ? '◌' : '⇌'}
      </span>
    </button>
  )
}

export function useCopy(): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false)
  const copy = (text: string) => {
    if (!text) return
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }
  return [copied, copy]
}
