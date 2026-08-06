/** Number base conversions (2/8/10/16 + arbitrary 2..36). Pure. */

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'

/** Parse a string in the given base to a BigInt. Throws on invalid digit. */
export function parseInBase(input: string, base: number): bigint {
  if (base < 2 || base > 36) throw new Error(`base must be 2..36, got ${base}`)
  const s = input.trim().toLowerCase().replace(/^0[bxo]/, (m) => {
    // strip common prefixes only when they match the base
    if (m === '0x' && base === 16) return ''
    if (m === '0b' && base === 2) return ''
    if (m === '0o' && base === 8) return ''
    return m
  })
  let neg = false
  let body = s
  if (body.startsWith('-')) {
    neg = true
    body = body.slice(1)
  }
  if (body === '') throw new Error('empty number')
  let acc = 0n
  const b = BigInt(base)
  for (const ch of body) {
    const d = DIGITS.indexOf(ch)
    if (d < 0 || d >= base) throw new Error(`invalid digit "${ch}" for base ${base}`)
    acc = acc * b + BigInt(d)
  }
  return neg ? -acc : acc
}

/** Render a BigInt in the given base. Pure. */
export function toBase(value: bigint, base: number): string {
  if (base < 2 || base > 36) throw new Error(`base must be 2..36, got ${base}`)
  if (value === 0n) return '0'
  const neg = value < 0n
  let v = neg ? -value : value
  const b = BigInt(base)
  let out = ''
  while (v > 0n) {
    const rem = Number(v % b)
    out = DIGITS[rem] + out
    v = v / b
  }
  return neg ? '-' + out : out
}

export interface BaseResult {
  binary: string
  octal: string
  decimal: string
  hex: string
}

/** Convert one input (in fromBase) to bin/oct/dec/hex at once. */
export function convertBases(input: string, fromBase: number): BaseResult {
  const v = parseInBase(input, fromBase)
  return {
    binary: toBase(v, 2),
    octal: toBase(v, 8),
    decimal: toBase(v, 10),
    hex: toBase(v, 16),
  }
}
