/** Color format conversions: HEX <-> RGB <-> HSL. Pure, no DOM. */

export interface RGB {
  r: number
  g: number
  b: number
  a: number
}
export interface HSL {
  h: number
  s: number
  l: number
  a: number
}

/** Parse #rgb/#rrggbb/#rrggbbaa/rgb()/rgba()/hsl()/hsla() to RGB. Throws on junk. */
export function parseColor(input: string): RGB {
  const s = input.trim().toLowerCase()
  const hex = s.match(/^#?([0-9a-f]{3,8})$/)
  if (hex) return hexToRgb(hex[1])
  const rgb = s.match(/^rgba?\(([^)]+)\)$/)
  if (rgb) {
    const parts = rgb[1].split(/[,\s/]+/).filter(Boolean)
    const [r, g, b] = parts.slice(0, 3).map((p) => clampInt(parseFloat(p)))
    const a = parts[3] != null ? clamp01(parseFloat(parts[3])) : 1
    return { r, g, b, a }
  }
  const hsl = s.match(/^hsla?\(([^)]+)\)$/)
  if (hsl) {
    const parts = hsl[1].split(/[,\s/]+/).filter(Boolean)
    const h = parseFloat(parts[0])
    const sp = parseFloat(parts[1]) / 100
    const lp = parseFloat(parts[2]) / 100
    const a = parts[3] != null ? clamp01(parseFloat(parts[3])) : 1
    return { ...hslToRgb({ h, s: sp, l: lp, a }), a }
  }
  throw new Error(`unrecognized color: "${input}"`)
}

function hexToRgb(h: string): RGB {
  let s = h
  if (s.length === 3) s = s.split('').map((c) => c + c).join('')
  if (s.length === 4) s = s.split('').map((c) => c + c).join('')
  if (s.length === 6) s += 'ff'
  if (s.length !== 8) throw new Error(`bad hex length: #${h}`)
  const r = parseInt(s.slice(0, 2), 16)
  const g = parseInt(s.slice(2, 4), 16)
  const b = parseInt(s.slice(4, 6), 16)
  const a = parseInt(s.slice(6, 8), 16) / 255
  return { r, g, b, a }
}

const hx = (n: number) => clampInt(n).toString(16).padStart(2, '0')

/** RGB to #rrggbb (or #rrggbbaa when alpha < 1). */
export function rgbToHex({ r, g, b, a }: RGB): string {
  const base = `#${hx(r)}${hx(g)}${hx(b)}`
  return a < 1 ? base + hx(Math.round(a * 255)) : base
}

export function rgbToHsl({ r, g, b, a }: RGB): HSL {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  const d = max - min
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0)
        break
      case gn:
        h = (bn - rn) / d + 2
        break
      default:
        h = (rn - gn) / d + 4
    }
    h /= 6
  }
  return { h: Math.round(h * 360), s: round2(s), l: round2(l), a }
}

export function hslToRgb({ h, s, l, a }: HSL): RGB {
  const hn = ((h % 360) + 360) % 360 / 360
  let r: number
  let g: number
  let b: number
  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, hn + 1 / 3)
    g = hue2rgb(p, q, hn)
    b = hue2rgb(p, q, hn - 1 / 3)
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255), a }
}

function hue2rgb(p: number, q: number, t: number): number {
  let tn = t
  if (tn < 0) tn += 1
  if (tn > 1) tn -= 1
  if (tn < 1 / 6) return p + (q - p) * 6 * tn
  if (tn < 1 / 2) return q
  if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6
  return p
}

export interface ColorResult {
  hex: string
  rgb: string
  hsl: string
  swatch: string
}

export function convertColor(input: string): ColorResult {
  const rgb = parseColor(input)
  const hsl = rgbToHsl(rgb)
  const rgbStr = rgb.a < 1 ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${round2(rgb.a)})` : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  const hslStr =
    hsl.a < 1
      ? `hsla(${hsl.h}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%, ${round2(hsl.a)})`
      : `hsl(${hsl.h}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`
  return { hex: rgbToHex(rgb), rgb: rgbStr, hsl: hslStr, swatch: rgbToHex({ ...rgb, a: 1 }) }
}

function clampInt(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)))
}
function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}
function round2(n: number): number {
  return Math.round(n * 100) / 100
}
