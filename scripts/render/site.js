/**
 * Every route the site has, and the command list the palette searches.
 *
 * build.js writes these to disk; server.js serves the same objects in
 * development. There is no third place where a page can be defined.
 */

import { page, navSections } from './layout.js';
import { homeContent } from './home.js';
import { projectContent } from './project.js';
import { profile } from '../../content/profile.js';
import { projects, lab } from '../../content/projects.js';

const DESCRIPTION =
  'Hunter Shapiro — UI/UX and interaction design, with a background in computer science and psychology.';

/**
 * The palette's index. Built from the same content as the pages, so a project
 * cannot exist on the site but be missing from search.
 *
 * Nothing decorative is added here: every entry goes somewhere real.
 */
function commands({ onHome }) {
  const sections = navSections({ lab, onHome: false }).map((section) => ({
    id: `section:${section.id}`,
    title: section.label,
    subtitle: 'Section',
    group: 'Sections',
    href: `/#${section.id}`,
    target: section.id,
    keywords: [section.label, section.number],
  }));

  const projectCommands = projects.map((project) => ({
    id: `project:${project.slug}`,
    title: project.name,
    subtitle: project.tagline,
    group: 'Projects',
    href: `/work/${project.slug}`,
    keywords: [project.name, project.shortName, project.status, ...project.stack].filter(Boolean),
  }));

  const links = [
    {
      id: 'link:resume',
      title: 'Résumé',
      subtitle: 'PDF',
      group: 'Links',
      href: profile.links.resume.href,
      external: true,
      keywords: ['resume', 'cv', 'download'],
    },
    {
      id: 'link:github',
      title: 'GitHub',
      subtitle: 'github.com/huntershaps',
      group: 'Links',
      href: profile.links.github.href,
      external: true,
      keywords: ['github', 'code', 'source'],
    },
    {
      id: 'link:linkedin',
      title: 'LinkedIn',
      subtitle: 'Profile',
      group: 'Links',
      href: profile.links.linkedin.href,
      external: true,
      keywords: ['linkedin', 'profile'],
    },
    {
      id: 'link:email',
      title: 'Email Hunter',
      subtitle: profile.email,
      group: 'Links',
      href: `mailto:${profile.email}`,
      keywords: ['email', 'contact', 'mail', 'hire'],
    },
  ];

  const actions = [
    {
      id: 'action:recruiter',
      title: 'Toggle recruiter view',
      subtitle: 'A dense, scannable summary',
      group: 'Actions',
      action: 'recruiter',
      keywords: ['recruiter', 'hiring', 'summary', 'mode', 'scan'],
    },
    {
      id: 'action:copy-email',
      title: 'Copy email address',
      subtitle: profile.email,
      group: 'Actions',
      action: 'copy-email',
      keywords: ['copy', 'email', 'clipboard'],
    },
  ];

  return [...projectCommands, ...sections, ...links, ...actions];
}

function homePage() {
  return page({
    title: 'Hunter Shapiro — UI/UX & Interaction Design',
    description: DESCRIPTION,
    canonical: '/',
    styles: ['tokens.css', 'base.css', 'components.css', 'chrome.css', 'home.css'],
    script: 'index.js',
    sections: navSections({ lab, onHome: true }),
    current: 'start',
    commands: commands({ onHome: true }),
    content: homeContent(),
  });
}

function workPage(project) {
  return page({
    title: `${project.name} — Hunter Shapiro`,
    description: project.tagline,
    canonical: `/work/${project.slug}`,
    styles: ['tokens.css', 'base.css', 'components.css', 'chrome.css', 'work.css'],
    script: 'work.js',
    sections: navSections({ lab, onHome: false }),
    current: 'work',
    commands: commands({ onHome: false }),
    bodyClass: 'work',
    ogType: 'article',
    content: projectContent(project),
  });
}

/**
 * Every route, as `{ '/path': htmlString }`.
 * Paths are URL paths; build.js turns them into files.
 */
export function routes() {
  const map = { '/': homePage() };
  for (const project of projects) {
    map[`/work/${project.slug}`] = workPage(project);
  }
  return map;
}
