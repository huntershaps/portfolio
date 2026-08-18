/**
 * Assembles the deployable site into `dist/`.
 *
 * Two jobs: render every route from content/*.js into a real HTML file, and
 * copy the static directories those pages reference.
 *
 * The copy step is an allowlist, not an ignore list. The site is static, so it
 * is tempting to publish the repository root directly — that would upload
 * everything sitting beside the HTML (`.env`, `.git`, `node_modules`,
 * `server.js`) to a public CDN, putting the SMTP credentials at /.env and the
 * full repository history at /.git/. A new asset directory therefore has to be
 * added here deliberately, which is the safer way round for something that
 * publishes to the internet.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { routes } from './scripts/render/site.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'dist');

/** Directories copied verbatim. Everything else stays out of the deploy. */
const SHIP = ['assets', 'styles', 'javascript'];

/** Anything on this list reaching dist/ is a build failure, not a warning. */
const FORBIDDEN = ['.env', '.git', 'node_modules', 'server.js', 'package.json', 'content', 'scripts'];

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      // Never ship a dotfile, whatever directory it turns up in.
      if (entry.startsWith('.')) continue;
      copy(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

/** '/' -> dist/index.html, '/work/x' -> dist/work/x/index.html */
function fileFor(route) {
  const clean = route.replace(/^\/+|\/+$/g, '');
  return clean ? path.join(OUT, clean, 'index.html') : path.join(OUT, 'index.html');
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const pages = routes();
for (const [route, markup] of Object.entries(pages)) {
  const file = fileFor(route);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, markup);
}
console.log(`rendered ${Object.keys(pages).length} pages`);

for (const item of SHIP) {
  const src = path.join(ROOT, item);
  if (!fs.existsSync(src)) {
    console.error(`missing: ${item}`);
    process.exit(1);
  }
  copy(src, path.join(OUT, item));
}

let files = 0;
let bytes = 0;
(function measure(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) measure(full);
    else {
      files++;
      bytes += stat.size;
    }
  }
})(OUT);

console.log(`dist/: ${files} files, ${(bytes / 1024 / 1024).toFixed(2)} MB`);

// A deployed secret is worth failing the build over.
for (const forbidden of FORBIDDEN) {
  if (fs.existsSync(path.join(OUT, forbidden))) {
    console.error(`REFUSING: ${forbidden} ended up in dist/`);
    process.exit(1);
  }
}
console.log('checked: no .env, .git, node_modules, server or source directories in dist/');
