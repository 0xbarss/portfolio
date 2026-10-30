import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const { site } = JSON.parse(readFileSync(new URL('./src/data/personal.json', import.meta.url), 'utf-8'))
const vars = { TITLE: site.title.en, DESC: site.description.en, URL: site.url }

// Fills the page title and social-preview tags from src/data/personal.json
const personalHtml = {
  name: 'personal-html',
  transformIndexHtml: (html) => html.replace(/__(TITLE|DESC|URL)__/g, (_, k) => vars[k]),
}

// Relative base './' works at username.github.io/<repo>/ and username.github.io/
export default defineConfig({ plugins: [react(), personalHtml], base: './' })
