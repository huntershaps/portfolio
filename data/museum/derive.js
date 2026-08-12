/**
 * @file Everything the Museum computes rather than stores.
 *
 * Championship counts, appearances and totals are derived from the seasons so
 * that adding one season updates every gallery at once. Nothing that can be
 * calculated should ever be typed in twice.
 */

/** @param {import('./schema.js').League} league */
export function memberIndex(league) {
  return new Map(league.members.map((member) => [member.id, member]));
}

/**
 * Resolve a member id to a display name. Unknown ids surface as-is rather than
 * silently rendering blank, so a typo in the data is visible immediately.
 * @param {import('./schema.js').League} league
 */
export function memberName(league, id) {
  return memberIndex(league).get(id)?.name ?? id;
}

/** Seasons, newest first. */
export function seasonsDescending(league) {
  return [...league.seasons].sort((a, b) => b.year - a.year);
}

/**
 * Per-member titles, runner-up finishes and last-place finishes.
 * @returns {Map<string, {titles: number, finals: number, wooden: number}>}
 */
export function honoursByMember(league) {
  const tally = new Map();
  const bump = (id, key) => {
    if (!id) return;
    const row = tally.get(id) ?? { titles: 0, finals: 0, wooden: 0 };
    row[key] += 1;
    tally.set(id, row);
  };

  league.seasons.forEach((season) => {
    bump(season.champion, 'titles');
    bump(season.champion, 'finals');
    bump(season.runnerUp, 'finals');
    bump(season.toiletBowl, 'wooden');
  });

  return tally;
}

/** Members ordered by titles, then finals reached. Only those with a title. */
export function titleLeaderboard(league) {
  return [...honoursByMember(league)]
    .filter(([, row]) => row.titles > 0)
    .sort((a, b) => b[1].titles - a[1].titles || b[1].finals - a[1].finals)
    .map(([id, row]) => ({ id, name: memberName(league, id), ...row }));
}

/** The headline numbers for a single league. */
export function leagueSummary(league) {
  const years = league.seasons.map((season) => season.year);
  const champions = new Set(league.seasons.map((season) => season.champion));

  return {
    seasons: league.seasons.length,
    firstYear: years.length ? Math.min(...years) : league.founded,
    lastYear: years.length ? Math.max(...years) : league.founded,
    champions: champions.size,
    managers: league.members.length,
    inductees: league.hallOfFame?.length ?? 0,
    awards: league.awards?.length ?? 0,
    moments: league.moments?.length ?? 0,
    records: league.records?.length ?? 0
  };
}

/** The headline numbers across the whole collection. */
export function collectionSummary(leagues) {
  const totals = leagues.reduce(
    (acc, league) => {
      const summary = leagueSummary(league);
      acc.seasons += summary.seasons;
      acc.awards += summary.awards;
      acc.moments += summary.moments;
      acc.inductees += summary.inductees;
      // Champions are counted by person, not by season, so the number means
      // "how many people have ever won something" rather than restating the
      // season count back at the visitor.
      league.seasons.forEach((season) => {
        if (season.champion) acc.champions.add(memberName(league, season.champion));
      });
      league.members.forEach((member) => acc.people.add(member.name));
      acc.earliest = Math.min(acc.earliest, summary.firstYear);
      return acc;
    },
    { seasons: 0, awards: 0, moments: 0, inductees: 0, champions: new Set(), people: new Set(), earliest: Infinity }
  );

  return {
    leagues: leagues.length,
    seasons: totals.seasons,
    champions: totals.champions.size,
    awards: totals.awards,
    moments: totals.moments,
    inductees: totals.inductees,
    managers: totals.people.size,
    since: Number.isFinite(totals.earliest) ? totals.earliest : new Date().getFullYear()
  };
}

/** Group any list into a Map keyed by the result of `keyOf`, preserving order. */
export function groupBy(items, keyOf) {
  const groups = new Map();
  items.forEach((item) => {
    const key = keyOf(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  return groups;
}

/** Standings sorted the way a league table is read: wins, then points for. */
export function rankedStandings(season) {
  return [...(season.standings ?? [])].sort(
    (a, b) => b.w - a.w || (b.pf ?? 0) - (a.pf ?? 0)
  );
}

export function formatRecord(row) {
  return row.t ? `${row.w}–${row.l}–${row.t}` : `${row.w}–${row.l}`;
}

export function formatPoints(value) {
  if (!value) return '—';
  return value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
