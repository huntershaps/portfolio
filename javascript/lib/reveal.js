import { qsa, prefersReducedMotion } from './dom.js';

/**
 * Reveals `[data-reveal]` elements as they enter the viewport.
 *
 * Elements start hidden in CSS, which makes this module load-bearing: anything
 * the observer never reaches would stay invisible. So there are three ways out.
 *
 *  1. Reduced motion, or no IntersectionObserver — everything shows at once.
 *  2. The observer, in the normal case.
 *  3. A deadline. IntersectionObserver reports nothing while a tab is hidden
 *     (a background tab, a prerender, a headless capture). If the observer has
 *     not reported anything by the time the deadline passes, the animation is
 *     abandoned and the content is shown.
 *
 * Content being visible always wins over content being animated.
 */

const FAILSAFE_MS = 2500;

export function initReveal(scope = document) {
  // Skip anything already shown — this runs again whenever a gallery re-renders.
  const targets = qsa('[data-reveal]', scope).filter((node) => !node.classList.contains('is-revealed'));
  if (!targets.length) return;

  const showAll = () => targets.forEach((target) => target.classList.add('is-revealed'));

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  let observed = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observed = true;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );

  targets.forEach((target) => observer.observe(target));

  window.setTimeout(() => {
    if (observed) return;
    observer.disconnect();
    showAll();
  }, FAILSAFE_MS);
}
