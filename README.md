# oriz-convert

**Live: https://convert.oriz.in**

Universal converter that runs entirely in your browser. Transmute structured data, units, number bases, and color formats — no upload, no signup, nothing leaves your machine.

**100% client-side · no upload · no signup.** All conversion runs in the browser; heavy parsers load on demand so first paint stays instant.

## What it does

- **Data formats** — CSV ⇌ JSON ⇌ YAML ⇌ XML (any direction). Paste or drag-drop a file, copy or download the result.
- **Units** — length, mass, temperature, data size. One value converts to every unit in the category at once.
- **Number bases** — binary / octal / decimal / hex / base-36, arbitrary-precision (BigInt), accepts `0x`/`0b`/`0o` prefixes.
- **Color** — HEX ⇌ RGB ⇌ HSL with alpha, live swatch, native color picker.
- **AI insight (optional)** — describe a pasted dataset or infer a JSON Schema. Powered by the shared `@chirag127/oz-ai` (g4f multi-provider failover, no key). Core conversion works even if AI is down.

## Stack

Astro (static) + React 19 islands + Tailwind v4. Shared `@chirag127/oz-*` atomic packages for AI, file helpers, tokens, and chrome. Parsers: `js-yaml`, `papaparse`, `fast-xml-parser` — dynamically imported per feature.

## Develop

```bash
npm install --legacy-peer-deps
npm run dev      # local
npm test         # vitest — pure conversion logic
npm run build    # static dist/
npm run deploy   # Cloudflare Pages
```

## Privacy

No backend. No network calls for conversion. The only outbound request is the optional AI feature, which you trigger explicitly.

## License

MIT © 2026 Chirag Singhal
