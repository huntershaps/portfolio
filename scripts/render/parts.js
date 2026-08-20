/**
 * Pieces shared between the homepage and the case-study pages, so a project's
 * preview and its status badge look and behave identically wherever they land.
 */

import { html, when, attrs, picture, arrow } from './html.js';

/**
 * A status badge. The vocabulary is deliberately small and qualitative —
 * there are no invented percentages anywhere on this site.
 */
export function statusChip(status) {
  if (!status) return '';
  const tone = status.toLowerCase().replace(/[^a-z]+/g, '-');
  return html`<span class="status-chip" data-status="${tone}">
    <span class="status-chip__dot" aria-hidden="true"></span>${status}
  </span>`;
}

/**
 * A project's preview.
 *
 * Videos keep the behaviour the previous site established: nothing is fetched
 * until the frame scrolls into view, and the poster with its play button stays
 * as the way in when autoplay is refused or motion is not wanted.
 */
export function mediaFigure(project, { context = 'card' } = {}) {
  const media = project.media;

  if (!media) {
    return html`
      <div class="media-empty" data-context="${context}">
        <span class="media-empty__mark" aria-hidden="true"></span>
        <p class="media-empty__text">No public preview yet</p>
      </div>
    `;
  }

  if (media.type === 'door') {
    // The door leads wherever the project's first link goes — an app mounted on
    // this domain, or a repository somewhere else. An off-site one opens in its
    // own tab, the same as every other external link on the site.
    const destination = project.links[0];
    return html`
      <a
        class="museum-door"
        ${attrs({
          href: destination ? destination.href : '#',
          target: destination && destination.external ? '_blank' : null,
          rel: destination && destination.external ? 'noopener noreferrer' : null,
        })}
      >
        <span class="museum-door__eyebrow">${media.label}</span>
        <span class="museum-door__title">${project.name}</span>
        <span class="museum-door__enter" aria-hidden="true">${media.enter} <span>↗</span></span>
      </a>
    `;
  }

  if (media.type === 'video') {
    return html`
      <figure
        class="media-frame${media.tall ? ' media-frame--tall' : ''}"
        data-media-frame
        ${attrs({ 'data-media-fallback-href': media.fallbackHref || null })}
        style="--media-ratio: ${media.ratio}"
      >
        <div class="media-frame__bar" aria-hidden="true">
          <i></i><i></i><i></i>
          <p>${media.barLabel}</p>
        </div>

        <div class="media-frame__stage">
          ${when(
            media.poster,
            () => html`
              <div class="media-frame__poster">
                ${picture({
                  src: media.poster,
                  alt: '',
                  width: media.posterWidth,
                  height: media.posterHeight,
                  loading: context === 'hero' ? 'eager' : 'lazy',
                  sizes: '(max-width: 60rem) 80vw, 26rem',
                })}
              </div>
            `,
          )}

          <button class="media-frame__play" type="button">
            <span class="media-frame__play-mark" aria-hidden="true"></span>
            <span class="media-frame__play-label">${media.playLabel}</span>
            <span class="media-frame__play-hint">${media.playHint}</span>
          </button>

          <video
            class="media-frame__video"
            data-src="${media.src}"
            preload="none"
            playsinline
            loop
            muted
            aria-label="${media.alt}"
          ></video>
        </div>
      </figure>
    `;
  }

  return '';
}
