/** Optional AI polish over oz-ai. Never required — core features work if this throws. */
import { complete } from '@chirag127/oz-ai'

/** Explain a pasted dataset in plain language. */
export async function explainData(sample: string, opts?: { signal?: AbortSignal; model?: string }): Promise<string> {
  const prompt = `Describe this dataset in 3-5 short bullet points: what it represents, its fields/types, row count if tabular, and one notable observation. Data:\n\n${clip(sample)}`
  return complete(prompt, {
    system: 'You are a concise data analyst. Plain language, no preamble, bullet points only.',
    signal: opts?.signal,
    model: opts?.model,
  })
}

/** Infer a JSON Schema (draft-07) from sample data. Returns the schema as a string. */
export async function inferSchema(sample: string, opts?: { signal?: AbortSignal; model?: string }): Promise<string> {
  const prompt = `Infer a JSON Schema (draft-07) for this sample data. Return ONLY the JSON schema, no prose, no code fences:\n\n${clip(sample)}`
  const out = await complete(prompt, {
    system: 'You output only valid JSON. No markdown, no explanation.',
    signal: opts?.signal,
    model: opts?.model,
  })
  return stripFences(out)
}

function clip(s: string, max = 4000): string {
  return s.length > max ? s.slice(0, max) + '\n… (truncated)' : s
}

function stripFences(s: string): string {
  return s
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()
}
