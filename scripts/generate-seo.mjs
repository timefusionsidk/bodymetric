// Generates robots.txt and sitemap.xml into dist/ using VITE_SITE_URL,
// so the canonical URL is configured once (in .env) instead of hardcoded
// in multiple static files. Runs automatically after `vite build`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const distDir = resolve(root, 'dist')

function loadEnvValue(key) {
  if (process.env[key]) return process.env[key]
  for (const file of ['.env.local', '.env']) {
    const path = resolve(root, file)
    if (existsSync(path)) {
      const match = readFileSync(path, 'utf-8').match(new RegExp(`^${key}=(.*)$`, 'm'))
      if (match && match[1].trim()) return match[1].trim()
    }
  }
  return null
}

const siteUrl = (loadEnvValue('VITE_SITE_URL') || 'https://your-domain.example').replace(/\/$/, '')

if (!existsSync(distDir)) {
  console.warn('[generate-seo] dist/ not found, skipping (did the build run?)')
  process.exit(0)
}

if (siteUrl === 'https://your-domain.example') {
  console.warn(
    '[generate-seo] VITE_SITE_URL is not set. Shipping robots.txt/sitemap.xml with a placeholder domain. ' +
    'Set VITE_SITE_URL in your environment before deploying to production.'
  )
}

writeFileSync(
  resolve(distDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
)

const pages = [
  { path: '/', priority: '1.0', freq: 'monthly' },
  { path: '/privacy', priority: '0.3', freq: 'yearly' },
  { path: '/terms', priority: '0.3', freq: 'yearly' },
]

const urls = pages
  .map(
    (p) => `  <url>\n    <loc>${siteUrl}${p.path}</loc>\n    <changefreq>${p.freq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  )
  .join('\n')

writeFileSync(
  resolve(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
)

console.log(`[generate-seo] Wrote robots.txt and sitemap.xml using site URL: ${siteUrl}`)
