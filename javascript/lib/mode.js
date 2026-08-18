import { qs, qsa, el } from './dom.js';

/**
 * Recruiter mode.
 *
 * Not a restyling of the page — a different page. The immersive sections are
 * taken out of the layout and the dossier, which is always in the markup,
 * takes their place. That means it works with CSS alone and survives a reload:
 * the choice is stored, and an inline script in <head> applies it before the
 * first paint so nothing visibly re-lays out.
 *
 * The mode is also reflected in the URL, so a link to the scannable version
 * can be sent to someone.
 */

const STORAGE_KEY = 'hs:mode';
const RECRUITER = 'recruiter';

export const isRecruiterMode = () =>
  document.documentElement.getAttribute('data-mode') === RECRUITER;

function announce(message) {
  let region = qs('#mode-status');
  if (!region) {
    region = el('p', { id: 'mode-status', class: 'visually-hidden', role: 'status' });
    document.body.append(region);
  }
  region.textContent = message;
}

/**
 * Only `aria-pressed` is written. Which label shows follows from it in CSS, so
 * there is no text for script to repaint and nothing to get out of step.
 */
function syncButtons() {
  const on = isRecruiterMode();
  qsa('[data-mode-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(on));
  });
}

/** `mode` is 'recruiter' or null. */
export function setMode(mode) {
  const root = document.documentElement;

  if (mode === RECRUITER) root.setAttribute('data-mode', RECRUITER);
  else root.removeAttribute('data-mode');

  try {
    if (mode) localStorage.setItem(STORAGE_KEY, mode);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Storage can be unavailable; the mode still applies for this page view. */
  }

  // Keep the address bar honest without adding a history entry per toggle.
  try {
    const url = new URL(window.location.href);
    if (mode) url.searchParams.set('mode', mode);
    else url.searchParams.delete('mode');
    window.history.replaceState({}, '', url);
  } catch {
    /* Ignore: a failed URL update must not block the mode change. */
  }

  syncButtons();
  announce(
    mode === RECRUITER
      ? 'Recruiter view on. A condensed summary of experience, education, projects and skills.'
      : 'Full site restored.',
  );

  // Coming back from a summary to a long page mid-scroll is disorienting.
  window.scrollTo({ top: 0, behavior: 'auto' });
}

export function initMode() {
  syncButtons();

  qsa('[data-mode-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      setMode(isRecruiterMode() ? null : RECRUITER);
    });
  });
}
