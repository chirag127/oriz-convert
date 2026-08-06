/** Unit conversions: length, mass, temperature, data. Pure math tables. */

export type UnitCategory = 'length' | 'mass' | 'temperature' | 'data'

/** Factor to the category base unit (length=m, mass=g, data=byte). */
export interface UnitDef {
  id: string
  label: string
  factor: number
}

export const UNITS: Record<Exclude<UnitCategory, 'temperature'>, UnitDef[]> = {
  length: [
    { id: 'mm', label: 'Millimeter', factor: 0.001 },
    { id: 'cm', label: 'Centimeter', factor: 0.01 },
    { id: 'm', label: 'Meter', factor: 1 },
    { id: 'km', label: 'Kilometer', factor: 1000 },
    { id: 'in', label: 'Inch', factor: 0.0254 },
    { id: 'ft', label: 'Foot', factor: 0.3048 },
    { id: 'yd', label: 'Yard', factor: 0.9144 },
    { id: 'mi', label: 'Mile', factor: 1609.344 },
    { id: 'nmi', label: 'Nautical mile', factor: 1852 },
  ],
  mass: [
    { id: 'mg', label: 'Milligram', factor: 0.001 },
    { id: 'g', label: 'Gram', factor: 1 },
    { id: 'kg', label: 'Kilogram', factor: 1000 },
    { id: 't', label: 'Metric ton', factor: 1_000_000 },
    { id: 'oz', label: 'Ounce', factor: 28.349523125 },
    { id: 'lb', label: 'Pound', factor: 453.59237 },
    { id: 'st', label: 'Stone', factor: 6350.29318 },
  ],
  data: [
    { id: 'b', label: 'Bit', factor: 0.125 },
    { id: 'B', label: 'Byte', factor: 1 },
    { id: 'KB', label: 'Kilobyte (1000)', factor: 1000 },
    { id: 'KiB', label: 'Kibibyte (1024)', factor: 1024 },
    { id: 'MB', label: 'Megabyte (1000)', factor: 1e6 },
    { id: 'MiB', label: 'Mebibyte (1024)', factor: 1024 ** 2 },
    { id: 'GB', label: 'Gigabyte (1000)', factor: 1e9 },
    { id: 'GiB', label: 'Gibibyte (1024)', factor: 1024 ** 3 },
    { id: 'TB', label: 'Terabyte (1000)', factor: 1e12 },
    { id: 'TiB', label: 'Tebibyte (1024)', factor: 1024 ** 4 },
  ],
}

export const TEMP_UNITS: { id: string; label: string }[] = [
  { id: 'C', label: 'Celsius' },
  { id: 'F', label: 'Fahrenheit' },
  { id: 'K', label: 'Kelvin' },
]

/** Factor-based conversion for length/mass/data. */
export function convertUnit(
  value: number,
  fromId: string,
  toId: string,
  category: Exclude<UnitCategory, 'temperature'>
): number {
  const units = UNITS[category]
  const from = units.find((u) => u.id === fromId)
  const to = units.find((u) => u.id === toId)
  if (!from || !to) throw new Error(`unknown unit ${fromId}->${toId} in ${category}`)
  return (value * from.factor) / to.factor
}

/** Temperature needs offsets, not just factors. */
export function convertTemp(value: number, fromId: string, toId: string): number {
  if (fromId === toId) return value
  // to Celsius first
  let c: number
  switch (fromId) {
    case 'C':
      c = value
      break
    case 'F':
      c = (value - 32) * (5 / 9)
      break
    case 'K':
      c = value - 273.15
      break
    default:
      throw new Error(`unknown temp unit ${fromId}`)
  }
  switch (toId) {
    case 'C':
      return c
    case 'F':
      return c * (9 / 5) + 32
    case 'K':
      return c + 273.15
    default:
      throw new Error(`unknown temp unit ${toId}`)
  }
}
