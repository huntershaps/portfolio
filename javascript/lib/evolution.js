import { qs, qsa } from './dom.js';

/**
 * The design-evolution stepper.
 *
 * A tablist over the published versions of a project. Arrow keys move between
 * versions with roving tabindex, which is what the pattern expects and what
 * makes it usable without a mouse.
 */
export function initEvolution(scope = document) {
  qsa('[data-evolution]', scope).forEach(setup);
}

function setup(root) {
  const tabs = qsa('[data-evolution-tab]', root);
  const panels = qsa('[role="tabpanel"]', root);
  if (tabs.length < 2 || tabs.length !== panels.length) return;

  function select(index, { focus = false } = {}) {
    // The other frames are lazy so they cost nothing on load. Once someone
    // starts stepping through them, waiting for a fetch is the wrong trade.
    const image = panels[index].querySelector('img');
    if (image) image.loading = 'eager';

    tabs.forEach((tab, position) => {
      const active = position === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[position].hidden = !active;
      panels[position].classList.toggle('is-active', active);
    });
    if (focus) tabs[index].focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));

    tab.addEventListener('keydown', (event) => {
      const last = tabs.length - 1;
      let next = null;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = last;

      if (next === null) return;
      event.preventDefault();
      select(next, { focus: true });
    });
  });
}
