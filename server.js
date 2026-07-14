// Minimal static file server — no build step, no framework, no dependencies.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 5000

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  let filePath = path.normalize(path.join(__dirname, urlPath))

  // Prevent path traversal outside the project root
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403)
    return res.end('Forbidden')
  }

  if (filePath.endsWith(path.sep)) filePath = path.join(filePath, 'index.html')

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) filePath = path.join(filePath, 'index.html')

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        // SPA fallback: serve index.html for unknown routes (no query/extension)
        return fs.readFile(path.join(__dirname, 'index.html'), (idxErr, idxData) => {
          if (idxErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            return res.end('Not found')
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
          res.end(idxData)
        })
      }
      const ext = path.extname(filePath)
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      })
      res.end(data)
    })
  })
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`BDI Document Generator serving static files on http://0.0.0.0:${PORT}`)
})
