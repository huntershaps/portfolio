import { qs, qsa, el, prefersReducedMotion } from './dom.js';

/**
 * Project preview windows.
 *
 * A frame starts as a designed poster and begins playing when it scrolls into
 * view, pausing again once it leaves. Nothing is fetched until that first
 * intersection — the sources are large and `preload="none"` keeps them off the
 * critical path — so a visitor who never reaches the case study never pays for
 * the video.
 *
 * The play button is not decoration: autoplay is refused by some browsers and
 * deliberately skipped for reduced-motion visitors, and in both cases the
 * poster stays put and the button is the way in.
 */
export function initMediaFrames(scope = document) {
  qsa('[data-media-frame]', scope).forEach(setupFrame);
}

const VISIBLE_ENOUGH = 0.35;

function setupFrame(frame) {
  const trigger = qs('.media-frame__play', frame);
  const video = qs('video', frame);
  if (!video) return;

  const source = video.dataset.src;
  let failed = false;

  // Ambient playback: muted and looping is what makes autoplay permissible at
  // all, and playsinline stops iOS taking the video fullscreen.
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  const start = () => {
    if (failed) return;
    if (!video.src && source) video.src = source;
    frame.classList.add('is-playing');
    video.controls = true;
    video.play().catch(() => {
      // Autoplay refused — fall back to the poster so there is still a way in.
      if (!failed) frame.classList.remove('is-playing');
    });
  };

  trigger?.addEventListener('click', start);

  video.addEventListener(
    'error',
    () => {
      failed = true;
      frame.classList.remove('is-playing');
      showFallback(frame, video);
    },
    { once: true },
  );

  // Reduced-motion visitors get the poster and the button, never motion they
  // did not ask for.
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= VISIBLE_ENOUGH) start();
        else if (!video.paused) video.pause();
      });
    },
    { threshold: [0, VISIBLE_ENOUGH] },
  );

  observer.observe(frame);
}

function showFallback(frame, video) {
  if (qs('.media-frame__fallback', frame)) return;
  video.remove();

  const link = frame.dataset.mediaFallbackHref;
  qs('.media-frame__stage', frame)?.append(
    el(
      'div',
      { class: 'media-frame__fallback' },
      el('p', {}, 'This preview could not be loaded.'),
      el('p', {}, el('code', {}, 'git lfs pull'), ' fetches the source video.'),
      link
        ? el('p', {}, el('a', { href: link, target: '_blank', rel: 'noopener noreferrer' }, 'Visit the live project ↗'))
        : null,
    ),
  );
}
