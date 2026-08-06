import { useMemo, useState } from 'react'
import { convertBases } from '../lib/bases'
import { useCopy } from './Transmute'

const BASES = [
  { id: 2, label: 'Binary (2)' },
  { id: 8, label: 'Octal (8)' },
  { id: 10, label: 'Decimal (10)' },
  { id: 16, label: 'Hex (16)' },
  { id: 36, label: 'Base 36' },
]

export default function BaseConverter() {
  const [input, setInput] = useState('255')
  const [base, setBase] = useState(10)
  const [, copy] = useCopy()

  const result = useMemo(() => {
    if (!input.trim()) return null
    try {
      return { ok: true as const, ...convertBases(input, base) }
    } catch (e) {
      return { ok: false as const, err: (e as Error).message }
    }
  }, [input, base])

  const rows = result?.ok
    ? [
        { k: 'Binary', v: result.binary },
        { k: 'Octal', v: result.octal },
        { k: 'Decimal', v: result.decimal },
        { k: 'Hex', v: result.hex },
      ]
    : []

  return (
    <div>
      <div className="controls">
        <label className="hint" htmlFor="bi">
          Number
        </label>
        <input
          id="bi"
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '16rem', fontFamily: 'var(--oz-font-mono)' }}
          placeholder="e.g. 255, 0xff, 0b1010"
        />
        <label className="hint" htmlFor="bb">
          Input base
        </label>
        <select id="bb" className="select" value={base} onChange={(e) => setBase(Number(e.target.value))}>
          {BASES.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {result && !result.ok && <div className="err">{result.err}</div>}
      {result?.ok && (
        <div className="grid">
          {rows.map((r) => (
            <button
              key={r.k}
              className="card"
              style={{ textAlign: 'left', cursor: 'pointer' }}
              onClick={() => copy(r.v)}
              title="Click to copy"
            >
              <div className="card__k">{r.k}</div>
              <div className="card__v">{r.v}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
