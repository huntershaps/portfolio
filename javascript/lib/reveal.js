import { qsa, prefersReducedMotion } from './dom.js';

/**
 * Reveals `[data-reveal]` elements as they enter the viewport.
 *
 * Elements start hidden in CSS, so anything the observer never reaches would
 * stay invisible. Reduced-motion users and browsers without IntersectionObserver
 * are shown everything immediately instead.
 */
export function initReveal(scope = document) {
  // Skip anything already shown — this runs again whenever a gallery re-renders.
  const targets = qsa('[data-reveal]', scope).filter((node) => !node.classList.contains('is-revealed'));
  if (!targets.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((target) => observer.observe(target));
}
