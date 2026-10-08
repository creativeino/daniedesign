const { createServer } = require('http');
const fs = require('fs');
const path = require('path');
const next = require('next');

const LOG = path.join(process.cwd(), 'server.log');

function log(...args) {
  const line = `[${new Date().toISOString()}] ${args
    .map((a) => (typeof a === 'string' ? a : (a && a.stack) || (a && a.message) || safeJson(a)))
    .join(' ')}`;
  try {
    fs.appendFileSync(LOG, line + '\n');
  } catch (e) {
    console.error('log write failed:', e.message);
  }
  console.log(line);
}

function safeJson(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

const port = process.env.PORT || 3000;
const hostname = '0.0.0.0';

const app = next({
  dev: false,
  hostname,
  port,
});

const handle = app.getRequestHandler();

log('BOOT', safeJson({
  node: process.version,
  cwd: process.cwd(),
  port,
  hostname,
  nodeEnv: process.env.NODE_ENV,
  hasDotNext: fs.existsSync(path.join(process.cwd(), '.next')),
  hasPackage: fs.existsSync(path.join(process.cwd(), 'package.json')),
}));

process.on('uncaughtException', (err) => log('UNCAUGHT EXCEPTION', err));
process.on('unhandledRejection', (err) => log('UNHANDLED REJECTION', err));
process.on('SIGTERM', () => {
  log('SIGTERM received');
  process.exit(0);
});

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      const started = Date.now();
      res.on('finish', () => {
        log(`${req.method} ${req.url} -> ${res.statusCode} (${Date.now() - started}ms)`);
      });
      Promise.resolve(handle(req, res)).catch((err) => {
        log('REQUEST ERROR', err);
        if (!res.headersSent) {
          res.statusCode = 500;
        }
        res.end('Internal server error');
      });
    });

    server.on('error', (err) => {
      log('SERVER ERROR', err);
      process.exit(1);
    });

    server.listen(port, hostname, () => {
      log(`> Next.js running on ${hostname}:${port}`);
    });
  })
  .catch((err) => {
    log('PREPARE FAILED', err);
    process.exit(1);
  });
