import { useMemo, useState } from 'react'
import { UNITS, TEMP_UNITS, convertUnit, convertTemp, type UnitCategory } from '../lib/units'
import { useCopy } from './Transmute'

const CATS: { id: UnitCategory; label: string }[] = [
  { id: 'length', label: 'Length' },
  { id: 'mass', label: 'Mass' },
  { id: 'temperature', label: 'Temperature' },
  { id: 'data', label: 'Data' },
]

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  if (n !== 0 && (Math.abs(n) < 1e-4 || Math.abs(n) >= 1e15)) return n.toExponential(6)
  return String(Math.round(n * 1e10) / 1e10)
}

export default function UnitConverter() {
  const [cat, setCat] = useState<UnitCategory>('length')
  const [value, setValue] = useState('1')
  const [, copy] = useCopy()

  const list = cat === 'temperature' ? TEMP_UNITS : UNITS[cat as Exclude<UnitCategory, 'temperature'>]
  const [from, setFrom] = useState(list[0].id)

  const num = parseFloat(value)
  const results = useMemo(() => {
    if (isNaN(num)) return []
    return list.map((u) => {
      const out =
        cat === 'temperature'
          ? convertTemp(num, from, u.id)
          : convertUnit(num, from, u.id, cat as Exclude<UnitCategory, 'temperature'>)
      return { id: u.id, label: u.label, out }
    })
  }, [num, from, cat, list])

  const changeCat = (c: UnitCategory) => {
    setCat(c)
    const l = c === 'temperature' ? TEMP_UNITS : UNITS[c as Exclude<UnitCategory, 'temperature'>]
    setFrom(l[0].id)
  }

  return (
    <div>
      <div className="controls">
        {CATS.map((c) => (
          <button key={c.id} className="tab" aria-selected={cat === c.id} onClick={() => changeCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="controls">
        <label className="hint" htmlFor="uv">
          Value
        </label>
        <input
          id="uv"
          className="input"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: '9rem' }}
        />
        <label className="hint" htmlFor="uf">
          From
        </label>
        <select id="uf" className="select" value={from} onChange={(e) => setFrom(e.target.value)}>
          {list.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      {isNaN(num) ? (
        <div className="err">Enter a number.</div>
      ) : (
        <div className="grid">
          {results.map((r) => (
            <button
              key={r.id}
              className="card"
              style={{ textAlign: 'left', cursor: 'pointer' }}
              onClick={() => copy(fmt(r.out))}
              title="Click to copy"
            >
              <div className="card__k">{r.label}</div>
              <div className="card__v">{fmt(r.out)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
