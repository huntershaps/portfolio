const fs = require('fs');
const path = require('path');

/**
 * Assembles the deployable site into `dist/`.
 *
 * The site is static, so it is tempting to publish the repository root
 * directly. That would upload everything sitting beside the HTML — `.env`,
 * `.git`, `node_modules`, `server.js` — to a public CDN, putting the SMTP
 * credentials at /.env and the full repository history at /.git/.
 *
 * So this is an allowlist, not an ignore list: nothing reaches the CDN unless
 * it is named here. A new asset directory has to be added deliberately, which
 * is the safer way round for something that publishes to the internet.
 */
const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');

const SHIP = ['index.html', 'museum.html', 'assets', 'styles', 'javascript'];

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

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let files = 0;
let bytes = 0;
for (const item of SHIP) {
  const src = path.join(ROOT, item);
  if (!fs.existsSync(src)) {
    console.error(`missing: ${item}`);
    process.exit(1);
  }
  copy(src, path.join(OUT, item));
}

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
for (const forbidden of ['.env', '.git', 'node_modules', 'server.js', 'package.json']) {
  if (fs.existsSync(path.join(OUT, forbidden))) {
    console.error(`REFUSING: ${forbidden} ended up in dist/`);
    process.exit(1);
  }
}
console.log('checked: no .env, .git, node_modules or server code in dist/');
