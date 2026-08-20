/**
 * Prints the résumé to assets/cv.pdf.
 *
 * Chrome does the typesetting. The alternative was a Python/reportlab script
 * laying out boxes by hand, which is what produced the previous PDF and is why
 * editing it meant editing coordinates. Rendering HTML means the résumé and
 * the site share one content file and one set of type rules.
 *
 * `--headless=new --print-to-pdf` is used rather than a Puppeteer dependency:
 * the repo has two dependencies and this does not need to be the third.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resumeHtml } from './render.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'assets', 'cv.pdf');

/** Where Chrome lives on this machine, most likely first. */
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));
if (!chrome) {
  console.error('No Chrome found. Set CHROME_PATH to the executable and try again.');
  process.exit(1);
}

// Chrome will only print a file it can read off disk, so the HTML goes to a
// temporary directory rather than into the repository.
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-'));
const source = path.join(work, 'resume.html');
fs.writeFileSync(source, resumeHtml());

// An HTML copy alongside the PDF, for previewing in a browser without a print
// dialog. Ignored by the build's allowlist, so it never ships.
fs.writeFileSync(path.join(work, 'preview.html'), resumeHtml());

try {
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-extensions',
      '--no-first-run',
      '--no-pdf-header-footer',
      '--print-to-pdf-no-header',
      `--print-to-pdf=${OUT}`,
      `file:///${source.replace(/\\/g, '/')}`,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
} catch (error) {
  console.error('Chrome failed to print the résumé.');
  console.error(String(error.stderr || error.message));
  process.exit(1);
}

if (!fs.existsSync(OUT)) {
  console.error('Chrome exited cleanly but wrote no PDF.');
  process.exit(1);
}

const kb = (fs.statSync(OUT).size / 1024).toFixed(1);

/**
 * Page count, straight out of the PDF's page tree. The résumé is meant to be
 * one page, and it is much easier to overrun that by a line than to notice.
 */
const pdf = fs.readFileSync(OUT, 'latin1');
const declared = pdf.match(/\/Type\s*\/Pages[^>]*?\/Count\s+(\d+)/);
const pages = declared ? Number(declared[1]) : (pdf.match(/\/Type\s*\/Page[^s]/g) || []).length;

console.log(`wrote assets/cv.pdf (${kb} KB, ${pages} page${pages === 1 ? '' : 's'})`);
console.log(`preview: ${path.join(work, 'preview.html')}`);

if (pages > 1) {
  console.warn(
    `\nWARNING: the résumé is ${pages} pages. It is written to fit one — trim a bullet in\n` +
      'content/resume.js, or nudge the type scale at the top of scripts/resume/render.js.',
  );
}
