/**
 * The résumé, as data.
 *
 * ============================ CONTENT RULES ============================
 * Same rule as content/profile.js: every line here is traceable to something
 * real — a job Hunter held, a repository that exists, a design file he made.
 * Nothing is inflated and no number is invented. A metric appears only when
 * Hunter has supplied it.
 *
 * Dates, name, email and links are NOT repeated here. They are imported from
 * profile.js so the PDF and the site can never disagree about them.
 *
 * ---- one page, and one line per bullet --------------------------------
 * The reference résumé keeps almost every bullet to one printed line, which is
 * what makes a dense page still scannable. A bullet over roughly 125
 * characters wraps and costs a line, and the page has no spare lines. Write
 * short first and the layout takes care of itself.
 *
 * `scripts/resume/render.js` turns this into HTML; `npm run resume` prints it
 * to assets/cv.pdf and fails loudly if it no longer fits on one page.
 * =======================================================================
 */

import { profile } from './profile.js';

/** Pull a role out of profile.experience so the dates stay in one place. */
function when(roleName) {
  const found = profile.experience.find((job) => job.role === roleName);
  if (!found) throw new Error(`resume.js: no experience entry for "${roleName}"`);
  return found.when;
}

export const resume = {
  /**
   * No objective or summary block: Hunter dropped it, and the reference résumé
   * does not have one either. The name, the contact line and the Skills
   * section immediately under Education do the positioning instead.
   *
   * The site still carries `profile.objective` for its own hero copy — that
   * one is unaffected by this.
   */

  education: [
    {
      institution: 'University of Central Florida',
      qualification: 'B.S. Computer Science · B.S. Psychology',
      when: 'Graduated August 2026',
      where: 'Orlando, FL',
      note: 'Psi Chi, International Honor Society in Psychology (Spring 2024 – Summer 2026)',
    },
  ],

  /**
   * Experience.
   *
   * TODO(hunter): two blocks here are missing the numbers that would make them
   * land, and they are numbers only you have.
   *
   *   LocalFiber — which interfaces you designed, how many, whether they are
   *   consumer-facing or internal, and roughly how many people use them.
   *
   *   Research Assistant — how many participants you have run, over how many
   *   sessions, how many batteries you are trained to administer, and whether
   *   you have trained or onboarded other assistants.
   */
  experience: [
    {
      organization: 'LocalFiber',
      title: 'UI/UX Design Intern',
      when: when('UI/UX Intern'),
      where: 'Orlando, FL',
      points: [
        'Design interfaces used site-wide at LocalFiber and by multiple leading internet service providers and partner companies',
        'Ship consumer and partner-level pages serving hundreds of users, working across product, engineering and partner teams',
        'Deliver designs that LocalFiber’s internal development teams build from, as the reference for new and existing pages',
        'Keep shipped screens accessible: contrast, focus order, keyboard navigation and touch targets, working from shared design tokens',
      ],
    },
    {
      organization: 'University of Central Florida',
      title: 'Research Assistant — NIH-funded cognitive aging and driving study',
      when: when('Research Assistant'),
      where: 'Orlando, FL',
      points: [
        'Tested 100 adults aged 65+ in an NIH study asking whether in-car sensors and cameras can catch cognitive decline early',
        'Ran 4+ hour sessions per participant, administering standardised cognitive, memory and reaction-time batteries to protocol',
        'Analysed the results and entered them into the study database used to track decline in cognitive aptitude over time',
        'Guided older adults through timed, computer-administered tasks, where instruction clarity and pacing decided if the data was usable',
      ],
    },
    {
      organization: 'University of Central Florida',
      title: 'Undergraduate Teaching Assistant',
      when: when('Teaching Assistant'),
      where: 'Orlando, FL',
      points: [
        'Graded and reviewed hundreds of assignments across two semesters for Health Psychology, a course of 300+ students',
      ],
    },
  ],

  /**
   * Projects, in the reference résumé's format: name, a stack line, then
   * bullets. Every one has a page on the site, so the slug travels with it and
   * the résumé and the portfolio can be checked against each other.
   */
  projects: [
    {
      slug: 'recrd-top',
      name: 'recrd.top',
      stack: 'Figma, React.js, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, Spotify Web API',
      points: [
        'Led a 5-person team to create recrd.top, a social media platform for ranking music albums',
        'Developed a web-scraping script to ingest 10,000+ music albums from the Spotify Web API into MongoDB',
        'Implemented user authentication with email verification using JWT tokens, bcrypt hashing, and SendGrid',
        'Reduced LCP by ~63% (3s to 1.1s) by minifying and deferring non-critical JS',
      ],
    },
    {
      slug: 'museum-of-fantasy-sports',
      name: 'Museum of Fantasy Sports',
      stack: 'Next.js, React.js, TypeScript, PostgreSQL, Prisma, Auth.js, Tailwind CSS',
      points: [
        'Built a league-history platform turning a fantasy league’s seasons into browsable standings, records and rivalries',
        'Modelled leagues, seasons, matchups and franchises in PostgreSQL with Prisma so records survive team renames',
        'Implemented authentication and per-league access control with Auth.js',
      ],
    },
    {
      slug: 'wishwell',
      name: 'Wishwell',
      stack: 'Next.js, React.js, TypeScript, Tailwind CSS, SQLite, Playwright',
      points: [
        'Built a social wishlist and gifting app on a two-ground design system that stays readable in light and dark themes',
        'Implemented a server-enforced claim system returning different data to the list owner than to everyone else',
        'Wrote Playwright end-to-end tests covering the add-item and claim-gift flows',
      ],
    },
    {
      slug: 'mahou-learning',
      name: 'Mahou Learning',
      stack: 'React Native, Expo, TypeScript, NativeWind, SQLite, Reanimated, Skia',
      points: [
        'Designed the UI for a six-person Japanese learning app: home, companion, settings, cards and a memory minigame',
        'Conducted user research on spaced-repetition scheduling and home-screen retention, then rebuilt both around it',
        'Migrated the app’s styling to NativeWind and built a token-driven theming system used by every screen',
        'Added the accessibility assets users asked for in research',
      ],
    },
  ],

  /**
   * Skills, grouped the way the reference résumé groups them and drawn from
   * what the projects above actually use. Each line is meant to stay on one
   * printed line.
   */
  skills: [
    { label: 'Languages', items: 'TypeScript, JavaScript, HTML/CSS, SQL, Python, Java, C' },
    {
      label: 'Frameworks',
      items: 'React, Next.js, React Native, Expo, Node.js, Express, Tailwind CSS, NativeWind, Auth.js',
    },
    { label: 'Data & Tools', items: 'Figma, PostgreSQL, SQLite, MongoDB, Git, Netlify, Playwright, Jira' },
  ],
};
