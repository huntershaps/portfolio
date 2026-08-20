/**
 * Renders content/resume.js into a single self-contained HTML page laid out
 * for US Letter print.
 *
 * The layout follows the LaTeX résumé Hunter picked as the reference: centred
 * name, one contact line, small-caps section headings with a rule under them,
 * and two-line entry headers with the organisation and dates on the first line
 * and the role and location italicised on the second.
 *
 * Everything is inline — no external stylesheet, no webfont, no image — so the
 * file prints identically wherever Chrome runs it.
 */

import { profile } from '../../content/profile.js';
import { resume } from '../../content/resume.js';

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

/**
 * profile.js writes date ranges as "Feb 2025 to Feb 2026" because that is how
 * they read in a sentence on the site. On the résumé they sit alone in the
 * right margin, where an en dash is the convention.
 */
const dateRange = (value) => String(value).replace(/ to /g, ' – ');

/** A bulleted list. Returns '' for an empty list so no stray <ul> is printed. */
const bullets = (points) =>
  points && points.length
    ? `<ul>${points.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>`
    : '';

/** The two-line entry header shared by education and experience. */
const entryHead = ({ left, right, subLeft, subRight }) => `
  <div class="row">
    <span class="row-main">${left}</span>
    <span class="row-aside">${escapeHtml(dateRange(right))}</span>
  </div>
  <div class="row row-sub">
    <span class="row-main">${escapeHtml(subLeft)}</span>
    <span class="row-aside">${escapeHtml(subRight)}</span>
  </div>`;

const section = (title, body) => `
  <section>
    <h2>${escapeHtml(title)}</h2>
    ${body}
  </section>`;

/**
 * The contact line under the name. Only links that exist in profile.js appear,
 * and each is printed as the bare domain or handle rather than a full URL,
 * which is how the reference résumé reads.
 */
function contactLine() {
  const parts = [
    { text: profile.email, href: `mailto:${profile.email}` },
    { text: 'huntermshaps.com', href: 'https://huntermshaps.com' },
    { text: '/hunter-shapiro', href: profile.links.linkedin.href },
    { text: '/huntershaps', href: profile.links.github.href },
  ];
  return parts
    .map((p) => `<a href="${escapeHtml(p.href)}">${escapeHtml(p.text)}</a>`)
    .join('<span class="sep">|</span>');
}

export function resumeHtml() {
  const education = resume.education
    .map(
      (school) => `
      <div class="entry">
        ${entryHead({
          left: `<strong>${escapeHtml(school.institution)}</strong>`,
          right: school.when,
          subLeft: school.qualification,
          subRight: school.where,
        })}
        ${school.note ? `<div class="row row-sub"><span class="row-main">${escapeHtml(school.note)}</span></div>` : ''}
      </div>`,
    )
    .join('');

  const experience = resume.experience
    .map(
      (job) => `
      <div class="entry">
        ${entryHead({
          left: `<strong>${escapeHtml(job.organization)}</strong>`,
          right: job.when,
          subLeft: job.title,
          subRight: job.where,
        })}
        ${bullets(job.points)}
      </div>`,
    )
    .join('');

  const projects = resume.projects
    .map(
      (project) => `
      <div class="entry">
        <div class="row">
          <span class="row-main">
            <strong>${escapeHtml(project.name)}</strong><span class="sep">|</span><em>${escapeHtml(project.stack)}</em>
          </span>
        </div>
        ${bullets(project.points)}
      </div>`,
    )
    .join('');

  const skills = `<div class="skills">${resume.skills
    .map(
      (group) =>
        `<div class="skill-row"><strong>${escapeHtml(group.label)}:</strong> ${escapeHtml(group.items)}</div>`,
    )
    .join('')}</div>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(profile.name)} — Résumé</title>
<style>
  /*
   * The whole page is tuned to fit on one sheet. The levers, in the order
   * worth pulling if content is added: the body font-size below, the .entry
   * top margin, and the li line-height. Everything else scales off them.
   */
  @page { size: letter; margin: 0.34in 0.45in; }

  * { box-sizing: border-box; }

  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  body {
    margin: 0;
    font-family: Cambria, Charter, Georgia, 'Times New Roman', serif;
    font-size: 10.2pt;
    line-height: 1.3;
    color: #000;
    background: #fff;
  }

  a { color: inherit; text-decoration: none; }

  /* ---- masthead ------------------------------------------------------ */
  header { text-align: center; margin-bottom: 5pt; }

  h1 {
    margin: 0 0 3pt;
    font-size: 24pt;
    font-weight: 700;
    letter-spacing: 0.4pt;
    line-height: 1.1;
  }

  .contact { font-size: 9.8pt; }
  .contact a { text-decoration: underline; text-underline-offset: 1.5pt; }

  .sep { padding: 0 5pt; }

  /* ---- sections ------------------------------------------------------ */
  section { margin-top: 5.5pt; }

  h2 {
    margin: 0 0 2pt;
    padding-bottom: 1pt;
    border-bottom: 0.6pt solid #000;
    font-size: 11.5pt;
    font-weight: 400;
    font-variant: small-caps;
    letter-spacing: 0.3pt;
  }

  .entry { margin-top: 3.2pt; page-break-inside: avoid; }
  .entry:first-of-type { margin-top: 3pt; }

  .row { display: flex; justify-content: space-between; gap: 12pt; }
  .row-main { flex: 1 1 auto; }
  .row-aside { flex: 0 0 auto; text-align: right; white-space: nowrap; }

  .row-sub { font-style: italic; font-size: 9.9pt; }
  .row-sub .row-aside { font-style: italic; }

  /* ---- bullets ------------------------------------------------------- */
  ul { margin: 1.5pt 0 0; padding-left: 13pt; }
  li { margin: 0 0 0.5pt; font-size: 9.9pt; line-height: 1.3; }
  li::marker { font-size: 8pt; }

  /* ---- skills -------------------------------------------------------- */
  .skills { margin-top: 3pt; }
  .skill-row { font-size: 9.9pt; margin-bottom: 0.5pt; }
</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(profile.name)}</h1>
    <div class="contact">${contactLine()}</div>
  </header>

  ${section('Education', education)}
  ${section('Technical Skills', skills)}
  ${section('Experience', experience)}
  ${section('Projects', projects)}
</body>
</html>
`;
}
