const http = require('http');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
require('dotenv').config();
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 8000;
const ROOT = __dirname;

/* Where the Museum of Fantasy Sports app runs during local development. */
const FANTASY_HOST = process.env.FANTASY_HOST || 'localhost';
const FANTASY_PORT = process.env.FANTASY_PORT || 3000;

/* Clean URLs -> files on disk. Add a line here when a page is added. */
const ROUTES = {
  '/': 'index.html',
  '/museum': 'museum.html',
  // Browsers request these regardless of what <link rel="icon"> says, and a
  // 404 for each shows up as a console error on every page load.
  '/favicon.ico': 'assets/images/portfolio_icon.png',
  '/apple-touch-icon.png': 'assets/images/portfolio_icon.png',
  '/apple-touch-icon-precomposed.png': 'assets/images/portfolio_icon.png'
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.pdf': 'application/pdf'
};

const IMMUTABLE = new Set(['.woff', '.woff2', '.ttf', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.mp4', '.webm', '.mov']);

const MAX_FIELD = { name: 120, email: 200, message: 5000 };

/* Server-side files that live in the web root but are not part of the site. */
const DENIED = new Set(['server.js', 'package.json', 'package-lock.json']);
const DENIED_DIRS = ['node_modules'];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

/**
 * Map a request URL to a real file inside ROOT, or null if it escapes the
 * root, points at a dotfile, or does not resolve to a readable file.
 */
async function resolveRequest(requestUrl) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  } catch {
    return null;
  }

  const routed = ROUTES[pathname.replace(/\/+$/, '') || '/'];
  const relative = routed || pathname.replace(/^\/+/, '');

  const segments = relative.split(/[\\/]/).filter(Boolean);
  // Reject dotfiles and dot-directories outright (.env, .git, .gitignore...),
  // plus the server's own source and its dependencies.
  if (segments.some((segment) => segment.startsWith('.'))) return null;
  if (segments.some((segment) => DENIED_DIRS.includes(segment))) return null;
  if (DENIED.has(segments[segments.length - 1])) return null;

  const candidates = [path.resolve(ROOT, relative)];
  // Allow extensionless URLs like /museum even if they are not in ROUTES.
  if (!routed && !path.extname(relative)) candidates.push(path.resolve(ROOT, `${relative}.html`));

  for (const candidate of candidates) {
    // path.resolve normalises `..`; confirm the result is still under ROOT.
    if (candidate !== ROOT && !candidate.startsWith(ROOT + path.sep)) continue;
    try {
      const stats = await fsp.stat(candidate);
      if (stats.isFile()) return { filePath: candidate, stats };
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

function notFound(res, method) {
  const body = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Not found — Hunter Shapiro</title>
<style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#15172a;color:#f7f1e6;
font:400 16px/1.5 system-ui,sans-serif;text-align:center;padding:2rem}h1{font-size:clamp(3rem,12vw,6rem);
margin:0;letter-spacing:-.06em}a{color:#d8ff59}</style></head>
<body><div><h1>404</h1><p>That page is not part of the collection.</p>
<p><a href="/">Return to the start</a> · <a href="/museum">Visit the museum</a></p></div></body></html>`;
  res.writeHead(404, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(method === 'HEAD' ? undefined : body);
}

async function handleContact(req, res) {
  let body = '';
  let aborted = false;

  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 20000) {
      aborted = true;
      sendJson(res, 413, { success: false, error: 'Message is too long.' });
      req.destroy();
    }
  });

  req.on('end', async () => {
    if (aborted) return;
    try {
      const payload = JSON.parse(body);

      // Honeypot: a real person never fills a visually hidden field.
      if (payload.company) return sendJson(res, 200, { success: true });

      const name = String(payload.name || '').trim().slice(0, MAX_FIELD.name) || 'Unknown';
      const fromEmail = String(payload.email || '').trim().slice(0, MAX_FIELD.email);
      const message = String(payload.message || '').trim().slice(0, MAX_FIELD.message);

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
        return sendJson(res, 400, { success: false, error: 'That email address does not look right.' });
      }
      if (!message) {
        return sendJson(res, 400, { success: false, error: 'Please include a message.' });
      }

      const smtpUser = process.env.SMTP_USER || '';
      const smtpHost = process.env.SMTP_HOST || '';
      let transporter;

      if (smtpUser && smtpHost && !smtpHost.includes('example')) {
        transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: smtpUser, pass: process.env.SMTP_PASS }
        });
      } else {
        // No SMTP configured: fall back to an Ethereal inbox for local testing.
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: { user: testAccount.user, pass: testAccount.pass }
        });
        console.log('SMTP is not configured — using an Ethereal test inbox.');
      }

      const info = await transporter.sendMail({
        from: process.env.FROM_ADDRESS || smtpUser || 'no-reply@example.com',
        to: process.env.CONTACT_TO || 'hunter@sflinsider.com',
        subject: `Portfolio contact from ${name}`,
        text: `Name: ${name}\nEmail: ${fromEmail}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(fromEmail)}</p>
<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
        replyTo: fromEmail
      });

      sendJson(res, 200, { success: true, previewUrl: nodemailer.getTestMessageUrl(info) || null });
    } catch (err) {
      // Log the detail, return something generic — errors can carry SMTP internals.
      console.error('Email send error:', err);
      sendJson(res, 500, { success: false, error: 'Message could not be sent. Please email me directly.' });
    }
  });
}

/**
 * Mirror the production setup locally.
 *
 * In production Netlify rewrites /fantasy/* to the Museum of Fantasy Sports
 * app (a separate Next.js deployment). Here we forward to it on localhost so
 * the same links work in development. If it is not running, say so plainly
 * rather than serving a bare 404 that looks like a broken link.
 */
function proxyToFantasyApp(req, res) {
  const upstream = http.request(
    {
      host: FANTASY_HOST,
      port: FANTASY_PORT,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: `${FANTASY_HOST}:${FANTASY_PORT}` }
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode, upstreamRes.headers);
      upstreamRes.pipe(res);
    }
  );

  upstream.on('error', () => {
    const body = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fantasy app not running</title>
<style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#0d0f1c;color:#f7f1e6;
font:400 16px/1.6 system-ui,sans-serif;text-align:center;padding:2rem}code{color:#d8b25e}a{color:#d8ff59}</style>
</head><body><div><h1>The museum is closed locally</h1>
<p>In production Netlify proxies <code>/fantasy</code> to the Next.js app.<br>
To run it here, start it separately:</p>
<p><code>cd ../../dev/fantasy_sports &amp;&amp; pnpm dev</code></p>
<p><a href="/">Back to the portfolio</a> · <a href="/museum">Read the case study</a></p>
</div></body></html>`;
    res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(body);
  });

  req.pipe(upstream);
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/fantasy' || req.url.startsWith('/fantasy/') || req.url.startsWith('/fantasy?')) {
    return proxyToFantasyApp(req, res);
  }

  if (req.url === '/send-email') {
    if (req.method !== 'POST') {
      res.writeHead(405, { Allow: 'POST' });
      return res.end();
    }
    return handleContact(req, res);
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }

  const resolved = await resolveRequest(req.url);
  if (!resolved) return notFound(res, req.method);

  const ext = path.extname(resolved.filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
    'Content-Length': resolved.stats.size,
    'Cache-Control': IMMUTABLE.has(ext) ? 'public, max-age=604800' : 'no-cache',
    'X-Content-Type-Options': 'nosniff'
  });

  if (req.method === 'HEAD') return res.end();

  const stream = fs.createReadStream(resolved.filePath);
  stream.on('error', () => res.destroy());
  stream.pipe(res);
});

server.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
