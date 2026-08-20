/**
 * The homepage.
 *
 * Sections are rendered from content/*.js. Anything with no real content
 * behind it — an empty lab, a project without a date — does not render at all,
 * which is what keeps the page honest as the content files change.
 */

import { html, join, each, when, attrs, arrow, picture, inlineCode } from './html.js';
import { profile, buildTimeline } from '../../content/profile.js';
import { projects, archive, lab, currentlyBuilding, featured } from '../../content/projects.js';
import { mediaFigure, statusChip } from './parts.js';

/* ---------------------------------------------------------------- 00 start */

function opening() {
  const building = currentlyBuilding();
  const current = profile.experience.find((job) => job.current);
  const school = profile.education[0];

  return html`
    <section class="opening" id="start" aria-labelledby="opening-title">
      <div class="opening__grain" aria-hidden="true"></div>

      <div class="opening__inner">
        <div class="opening__lede">
          <h1 class="opening__title" id="opening-title">
            <span data-reveal>HUNTER</span>
            <span class="opening__title-accent" data-reveal>SHAPIRO</span>
          </h1>

          <p class="opening__statement" data-reveal>
            I studied <em>psychology and computer science</em> because I care about both sides of
            technology: the people using it, and the systems being built.
          </p>

          <div class="opening__actions" data-reveal>
            <a class="button" href="#work">See the work ${arrow}</a>
            <a class="button button--ghost" href="${profile.links.resume.href}" target="_blank" rel="noopener noreferrer">
              Résumé (PDF) ${arrow}
            </a>
          </div>
        </div>

        <!-- The facts a recruiter looks for first, before they scroll at all.
             Both entries are read from profile.js, not written here. -->
        <aside class="opening__card" data-reveal aria-label="At a glance">
          ${when(
            current,
            () => html`
              <div class="opening__card-row">
                <p class="opening__card-label">Now</p>
                <p class="opening__card-value">
                  ${current.role}${when(current.organization, () => html` · ${current.organization}`)}
                </p>
                <p class="opening__card-note">${current.when}</p>
              </div>
            `,
          )}

          <div class="opening__card-row">
            <p class="opening__card-label">Studied</p>
            <p class="opening__card-value">${school.qualifications.join(' · ')}</p>
            <p class="opening__card-note">${school.institution} · ${school.detail}</p>
          </div>

          <div class="opening__card-links">
            <a href="${profile.links.github.href}" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a>
            <a href="${profile.links.linkedin.href}" target="_blank" rel="noopener noreferrer">LinkedIn ${arrow}</a>
            <a href="mailto:${profile.email}">Email ${arrow}</a>
          </div>
        </aside>
      </div>

      ${when(
        building.length,
        () => html`
          <p class="opening__now" data-reveal>
            <span class="opening__now-pulse" aria-hidden="true"></span>
            <span class="opening__now-label">Currently building</span>
            ${join(
              building.map((project) => html`<a href="/work/${project.slug}">${project.name}</a>`),
              '<span aria-hidden="true">·</span>',
            )}
          </p>
        `,
      )}

      <a class="scroll-prompt" href="#building">
        <span class="scroll-prompt__line" aria-hidden="true"></span>What I am working on
      </a>
    </section>
  `;
}

/* ------------------------------------------------------------- 01 building */

function building() {
  const items = currentlyBuilding();
  if (!items.length) return '';

  return html`
    <section class="section-shell building" id="building" aria-labelledby="building-title">
      <header class="section-head" data-reveal>
        <p class="section-number">01</p>
        <h2 id="building-title">Currently<br /><em>building.</em></h2>
        <p class="section-head__note">
          What is open on this machine right now. Status is where each one honestly stands, not a
          percentage.
        </p>
      </header>

      <ul class="build-list">
        ${each(
          items,
          (project) => html`
            <li class="build-card" data-accent="${project.accent}" data-reveal>
              <div class="build-card__top">
                ${statusChip(project.status)}
                ${when(
                  project.timeline && project.timeline.when,
                  () => html`<span class="build-card__when">${project.timeline.when}</span>`,
                )}
              </div>

              <h3 class="build-card__title">
                <a href="/work/${project.slug}">${project.name}</a>
              </h3>
              <p class="build-card__tagline">${project.tagline}</p>

              ${when(
                project.statusNote,
                () => html`<p class="build-card__note">${project.statusNote}</p>`,
              )}

              <ul class="tag-row tag-row--quiet">
                ${each(project.stack.slice(0, 4), (tech) => html`<li>${tech}</li>`)}
                ${when(
                  project.stack.length > 4,
                  () => html`<li class="tag-row__more">+${project.stack.length - 4}</li>`,
                )}
              </ul>

              <p class="build-card__cta"><span>Read the case study</span> ${arrow}</p>
            </li>
          `,
        )}
      </ul>
    </section>
  `;
}

/* ----------------------------------------------------------------- 02 work */

function projectCard(project, index) {
  const number = String(index + 1).padStart(2, '0');
  const externals = project.links.filter((link) => link.external);

  return html`
    <article class="project-card" data-accent="${project.accent}" data-reveal>
      <div class="project-card__visual">
        ${mediaFigure(project, { context: 'card' })}
      </div>

      <div class="project-card__body">
        <div class="project-card__meta">
          <span class="project-card__index" aria-hidden="true">${number}</span>
          ${statusChip(project.status)}
          ${when(project.team, () => html`<span class="project-card__team">${project.team}</span>`)}
        </div>

        <h3 class="project-card__title">
          <a class="project-card__link" href="/work/${project.slug}">${project.name}</a>
        </h3>

        <p class="project-card__tagline">${project.tagline}</p>

        ${when(
          project.role,
          () => html`
            <p class="project-card__role"><span>My role</span>${project.role}</p>
          `,
        )}

        <ul class="tag-row">
          ${each(project.stack, (tech) => html`<li>${tech}</li>`)}
        </ul>

        <div class="project-card__actions">
          <span class="project-card__cta">Case study ${arrow}</span>
          ${each(
            externals,
            (link) => html`
              <a
                class="project-card__external"
                href="${link.href}"
                target="_blank"
                rel="noopener noreferrer"
              >
                ${link.label} ${arrow}
              </a>
            `,
          )}
        </div>
      </div>
    </article>
  `;
}

function work() {
  const items = featured();

  return html`
    <section class="section-shell work on-dark" id="work" aria-labelledby="work-title">
      <header class="section-head section-head--wide" data-reveal>
        <p class="section-number">02</p>
        <h2 id="work-title">Selected<br /><em>work.</em></h2>
        <p class="section-head__note">
          Each one opens into a case study: the problem, the build, the decisions and where it
          actually stands.
        </p>
      </header>

      <div class="project-grid">${each(items, (project, index) => projectCard(project, index))}</div>

      <p class="work__all" data-reveal>
        Everything else lives in the <a href="#archive">archive</a>.
      </p>
    </section>
  `;
}

/* ----------------------------------------------------------------- 03 path */

function path() {
  const entries = buildTimeline(projects);
  if (!entries.length) return '';

  return html`
    <section class="section-shell path" id="path" aria-labelledby="path-title">
      <header class="section-head" data-reveal>
        <p class="section-number">03</p>
        <h2 id="path-title">The<br /><em>path.</em></h2>
        <p class="section-head__note">
          Study, work and projects on one line. Every date here comes off the résumé or a
          repository's history.
        </p>
      </header>

      <ol class="timeline">
        ${each(
          entries,
          (entry) => html`
            <li class="timeline__entry" data-kind="${entry.kind}" data-reveal>
              <details class="timeline__details" ${attrs({ open: Boolean(entry.current) })}>
                <summary class="timeline__summary">
                  <span class="timeline__marker" aria-hidden="true"></span>
                  <span class="timeline__when">
                    ${entry.when}${when(
                      entry.current,
                      () => html`<span class="timeline__live">Now</span>`,
                    )}
                  </span>
                  <span class="timeline__headline">
                    <span class="timeline__kind">${entry.kindLabel}</span>
                    <span class="timeline__title">${entry.title}</span>
                    ${when(
                      entry.subtitle,
                      () => html`<span class="timeline__subtitle">${entry.subtitle}</span>`,
                    )}
                  </span>
                  <span class="timeline__sign" aria-hidden="true"></span>
                </summary>

                <div class="timeline__panel">
                  ${when(
                    entry.points && entry.points.length,
                    () => html`
                      <ul class="timeline__points">
                        ${each(entry.points, (point) => html`<li>${point}</li>`)}
                      </ul>
                    `,
                  )}
                  ${when(
                    entry.href,
                    () => html`
                      <a class="rule-link timeline__link" href="${entry.href}">
                        Open the case study ${arrow}
                      </a>
                    `,
                  )}
                </div>
              </details>
            </li>
          `,
        )}
      </ol>
    </section>
  `;
}

/* -------------------------------------------------------------- 04 toolkit */

function toolkit() {
  const named = new Map(projects.map((project) => [project.slug, project]));

  return html`
    <section class="section-shell toolkit" id="toolkit" aria-labelledby="toolkit-title">
      <header class="section-head" data-reveal>
        <p class="section-number">04</p>
        <h2 id="toolkit-title">The<br /><em>toolkit.</em></h2>
        <p class="section-head__note">
          Grouped, and pointed at the projects that actually use them. A tool with nothing next to
          it is one I have used, but not on anything published here.
        </p>
      </header>

      <div class="skill-groups">
        ${each(
          profile.skillGroups,
          (group) => html`
            <section class="skill-group" data-reveal aria-labelledby="skills-${group.id}">
              <h3 class="skill-group__title" id="skills-${group.id}">${group.title}</h3>
              <ul class="skill-group__list">
                ${each(
                  group.skills,
                  (skill) => html`
                    <li class="skill${skill.projects.length ? '' : ' skill--bare'}">
                      <span class="skill__name">${skill.name}</span>
                      ${when(
                        skill.projects.length,
                        () => html`
                          <span class="skill__uses">
                            ${join(
                              skill.projects
                                .map((slug) => named.get(slug))
                                .filter(Boolean)
                                .map(
                                  (project) => html`
                                    <a href="/work/${project.slug}">${project.shortName || project.name}</a>
                                  `,
                                ),
                            )}
                          </span>
                        `,
                      )}
                    </li>
                  `,
                )}
              </ul>
            </section>
          `,
        )}
      </div>
    </section>
  `;
}

/* ---------------------------------------------------------- 05 perspective */

function perspective() {
  return html`
    <section class="section-shell perspective" id="perspective" aria-labelledby="perspective-title">
      <header class="section-head" data-reveal>
        <p class="section-number">05</p>
        <h2 id="perspective-title">Both<br /><em>sides.</em></h2>
        <p class="section-head__note">
          People bring expectations, habits and goals to technology. Software brings structure,
          possibility and constraints. I am interested in where those meet.
        </p>
      </header>

      <div class="venn" data-venn-active="psychology" data-reveal>
        <h3 class="visually-hidden">Three overlapping interests</h3>

        <div class="venn__glyph" aria-hidden="true">
          <span></span><span></span><span></span>
          <span class="venn__glyph-core"></span>
        </div>

        <div class="venn__stage">
          <button
            class="venn__key venn__key--psychology is-selected"
            type="button"
            aria-pressed="true"
            data-venn="psychology"
            data-venn-detail="How people learn, make sense of choices, and form expectations around an experience."
          >
            <span class="venn__key-title">Psychology</span>
            <span class="venn__key-note">People &amp; behaviour</span>
          </button>

          <button
            class="venn__key venn__key--computing"
            type="button"
            aria-pressed="false"
            data-venn="computing"
            data-venn-detail="The systems behind an experience, from structure to interaction, and the work of building them."
          >
            <span class="venn__key-title">Computer science</span>
            <span class="venn__key-note">Systems &amp; building</span>
          </button>

          <button
            class="venn__key venn__key--interaction"
            type="button"
            aria-pressed="false"
            data-venn="interaction"
            data-venn-detail="The point where technology has to feel clear, useful, and worth returning to."
          >
            <span class="venn__key-title">Human interaction</span>
            <span class="venn__key-note">How it feels to use</span>
          </button>

          <p class="venn__core" aria-hidden="true">What I am<br />drawn to</p>
        </div>

        <p class="venn__readout" aria-live="polite">
          <strong>Psychology</strong>
          <span>How people learn, make sense of choices, and form expectations around an experience.</span>
        </p>
      </div>

      <div class="question-list" data-reveal>
        <h3 class="question-list__title">Questions I keep coming back to</h3>
        ${each(
          profile.questions,
          (item, index) => html`
            <div class="question-list__item${index === 0 ? ' is-open' : ''}">
              <h4>
                <button
                  class="question-list__trigger"
                  type="button"
                  aria-expanded="${index === 0 ? 'true' : 'false'}"
                  aria-controls="answer-${index + 1}"
                >
                  <span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
                  <strong>${item.question}</strong>
                  <span class="question-list__sign" aria-hidden="true"></span>
                </button>
              </h4>
              <div class="question-list__panel" id="answer-${index + 1}" role="region">
                <div><p>${item.answer}</p></div>
              </div>
            </div>
          `,
        )}
      </div>
    </section>
  `;
}

/* -------------------------------------------------------------- 06 archive */

function archiveSection() {
  if (!archive.length) return '';

  return html`
    <section class="section-shell archive" id="archive" aria-labelledby="archive-title">
      <header class="section-head" data-reveal>
        <p class="section-number">06</p>
        <h2 id="archive-title">The<br /><em>archive.</em></h2>
        <p class="section-head__note">
          Earlier versions, kept rather than deleted. Each screenshot is a render of that actual
          commit.
        </p>
      </header>

      <ul class="archive-list">
        ${each(
          archive,
          (item) => html`
            <li class="archive-card" data-reveal>
              <a class="archive-card__media" href="${item.href}" tabindex="-1" aria-hidden="true">
                ${picture({
                  src: item.image.src,
                  alt: '',
                  width: item.image.width,
                  height: item.image.height,
                  sizes: '(max-width: 60rem) 90vw, 30rem',
                })}
              </a>
              <div class="archive-card__body">
                <p class="archive-card__when">
                  ${item.when} <span class="archive-card__ref">${item.ref}</span>
                </p>
                <h3 class="archive-card__title"><a href="${item.href}">${item.title}</a></h3>
                <p class="archive-card__summary">${item.summary}</p>
                <ul class="tag-row tag-row--quiet">
                  ${each(item.tech, (tech) => html`<li>${tech}</li>`)}
                </ul>
              </div>
            </li>
          `,
        )}
      </ul>
    </section>
  `;
}

/* ------------------------------------------------------------------ 07 lab */

function labSection() {
  // Renders nothing at all while the lab is empty — see content/projects.js.
  if (!lab.length) return '';

  return html`
    <section class="section-shell lab" id="lab" aria-labelledby="lab-title">
      <header class="section-head" data-reveal>
        <p class="section-number">07</p>
        <h2 id="lab-title">The<br /><em>lab.</em></h2>
        <p class="section-head__note">
          Smaller experiments and technical explorations that do not warrant a case study.
        </p>
      </header>

      <ul class="lab-list">
        ${each(
          lab,
          (item) => html`
            <li class="lab-card" data-reveal>
              <p class="lab-card__kind">${item.kind}${when(item.when, () => html` · ${item.when}`)}</p>
              <h3 class="lab-card__title">
                ${when(
                  item.href,
                  () => html`<a href="${item.href}">${item.title}</a>`,
                )}
                ${when(!item.href, () => html`${item.title}`)}
              </h3>
              <p class="lab-card__summary">${item.summary}</p>
              ${when(
                item.tech && item.tech.length,
                () => html`
                  <ul class="tag-row tag-row--quiet">
                    ${each(item.tech, (tech) => html`<li>${tech}</li>`)}
                  </ul>
                `,
              )}
            </li>
          `,
        )}
      </ul>
    </section>
  `;
}

/* -------------------------------------------------------------- recruiter */

/**
 * The recruiter view: everything a hiring decision needs, in one scan, with no
 * scrolling through case studies to find it. Hidden until the mode is on.
 */
function dossier() {
  const strongest = projects.filter((project) => project.featured || project.building);

  return html`
    <section class="dossier" id="dossier" data-recruiter aria-labelledby="dossier-title">
      <div class="dossier__head">
        <div>
          <h1 class="dossier__name" id="dossier-title">Hunter Shapiro</h1>
          <p class="dossier__headline">${profile.headline}</p>
          <p class="dossier__credential">${profile.credential}</p>
        </div>

        <ul class="dossier__links">
          <li>
            <a class="button button--compact" href="${profile.links.resume.href}" target="_blank" rel="noopener noreferrer">
              Résumé (PDF) ${arrow}
            </a>
          </li>
          <li><a class="dossier__link" href="mailto:${profile.email}">${profile.email}</a></li>
          <li>
            <a class="dossier__link" href="${profile.links.github.href}" target="_blank" rel="noopener noreferrer">
              GitHub ${arrow}
            </a>
          </li>
          <li>
            <a class="dossier__link" href="${profile.links.linkedin.href}" target="_blank" rel="noopener noreferrer">
              LinkedIn ${arrow}
            </a>
          </li>
        </ul>
      </div>

      <div class="dossier__grid">
        <section class="dossier__block" aria-labelledby="dossier-experience">
          <h3 class="dossier__block-title" id="dossier-experience">Experience</h3>
          <ul class="dossier__rows">
            ${each(
              profile.experience,
              (job) => html`
                <li class="dossier__row">
                  <p class="dossier__row-when">${job.when}</p>
                  <div>
                    <p class="dossier__row-title">
                      ${job.role}${when(job.organization, () => html` · <span>${job.organization}</span>`)}
                    </p>
                    <ul class="dossier__points">
                      ${each(job.points, (point) => html`<li>${point}</li>`)}
                    </ul>
                  </div>
                </li>
              `,
            )}
          </ul>
        </section>

        <section class="dossier__block" aria-labelledby="dossier-education">
          <h3 class="dossier__block-title" id="dossier-education">Education</h3>
          <ul class="dossier__rows">
            ${each(
              profile.education,
              (school) => html`
                <li class="dossier__row">
                  <p class="dossier__row-when">${school.when}</p>
                  <div>
                    <p class="dossier__row-title">${school.institution}</p>
                    <ul class="dossier__points">
                      ${each(school.qualifications, (item) => html`<li>${item}</li>`)}
                      ${when(school.detail, () => html`<li>${school.detail}</li>`)}
                    </ul>
                  </div>
                </li>
              `,
            )}
          </ul>
        </section>

        <section class="dossier__block dossier__block--wide" aria-labelledby="dossier-projects">
          <h3 class="dossier__block-title" id="dossier-projects">Projects</h3>
          <ul class="dossier__projects">
            ${each(
              strongest,
              (project) => html`
                <li class="dossier__project">
                  <div class="dossier__project-head">
                    <a class="dossier__project-name" href="/work/${project.slug}">${project.name}</a>
                    ${statusChip(project.status)}
                  </div>
                  <p class="dossier__project-tagline">${project.tagline}</p>
                  ${when(
                    project.role,
                    () => html`<p class="dossier__project-role">${project.role}</p>`,
                  )}
                  <p class="dossier__project-stack">${project.stack.join(' · ')}</p>
                  ${when(
                    project.links.length,
                    () => html`
                      <p class="dossier__project-links">
                        ${join(
                          project.links.map(
                            (link) => html`
                              <a
                                href="${link.href}"
                                ${attrs({
                                  target: link.external ? '_blank' : null,
                                  rel: link.external ? 'noopener noreferrer' : null,
                                })}
                                >${link.label} ${arrow}</a
                              >
                            `,
                          ),
                        )}
                      </p>
                    `,
                  )}
                </li>
              `,
            )}
          </ul>
        </section>

        <section class="dossier__block dossier__block--wide" aria-labelledby="dossier-skills">
          <h3 class="dossier__block-title" id="dossier-skills">Skills</h3>
          <ul class="dossier__skills">
            ${each(
              profile.skillGroups,
              (group) => html`
                <li>
                  <span class="dossier__skills-group">${group.title}</span>
                  <span class="dossier__skills-list"
                    >${group.skills.map((skill) => skill.name).join(', ')}</span
                  >
                </li>
              `,
            )}
          </ul>
        </section>
      </div>
    </section>
  `;
}

/* -------------------------------------------------------------- 08 contact */

function contact() {
  return html`
    <section class="section-shell contact" id="contact" aria-labelledby="contact-title">
      <div class="contact__layout">
        <div data-reveal>
          <p class="section-number section-number--light">08</p>
          <h2 id="contact-title">Let's<br /><em>talk.</em></h2>
          <p class="contact__invitation">
            If you are thinking about people, technology, or a project where the two meet, I would
            love to hear from you.
          </p>

          <div class="contact__direct-links">
            <a href="mailto:${profile.email}">${profile.email} ${arrow}</a>
            <a href="${profile.links.github.href}" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a>
            <a href="${profile.links.linkedin.href}" target="_blank" rel="noopener noreferrer">LinkedIn ${arrow}</a>
            <a href="${profile.links.resume.href}" target="_blank" rel="noopener noreferrer">Résumé (PDF) ${arrow}</a>
          </div>
        </div>

        <form class="contact__form" id="sendForm" novalidate data-reveal>
          <h3 class="visually-hidden">Send me a message</h3>

          <label for="name">Your name</label>
          <input type="text" name="name" id="name" autocomplete="name" />

          <label for="email">Email address <span aria-hidden="true">*</span></label>
          <input
            type="email"
            name="email"
            id="email"
            autocomplete="email"
            required
            aria-required="true"
            aria-describedby="email-error"
          />
          <p class="contact__error" id="email-error"></p>

          <label for="message">Message <span aria-hidden="true">*</span></label>
          <textarea id="message" name="message" rows="5" required aria-required="true" aria-describedby="message-error"></textarea>
          <p class="contact__error" id="message-error"></p>

          <div class="contact__trap" aria-hidden="true">
            <label for="company">Company (leave this empty)</label>
            <input type="text" name="company" id="company" tabindex="-1" autocomplete="off" />
          </div>

          <button class="contact__submit" type="submit" id="sendButton">
            <span class="contact__spinner" aria-hidden="true"></span>
            <span class="contact__submit-label">Send message</span>
          </button>

          <p class="contact__status hide" id="form__info" role="status">
            <span id="form__popup-txt"></span>
          </p>
        </form>
      </div>
    </section>
  `;
}

/* ---------------------------------------------------------------- assembly */

export function homeContent() {
  return join([
    dossier(),
    html`<div data-immersive>
      ${opening()} ${building()} ${work()} ${path()} ${toolkit()} ${perspective()} ${archiveSection()}
      ${labSection()}
    </div>`,
    contact(),
  ]);
}
