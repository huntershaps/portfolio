import { qs, qsa } from './dom.js';

/**
 * Gallery lightbox.
 *
 * Uses a real <dialog>, so the modal semantics, the backdrop, Escape and the
 * focus trap come from the platform rather than from this file. Without
 * `showModal` support the thumbnails simply stay thumbnails.
 */
export function initGallery(scope = document) {
  const dialog = qs('[data-lightbox]', scope);
  const triggers = qsa('[data-gallery-open]', scope);
  if (!dialog || !triggers.length || typeof dialog.showModal !== 'function') return;

  const image = qs('.lightbox__image', dialog);
  let opener = null;

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      opener = trigger;
      image.src = trigger.dataset.gallerySrc;
      image.alt = trigger.dataset.galleryAlt || '';
      dialog.showModal();
    });
  });

  /**
   * Close, and drop the source so a large image is not held behind a hidden
   * dialog. Every dismissal path calls this rather than relying on the `close`
   * event alone, so the cleanup does not depend on event ordering.
   */
  function dismiss() {
    if (dialog.open) dialog.close();
    image.removeAttribute('src');
    if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    opener = null;
  }

  qsa('[data-lightbox-close]', dialog).forEach((button) =>
    button.addEventListener('click', dismiss),
  );

  // Clicking the backdrop closes it: outside the image is outside the content.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dismiss();
  });

  // Escape closes the dialog natively, without going through dismiss().
  dialog.addEventListener('close', dismiss);
}
