import { describe, expect, it } from 'vitest'
import { convertTemp, convertUnit } from '../src/lib/units'

describe('units', () => {
  it('length km to mi', () => {
    expect(convertUnit(1, 'km', 'm', 'length')).toBeCloseTo(1000, 6)
    expect(convertUnit(1, 'mi', 'km', 'length')).toBeCloseTo(1.609344, 6)
  })

  it('mass lb to kg', () => {
    expect(convertUnit(1, 'lb', 'kg', 'mass')).toBeCloseTo(0.45359237, 8)
  })

  it('data MiB to KiB', () => {
    expect(convertUnit(1, 'MiB', 'KiB', 'data')).toBe(1024)
    expect(convertUnit(1, 'B', 'b', 'data')).toBe(8)
  })

  it('temperature C/F/K', () => {
    expect(convertTemp(100, 'C', 'F')).toBeCloseTo(212, 6)
    expect(convertTemp(32, 'F', 'C')).toBeCloseTo(0, 6)
    expect(convertTemp(0, 'C', 'K')).toBeCloseTo(273.15, 6)
    expect(convertTemp(300, 'K', 'C')).toBeCloseTo(26.85, 6)
  })

  it('same unit is identity', () => {
    expect(convertTemp(42, 'K', 'K')).toBe(42)
  })
})
