/**
 * The smallest possible template layer.
 *
 * Every string that comes from content/*.js is escaped on the way into the
 * markup. `raw()` is the single, explicit escape hatch, used only for markup
 * this codebase generated itself — never for content.
 */

const ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

class Raw {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

/** Mark a string as already-safe markup. */
export const raw = (value) => new Raw(value);

/** Escape a value for use in text or an attribute. */
export function esc(value) {
  if (value instanceof Raw) return value.value;
  if (value === null || value === undefined || value === false) return '';
  return String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

/**
 * Tagged template that escapes every interpolation.
 * Arrays are joined, `raw()` values pass through untouched, null/false vanish.
 */
export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    out += Array.isArray(value) ? value.map(esc).join('') : esc(value);
    out += strings[i + 1];
  }
  return raw(out);
}

/** Join a list of rendered chunks. */
export const join = (parts, separator = '\n') =>
  raw(parts.filter(Boolean).map((part) => esc(part)).join(separator));

/** Render `items` with `fn`, dropping anything falsy. */
export const each = (items, fn) => join((items || []).map(fn).filter(Boolean));

/** Only render when `condition` is truthy. */
export const when = (condition, fn) => (condition ? fn() : '');

/** Build a class attribute from strings and conditionals. */
export const cx = (...parts) => parts.filter(Boolean).join(' ');

/**
 * Build an attribute string. Null, undefined and false drop the attribute
 * entirely; true renders it bare.
 */
export function attrs(map) {
  const out = [];
  for (const [key, value] of Object.entries(map)) {
    if (value === null || value === undefined || value === false) continue;
    if (value === true) out.push(key);
    else out.push(`${key}="${esc(value)}"`);
  }
  return raw(out.length ? ' ' + out.join(' ') : '');
}

/**
 * Inline `code` spans written as `backticks` in the content files.
 * Content is escaped first, so this can only ever produce <code> from a
 * literal backtick pair that the author typed.
 */
export function inlineCode(text) {
  return raw(esc(text).replace(/`([^`]+)`/g, '<code>$1</code>'));
}

/**
 * A responsive image with a WebP source and its original as the fallback.
 * `src` is given without an extension: '/assets/images/x' finds x.webp / x.png.
 */
export function picture({ src, alt, width, height, className, loading = 'lazy', sizes }) {
  if (!src) return '';
  return html`
    <picture>
      <source srcset="${src}.webp" type="image/webp" />
      <img
        ${attrs({
          src: `${src}.png`,
          alt: alt || '',
          width,
          height,
          class: className,
          loading,
          decoding: 'async',
          sizes,
        })}
      />
    </picture>
  `;
}

/** The one arrow used across the site, so it is identical everywhere. */
export const arrow = raw('<span class="arrow" aria-hidden="true">↗</span>');

export const ICONS = {
  search: raw(
    '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">' +
      '<circle cx="9" cy="9" r="5.25" stroke="currentColor" stroke-width="1.6"/>' +
      '<path d="M13 13l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  ),
  close: raw(
    '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">' +
      '<path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  ),
  enter: raw(
    '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">' +
      '<path d="M4 10h10a2 2 0 0 0 2-2V5" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M7 7l-3 3 3 3" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ),
};
