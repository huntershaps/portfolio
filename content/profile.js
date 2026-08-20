/**
 * Who Hunter is, as data.
 *
 * ============================ CONTENT RULES ============================
 * Everything in this file is transcribed from a real source: the résumé in
 * assets/cv.pdf, or a link that already existed on the site. Nothing here is
 * inferred, rounded up, or written to sound better than the source.
 *
 * Where a fact does not exist, the field is `null` and carries a TODO. The
 * renderer omits null fields entirely, so an empty field never reaches the page,
 * so leaving one unanswered is always safe.
 * =======================================================================
 */

export const profile = {
  name: 'Hunter Shapiro',
  initials: 'HS',

  /**
   * Source: the OBJECTIVE line of the résumé, kept close to his own wording.
   * The headline is the first clause; `objective` is the full sentence.
   */
  headline: 'Aspiring UI/UX designer with a background in computer science and psychology',
  objective:
    'Aspiring UI/UX designer with a background in computer science and psychology, focused ' +
    'on creating intuitive, human-centered digital experiences. Seeking an internship to ' +
    'apply skills in user research, interaction design, and problem solving.',

  /**
   * The line under the name. Kept factual: degrees and institution only, both
   * straight from the résumé.
   */
  credential: 'B.S. Computer Science · B.S. Psychology, University of Central Florida',

  // TODO(hunter): add a city if you want one shown. Not on the résumé, so it
  // is omitted rather than guessed.
  location: null,

  email: 'hunter@sflinsider.com',

  links: {
    github: { label: 'GitHub', href: 'https://github.com/huntershaps' },
    linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hunter-shapiro-4192b52a9/' },
    resume: { label: 'Résumé', href: '/assets/cv.pdf', note: 'PDF' },
    email: { label: 'Email', href: 'mailto:hunter@sflinsider.com' },
  },

  /**
   * Education, from the EDUCATION block of the résumé.
   * The résumé now reads "Graduated: Summer 2026" (it previously said
   * "Expected"), so the site says graduated too.
   */
  education: [
    {
      institution: 'University of Central Florida',
      qualifications: ['B.S. Computer Science', 'B.S. Psychology'],
      detail: 'Graduated Summer 2026',
      start: '2026-08', // used only for timeline ordering
      end: '2026-08',
      when: 'Summer 2026',
    },
    {
      institution: 'UCF Psi Chi',
      qualifications: ['National Psychology Honors Society'],
      detail: null,
      start: '2024-01',
      end: '2026-08',
      when: 'Spring 2024 to Summer 2026',
    },
  ],

  /**
   * Experience, from the EXPERIENCE block of the résumé, plus the LocalFiber
   * internship Hunter supplied directly.
   *
   * The résumé does not name an employer for the Research Assistant or
   * Teaching Assistant roles; Hunter confirmed both were at the University of
   * Central Florida.
   */
  experience: [
    {
      role: 'UI/UX Intern',
      organization: 'LocalFiber',
      start: '2026-06',
      end: null, // ongoing
      when: 'Jun 2026 to Present',
      current: true,
      points: [
        'Collaborated with a team to iterate on, create, and implement user interfaces and designs',
        'Maintained accessible and usable interfaces',
      ],
    },
    {
      role: 'Research Assistant',
      organization: 'University of Central Florida',
      start: '2025-02',
      end: '2026-02',
      when: 'Feb 2025 to Feb 2026',
      points: ['Administered cognitive, memory, and response time tests on senior drivers'],
    },
    {
      role: 'Teaching Assistant',
      organization: 'University of Central Florida',
      start: '2025-05',
      end: '2025-12',
      when: 'May 2025 to Dec 2025',
      points: [
        'Worked in collaboration grading and reviewing student assignments, providing thorough feedback',
      ],
    },
    {
      role: 'JD Sports Associate',
      organization: 'JD Sports',
      start: '2024-05',
      end: '2026-01',
      when: 'May 2024 to Jan 2026',
      points: [
        'Assisted customers by identifying needs and recommending solutions',
        'Improved in-store worker experience by organizing layouts based on worker behavior',
      ],
    },
  ],

  /**
   * Skills, grouped, with each one pointing at the projects that actually use
   * it. `projects` holds project slugs from projects.js.
   *
   * A skill with an empty `projects` array is listed on the résumé but has no
   * project on this site demonstrating it. The UI shows it plainly, with no
   * links, rather than inventing a connection.
   */
  skillGroups: [
    {
      id: 'languages',
      title: 'Languages',
      skills: [
        { name: 'TypeScript', projects: ['mahou-learning', 'museum-of-fantasy-sports', 'cardhouse'] },
        { name: 'JavaScript', projects: ['portfolio'] },
        { name: 'SQL', projects: ['museum-of-fantasy-sports', 'cardhouse'] },
        { name: 'HTML & CSS', projects: ['portfolio'] },
        { name: 'Java', projects: [] },
        { name: 'Python', projects: [] },
        { name: 'C', projects: [] },
      ],
    },
    {
      id: 'frameworks',
      title: 'Frameworks',
      skills: [
        { name: 'React', projects: ['mahou-learning', 'museum-of-fantasy-sports', 'cardhouse'] },
        { name: 'Next.js', projects: ['museum-of-fantasy-sports', 'cardhouse'] },
        { name: 'React Native · Expo', projects: ['mahou-learning'] },
        { name: 'Node.js', projects: ['portfolio'] },
      ],
    },
    {
      id: 'data',
      title: 'Data',
      skills: [
        { name: 'PostgreSQL', projects: ['museum-of-fantasy-sports', 'cardhouse'] },
        { name: 'Prisma', projects: ['museum-of-fantasy-sports', 'cardhouse'] },
        { name: 'SQLite', projects: ['mahou-learning'] },
      ],
    },
    {
      id: 'design',
      title: 'Design & UX',
      skills: [
        { name: 'Figma', projects: ['recrd-top', 'mahou-learning'] },
        { name: 'Wireframing', projects: ['recrd-top'] },
        { name: 'Prototyping', projects: ['recrd-top'] },
        { name: 'Accessibility testing', projects: ['portfolio'] },
        { name: 'User research', projects: [] },
        { name: 'Usability testing', projects: [] },
      ],
    },
    {
      id: 'tools',
      title: 'Tools',
      skills: [
        { name: 'Git', projects: [] },
        { name: 'Tailwind CSS', projects: ['museum-of-fantasy-sports', 'cardhouse'] },
        { name: 'Auth.js', projects: ['museum-of-fantasy-sports', 'cardhouse'] },
        { name: 'Netlify', projects: ['portfolio', 'museum-of-fantasy-sports'] },
        { name: 'Microsoft Office Suite', projects: [] },
      ],
    },
  ],

  /**
   * The questions section, existing site copy carried over unchanged.
   */
  questions: [
    {
      question: 'What makes a learning interface actually engaging?',
      answer:
        'Mahou Learning sits inside this question: the difference between a lesson someone ' +
        'finishes and one they come back to.',
    },
    {
      question: 'How do people build mental models of complex systems?',
      answer:
        'I am interested in the exact moment a system stops feeling arbitrary and starts making ' +
        'sense, and in what an interface did to get someone there.',
    },
    {
      question: 'How should AI adapt to the way humans think?',
      answer:
        'A question about technology, behaviour, and responsibility, and about who is expected ' +
        'to do the adapting.',
    },
    {
      question: 'What makes an interaction feel clear, not just functional?',
      answer:
        'Plenty of interfaces work. Fewer of them tell you what just happened, what will happen ' +
        'next, and what to do if you were wrong.',
    },
  ],
};

/**
 * The timeline is assembled from the education, experience and project records
 * rather than typed out again, so a date can only ever be wrong in one place.
 * Anything without a real date simply does not appear.
 */
export function buildTimeline(projects) {
  const entries = [];

  for (const job of profile.experience) {
    entries.push({
      kind: 'experience',
      kindLabel: 'Experience',
      title: job.role,
      subtitle: job.organization,
      when: job.when,
      sort: job.start,
      current: Boolean(job.current),
      points: job.points,
    });
  }

  for (const school of profile.education) {
    entries.push({
      kind: 'education',
      kindLabel: 'Education',
      title: school.institution,
      subtitle: school.qualifications.join(' · '),
      when: school.when,
      sort: school.start,
      points: school.detail ? [school.detail] : [],
    });
  }

  for (const project of projects) {
    if (!project.timeline || !project.timeline.start) continue;
    entries.push({
      kind: 'project',
      kindLabel: 'Project',
      title: project.name,
      subtitle: project.tagline,
      when: project.timeline.when,
      sort: project.timeline.start,
      current: Boolean(project.timeline.current),
      href: `/work/${project.slug}`,
      points: project.timeline.points || [],
    });
  }

  // Most recent first. Ongoing entries sort above finished ones that started
  // in the same month.
  return entries.sort((a, b) => {
    if (a.sort === b.sort) return Number(b.current) - Number(a.current);
    return a.sort < b.sort ? 1 : -1;
  });
}
