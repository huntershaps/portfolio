import { qs, qsa } from './lib/dom.js';
import { initNavigation } from './lib/nav.js';
import { initReveal } from './lib/reveal.js';
import { initMediaFrames } from './lib/mediaFrame.js';
import { initContactForm } from './contactForm.js';

initNavigation();
initReveal();
initMediaFrames();
initContactForm();
initOpeningPoles();
initVenn();
initQuestions();

/**
 * Generic single-select toggle group. Reads its copy from the DOM rather than
 * from a parallel object in this file, so the text lives in exactly one place
 * and cannot drift out of sync with the markup.
 */
function initToggleGroup(buttons, onSelect) {
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle('is-selected', selected);
        candidate.setAttribute('aria-pressed', String(selected));
      });
      onSelect(button);
    });
  });
}

/* 00 — the two poles in the opening. */
function initOpeningPoles() {
  const response = qs('.opening__response');
  const poles = qsa('.identity-pole');
  if (!response || !poles.length) return;

  initToggleGroup(poles, (button) => {
    response.textContent = button.dataset.response;
  });
}

/* 01 — the Venn. One set of controls drives both the desktop diagram and the
   small-screen list; the container's data attribute drives the mobile glyph. */
function initVenn() {
  const venn = qs('.venn');
  const readout = qs('.venn__readout');
  const keys = qsa('[data-venn]');
  if (!venn || !readout || !keys.length) return;

  const title = qs('strong', readout);
  const body = qs('span', readout);

  initToggleGroup(keys, (button) => {
    venn.dataset.vennActive = button.dataset.venn;
    title.textContent = qs('.venn__key-title', button).textContent;
    body.textContent = button.dataset.vennDetail;
  });
}

/* 04 — questions, as a proper disclosure group. */
function initQuestions() {
  const items = qsa('.question-list__item');

  const sync = () => {
    items.forEach((item) => {
      const open = item.classList.contains('is-open');
      qs('.question-list__trigger', item)?.setAttribute('aria-expanded', String(open));
      // Collapsed answers must not be tabbable or announced, whatever the
      // height animation happens to be doing at that instant.
      const panel = qs('.question-list__panel', item);
      if (panel) panel.inert = !open;
    });
  };

  items.forEach((item) => {
    const trigger = qs('.question-list__trigger', item);
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      items.forEach((candidate) => candidate.classList.remove('is-open'));
      if (willOpen) item.classList.add('is-open');
      sync();
    });
  });

  sync();
}
