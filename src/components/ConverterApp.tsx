import { useState } from 'react'
import DataConverter from './DataConverter'
import UnitConverter from './UnitConverter'
import BaseConverter from './BaseConverter'
import ColorConverter from './ColorConverter'

type Tool = 'data' | 'units' | 'bases' | 'color'

const TABS: { id: Tool; label: string }[] = [
  { id: 'data', label: 'Data · CSV/JSON/YAML/XML' },
  { id: 'units', label: 'Units' },
  { id: 'bases', label: 'Number bases' },
  { id: 'color', label: 'Color' },
]

export default function ConverterApp() {
  const [tool, setTool] = useState<Tool>('data')
  return (
    <section>
      <div className="tabs" role="tablist" aria-label="Converter type">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            className="tab"
            aria-selected={tool === t.id}
            aria-controls={`panel-${t.id}`}
            id={`tab-${t.id}`}
            onClick={() => setTool(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tool}`} aria-labelledby={`tab-${tool}`}>
        {tool === 'data' && <DataConverter />}
        {tool === 'units' && <UnitConverter />}
        {tool === 'bases' && <BaseConverter />}
        {tool === 'color' && <ColorConverter />}
      </div>
    </section>
  )
}
