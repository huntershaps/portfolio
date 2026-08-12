import { qs, qsa, el } from './dom.js';

/**
 * Click-to-play video windows.
 *
 * The project previews are 40–50 MB and tracked with Git LFS. Autoplaying them
 * cost every visitor — especially on a phone — the whole download before they
 * had decided they wanted it, and left an empty black box whenever LFS had not
 * been fetched. Each frame now shows a designed poster until it is asked to
 * play, and states plainly what happened if the source will not load.
 */
export function initMediaFrames(scope = document) {
  qsa('[data-media-frame]', scope).forEach(setupFrame);
}

function setupFrame(frame) {
  const trigger = qs('.media-frame__play', frame);
  const video = qs('video', frame);
  if (!trigger || !video) return;

  const source = video.dataset.src;

  trigger.addEventListener('click', () => {
    if (!video.src && source) video.src = source;
    frame.classList.add('is-playing');
    video.controls = true;
    video.play().catch(() => {
      /* Autoplay refusal is fine — the controls are visible. */
    });
  });

  video.addEventListener(
    'error',
    () => {
      frame.classList.remove('is-playing');
      showFallback(frame, video);
    },
    { once: true }
  );
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
        : null
    )
  );
}
