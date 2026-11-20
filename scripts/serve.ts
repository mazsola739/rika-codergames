// Serves docs/ on http://localhost:4321 so the site can be checked before it goes to GitHub Pages.
// Usage: npm run preview
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, normalize, extname } from 'node:path'
import { ROOT } from './tasks.ts'

const DOCS = join(ROOT, 'docs')
const PORT = Number(process.env.PORT ?? 4321)
const TYPES: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' }

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname)).replace(/^([/\\])+/, '')
  const file = join(DOCS, path || 'index.html')
  if (!file.startsWith(DOCS)) {
    res.writeHead(403).end()
    return
  }
  try {
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' }).end(body)
  } catch {
    res.writeHead(404).end('Not found')
  }
}).listen(PORT, () => console.log(`Docs at http://localhost:${PORT}`))
