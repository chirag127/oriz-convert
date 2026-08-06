/**
 * Structured-data conversions: CSV/JSON/YAML/XML.
 * Heavy parsers (js-yaml, papaparse, fast-xml-parser) are dynamically imported
 * only when their format is actually used, so first paint ships minimal JS.
 */

export type DataFormat = 'json' | 'yaml' | 'csv' | 'xml'

/** Parse any supported format to a JS value. Async (lazy-loads the parser). */
export async function parseData(text: string, format: DataFormat): Promise<unknown> {
  switch (format) {
    case 'json':
      return JSON.parse(text)
    case 'yaml': {
      const { load } = await import('js-yaml')
      return load(text)
    }
    case 'csv': {
      const Papa = (await import('papaparse')).default
      const res = Papa.parse(text.trim(), { header: true, dynamicTyping: true, skipEmptyLines: true })
      if (res.errors.length) throw new Error(res.errors[0].message)
      return res.data
    }
    case 'xml': {
      const { XMLParser } = await import('fast-xml-parser')
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', parseAttributeValue: true })
      return parser.parse(text)
    }
  }
}

/** Serialize a JS value to the target format. Async (lazy-loads the serializer). */
export async function serializeData(value: unknown, format: DataFormat): Promise<string> {
  switch (format) {
    case 'json':
      return JSON.stringify(value, null, 2)
    case 'yaml': {
      const { dump } = await import('js-yaml')
      return dump(value, { indent: 2, lineWidth: 120 })
    }
    case 'csv': {
      const Papa = (await import('papaparse')).default
      const rows = Array.isArray(value) ? value : [value]
      return Papa.unparse(rows as object[])
    }
    case 'xml': {
      const { XMLBuilder } = await import('fast-xml-parser')
      const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: '@_', format: true, indentBy: '  ' })
      return builder.build(value)
    }
  }
}

/** Convert text from one format to another. */
export async function convertData(text: string, from: DataFormat, to: DataFormat): Promise<string> {
  const parsed = await parseData(text, from)
  return serializeData(parsed, to)
}

export const FORMAT_LABELS: Record<DataFormat, string> = {
  json: 'JSON',
  yaml: 'YAML',
  csv: 'CSV',
  xml: 'XML',
}
