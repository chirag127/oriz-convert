import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@tailwindcss/vite'

// https://astro.build
export default defineConfig({
  site: 'https://convert.oriz.in',
  output: 'static',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwind()],
  },
})
