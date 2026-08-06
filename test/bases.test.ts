import { describe, expect, it } from 'vitest'
import { convertBases, parseInBase, toBase } from '../src/lib/bases'

describe('bases', () => {
  it('converts 255 dec to all bases', () => {
    const r = convertBases('255', 10)
    expect(r.binary).toBe('11111111')
    expect(r.octal).toBe('377')
    expect(r.hex).toBe('ff')
    expect(r.decimal).toBe('255')
  })

  it('parses hex prefix', () => {
    expect(parseInBase('0xff', 16)).toBe(255n)
    expect(parseInBase('0b1010', 2)).toBe(10n)
  })

  it('handles big numbers via BigInt', () => {
    const big = '123456789012345678901234567890'
    expect(toBase(parseInBase(big, 10), 10)).toBe(big)
  })

  it('round-trips base 36', () => {
    expect(toBase(parseInBase('zz', 36), 36)).toBe('zz')
  })

  it('rejects invalid digit', () => {
    expect(() => parseInBase('2', 2)).toThrow()
    expect(() => parseInBase('g', 16)).toThrow()
  })

  it('handles negatives and zero', () => {
    expect(toBase(0n, 2)).toBe('0')
    expect(convertBases('-16', 10).hex).toBe('-10')
  })
})
