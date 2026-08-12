/**
 * Small DOM helpers shared by both pages. Deliberately tiny — the site has no
 * build step and no framework, and does not need one.
 */

/** @type {(selector: string, scope?: ParentNode) => Element | null} */
export const qs = (selector, scope = document) => scope.querySelector(selector);

/** @type {(selector: string, scope?: ParentNode) => Element[]} */
export const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

/**
 * Build an element from a tag, a props object and children.
 *
 * Children may be nodes or strings; strings always become text nodes. There is
 * deliberately no innerHTML escape hatch — every string that reaches the DOM
 * from the data files goes through `createTextNode`.
 */
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else node.setAttribute(key, value === true ? '' : String(value));
  }

  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

/** Replace every child of `parent` with `children`. */
export function render(parent, ...children) {
  parent.replaceChildren(...children.flat().filter(Boolean));
  return parent;
}

/** Format an ordinal: 1 -> 1st, 12 -> 12th, 23 -> 23rd. */
export function ordinal(n) {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] || 'th'}`;
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
