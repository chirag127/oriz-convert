import { useMemo, useState } from 'react'
import { convertColor } from '../lib/color'
import { useCopy } from './Transmute'

export default function ColorConverter() {
  const [input, setInput] = useState('#7c3aed')
  const [, copy] = useCopy()

  const result = useMemo(() => {
    if (!input.trim()) return null
    try {
      return { ok: true as const, ...convertColor(input) }
    } catch (e) {
      return { ok: false as const, err: (e as Error).message }
    }
  }, [input])

  const rows = result?.ok
    ? [
        { k: 'HEX', v: result.hex },
        { k: 'RGB', v: result.rgb },
        { k: 'HSL', v: result.hsl },
      ]
    : []

  return (
    <div>
      <div className="controls">
        <label className="hint" htmlFor="ci">
          Color
        </label>
        <input
          id="ci"
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '20rem', fontFamily: 'var(--oz-font-mono)' }}
          placeholder="#7c3aed · rgb(124,58,237) · hsl(262,83%,58%)"
        />
        <input
          type="color"
          aria-label="Pick a color"
          className="input"
          style={{ width: '3rem', padding: '0.2rem', height: '2.4rem' }}
          value={result?.ok ? result.swatch : '#000000'}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {result && !result.ok && <div className="err">{result.err}</div>}
      {result?.ok && (
        <div className="grid">
          <div className="card">
            <div className="card__k">Swatch</div>
            <div className="swatch" style={{ background: result.hex }} />
          </div>
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
