import { qs, qsa } from './dom.js';

const DRAWER_QUERY = '(max-width: 60rem)';
const FOCUSABLE = 'a[href], button:not(:disabled), input, textarea, select, [tabindex]:not([tabindex="-1"])';

/**
 * Wires the site index: a fixed rail on desktop, a modal drawer below 60rem.
 *
 * The drawer is a real dialog as far as assistive tech is concerned — it is
 * inert while closed, traps Tab while open, closes on Escape or scrim click,
 * and returns focus to the toggle it came from.
 */
export function initNavigation() {
  const nav = qs('.system-nav');
  const toggle = qs('.system-toggle');
  const scrim = qs('.system-scrim');
  if (!nav || !toggle) return;

  const drawer = window.matchMedia(DRAWER_QUERY);
  const label = qs('.system-toggle__label', toggle);
  let lastFocused = null;

  const isOpen = () => nav.classList.contains('is-open');

  function syncInert() {
    // Off-canvas links must not be reachable by keyboard or screen reader.
    nav.inert = drawer.matches && !isOpen();
  }

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    scrim?.classList.toggle('is-active', open);
    document.body.classList.toggle('is-nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Close' : 'Index';
    syncInert();

    if (open) {
      lastFocused = document.activeElement;
      qs(FOCUSABLE, nav)?.focus();
    } else {
      // Focus must never be left stranded on the now-inert drawer.
      const restoreTo =
        lastFocused instanceof HTMLElement && lastFocused.isConnected && lastFocused !== document.body
          ? lastFocused
          : toggle;
      restoreTo.focus();
      lastFocused = null;
    }
  }

  toggle.addEventListener('click', () => setOpen(!isOpen()));
  scrim?.addEventListener('click', () => setOpen(false));

  // Following a link inside the drawer should close it.
  qsa('a', nav).forEach((link) => {
    link.addEventListener('click', () => {
      if (drawer.matches && isOpen()) setOpen(false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (!drawer.matches || !isOpen()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key !== 'Tab') return;
    const focusables = qsa(FOCUSABLE, nav).filter((node) => node.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Crossing the breakpoint while open would leave the page scroll-locked.
  drawer.addEventListener('change', () => {
    if (!drawer.matches && isOpen()) setOpen(false);
    else syncInert();
  });

  syncInert();
  initScrollSpy(nav);
}

/**
 * Highlights the index entry for whichever section is currently in view.
 * Only same-page hash links participate; cross-page links are left alone.
 */
function initScrollSpy(nav) {
  const links = qsa('.system-nav__link[href^="#"]', nav);
  const sections = links
    .map((link) => ({ link, section: qs(link.getAttribute('href')) }))
    .filter((entry) => entry.section);

  if (!sections.length) return;

  const setCurrent = (link) => {
    sections.forEach(({ link: candidate }) => {
      const current = candidate === link;
      candidate.classList.toggle('is-current', current);
      if (current) candidate.setAttribute('aria-current', 'true');
      else candidate.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const match = sections.find(({ section }) => section === visible.target);
      if (match) setCurrent(match.link);
    },
    { rootMargin: '-40% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach(({ section }) => observer.observe(section));
}
