import { describe, expect, it } from 'vitest'
import { convertColor, parseColor, rgbToHex, rgbToHsl } from '../src/lib/color'

describe('color', () => {
  it('parses hex short + long', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 })
    expect(parseColor('#7c3aed')).toEqual({ r: 124, g: 58, b: 237, a: 1 })
  })

  it('rgb to hex', () => {
    expect(rgbToHex({ r: 124, g: 58, b: 237, a: 1 })).toBe('#7c3aed')
  })

  it('rgb to hsl for violet', () => {
    const hsl = rgbToHsl({ r: 124, g: 58, b: 237, a: 1 })
    expect(hsl.h).toBe(262)
    expect(Math.round(hsl.s * 100)).toBe(83)
    expect(Math.round(hsl.l * 100)).toBe(58)
  })

  it('parses rgb() and hsl()', () => {
    expect(parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
    const c = convertColor('hsl(0, 100%, 50%)')
    expect(c.hex).toBe('#ff0000')
  })

  it('handles alpha', () => {
    const c = convertColor('#7c3aed80')
    expect(c.hex.length).toBe(9)
    expect(c.rgb.startsWith('rgba(')).toBe(true)
  })

  it('rejects junk', () => {
    expect(() => parseColor('not-a-color')).toThrow()
  })
})
