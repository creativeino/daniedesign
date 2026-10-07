// cPanel / Namecheap Node.js entry point (Passenger runs this file).
// Vercel ignores it — production there keeps using `next build` + `next start`.
// Local/standard flow is unchanged (`npm run dev` / `npm start`).
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`> listening on :${port} (${dev ? "dev" : "prod"})`);
  });
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
