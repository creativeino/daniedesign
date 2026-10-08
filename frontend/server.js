process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const fs = require('fs')
const path = require('path')

const port = parseInt(process.env.PORT, 10) || 3001
const hostname = process.env.HOSTNAME || '0.0.0.0'

// If standalone server exists, delegate execution to it to avoid Wasm memory overhead
// and Next.js standalone warning ("next start does not work with output: standalone")
const standaloneServerPath = path.join(__dirname, '.next', 'standalone', 'server.js')
if (fs.existsSync(standaloneServerPath) && require.main === module) {
  process.env.PORT = String(port)
  process.env.HOSTNAME = hostname
  require(standaloneServerPath)
} else {
  const { createServer } = require('http')
  const { parse } = require('url')
  const next = require('next')

  const dev = process.env.NODE_ENV !== 'production'
  const app = next({ dev, hostname, port })
  const handle = app.getRequestHandler()

  console.log(
    `> next@${require('next/package.json').version} | node ${process.version} | cwd ${process.cwd()} | port ${port}`
  )

  app
    .prepare()
    .then(() => {
      createServer(async (req, res) => {
        try {
          const parsedUrl = parse(req.url, true)
          await handle(req, res, parsedUrl)
        } catch (err) {
          console.error('Error occurred handling', req.url, err)
          res.statusCode = 500
          res.end('internal server error')
        }
      })
        .once('error', (err) => {
          console.error(err)
          process.exit(1)
        })
        .listen(port, () => {
          console.log(`> Ready on http://${hostname}:${port}`)
        })
    })
    .catch((err) => {
      console.error('NEXT ERROR:', err)
      process.exit(1)
    })
}

