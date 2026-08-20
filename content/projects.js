/**
 * Every project, as data. One entry per project; the homepage, the case-study
 * pages, the timeline, the archive and the command palette all read from here.
 *
 * ============================ CONTENT RULES ============================
 * Only write something here if it is true and you can point at where it came
 * from. Sources used so far: the résumé, the previous version of this site,
 * each project's own repository, and Hunter directly.
 *
 * There are no invented metrics, user counts, dates, awards or outcomes
 * anywhere in this file, and there must not be. A missing section is `null`
 * and is skipped by the renderer, so an unfinished case study renders as a
 * shorter page, never as a fabricated one.
 *
 * ---------------------------- HOW TO ADD ONE ----------------------------
 * Copy this skeleton into the array below. Delete any key you have nothing
 * real to put in.
 *
 *   {
 *     slug: 'my-project',            // becomes /work/my-project
 *     name: 'My Project',
 *     tagline: 'One sentence, plainly.',
 *     status: 'In development',      // Concept | Prototype | In development | Live | Completed
 *     statusNote: 'Anything qualifying the status.',
 *     building: true,                // show under "Currently building"
 *     featured: true,                // show in the main work grid
 *     role: 'What you personally did.',
 *     team: null,                    // or 'Team project, N contributors'
 *     stack: ['Thing', 'Other thing'],
 *     links: [{ label: 'Live', href: 'https://…' }],
 *     timeline: { start: '2026-08', when: 'August 2026', current: true, points: [] },
 *     media: null,                   // see the media shapes used below
 *     caseStudy: [                   // only the sections you can fill honestly
 *       { id: 'problem', title: 'The Problem', blocks: [
 *         { type: 'prose', paragraphs: ['…'] },
 *       ]},
 *     ],
 *   }
 *
 * Section ids the design already styles, in their conventional order:
 *   problem · idea · design · build · challenges · decisions · outcome · learned
 *
 * Block types the renderer understands:
 *   prose     { paragraphs: [], lead: bool, note: '…' }
 *   flow      { steps: [{ title, text }] }         numbered process
 *   tenets    { items: [{ title, text, why }] }    principle cards
 *   spec      { rows: [{ label, value }] }         definition list
 *   list      { items: ['…'] }                     plain bullets
 *   gallery   { images: [{ src, alt, caption, width, height }] }
 *   evolution { frames: [{ label, when, src, alt, caption, width, height }] }
 * =======================================================================
 */

export const projects = [
  /* ====================================================================
     Museum of Fantasy Sports
     Source: the existing /museum case study on this site, which Hunter
     wrote and published, plus the repository itself.
     ==================================================================== */
  {
    slug: 'museum-of-fantasy-sports',
    name: 'Museum of Fantasy Sports',
    shortName: 'The Museum',
    tagline:
      'A league history platform that treats a fantasy league’s past as an archive worth keeping.',
    status: 'Live',
    statusNote: 'Deployed at /fantasy · real league import waiting on credentials',
    building: true,
    featured: true,
    role: 'Solo, design and build',
    team: null,
    stack: ['Next.js', 'React.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Auth.js', 'Tailwind CSS'],
    links: [
      { label: 'Open the live app', href: '/fantasy', primary: true },
      { label: 'Source on GitHub', href: 'https://github.com/huntershaps/fantasy_sports', external: true },
    ],
    timeline: {
      start: '2026-08',
      when: 'Aug 2026 to Present',
      current: true,
      points: ['Providers for ESPN and Yahoo, a re-runnable sync, and an engine that derives records'],
    },
    media: { type: 'door', label: 'Live application', enter: 'Enter' },
    accent: 'blue',

    caseStudy: [
      {
        id: 'problem',
        title: 'The Problem',
        blocks: [
          {
            type: 'prose',
            lead: true,
            paragraphs: [
              'Fantasy platforms are built for the season you are in. Last year’s standings are three clicks deep, the year before that is a dead link, and the trade everyone still argues about exists only in a group chat nobody can search.',
              'The interesting part of a long-running league is not this week’s matchup. It is the decade of context around it: who has never won, who wins constantly, which rivalry has a real record behind it and which one is just noise. None of that survives on the platforms themselves.',
              'So the goal was not another stats dashboard. It was somewhere a league’s history is kept deliberately, and served back in a way that means something to whoever is reading it.',
            ],
          },
        ],
      },
      {
        id: 'idea',
        title: 'The Idea',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'League history deserves an archive, not a leaderboard. Champions, records, rivalries and the moments a spreadsheet forgets, imported from ESPN and Yahoo, and kept permanently.',
            ],
          },
        ],
      },
      {
        id: 'build',
        title: 'The Build',
        intro:
          'The frontend never talks to ESPN or Yahoo. Everything is normalised on the way in, so the UI only ever reads one shape.',
        blocks: [
          {
            type: 'flow',
            steps: [
              { title: 'External platform', text: 'ESPN and Yahoo, each behind its own provider with its own authentication story.' },
              { title: 'FantasyProvider', text: 'One interface per platform. Adding a third source means writing a provider, not touching the app.' },
              { title: 'Normalisation', text: 'Platform quirks are resolved here: bench slots, placeholder draft picks, differing season shapes.' },
              { title: 'Database', text: 'One schema, provider-agnostic. Re-importing a season updates in place rather than duplicating it.' },
              { title: 'Event engine', text: 'Derives records, awards and memories from stored history instead of storing them by hand.' },
              { title: 'Personalised UI', text: 'The same row reads differently depending on who is signed in.' },
            ],
          },
        ],
      },
      {
        id: 'decisions',
        title: 'Technical Decisions',
        intro: 'Most of the schema follows from two invariants.',
        blocks: [
          {
            type: 'tenets',
            items: [
              {
                title: 'History is append-safe',
                text: 'Mutable rows carry `source` and `lockedFields`, and every provider-sourced row has a natural key. Re-importing a season updates in place instead of destroying a manual correction someone made months earlier.',
                why: 'An import that can silently erase human edits is an import nobody will run twice.',
              },
              {
                title: 'A person is not their team',
                text: '`User → TeamMembership → FantasyTeam → Franchise` keeps a manager’s identity separate from whatever they named the team that year.',
                why: 'It is what makes career history traversable. Without it, a manager who renames their team every season becomes six different people.',
              },
              {
                title: 'Memories are rendered, not written',
                text: 'A memory stores `template` + `data` plus a `MemorySubject` join, rather than finished prose. One row renders as “You beat Noah” or “Noah beat you” depending on who is reading it.',
                why: null,
              },
              {
                title: 'Records remember their own lineage',
                text: 'Each record keeps `previousRecordId`, so the app can say a mark stood for three years before it fell, which is the part that actually makes a record interesting.',
                why: null,
              },
            ],
          },
        ],
      },
      {
        id: 'challenges',
        title: 'Challenges',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'Importing real league history is the remaining gate, and it is an access problem rather than a code one. ESPN needs session cookies for private leagues and prior seasons; Yahoo needs a registered developer app for OAuth. Both have to come from the league owner, so the archive fills up as those land.',
              'The two platforms also disagree about shape. ESPN serves the active season and earlier seasons from two different controllers that return different types, and answers 401 rather than 404 for a private season that exists, so a naive fallback would quietly mask a real permission error.',
            ],
          },
        ],
      },
      {
        id: 'outcome',
        title: 'Where it is now',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'The app is built and running: providers, sync, the event engine, auth and the admin surface all work. It is deployed under this domain rather than its own, which is a deliberate constraint: one domain, one certificate, one thing to maintain.',
            ],
            note:
              'The live build shows the real interface. It does not present invented league history as though it were real.',
          },
          {
            type: 'spec',
            rows: [
              { label: 'Framework', value: 'Next.js · React.js · TypeScript' },
              { label: 'Styling', value: 'Tailwind CSS · Motion' },
              { label: 'Data', value: 'PostgreSQL · Prisma' },
              { label: 'Auth', value: 'Auth.js, role-based, with an admin surface' },
              { label: 'Charts', value: 'Recharts' },
              { label: 'Hosting', value: 'Netlify, mounted at /fantasy' },
            ],
          },
        ],
      },
      {
        id: 'learned',
        title: 'What I Learned',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'Two things, and they pulled against each other. The first was interface work: an archive is only worth keeping if it is worth reading, so most of the design effort went into making a decade of records legible at a glance rather than dense.',
              'The second was implementing against APIs I did not control. ESPN and Yahoo each return their own shape with their own authentication story, and the interface can only stay simple if that is resolved on the way in. Everything I learned about providers, normalisation and re-runnable syncs came out of keeping that mess away from the UI.',
            ],
          },
        ],
      },
    ],
  },

  /* ====================================================================
     Wishwell
     Source: the application itself, in claude_projects/wishwell, and its
     README. The screenshots are captured from the running app rather than
     mocked up. Hunter dictated the "What I Learned" section himself, so leave
     its wording alone.
     ==================================================================== */
  {
    slug: 'wishwell',
    name: 'Wishwell',
    shortName: 'Wishwell',
    tagline:
      'A wishlist that says why, and a claim system that stops duplicate gifts without spoiling the surprise.',
    status: 'In development',
    statusNote: 'Source on GitHub · runs locally, not deployed yet',
    building: true,
    featured: true,
    role: 'Solo, design and build',
    team: null,
    stack: ['Next.js', 'React.js', 'TypeScript', 'Tailwind CSS', 'SQLite', 'Playwright'],
    links: [
      {
        label: 'Read the source',
        href: 'https://github.com/huntershaps/wishingwell',
        primary: true,
        external: true,
      },
    ],
    timeline: {
      start: '2026-08',
      when: 'August 2026',
      current: true,
      points: ['A claim that reads differently depending on who is asking'],
    },
    media: { type: 'door', label: 'Source', enter: 'Open on GitHub' },
    accent: 'madder',

    caseStudy: [
      {
        id: 'problem',
        title: 'The Problem',
        blocks: [
          {
            type: 'prose',
            lead: true,
            paragraphs: [
              'Everyone has had both of these conversations: the one where two people turn up with the same present, and the one where somebody asks what you want and you cannot think of a single thing. A wishlist fixes the second and causes the first.',
            ],
          },
          {
            type: 'prose',
            paragraphs: [
              'The awkward part is that a claim has to be two contradictory things at once. Public enough that nobody buys the same gift twice, and private enough that the surprise survives. So Wishwell answers the question differently depending on who is asking, and enforces the difference on the server rather than in the interface.',
              'The other half of the problem is the list itself. A row of links is not something anyone enjoys shopping from, so every item has room for photographs, a short video, and the reason it is on the list at all, which turns out to be the part people actually read.',
            ],
          },
        ],
      },
      {
        id: 'design',
        title: 'The Design',
        intro: 'Two grounds and two voices, so the same component is right in either place.',
        blocks: [
          {
            type: 'tenets',
            items: [
              {
                title: 'The gallery and the studio',
                text: 'Looking at somebody else’s list puts you in the gallery: lights down, photographs lit. Managing your own puts you in the studio: paper, hairlines, everything legible at a glance. Both read the same semantic tokens, so no component needs a conditional to be correct on either.',
                why: 'Which mode you are in is the first thing you need to know, and it is answered before you read a word.',
              },
              {
                title: 'The interface speaks; people speak differently',
                text: 'Product chrome is set in Instrument Sans. Anything a person wrote is set in Newsreader instead: a description, a bio, the reason something is on the list.',
                why: 'A list ends up reading like a letter inside a precise interface, which is what a wishlist actually is.',
              },
              {
                title: 'The hold tag',
                text: 'A claimed item gets a paper tag tied onto it, turned a degree off true so it reads as an object set down on the photograph rather than a badge stamped into the layout.',
                why: null,
              },
              {
                title: 'The veil',
                text: 'Its opposite, and the only thing an owner sees where a spoiler would otherwise be: the shape of the news, and none of the content.',
                why: null,
              },
            ],
          },
          {
            type: 'gallery',
            images: [
              {
                src: '/assets/images/wishwell/wishwell_list',
                alt: 'A shared wishlist on a dark ground, items at different sizes, with a paper tag on one that has been claimed',
                caption: 'A list, seen by somebody shopping from it. One item is already spoken for.',
                width: 1200,
                height: 750,
              },
              {
                src: '/assets/images/wishwell/wishwell_item',
                alt: 'An item opened in place, showing a video note beside the reason it is on the list',
                caption: 'An item opens over the list it came from. The video note and the reason lead; specifications follow.',
                width: 1200,
                height: 750,
              },
              {
                src: '/assets/images/wishwell/wishwell_owner',
                alt: 'The owner’s view of the same list on a light ground, with the claimed items redacted behind a hatched panel',
                caption: 'The same list, owned rather than shopped. Two items are spoken for; which two is redacted.',
                width: 1200,
                height: 750,
              },
            ],
          },
        ],
      },
      {
        id: 'build',
        title: 'The Build',
        intro: 'One claim, and the five states it can be in.',
        blocks: [
          {
            type: 'flow',
            steps: [
              { title: 'Available', text: 'Anyone with the link can open the list and read why each thing is on it. No account required to look.' },
              { title: 'Claimed', text: 'One tap. A guest gets a durable cookie identity rather than a sign-up wall, so they can still manage it afterwards.' },
              { title: 'Held', text: 'The item locks for everyone else. The database allows exactly one live claim, so a race between two buyers has one winner and one honest answer.' },
              { title: 'Bought', text: 'The buyer confirms. The item stays locked and moves into their own list of gifts, still invisible to the person receiving it.' },
              { title: 'Released or expired', text: 'A hold nobody follows through on returns the item to the list on its own, after a window the owner sets.' },
            ],
          },
        ],
      },
      {
        id: 'decisions',
        title: 'Technical Decisions',
        intro: 'Four decisions carry most of the product.',
        blocks: [
          {
            type: 'tenets',
            items: [
              {
                title: 'The guarantee is a constraint, not a code path',
                text: 'A partial unique index over the item id, covering only live claims, is what prevents duplicate gifts. Two people tapping in the same instant both reach the insert; one commits, and the other is told the truth.',
                why: 'Application logic that checks and then writes has a gap between the two steps. An index does not have one.',
              },
              {
                title: 'Surprise mode is resolved in exactly one function',
                text: 'Every read of an item passes through a single resolver, which returns nothing at all for the owner while surprise mode is on.',
                why: 'The answer is never placed in the payload, so it cannot be recovered from the page source or a network response by an owner who goes looking.',
              },
              {
                title: 'Vague when written, not filtered when read',
                text: 'Notifications to an owner are composed without the item name in them, rather than having it stripped out on the way to the screen.',
                why: 'A row that never contained the answer cannot leak it later, however it is queried.',
              },
              {
                title: 'The layout is derived from the item',
                text: 'How much room something gets on the wall comes from the item itself: whether the owner pinned it, how badly they want it, whether they filmed a note, how much there is to look at.',
                why: 'Every list composes differently without anybody arranging one, and the page never becomes a grid of identical cards.',
              },
            ],
          },
        ],
      },
      {
        id: 'challenges',
        title: 'Challenges',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'The two bugs that mattered most were only found by driving the application, not by reading it.',
              'The first was visible. Claiming a gift from inside an item view opened a second dialog on top of the first, and two translucent scrims stacked into something close to black. The screen appeared to go blank at the exact moment somebody was trying to give a present. The fix was to stop nesting: the item view now claims in place, inside the surface that is already open.',
              'The second was worse, and quiet. A two-step delete button switched itself from a plain button into a submit button inside its own click handler. The browser reads that attribute after the handler has run, so the first press submitted the form. One click removed an item, or an entire list along with every claim on it. It is never a submit button now, and asks the form to submit explicitly on the second press.',
            ],
            note: 'Both are covered by tests now, which is the only reason they stay fixed.',
          },
        ],
      },
      {
        id: 'outcome',
        title: 'Where it is now',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'The application is complete and runs locally: accounts, list and item management with real uploads, the shared list, the whole claim lifecycle, a buyer’s dashboard, notifications, and the privacy and gifting settings that govern all of it. It is not deployed. The data layer is a local SQLite file kept behind one module, so a hosted database can replace it without the rest of the app noticing.',
            ],
            note:
              'The demo content is written the way a person would write it, and every photograph is credited. None of it is presented as a live service.',
          },
          {
            type: 'spec',
            rows: [
              { label: 'Framework', value: 'Next.js · React.js · TypeScript' },
              { label: 'Styling', value: 'Tailwind CSS, on a two-ground token system' },
              { label: 'Data', value: 'SQLite via better-sqlite3, reached only through server actions' },
              { label: 'Media', value: 'Local uploads, plus short video notes generated with ffmpeg' },
              { label: 'Verification', value: 'Four Playwright suites: reservation guarantees, the gift flow, a whole-application sweep, and axe' },
              { label: 'Accessibility', value: 'No axe violations at 1440 or 390, with focus trapping, escape and focus return covered' },
            ],
          },
        ],
      },
      {
        id: 'learned',
        title: 'What I Learned',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'Most of what I took from this was interface work on a product whose content is photographs and video rather than text. The media is taken from other websites too, off the product pages where the thing is actually sold, rather than shot for the app. Designing around images you did not make and do not control is a different problem from designing around copy you write. They turn up at every shape, quality and orientation, and the page has to hold together whatever arrives.',
              'That is where most of the usability decisions came from. How much room an item gets is worked out from the item rather than set by hand, a video sits inside the item instead of hanging off it as an attachment, and on a phone the photographs run edge to edge so a list reads like something you look through rather than a form you fill in.',
            ],
          },
        ],
      },
    ],
  },

  /* ====================================================================
     Mahou Learning
     Source: the résumé, the project repository (elprogramadora/mahou-learning)
     and its commit history. This is a TEAM project. The repo has several
     contributors, and `role` describes only what Hunter's own commits touch.
     ==================================================================== */
  {
    slug: 'mahou-learning',
    name: 'Mahou Learning',
    shortName: 'Mahou',
    tagline:
      'A Japanese learning app built around flashcards, writing practice and a companion that lives on your home screen.',
    status: 'Completed',
    statusNote: 'Team project · contributions through July 2026',
    building: false,
    featured: true,
    role:
      'Interface and interaction work: the app’s theming system, its move to NativeWind, the home screen, the Mahou companion screen, the memory minigame, and the settings and cards screens.',
    team: 'Team project, one of several contributors',
    stack: ['React Native', 'Expo', 'TypeScript', 'NativeWind', 'SQLite', 'Reanimated', 'Skia'],
    links: [
      { label: 'Source on GitHub', href: 'https://github.com/elprogramadora/mahou-learning', external: true },
    ],
    timeline: {
      start: '2026-05',
      when: 'May 2026 to Jul 2026',
      current: false,
      points: ['Interface work on a team-built Japanese learning app'],
    },
    media: {
      type: 'video',
      poster: '/assets/images/mahou/mahou_home',
      posterWidth: 840,
      posterHeight: 1722,
      src: '/assets/videos/mahou_preview.mp4',
      ratio: '840 / 1722',
      tall: true,
      barLabel: 'Mahou Learning / app preview',
      playLabel: 'Play the walkthrough',
      playHint: '2.6 MB · plays when it scrolls into view',
      alt: 'Mahou Learning home screen',
    },
    accent: 'violet',

    caseStudy: [
      {
        id: 'idea',
        title: 'The Idea',
        blocks: [
          {
            type: 'prose',
            lead: true,
            paragraphs: [
              'Japanese is hard to start because the writing system comes first. Mahou Learning is a flashcard app aimed squarely at that wall: learn the alphabet faster, practise writing it by hand, and pick up grammar once the characters stop being noise.',
            ],
          },
        ],
      },
      {
        id: 'design',
        title: 'The Design',
        intro:
          'Screens from the build. The companion, the shops and the minigames are the reason to come back; the flashcards are the reason it works.',
        blocks: [
          {
            type: 'gallery',
            images: [
              {
                src: '/assets/images/mahou/mahou_home',
                alt: 'Mahou Learning home screen showing the companion character, currency and study entry points',
                caption: 'Home: the companion, your currency, and the way into a study session.',
                width: 840,
                height: 1722,
              },
              {
                src: '/assets/images/mahou/mahou_minigame',
                alt: 'The Kanji Memory minigame: a four-by-four grid of face-down cards with moves, matches and remaining counters',
                caption: 'Kanji Memory: match each English word to its kanji. Moves, matches and pairs left stay visible.',
                width: 840,
                height: 1719,
              },
              {
                src: '/assets/images/mahou/mahou_logo',
                alt: 'The Mahou Learning app mark',
                caption: 'The app mark.',
                width: 517,
                height: 513,
              },
            ],
          },
        ],
      },
      {
        id: 'build',
        title: 'The Build',
        intro: 'What the app is made of, and which parts of it I worked on.',
        blocks: [
          {
            type: 'spec',
            rows: [
              { label: 'Platform', value: 'React Native via Expo, file-based routing with expo-router' },
              { label: 'Styling', value: 'NativeWind, Tailwind syntax in React Native' },
              { label: 'Storage', value: 'expo-sqlite, on device' },
              { label: 'Motion & drawing', value: 'Reanimated, Gesture Handler, Skia canvas for stroke practice' },
              { label: 'Scheduling', value: 'An SM-2 spaced-repetition schedule drives when a card comes back' },
              { label: 'Dictionary', value: 'JMdict and KanjiDic, parsed and searched on device' },
            ],
          },
          {
            type: 'prose',
            paragraphs: [
              'My own work sat on the interface side. I built the theming system the rest of the app reads its colours from, moved styling over to NativeWind, and built the home screen, the settings and cards screens, the Mahou companion screen with its hunger and happiness state, and the Kanji Memory minigame.',
            ],
            note:
              'This was a team project. The stack above describes the whole app; the paragraph above describes the part I contributed.',
          },
        ],
      },
      {
        id: 'challenges',
        title: 'Challenges',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'Getting theme switching to hold across the whole app was the harder of the two. A theme is only real if every screen reads its colours from the same place. One hard-coded value and the app half-changes, which looks worse than not having themes at all. That is what the theme provider exists to prevent, and it meant going back through screens that already worked.',
              'The other was the home page. It is the screen that has to earn attention in the first few seconds and give someone a reason to come back tomorrow, so what it leads with (the companion, progress, the way straight into a session) went through several passes before it felt right.',
            ],
          },
        ],
      },
      {
        id: 'learned',
        title: 'What I Learned',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'Everything I owned on Mahou was interface and experience work, and that is where the lessons are. Deciding what a learner sees first, keeping the app consistent from screen to screen, and making practice feel like something other than a chore did more for whether a session got finished than any single feature did.',
              'It also taught me how much of UX is maintenance rather than invention: a theming system, a shared button, a screen layout that other people build on top of are all decisions that either hold up across a team or quietly come apart.',
            ],
          },
        ],
      },
    ],
  },

  /* ====================================================================
     RECRD.TOP
     Source: the résumé, the existing site, and Hunter directly.
     A five-person team project that Hunter LED. He designed it in Figma and
     built the Spotify ingest, the auth and the performance work himself.
     Rewritten 2026-08-20 at his direction: this page previously described the
     design contribution only, which he has since corrected.
     No dates are recorded anywhere, so none are shown.
     ==================================================================== */
  {
    slug: 'recrd-top',
    name: 'RECRD.TOP',
    shortName: 'RECRD',
    tagline: 'A social space for rating and ranking albums: designed in Figma, then built by the five of us.',
    status: 'Live',
    statusNote: null,
    building: false,
    featured: true,
    role: 'Team lead, design and build',
    team: 'Five-person team, led by me',
    stack: ['Figma', 'React.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Spotify Web API'],
    links: [{ label: 'Visit the project', href: 'https://recrd.top', external: true, primary: true }],
    // No start date exists for this project, so it is deliberately absent from
    // the timeline rather than given a guessed one.
    timeline: null,
    media: {
      type: 'video',
      // A frame lifted straight out of the demo recording below it, so the
      // still and the video are the same product.
      poster: '/assets/images/recrd/recrd_poster',
      posterWidth: 1280,
      posterHeight: 606,
      src: '/assets/videos/recrd_demo.mp4',
      ratio: '1280 / 606',
      barLabel: 'recrd.top / preview',
      playLabel: 'Play the demo',
      playHint: '1.1 MB · plays when it scrolls into view',
      fallbackHref: 'https://recrd.top',
      alt: 'RECRD.TOP demo',
    },
    accent: 'coral',

    caseStudy: [
      {
        id: 'idea',
        title: 'The Idea',
        blocks: [
          {
            type: 'prose',
            lead: true,
            paragraphs: [
              'A social product for ranking music albums, worked through in Figma first — wireframes, then interactive prototypes — and then built by a team of five that I led, with the focus on how interaction shapes engagement.',
            ],
          },
        ],
      },
      {
        id: 'design',
        title: 'What I Did',
        blocks: [
          {
            type: 'list',
            items: [
              'Led a 5-person team to create recrd.top, a social media platform for ranking music albums',
              'Designed the wireframes and interactive prototypes in Figma before any of it was built',
              'Developed a web-scraping script to ingest 10,000+ music albums from the Spotify Web API into MongoDB',
              'Implemented user authentication with email verification using JWT tokens, bcrypt hashing, and SendGrid',
              'Reduced LCP by ~63% (3s to 1.1s) by minifying and deferring non-critical JS',
            ],
          },
        ],
      },
      {
        id: 'build',
        title: 'What Shipped',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'The demo on this page moves through album search, a ten-point rating, a personal ranking list, a leaderboard for both top albums and top users, and a profile carrying favourite albums, follower counts and an activity feed.',
            ],
          },
        ],
      },
      {
        id: 'learned',
        title: 'What I Learned',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'RECRD is where accessibility and usability stopped being a checklist for me. Designing the same flows for a phone and for a browser makes the differences impossible to ignore: touch targets that are fine under a cursor are not fine under a thumb, reading order matters more than visual order, and the amount of screen you can actually rely on is much smaller than the one you design on.',
              'Working through it on both at once was the useful part: it is easier to design something usable on a wide screen and discover later that it does not survive contact with a phone.',
            ],
          },
        ],
      },
      // TODO(hunter): if you still have the Figma file, a few screens here
      // would turn the design section into a real case study. Add a
      // { type: 'gallery', images: [...] } block to the section above.
    ],
  },

  /* ====================================================================
     Cardhouse
     Source: the project repository at C:\Users\15613\dev\card_tracker.
     Not public, so no links are shown. Added at Hunter's request.
     ==================================================================== */
  {
    slug: 'cardhouse',
    name: 'Cardhouse',
    shortName: 'Cardhouse',
    tagline: 'A sports card portfolio tracker: what a collection holds, and what it is worth.',
    status: 'In development',
    statusNote: 'Private repository · no public link yet',
    building: true,
    featured: false,
    role: 'Solo, design and build',
    team: null,
    stack: ['Next.js', 'React.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Auth.js', 'Tailwind CSS'],
    links: [],
    timeline: {
      start: '2026-08',
      when: 'Aug 2026 to Present',
      current: true,
      points: ['A valuation engine built on comparable sales'],
    },
    media: null,
    accent: 'brass',

    caseStudy: [
      {
        id: 'idea',
        title: 'The Idea',
        blocks: [
          {
            type: 'prose',
            lead: true,
            paragraphs: [
              'A collection is a portfolio whether or not anyone treats it as one. Cardhouse tracks what a collection contains and estimates what it is worth from comparable sales, rather than from a single headline price.',
            ],
          },
        ],
      },
      {
        id: 'decisions',
        title: 'Technical Decisions',
        blocks: [
          {
            type: 'tenets',
            items: [
              {
                title: 'A trimmed mean, not a median',
                text: 'Valuation uses a recency-weighted trimmed mean of comparable sales. A median returns a price that was actually observed, so a tight cluster of comps produces a flat, stepped chart that looks broken.',
                why: null,
              },
              {
                title: 'The data source never falls back silently',
                text: 'The market-data provider switch refuses to fall back from live data to the demo catalogue. A valuation that quietly changes source is worse than one that fails loudly.',
                why: null,
              },
            ],
          },
        ],
      },
      {
        id: 'challenges',
        title: 'Challenges',
        blocks: [
          {
            type: 'prose',
            paragraphs: [
              'Sold prices are the hard part. eBay retired the completed-items search in February 2025, and the API that replaced it for sold data is a limited-release product that is not open to new individual developers. Active listings and image search are available; historical sale prices are not.',
              'So the app is built against the real API surface that does exist, and every price in the current build comes from a demo catalogue that is labelled as such in the interface.',
            ],
            note:
              'Nothing in the demo build is presented as a real market price. Live valuations wait on a sold-comp source that can actually be obtained.',
          },
        ],
      },
    ],
  },

  /* ====================================================================
     This portfolio
     Source: this repository and its git history.
     ==================================================================== */
  {
    slug: 'portfolio',
    name: 'This Portfolio',
    shortName: 'Portfolio',
    tagline: 'A static site written by hand, with no framework and no build step to speak of.',
    status: 'Live',
    statusNote: 'huntermshaps.com · revised continuously',
    building: true,
    featured: false,
    role: 'Solo, design and build',
    team: null,
    stack: ['HTML', 'CSS', 'JavaScript (ES modules)', 'Node.js', 'Netlify'],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/huntershaps/portfolio', external: true }],
    timeline: {
      start: '2026-08',
      when: 'Aug 2026 to Present',
      current: true,
      points: ['Hand-written, dependency-light, rebuilt in the open'],
    },
    media: null,
    accent: 'acid',

    caseStudy: [
      {
        id: 'idea',
        title: 'The Idea',
        blocks: [
          {
            type: 'prose',
            lead: true,
            paragraphs: [
              'A portfolio is a product with exactly one user story, so it seemed worth building it the way I would build anything else: a design system rather than a stylesheet, content as data rather than as markup, and no dependency I could not justify.',
              'There is no framework here. The pages are generated from the content files by a small Node script that also serves them in development, so the markup a browser receives is the markup in the repository.',
            ],
          },
        ],
      },
      {
        id: 'design',
        title: 'Design Evolution',
        intro: 'Three published versions, all still in the git history.',
        blocks: [
          {
            type: 'evolution',
            frames: [
              {
                label: 'V1',
                when: '4 August 2026',
                src: '/assets/images/archive/portfolio_v1',
                alt: 'The first published version of the portfolio: a dark navigation rail, a large HUNTER SHAPIRO wordmark, and the two-poles panel on the right',
                caption:
                  'The first published version. The editorial identity is already here: the rail, the wordmark, the serif italic accent.',
                width: 1200,
                height: 833,
              },
              {
                label: 'V2',
                when: '17 August 2026',
                src: '/assets/images/archive/portfolio_v2',
                alt: 'The second version of the portfolio, adding a metadata line above the wordmark and two call-to-action buttons',
                caption:
                  'Contrast fixed against the paper background, a metadata line added above the wordmark, and the first real calls to action.',
                width: 1200,
                height: 833,
              },
              {
                label: 'V3',
                when: '18 August 2026',
                src: '/assets/images/archive/portfolio_v3',
                alt: 'The current version of the portfolio: the wordmark on the left, an at-a-glance panel on the right listing the current role and degrees, and a line of links to what is currently being built',
                caption:
                  'The rebuild. Content moved into data files, every project got a case-study page, and the hero gained the two facts a recruiter looks for first. The small letter-spaced labels above headings came out.',
                width: 1200,
                height: 833,
              },
            ],
          },
        ],
      },
      {
        id: 'decisions',
        title: 'Technical Decisions',
        blocks: [
          {
            type: 'tenets',
            items: [
              {
                title: 'The deploy is an allowlist',
                text: 'The build copies a named list of files into `dist/` rather than ignoring a list of secrets. Publishing the repository root would put `.env` and `.git` on a public CDN; with an allowlist a new asset directory has to be added deliberately.',
                why: 'The failure mode of the safer-looking option is a leaked SMTP credential at /.env.',
              },
              {
                title: 'Content is data, markup is generated',
                text: 'Projects, skills and dates live in `content/*.js`. The homepage, every case-study page, the timeline and the command palette all read from those files, so a date exists in exactly one place.',
                why: null,
              },
              {
                title: 'Videos are loaded only if you reach them',
                text: 'Each preview is `preload="none"` and starts on its first intersection, then pauses when it leaves. A visitor who never scrolls to a case study never downloads its video.',
                why: null,
              },
              {
                title: 'The previews were re-encoded, not just compressed',
                text: 'The two demo videos were 42 MB and 52 MB and tracked in Git LFS, which meant a plain clone produced 133-byte pointer files and both previews failed silently. Re-encoded to 1.1 MB and 2.6 MB, audio dropped, and committed directly.',
                why: null,
              },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * Earlier versions kept deliberately, rather than deleted.
 *
 * These are real, dated by the git history of this repository, and every
 * screenshot is a render of that actual commit. Add to this list as things are
 * retired; do not add anything that was never published.
 */
export const archive = [
  {
    title: 'Portfolio V2',
    when: '17 August 2026',
    ref: '66c6d28',
    summary:
      'The version this redesign replaced. Editorial layout, a fixed index rail, and three case studies on one page.',
    tech: ['HTML', 'CSS', 'ES modules'],
    image: {
      src: '/assets/images/archive/portfolio_v2',
      alt: 'Screenshot of version 2 of the portfolio',
      width: 1200,
      height: 833,
    },
    href: '/work/portfolio#design',
  },
  {
    title: 'Portfolio V1',
    when: '4 August 2026',
    ref: 'c701a28',
    summary:
      'The first version published to huntermshaps.com. Same bones, before the contrast pass and before the museum existed.',
    tech: ['HTML', 'CSS', 'ES modules'],
    image: {
      src: '/assets/images/archive/portfolio_v1',
      alt: 'Screenshot of version 1 of the portfolio',
      width: 1200,
      height: 833,
    },
    href: '/work/portfolio#design',
  },
];

/**
 * The Lab: smaller experiments, prototypes and technical explorations that do
 * not warrant a full case study.
 *
 * DELIBERATELY EMPTY. Nothing on this machine qualified without stretching the
 * truth, and a lab full of invented experiments would undo the point of the
 * rest of the site. The section, its styles and its command-palette entry all
 * exist and switch on the moment this array has something in it.
 *
 * To add one:
 *   { title: 'Name', kind: 'Prototype', summary: 'One or two sentences.',
 *     tech: ['…'], href: null, when: 'August 2026' }
 *
 * `kind` is free text: Prototype, Experiment, Concept, Exploration, whatever
 * fits. `href` may be null; the card simply will not be a link.
 */
export const lab = [];

/* ---------------------------------------------------------------------- */

export const bySlug = (slug) => projects.find((project) => project.slug === slug);

/** Projects shown in "Currently building", in the order they appear above. */
export const currentlyBuilding = () => projects.filter((project) => project.building);

/** Projects shown in the main work grid. */
export const featured = () => projects.filter((project) => project.featured);

/** Everything with a case-study page, which is everything. */
export const all = () => projects;
