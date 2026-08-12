/**
 * @file The shape of everything the Museum displays.
 *
 * These are JSDoc typedefs rather than TypeScript because the site has no build
 * step — but editors will still type-check `leagues.js` against them, and they
 * are the reference for what a new season or exhibit needs to contain.
 *
 * Nothing here is required to be complete. Every gallery renders whatever it is
 * given and hides itself when a league has no entries for it, so a brand-new
 * league with two seasons and no Hall of Fame is a valid league.
 */

/**
 * @typedef {object} Collection
 * @property {string}  title
 * @property {string}  subtitle
 * @property {string}  curator
 * @property {'sample'|'live'} provenance  'sample' surfaces the placeholder
 *   banner site-wide. Switch to 'live' only once the data below is real.
 * @property {string}  provenanceNote      Shown in the banner.
 */

/**
 * @typedef {object} Member  A person in the league.
 * @property {string}  id     Stable slug. Referenced by every other record.
 * @property {string}  name
 * @property {number}  joined
 * @property {number}  [left] Omit while they are still playing.
 * @property {string}  [team] Their most recent team name.
 */

/**
 * @typedef {object} StandingRow
 * @property {string}  member  Member id.
 * @property {number}  w
 * @property {number}  l
 * @property {number}  [t]
 * @property {number}  pf      Points for.
 * @property {number}  pa      Points against.
 */

/**
 * @typedef {object} Season
 * @property {number}  year
 * @property {string}  champion            Member id.
 * @property {string}  runnerUp            Member id.
 * @property {string}  [regularSeasonCrown] Best record, if not the champion.
 * @property {string}  [toiletBowl]        Last place.
 * @property {string}  headline            One line. This is the exhibit label.
 * @property {string}  [recap]             A short paragraph.
 * @property {{champion: number, runnerUp: number}} [finalScore]
 * @property {StandingRow[]} [standings]
 */

/**
 * @typedef {object} Inductee
 * @property {string}  id
 * @property {string}  member
 * @property {number}  inducted
 * @property {string}  honor      The category. Invent new ones freely — the
 *   gallery groups by whatever string appears here.
 * @property {string}  citation
 * @property {{label: string, value: string}} [stat]
 */

/**
 * @typedef {object} Award
 * @property {string}  id
 * @property {number}  year
 * @property {string}  name
 * @property {string}  member
 * @property {string}  note
 * @property {'honour'|'infamy'} tone  Drives the exhibit's colour treatment.
 * @property {string}  glyph            A single character or emoji.
 */

/**
 * @typedef {object} MediaItem
 * @property {'image'} type
 * @property {string}  src
 * @property {string}  alt
 * @property {string}  [caption]
 */

/**
 * @typedef {object} Moment
 * @property {string}  id
 * @property {number}  year
 * @property {string}  [date]   Display string, e.g. 'Week 13'.
 * @property {string}  title
 * @property {string}  story
 * @property {string[]} [tags]
 * @property {MediaItem[]} [media]
 */

/**
 * @typedef {object} Rivalry
 * @property {string}  id
 * @property {[string, string]} members
 * @property {[number, number]} record            Wins for members[0], members[1].
 * @property {number}  [playoffMeetings]
 * @property {string}  [streak]
 * @property {number}  heat                       0–100. Drives the meter.
 * @property {string}  story
 */

/**
 * @typedef {object} RecordEntry
 * @property {string}  id
 * @property {string}  label
 * @property {string}  value    Pre-formatted; records are not all numbers.
 * @property {string}  [member]
 * @property {number}  [year]
 * @property {'peak'|'trough'} kind
 * @property {string}  [note]
 */

/**
 * @typedef {object} MemoryItem
 * @property {string}  id
 * @property {'quote'|'note'|'artifact'} kind
 * @property {string}  body
 * @property {string}  [attribution]
 * @property {number}  [year]
 * @property {MediaItem} [media]
 */

/**
 * @typedef {object} League
 * @property {string}  id
 * @property {string}  name
 * @property {string}  shortName
 * @property {string}  sport
 * @property {string}  platform
 * @property {number}  founded
 * @property {number}  teams
 * @property {string}  accent      CSS colour. Gives each league its own identity.
 * @property {string}  monogram    Two or three letters.
 * @property {string}  motto
 * @property {string}  about
 * @property {Member[]} members
 * @property {Season[]} seasons
 * @property {Inductee[]} [hallOfFame]
 * @property {Award[]} [awards]
 * @property {Moment[]} [moments]
 * @property {Rivalry[]} [rivalries]
 * @property {RecordEntry[]} [records]
 * @property {MemoryItem[]} [memoryWall]
 */

export {};
