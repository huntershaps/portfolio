/**
 * A project case-study page.
 *
 * The page is assembled from whatever sections a project actually has. A
 * project with two honest sections gets a short, complete page; nothing is
 * padded out, and no heading appears above content that does not exist.
 */

import { html, join, each, when, attrs, arrow, picture, inlineCode } from './html.js';
import { projects } from '../../content/projects.js';
import { mediaFigure, statusChip } from './parts.js';

/* ----------------------------------------------------------------- blocks */

function prose(block) {
  return html`
    <div class="prose${block.lead ? ' prose--lead' : ''}">
      ${each(block.paragraphs, (text, index) =>
        index === 0 && block.lead
          ? html`<p class="prose__lead">${inlineCode(text)}</p>`
          : html`<p>${inlineCode(text)}</p>`,
      )}
      ${when(block.note, () => html`<p class="prose__note">${inlineCode(block.note)}</p>`)}
    </div>
  `;
}

function flow(block) {
  return html`
    <ol class="flow">
      ${each(
        block.steps,
        (step, index) => html`
          <li class="flow__step${index === block.steps.length - 1 ? ' flow__step--end' : ''}">
            <span class="flow__index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
            <h4>${step.title}</h4>
            <p>${inlineCode(step.text)}</p>
          </li>
        `,
      )}
    </ol>
  `;
}

function tenets(block) {
  return html`
    <div class="tenets">
      ${each(
        block.items,
        (item) => html`
          <article class="tenet">
            <h4 class="tenet__title">${item.title}</h4>
            <p>${inlineCode(item.text)}</p>
            ${when(
              item.why,
              () => html`
                <p class="tenet__why"><strong>Why it matters:</strong> ${inlineCode(item.why)}</p>
              `,
            )}
          </article>
        `,
      )}
    </div>
  `;
}

function spec(block) {
  return html`
    <dl class="spec-list">
      ${each(
        block.rows,
        (row) => html`
          <div class="spec-list__row">
            <dt>${row.label}</dt>
            <dd>${inlineCode(row.value)}</dd>
          </div>
        `,
      )}
    </dl>
  `;
}

function list(block) {
  return html`
    <ul class="bullet-list">
      ${each(block.items, (item) => html`<li>${inlineCode(item)}</li>`)}
    </ul>
  `;
}

function gallery(block) {
  // The lightbox opens the WebP rather than the PNG fallback: anything that
  // supports dialog.showModal() supports WebP, and it is a third of the size.
  return html`
    <div class="gallery" data-gallery>
      ${each(
        block.images,
        (image, index) => html`
          <figure class="gallery__item">
            <button
              class="gallery__open"
              type="button"
              data-gallery-open="${index}"
              data-gallery-src="${image.src}.webp"
              data-gallery-alt="${image.alt}"
              aria-label="Enlarge: ${image.alt}"
            >
              ${picture({
                src: image.src,
                alt: image.alt,
                width: image.width,
                height: image.height,
                sizes: '(max-width: 60rem) 80vw, 22rem',
              })}
              <span class="gallery__zoom" aria-hidden="true">Enlarge</span>
            </button>
            ${when(image.caption, () => html`<figcaption>${image.caption}</figcaption>`)}
          </figure>
        `,
      )}
    </div>
  `;
}

/**
 * The design-evolution stepper: one button per version, one stage, captions
 * that change with it. Arrow keys move between versions.
 */
function evolution(block) {
  const frames = block.frames;
  if (!frames.length) return '';

  return html`
    <div class="evolution" data-evolution>
      <div class="evolution__controls" role="tablist" aria-label="Versions">
        ${each(
          frames,
          (frame, index) => html`
            <button
              class="evolution__tab${index === frames.length - 1 ? ' is-active' : ''}"
              type="button"
              role="tab"
              id="evolution-tab-${index}"
              aria-controls="evolution-panel-${index}"
              aria-selected="${index === frames.length - 1 ? 'true' : 'false'}"
              tabindex="${index === frames.length - 1 ? '0' : '-1'}"
              data-evolution-tab="${index}"
            >
              <span class="evolution__tab-label">${frame.label}</span>
              <span class="evolution__tab-when">${frame.when}</span>
            </button>
          `,
        )}
      </div>

      <div class="evolution__stage">
        ${each(
          frames,
          (frame, index) => html`
            <div
              class="evolution__panel${index === frames.length - 1 ? ' is-active' : ''}"
              id="evolution-panel-${index}"
              role="tabpanel"
              aria-labelledby="evolution-tab-${index}"
              ${attrs({ hidden: index !== frames.length - 1 })}
            >
              ${picture({
                src: frame.src,
                alt: frame.alt,
                width: frame.width,
                height: frame.height,
                loading: index === frames.length - 1 ? 'eager' : 'lazy',
                sizes: '(max-width: 60rem) 92vw, 54rem',
              })}
              <p class="evolution__caption">
                <span class="evolution__caption-label">${frame.label} · ${frame.when}</span>
                ${frame.caption}
              </p>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

const BLOCKS = { prose, flow, tenets, spec, list, gallery, evolution };

function renderBlock(block) {
  const render = BLOCKS[block.type];
  if (!render) return '';
  return render(block);
}

/* ------------------------------------------------------------------- page */

function heroMeta(project) {
  const rows = [
    project.role && { label: 'Role', value: project.role },
    project.team && { label: 'Team', value: project.team },
    project.timeline && project.timeline.when && { label: 'When', value: project.timeline.when },
    project.statusNote && { label: 'Status', value: project.statusNote },
  ].filter(Boolean);

  if (!rows.length) return '';

  return html`
    <dl class="work-hero__meta">
      ${each(
        rows,
        (row) => html`
          <div>
            <dt>${row.label}</dt>
            <dd>${row.value}</dd>
          </div>
        `,
      )}
    </dl>
  `;
}

export function projectContent(project) {
  const index = projects.findIndex((candidate) => candidate.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const sections = project.caseStudy || [];

  return html`
    <article class="work-page" data-accent="${project.accent}">
      <header class="work-hero">
        <div class="work-hero__grain" aria-hidden="true"></div>

        <div class="work-hero__text">
          <p class="work-hero__eyebrow">
            <a href="/#work">Work</a> <span aria-hidden="true">/</span> Case study
          </p>

          <h1 class="work-hero__title">${project.name}</h1>
          <p class="work-hero__tagline">${project.tagline}</p>

          <div class="work-hero__status">
            ${statusChip(project.status)}
            <ul class="tag-row tag-row--quiet">
              ${each(project.stack, (tech) => html`<li>${tech}</li>`)}
            </ul>
          </div>

          ${when(
            project.links.length,
            () => html`
              <div class="work-hero__actions">
                ${each(
                  project.links,
                  (link) => html`
                    <a
                      class="button${link.primary ? '' : ' button--ghost'}"
                      href="${link.href}"
                      ${attrs({
                        target: link.external ? '_blank' : null,
                        rel: link.external ? 'noopener noreferrer' : null,
                      })}
                    >
                      ${link.label} ${arrow}
                    </a>
                  `,
                )}
              </div>
            `,
          )}

          ${heroMeta(project)}
        </div>

        ${when(
          project.media,
          () => html`<div class="work-hero__media">${mediaFigure(project, { context: 'hero' })}</div>`,
        )}
      </header>

      ${when(
        sections.length > 1,
        () => html`
          <nav class="work-index" aria-label="On this page">
            <p class="work-index__label">On this page</p>
            <ul>
              ${each(
                sections,
                (section) => html`<li><a href="#${section.id}">${section.title}</a></li>`,
              )}
            </ul>
          </nav>
        `,
      )}

      <div class="work-body">
        ${each(
          sections,
          (section, position) => html`
            <section class="work-section" id="${section.id}" aria-labelledby="${section.id}-title">
              <header class="placard" data-reveal>
                <p class="placard__catalog">${String(position + 1).padStart(2, '0')}</p>
                <h2 class="placard__title" id="${section.id}-title">${section.title}</h2>
                ${when(section.intro, () => html`<p class="placard__note">${section.intro}</p>`)}
              </header>

              <div class="work-section__blocks" data-reveal>
                ${each(section.blocks, (block) => renderBlock(block))}
              </div>
            </section>
          `,
        )}
      </div>

      <nav class="work-next" aria-label="More work">
        <a class="work-next__link" href="/work/${next.slug}">
          <span class="work-next__label">Next project</span>
          <span class="work-next__title">${next.name} ${arrow}</span>
          <span class="work-next__tagline">${next.tagline}</span>
        </a>
        <a class="rule-link work-next__all" href="/#work">All work ${arrow}</a>
      </nav>
    </article>

    <dialog class="lightbox" data-lightbox aria-label="Enlarged image">
      <button class="lightbox__close" type="button" data-lightbox-close aria-label="Close image">
        <span aria-hidden="true">×</span>
      </button>
      <img class="lightbox__image" alt="" />
    </dialog>
  `;
}
