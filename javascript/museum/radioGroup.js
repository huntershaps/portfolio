import { qsa } from '../lib/dom.js';

/**
 * A single-select group of buttons with proper radio semantics: one stop in the
 * tab order, arrow keys to move between options, Home/End to jump.
 *
 * Used for both the league switcher and the season rail — they behave the same
 * way, so they share the behaviour rather than each inventing it.
 *
 * @param {HTMLElement} container       Gets role="radiogroup".
 * @param {object}   options
 * @param {string}   options.label      Accessible name for the group.
 * @param {HTMLElement[]} options.items Buttons, each with `dataset.value`.
 * @param {string}   options.value      Currently selected value.
 * @param {(value: string) => void} options.onChange
 */
export function createRadioGroup(container, { label, items, value, onChange }) {
  container.setAttribute('role', 'radiogroup');
  container.setAttribute('aria-label', label);
  container.replaceChildren(...items);

  const select = (next, { focus = false } = {}) => {
    items.forEach((item) => {
      const active = item.dataset.value === next;
      item.setAttribute('role', 'radio');
      item.setAttribute('aria-checked', String(active));
      item.tabIndex = active ? 0 : -1;
      item.classList.toggle('is-active', active);
      if (active && focus) item.focus();
    });
  };

  items.forEach((item) => {
    item.addEventListener('click', () => {
      if (item.dataset.value === value) return;
      value = item.dataset.value;
      select(value);
      onChange(value);
    });
  });

  container.addEventListener('keydown', (event) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;

    const index = items.findIndex((item) => item.dataset.value === value);
    let next = index;

    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % items.length;
    else next = (index - 1 + items.length) % items.length;

    event.preventDefault();
    value = items[next].dataset.value;
    select(value, { focus: true });
    onChange(value);
  });

  select(value);
  return { select: (next) => { value = next; select(next); } };
}

/**
 * A multi-state filter bar (All / …). Plain toggle buttons — no radio
 * semantics, because these read as a set of filters rather than one choice.
 */
export function createFilterBar(container, { label, items, value, onChange }) {
  container.setAttribute('role', 'group');
  container.setAttribute('aria-label', label);
  container.replaceChildren(...items);

  const sync = (next) => {
    qsa('button', container).forEach((button) => {
      const active = button.dataset.value === next;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
    });
  };

  items.forEach((item) => {
    item.addEventListener('click', () => {
      value = item.dataset.value;
      sync(value);
      onChange(value);
    });
  });

  sync(value);
}
