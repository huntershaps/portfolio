/**
 * The page shell every route shares: head, skip link, index rail, the utility
 * controls, the command palette and the footer.
 *
 * Keeping this in one place is what makes a new case-study page free — it
 * inherits the chrome, the accessibility behaviour and the design system
 * without any of it being written twice.
 */

import { html, join, each, when, attrs, raw, esc, ICONS, arrow } from './html.js';
import { profile } from '../../content/profile.js';

const SITE = 'https://huntermshaps.com';

/**
 * The index shown in the rail. `id` is a homepage section; `href` overrides it
 * for links that leave the page.
 */
export function navSections({ lab = [], onHome = true } = {}) {
  const sections = [
    { id: 'start', label: 'Start' },
    { id: 'building', label: 'Building' },
    { id: 'work', label: 'Work' },
    { id: 'path', label: 'Path' },
    { id: 'toolkit', label: 'Toolkit' },
    { id: 'perspective', label: 'Perspective' },
    { id: 'archive', label: 'Archive' },
  ];
  if (lab.length) sections.push({ id: 'lab', label: 'Lab' });
  sections.push({ id: 'contact', label: 'Contact' });

  return sections.map((section, index) => ({
    ...section,
    number: String(index).padStart(2, '0'),
    href: onHome ? `#${section.id}` : `/#${section.id}`,
  }));
}

function head({ title, description, canonical, styles, script, ogType = 'website' }) {
  return html`
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="color-scheme" content="light" />
    <meta name="theme-color" content="#15172a" />
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${SITE}${canonical}" />

    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${SITE}${canonical}" />
    <meta property="og:image" content="${SITE}/assets/images/portfolio_icon.png" />
    <meta name="twitter:card" content="summary" />

    <title>${title}</title>
    <link rel="icon" href="/assets/images/portfolio_icon.png" />
    <link rel="apple-touch-icon" href="/assets/images/portfolio_icon.png" />

    <link rel="preload" href="/assets/fonts/Centra/CentraNo2-Bold.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/assets/fonts/Centra/CentraNo2-Book.woff2" as="font" type="font/woff2" crossorigin />

    <!-- Linked separately rather than @import-chained so they download in parallel. -->
    ${join(styles.map((sheet) => html`<link rel="stylesheet" href="/styles/${sheet}" />`))}

    <!--
      Runs before first paint, for two reasons: scroll-reveal elements start
      hidden and would otherwise flash in and back out, and recruiter mode has
      to be applied before anything is painted or the page visibly re-lays out.
    -->
    <script>
      (function () {
        var root = document.documentElement;
        root.classList.remove('no-js');
        try {
          var url = new URL(window.location.href);
          var requested = url.searchParams.get('mode');
          var stored = localStorage.getItem('hs:mode');
          var mode = requested || stored;
          if (mode === 'recruiter') root.setAttribute('data-mode', 'recruiter');
        } catch (error) {
          /* Private mode or a blocked storage API must never break the page. */
        }
      })();
    </script>
    <script type="module" src="/javascript/${script}"></script>
  `;
}

function rail(sections, { current } = {}) {
  return html`
    <button class="system-toggle" type="button" aria-expanded="false" aria-controls="system-nav">
      <span class="system-toggle__mark" aria-hidden="true"></span>
      <span class="system-toggle__label">Index</span>
    </button>

    <div class="system-scrim" aria-hidden="true"></div>

    <aside class="system-nav" id="system-nav" aria-label="Site index">
      <a class="system-nav__identity" href="/" aria-label="Hunter Shapiro — home">
        <span>H<span class="system-nav__thin">S</span></span>
      </a>
      <div class="system-nav__rule" aria-hidden="true"></div>

      <nav aria-label="Sections">
        ${each(
          sections,
          (section) => html`
            <a
              class="system-nav__link${current === section.id ? ' is-current' : ''}"
              href="${section.href}"
              ${attrs({ 'aria-current': current === section.id ? 'true' : null })}
            >
              <span>${section.number}</span>${section.label}
            </a>
          `,
        )}
      </nav>

      <div class="system-nav__external">
        <a href="${profile.links.github.href}" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a>
        <a href="${profile.links.linkedin.href}" target="_blank" rel="noopener noreferrer">LinkedIn ${arrow}</a>
        <a href="${profile.links.resume.href}" target="_blank" rel="noopener noreferrer">Résumé ${arrow}</a>
      </div>
    </aside>
  `;
}

/**
 * The two controls that sit above every page: search, and the recruiter-mode
 * switch. Both are real buttons and both work from the keyboard.
 */
function utility() {
  return html`
    <div class="utility">
      <button
        class="utility__button utility__search"
        type="button"
        data-palette-open
        aria-haspopup="dialog"
        aria-controls="command-palette"
      >
        ${ICONS.search}
        <span class="utility__label">Search</span>
        <kbd class="utility__kbd"><span data-palette-key>Ctrl</span> K</kbd>
      </button>

      <!--
        Both labels ship in the markup and CSS picks one from aria-pressed.
        Rewriting the text from script meant the label could be repainted after
        the webfont had already settled, which occasionally left the button
        looking empty.
      -->
      <button
        class="utility__button utility__mode"
        type="button"
        data-mode-toggle
        aria-pressed="false"
      >
        <span class="utility__dot" aria-hidden="true"></span>
        <span class="utility__label utility__label--off">Recruiter view</span>
        <span class="utility__label utility__label--on">Full site</span>
      </button>
    </div>
  `;
}

/**
 * The command palette's markup ships with the page rather than being built by
 * script, so its semantics are inspectable and it needs no work on first open.
 * The commands themselves are a JSON island generated from content/*.js.
 */
function palette(commands) {
  return html`
    <div class="palette" id="command-palette" hidden>
      <div class="palette__scrim" data-palette-dismiss></div>

      <div class="palette__panel" role="dialog" aria-modal="true" aria-labelledby="palette-title">
        <h2 class="visually-hidden" id="palette-title">Search this site</h2>

        <div class="palette__field">
          <span class="palette__field-icon" aria-hidden="true">${ICONS.search}</span>
          <input
            class="palette__input"
            id="palette-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            aria-label="Search projects, sections and links"
            placeholder="Jump to a project, section or link…"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
          />
          <button class="palette__dismiss" type="button" data-palette-dismiss aria-label="Close search">
            ${ICONS.close}
          </button>
        </div>

        <ul class="palette__list" id="palette-list" role="listbox" aria-label="Results"></ul>

        <p class="palette__empty" hidden>
          Nothing matches that. <span>Try a project name, or “résumé”.</span>
        </p>

        <footer class="palette__footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> to move</span>
          <span><kbd>↵</kbd> to open</span>
          <span><kbd>Esc</kbd> to close</span>
        </footer>
      </div>
    </div>

    <script type="application/json" id="palette-commands">
      ${raw(JSON.stringify(commands))}
    </script>
  `;
}

function footer(sections) {
  return html`
    <footer class="site-footer">
      <div class="site-footer__grid">
        <div>
          <p class="site-footer__wordmark">Hunter Shapiro</p>
          <p class="site-footer__blurb">${profile.credential}</p>
        </div>

        <div>
          <h2>Index</h2>
          <ul>
            ${each(sections, (section) => html`<li><a href="${section.href}">${section.label}</a></li>`)}
          </ul>
        </div>

        <div>
          <h2>Elsewhere</h2>
          <ul>
            <li><a href="/fantasy">Museum of Fantasy Sports ${arrow}</a></li>
            <li>
              <a href="https://recrd.top" target="_blank" rel="noopener noreferrer">RECRD.TOP ${arrow}</a>
            </li>
            <li>
              <a href="${profile.links.github.href}" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a>
            </li>
            <li>
              <a href="${profile.links.linkedin.href}" target="_blank" rel="noopener noreferrer">LinkedIn ${arrow}</a>
            </li>
            <li>
              <a href="${profile.links.resume.href}" target="_blank" rel="noopener noreferrer">Résumé (PDF) ${arrow}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="site-footer__baseline">
        <p>Written by hand · No framework</p>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  `;
}

/** Wrap page content in the shell. */
export function page({
  title,
  description,
  canonical,
  styles,
  script,
  sections,
  current,
  commands,
  bodyClass,
  ogType,
  content,
}) {
  return `<!DOCTYPE html>
<html lang="en" class="no-js" id="top">
  <head>
${esc(head({ title, description, canonical, styles, script, ogType }))}
  </head>

  <body${bodyClass ? ` class="${esc(bodyClass)}"` : ''}>
    <a class="skip-link" href="#main">Skip to content</a>

${esc(rail(sections, { current }))}
${esc(utility())}

    <main id="main">
${esc(content)}
    </main>

${esc(footer(sections))}
${esc(palette(commands))}
  </body>
</html>
`;
}

export { SITE };
