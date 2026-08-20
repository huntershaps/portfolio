import { qs, qsa, el } from './dom.js';
import { setMode, isRecruiterMode } from './mode.js';

/**
 * The command palette.
 *
 * Its contents are generated from the same content files as the pages, so it
 * cannot list something the site does not have. Entries either navigate
 * somewhere real or run one of two actions — there are no decorative commands.
 *
 * It follows the combobox/listbox pattern: the input keeps DOM focus and owns
 * `aria-activedescendant`, the list is a listbox, and the highlighted row is
 * the only option with `aria-selected="true"`.
 */

const OPEN_KEY = 'k';
const MAX_RESULTS = 40;

export function initPalette() {
  const root = qs('#command-palette');
  const dataNode = qs('#palette-commands');
  if (!root || !dataNode) return;

  let commands = [];
  try {
    commands = JSON.parse(dataNode.textContent);
  } catch {
    return; // A malformed island should disable search, not break the page.
  }

  const input = qs('.palette__input', root);
  const list = qs('.palette__list', root);
  const empty = qs('.palette__empty', root);
  const openers = qsa('[data-palette-open]');

  let results = [];
  let activeIndex = 0;
  let lastFocused = null;

  /* --- platform label -------------------------------------------------- */
  const isApple = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
  qsa('[data-palette-key]').forEach((node) => {
    node.textContent = isApple ? '⌘' : 'Ctrl';
  });

  /* --- searching -------------------------------------------------------- */

  /** Sections that recruiter mode has hidden must not be offered. */
  function isReachable(command) {
    if (!command.target) return true;
    if (!isRecruiterMode()) return true;
    const section = document.getElementById(command.target);
    // getClientRects() is empty for a `display: none` ancestor.
    return Boolean(section && section.getClientRects().length);
  }

  function score(command, query) {
    const haystacks = [command.title, command.subtitle, ...(command.keywords || [])];
    let best = -1;
    for (const [index, text] of haystacks.entries()) {
      if (!text) continue;
      const position = text.toLowerCase().indexOf(query);
      if (position === -1) continue;
      // Title matches beat keyword matches; earlier matches beat later ones.
      const value = 1000 - index * 50 - position - (position === 0 ? 0 : 20);
      if (value > best) best = value;
    }
    return best;
  }

  function search(rawQuery) {
    const query = rawQuery.trim().toLowerCase();
    const reachable = commands.filter(isReachable);
    if (!query) return reachable.slice(0, MAX_RESULTS);

    return reachable
      .map((command) => ({ command, value: score(command, query) }))
      .filter((entry) => entry.value >= 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, MAX_RESULTS)
      .map((entry) => entry.command);
  }

  /** Wrap the matched run in <mark>, without ever inserting raw HTML. */
  function highlight(text, query) {
    if (!query) return [text];
    const position = text.toLowerCase().indexOf(query);
    if (position === -1) return [text];
    return [
      text.slice(0, position),
      el('mark', {}, text.slice(position, position + query.length)),
      text.slice(position + query.length),
    ];
  }

  /* --- rendering -------------------------------------------------------- */

  function render(query = '') {
    list.replaceChildren();
    results.length = 0;

    const found = search(query);
    const lower = query.trim().toLowerCase();
    let lastGroup = null;

    found.forEach((command) => {
      if (command.group !== lastGroup) {
        lastGroup = command.group;
        list.append(el('li', { class: 'palette__group', role: 'presentation' }, command.group));
      }

      const option = el(
        'li',
        {
          class: 'palette__option',
          role: 'option',
          id: `palette-option-${results.length}`,
          'aria-selected': 'false',
        },
        el('span', { class: 'palette__option-title' }, ...highlight(command.title, lower)),
        command.subtitle
          ? el('span', { class: 'palette__option-subtitle' }, command.subtitle)
          : null,
        el('span', { class: 'palette__option-kind' }, command.external ? 'External' : command.group),
      );

      const index = results.length;
      option.addEventListener('click', () => run(index));
      option.addEventListener('mousemove', () => setActive(index));

      results.push({ command, option });
      list.append(option);
    });

    const nothing = results.length === 0;
    empty.hidden = !nothing;
    list.hidden = nothing;

    activeIndex = 0;
    if (!nothing) setActive(0);
    else input.removeAttribute('aria-activedescendant');
  }

  function setActive(index) {
    if (!results.length) return;
    activeIndex = (index + results.length) % results.length;
    results.forEach(({ option }, position) => {
      const active = position === activeIndex;
      option.setAttribute('aria-selected', String(active));
      if (active) {
        input.setAttribute('aria-activedescendant', option.id);
        option.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  /* --- running a command ------------------------------------------------ */

  async function run(index) {
    const entry = results[index];
    if (!entry) return;
    const { command } = entry;

    if (command.action === 'recruiter') {
      close();
      setMode(isRecruiterMode() ? null : 'recruiter');
      return;
    }

    if (command.action === 'copy-email') {
      const email = command.subtitle;
      try {
        await navigator.clipboard.writeText(email);
        flash('Email address copied');
      } catch {
        // Clipboard access can be refused; the address is still on the page.
        flash(`Copy failed. The address is ${email}`);
      }
      close();
      return;
    }

    if (!command.href) return;
    close();

    if (command.external) {
      window.open(command.href, '_blank', 'noopener,noreferrer');
      return;
    }

    window.location.assign(command.href);
  }

  /** A short, polite status message for actions with no visible result. */
  function flash(message) {
    let region = qs('#palette-flash');
    if (!region) {
      region = el('p', { id: 'palette-flash', class: 'visually-hidden', role: 'status' });
      document.body.append(region);
    }
    region.textContent = message;
  }

  /* --- opening and closing ---------------------------------------------- */

  function open() {
    if (!root.hidden) return;
    lastFocused = document.activeElement;
    root.hidden = false;
    document.body.classList.add('is-palette-open');
    openers.forEach((button) => button.setAttribute('aria-expanded', 'true'));
    input.value = '';
    render('');
    input.focus();
  }

  function close() {
    if (root.hidden) return;
    root.hidden = true;
    document.body.classList.remove('is-palette-open');
    openers.forEach((button) => button.setAttribute('aria-expanded', 'false'));
    // Returning focus to <body> would strand a keyboard user, so anything
    // that is not a real focusable element falls back to the search button.
    const restoreTo =
      lastFocused instanceof HTMLElement && lastFocused.isConnected && lastFocused !== document.body
        ? lastFocused
        : openers[0];
    restoreTo?.focus();
    lastFocused = null;
  }

  openers.forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', open);
  });

  qsa('[data-palette-dismiss]', root).forEach((node) => node.addEventListener('click', close));

  input.addEventListener('input', () => render(input.value));

  input.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActive(activeIndex + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActive(activeIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        setActive(0);
        break;
      case 'End':
        event.preventDefault();
        setActive(results.length - 1);
        break;
      case 'Enter':
        event.preventDefault();
        run(activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      default:
        break;
    }
  });

  // The panel is a modal dialog, so Tab must not escape it. There is only ever
  // one tab stop inside besides the input, which keeps this simple.
  root.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusables = qsa('input, button', root).filter((node) => node.offsetParent !== null);
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

  document.addEventListener('keydown', (event) => {
    const inField =
      event.target instanceof HTMLElement &&
      (event.target.matches('input, textarea, select') || event.target.isContentEditable);

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === OPEN_KEY) {
      event.preventDefault();
      root.hidden ? open() : close();
      return;
    }

    // "/" is a search shortcut people expect, but only when they are not
    // already typing something.
    if (event.key === '/' && !inField && root.hidden) {
      event.preventDefault();
      open();
    }
  });
}
