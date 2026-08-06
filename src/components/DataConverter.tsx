import { useCallback, useEffect, useRef, useState } from 'react'
import { onDropZone, downloadBlob, formatBytes, readAsText } from '@chirag127/oz-file'
import { convertData, FORMAT_LABELS, type DataFormat } from '../lib/dataformats'
import { explainData, inferSchema } from '../lib/ai'
import { TransmuteButton, useCopy } from './Transmute'

const FORMATS: DataFormat[] = ['json', 'yaml', 'csv', 'xml']
const EXT: Record<DataFormat, string> = { json: 'json', yaml: 'yaml', csv: 'csv', xml: 'xml' }

const SAMPLE = `[
  { "id": 1, "name": "Mercury", "au": 0.39, "moons": 0 },
  { "id": 2, "name": "Venus", "au": 0.72, "moons": 0 },
  { "id": 3, "name": "Earth", "au": 1.0, "moons": 1 }
]`

export default function DataConverter() {
  const [from, setFrom] = useState<DataFormat>('json')
  const [to, setTo] = useState<DataFormat>('yaml')
  const [input, setInput] = useState(SAMPLE)
  const [output, setOutput] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [copied, copy] = useCopy()
  const dropRef = useRef<HTMLTextAreaElement>(null)

  const [aiBusy, setAiBusy] = useState(false)
  const [aiOut, setAiOut] = useState('')
  const [aiErr, setAiErr] = useState('')
  const abort = useRef<AbortController | null>(null)

  const run = useCallback(async () => {
    setErr('')
    setBusy(true)
    try {
      setOutput(await convertData(input, from, to))
    } catch (e) {
      setOutput('')
      setErr((e as Error).message || String(e))
    } finally {
      setBusy(false)
    }
  }, [input, from, to])

  useEffect(() => {
    const el = dropRef.current
    if (!el) return
    return onDropZone(el, async (files) => {
      if (!files[0]) return
      setInput(await readAsText(files[0]))
    })
  }, [])

  const swap = () => {
    setFrom(to)
    setTo(from)
    setInput(output || input)
    setOutput('')
  }

  const download = () => {
    if (!output) return
    downloadBlob(new Blob([output], { type: 'text/plain' }), `converted.${EXT[to]}`)
  }

  const ai = async (kind: 'explain' | 'schema') => {
    setAiErr('')
    setAiOut('')
    setAiBusy(true)
    abort.current?.abort()
    abort.current = new AbortController()
    try {
      const fn = kind === 'explain' ? explainData : inferSchema
      setAiOut(await fn(input, { signal: abort.current.signal }))
    } catch (e) {
      setAiErr('AI unavailable right now — core conversion still works. ' + ((e as Error).message || ''))
    } finally {
      setAiBusy(false)
    }
  }

  return (
    <div>
      <div className="controls">
        <label className="hint" htmlFor="fromFmt">
          From
        </label>
        <select id="fromFmt" className="select" value={from} onChange={(e) => setFrom(e.target.value as DataFormat)}>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {FORMAT_LABELS[f]}
            </option>
          ))}
        </select>
        <label className="hint" htmlFor="toFmt">
          To
        </label>
        <select id="toFmt" className="select" value={to} onChange={(e) => setTo(e.target.value as DataFormat)}>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {FORMAT_LABELS[f]}
            </option>
          ))}
        </select>
        <button className="btn" onClick={swap} title="Swap direction">
          ⇄ Swap
        </button>
        <span className="hint">{formatBytes(new Blob([input]).size)} in</span>
      </div>

      <div className="mirror">
        <div className="pane">
          <div className="pane__head">
            <span className="pane__label">Source · {FORMAT_LABELS[from]}</span>
            <button className="btn" onClick={() => setInput('')}>
              Clear
            </button>
          </div>
          <textarea
            ref={dropRef}
            className="field"
            value={input}
            spellCheck={false}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste ${FORMAT_LABELS[from]} or drop a file…`}
            aria-label="Source data"
          />
        </div>

        <div className="circle">
          <TransmuteButton busy={busy} onClick={run} title={`Convert ${FORMAT_LABELS[from]} to ${FORMAT_LABELS[to]}`} />
        </div>

        <div className="pane">
          <div className="pane__head">
            <span className="pane__label">Result · {FORMAT_LABELS[to]}</span>
            <span style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn" onClick={() => copy(output)} disabled={!output}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button className="btn" onClick={download} disabled={!output}>
                Download
              </button>
            </span>
          </div>
          <textarea
            className="field field--out"
            value={output}
            readOnly
            spellCheck={false}
            placeholder="Result appears here…"
            aria-label="Converted result"
          />
        </div>
      </div>
      {err && <div className="err">Error: {err}</div>}

      <div className="ai">
        <div className="ai__head">
          <strong style={{ fontFamily: 'var(--oz-font-display)' }}>AI insight</strong>
          <span className="hint">optional — describe the data or infer a JSON schema</span>
          <span style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn--gold" onClick={() => ai('explain')} disabled={aiBusy || !input.trim()}>
              {aiBusy ? <span className="spinner" /> : 'Explain data'}
            </button>
            <button className="btn" onClick={() => ai('schema')} disabled={aiBusy || !input.trim()}>
              Infer schema
            </button>
          </span>
        </div>
        {aiBusy && <div className="ai__out">Transmuting insight…</div>}
        {aiOut && <div className="ai__out">{aiOut}</div>}
        {aiErr && <div className="err">{aiErr}</div>}
      </div>
    </div>
  )
}
