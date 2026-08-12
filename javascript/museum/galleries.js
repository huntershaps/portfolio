import { el, qs, render, ordinal } from '../lib/dom.js';
import {
  memberName,
  seasonsDescending,
  titleLeaderboard,
  leagueSummary,
  groupBy,
  rankedStandings,
  formatRecord,
  formatPoints
} from '../../data/museum/derive.js';
import { createRadioGroup, createFilterBar } from './radioGroup.js';

/* -------------------------------------------------------------------------
   Shared pieces
   ------------------------------------------------------------------------- */

/** Shown when a league has nothing in a gallery yet. Honest, not decorative. */
function emptyExhibit(message) {
  return el(
    'p',
    { class: 'exhibit-empty' },
    el('span', { class: 'exhibit-empty__mark', 'aria-hidden': 'true' }, '—'),
    message
  );
}

function monogram(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/* -------------------------------------------------------------------------
   Gallery 01 — Leagues
   ------------------------------------------------------------------------- */

export function renderLeagueSwitch(container, leagues, activeId, onChange) {
  const items = leagues.map((league) =>
    el(
      'button',
      { type: 'button', class: 'league-chip', dataset: { value: league.id }, style: `--league-accent:${league.accent}` },
      el('span', { class: 'league-chip__monogram', 'aria-hidden': 'true' }, league.monogram),
      el(
        'span',
        { class: 'league-chip__body' },
        el('span', { class: 'league-chip__name' }, league.name),
        el('span', { class: 'league-chip__meta' }, `${league.sport} · est. ${league.founded}`)
      )
    )
  );

  return createRadioGroup(container, { label: 'Choose a league', items, value: activeId, onChange });
}

export function renderLeagueProfile(container, league) {
  const summary = leagueSummary(league);
  const leaders = titleLeaderboard(league);

  render(
    container,
    el(
      'div',
      { class: 'league-profile' },
      el(
        'div',
        { class: 'league-profile__identity' },
        el('p', { class: 'league-profile__monogram', 'aria-hidden': 'true' }, league.monogram),
        el('h3', { class: 'league-profile__name' }, league.name),
        el('p', { class: 'league-profile__motto' }, league.motto),
        el('p', { class: 'league-profile__about' }, league.about),
        el(
          'dl',
          { class: 'league-profile__facts' },
          fact('Founded', String(league.founded)),
          fact('Platform', league.platform),
          fact('Teams', String(league.teams)),
          fact('Seasons archived', String(summary.seasons)),
          fact('Distinct champions', String(summary.champions))
        )
      ),
      el(
        'div',
        { class: 'league-profile__roll' },
        el('h4', {}, 'The managers'),
        el(
          'ul',
          { class: 'roll-call' },
          league.members.map((member) =>
            el(
              'li',
              { class: 'roll-call__row' },
              el('span', { class: 'roll-call__mark', 'aria-hidden': 'true' }, monogram(member.name)),
              el(
                'span',
                {},
                el('strong', {}, member.name),
                member.team ? el('small', {}, member.team) : null
              ),
              el('span', { class: 'roll-call__since' }, `since ${member.joined}`)
            )
          )
        ),
        leaders.length
          ? el(
              'div',
              { class: 'title-count' },
              el('h4', {}, 'Titles'),
              el(
                'ul',
                {},
                leaders.map((leader) =>
                  el(
                    'li',
                    { class: 'title-count__row' },
                    el('span', {}, leader.name),
                    el(
                      'span',
                      { class: 'title-count__rings', 'aria-label': `${leader.titles} championship${leader.titles === 1 ? '' : 's'}` },
                      Array.from({ length: leader.titles }, () => el('i', { 'aria-hidden': 'true' }))
                    )
                  )
                )
              )
            )
          : null
      )
    )
  );
}

function fact(term, value) {
  return el('div', {}, el('dt', {}, term), el('dd', {}, value));
}

/* -------------------------------------------------------------------------
   Gallery 02 — Season archive
   ------------------------------------------------------------------------- */

export function renderSeasonArchive(railContainer, detailContainer, league) {
  const seasons = seasonsDescending(league);

  if (!seasons.length) {
    railContainer.replaceChildren();
    render(detailContainer, emptyExhibit('No seasons have been archived for this league yet.'));
    return;
  }

  const items = seasons.map((season) =>
    el(
      'button',
      { type: 'button', class: 'year-plaque', dataset: { value: String(season.year) } },
      el('span', { class: 'year-plaque__year' }, String(season.year)),
      el('span', { class: 'year-plaque__champion' }, memberName(league, season.champion))
    )
  );

  const show = (year) => {
    const season = seasons.find((entry) => String(entry.year) === String(year));
    if (season) render(detailContainer, seasonDetail(league, season));
  };

  createRadioGroup(railContainer, {
    label: 'Choose a season',
    items,
    value: String(seasons[0].year),
    onChange: show
  });

  show(seasons[0].year);
}

function seasonDetail(league, season) {
  const standings = rankedStandings(season);
  const hasPoints = standings.some((row) => row.pf);

  return el(
    'article',
    { class: 'season' },
    el(
      'div',
      { class: 'season__head' },
      el('p', { class: 'season__year' }, String(season.year)),
      el('h3', { class: 'season__headline' }, season.headline),
      season.recap ? el('p', { class: 'season__recap' }, season.recap) : null
    ),

    el(
      'div',
      { class: 'season__final' },
      el(
        'div',
        { class: 'season__finalist season__finalist--won' },
        el('p', { class: 'season__role' }, 'Champion'),
        el('p', { class: 'season__name' }, memberName(league, season.champion)),
        season.finalScore ? el('p', { class: 'season__score' }, formatPoints(season.finalScore.champion)) : null
      ),
      el('p', { class: 'season__versus', 'aria-hidden': 'true' }, 'def.'),
      el(
        'div',
        { class: 'season__finalist' },
        el('p', { class: 'season__role' }, 'Runner-up'),
        el('p', { class: 'season__name' }, memberName(league, season.runnerUp)),
        season.finalScore ? el('p', { class: 'season__score' }, formatPoints(season.finalScore.runnerUp)) : null
      )
    ),

    el(
      'ul',
      { class: 'season__badges' },
      season.regularSeasonCrown
        ? badge('Best record', memberName(league, season.regularSeasonCrown))
        : null,
      season.toiletBowl ? badge('Toilet bowl', memberName(league, season.toiletBowl)) : null
    ),

    standings.length
      ? el(
          'div',
          { class: 'season__table-wrap' },
          el(
            'table',
            { class: 'standings' },
            el('caption', {}, `${season.year} final standings`),
            el(
              'thead',
              {},
              el(
                'tr',
                {},
                el('th', { scope: 'col' }, '#'),
                el('th', { scope: 'col' }, 'Manager'),
                el('th', { scope: 'col' }, 'Record'),
                hasPoints ? el('th', { scope: 'col' }, 'PF') : null,
                hasPoints ? el('th', { scope: 'col' }, 'PA') : null
              )
            ),
            el(
              'tbody',
              {},
              standings.map((row, index) =>
                el(
                  'tr',
                  { class: row.member === season.champion ? 'is-champion' : null },
                  el('td', { class: 'standings__rank' }, ordinal(index + 1)),
                  el('th', { scope: 'row' }, memberName(league, row.member)),
                  el('td', {}, formatRecord(row)),
                  hasPoints ? el('td', {}, formatPoints(row.pf)) : null,
                  hasPoints ? el('td', {}, formatPoints(row.pa)) : null
                )
              )
            )
          ),
          standings.length < league.teams
            ? el('p', { class: 'season__table-note' }, `Showing ${standings.length} of ${league.teams} teams — the rest of this table has not been entered yet.`)
            : null
        )
      : null
  );
}

function badge(label, value) {
  return el('li', { class: 'season__badge' }, el('span', {}, label), el('strong', {}, value));
}

/* -------------------------------------------------------------------------
   Gallery 03 — Hall of Fame
   ------------------------------------------------------------------------- */

export function renderHallOfFame(container, league) {
  const inductees = league.hallOfFame ?? [];
  if (!inductees.length) {
    render(container, emptyExhibit('No inductees yet. The first class is still being argued about.'));
    return;
  }

  const wings = groupBy(inductees, (entry) => entry.honor);

  render(
    container,
    [...wings].map(([honor, members]) =>
      el(
        'section',
        { class: 'wing' },
        el('h3', { class: 'wing__title' }, honor),
        el(
          'ul',
          { class: 'plaque-grid' },
          members.map((entry) =>
            el(
              'li',
              { class: 'plaque' },
              el('p', { class: 'plaque__monogram', 'aria-hidden': 'true' }, monogram(memberName(league, entry.member))),
              el('h4', { class: 'plaque__name' }, memberName(league, entry.member)),
              el('p', { class: 'plaque__year' }, `Inducted ${entry.inducted}`),
              el('p', { class: 'plaque__citation' }, entry.citation),
              entry.stat
                ? el(
                    'p',
                    { class: 'plaque__stat' },
                    el('span', {}, entry.stat.label),
                    el('strong', {}, entry.stat.value)
                  )
                : null
            )
          )
        )
      )
    )
  );
}

/* -------------------------------------------------------------------------
   Gallery 04 — Awards
   ------------------------------------------------------------------------- */

export function renderAwards(filterContainer, gridContainer, league) {
  const awards = league.awards ?? [];
  if (!awards.length) {
    filterContainer.replaceChildren();
    render(gridContainer, emptyExhibit('The trophy case is empty. Awards added to the data will appear here.'));
    return;
  }

  const years = [...new Set(awards.map((award) => award.year))].sort((a, b) => b - a);
  let tone = 'all';
  let year = 'all';

  const chip = (value, label) =>
    el('button', { type: 'button', class: 'chip', dataset: { value } }, label);

  const draw = () => {
    const visible = awards.filter(
      (award) => (tone === 'all' || award.tone === tone) && (year === 'all' || String(award.year) === year)
    );

    if (!visible.length) {
      render(
        gridContainer,
        emptyExhibit('Nothing in the collection matches those filters.')
      );
      return;
    }

    render(
      gridContainer,
      el(
        'ul',
        { class: 'trophy-grid' },
        visible
          .sort((a, b) => b.year - a.year || a.name.localeCompare(b.name))
          .map((award) =>
            el(
              'li',
              { class: `trophy trophy--${award.tone}` },
              el('p', { class: 'trophy__glyph', 'aria-hidden': 'true' }, award.glyph),
              el('p', { class: 'trophy__year' }, String(award.year)),
              el('h3', { class: 'trophy__name' }, award.name),
              el('p', { class: 'trophy__member' }, memberName(league, award.member)),
              el('p', { class: 'trophy__note' }, award.note),
              el('p', { class: 'trophy__tone' }, award.tone === 'honour' ? 'Honour' : 'Infamy')
            )
          )
      )
    );
  };

  render(
    filterContainer,
    el('div', { class: 'filter-row' }, el('span', { class: 'filter-row__label' }, 'Kind'), el('div', { class: 'chip-row', 'data-tone-filter': '' })),
    el('div', { class: 'filter-row' }, el('span', { class: 'filter-row__label' }, 'Year'), el('div', { class: 'chip-row', 'data-year-filter': '' }))
  );

  createFilterBar(qs('[data-tone-filter]', filterContainer), {
    label: 'Filter awards by kind',
    items: [chip('all', 'All'), chip('honour', 'Honours'), chip('infamy', 'Infamy')],
    value: tone,
    onChange: (next) => {
      tone = next;
      draw();
    }
  });

  createFilterBar(qs('[data-year-filter]', filterContainer), {
    label: 'Filter awards by year',
    items: [chip('all', 'All'), ...years.map((value) => chip(String(value), String(value)))],
    value: year,
    onChange: (next) => {
      year = next;
      draw();
    }
  });

  draw();
}

/* -------------------------------------------------------------------------
   Gallery 05 — Legendary moments
   ------------------------------------------------------------------------- */

export function renderMoments(container, league) {
  const moments = [...(league.moments ?? [])].sort((a, b) => b.year - a.year);
  if (!moments.length) {
    render(container, emptyExhibit('No moments recorded yet.'));
    return;
  }

  render(
    container,
    el(
      'ol',
      { class: 'moment-list' },
      moments.map((moment) =>
        el(
          'li',
          { class: 'moment' },
          el(
            'div',
            { class: 'moment__stamp' },
            el('span', { class: 'moment__year' }, String(moment.year)),
            moment.date ? el('span', { class: 'moment__date' }, moment.date) : null
          ),
          el(
            'div',
            { class: 'moment__body' },
            el('h3', { class: 'moment__title' }, moment.title),
            el('p', { class: 'moment__story' }, moment.story),
            moment.media?.length
              ? el(
                  'div',
                  { class: 'moment__media' },
                  moment.media.map((item) =>
                    el(
                      'figure',
                      {},
                      el('img', { src: item.src, alt: item.alt, loading: 'lazy', decoding: 'async' }),
                      item.caption ? el('figcaption', {}, item.caption) : null
                    )
                  )
                )
              : null,
            moment.tags?.length
              ? el('ul', { class: 'moment__tags' }, moment.tags.map((tag) => el('li', {}, tag)))
              : null
          )
        )
      )
    )
  );
}

/* -------------------------------------------------------------------------
   Gallery 06 — Rivalries
   ------------------------------------------------------------------------- */

export function renderRivalries(container, league) {
  const rivalries = league.rivalries ?? [];
  if (!rivalries.length) {
    render(container, emptyExhibit('No rivalries logged yet. Give it a season.'));
    return;
  }

  render(
    container,
    el(
      'ul',
      { class: 'rivalry-list' },
      rivalries
        .slice()
        .sort((a, b) => b.heat - a.heat)
        .map((rivalry) => {
          const [a, b] = rivalry.members;
          const [winsA, winsB] = rivalry.record;
          const total = winsA + winsB || 1;
          const shareA = Math.round((winsA / total) * 100);

          return el(
            'li',
            { class: 'rivalry' },
            el(
              'div',
              { class: 'rivalry__names' },
              el('span', { class: 'rivalry__name' }, memberName(league, a)),
              el('span', { class: 'rivalry__vs', 'aria-hidden': 'true' }, 'vs'),
              el('span', { class: 'rivalry__name rivalry__name--right' }, memberName(league, b))
            ),
            el(
              'div',
              {
                class: 'rivalry__bar',
                role: 'img',
                'aria-label': `Head to head: ${memberName(league, a)} ${winsA}, ${memberName(league, b)} ${winsB}`
              },
              el('span', { class: 'rivalry__fill', style: `width:${shareA}%` }),
              el('span', { class: 'rivalry__tally rivalry__tally--left' }, String(winsA)),
              el('span', { class: 'rivalry__tally rivalry__tally--right' }, String(winsB))
            ),
            el('p', { class: 'rivalry__story' }, rivalry.story),
            el(
              'dl',
              { class: 'rivalry__facts' },
              fact('Playoff meetings', String(rivalry.playoffMeetings ?? 0)),
              fact('Current streak', rivalry.streak ?? '—'),
              fact('Rivalry score', `${rivalry.heat}/100`)
            ),
            el(
              'div',
              { class: 'rivalry__heat', role: 'img', 'aria-label': `Rivalry score ${rivalry.heat} out of 100` },
              el('span', { style: `width:${rivalry.heat}%` })
            )
          );
        })
    )
  );
}

/* -------------------------------------------------------------------------
   Gallery 07 — Record book
   ------------------------------------------------------------------------- */

export function renderRecords(container, league) {
  const records = league.records ?? [];
  if (!records.length) {
    render(container, emptyExhibit('The record book has not been opened yet.'));
    return;
  }

  render(
    container,
    el(
      'ul',
      { class: 'record-book' },
      records.map((record) =>
        el(
          'li',
          { class: `record record--${record.kind}` },
          el('p', { class: 'record__label' }, record.label),
          el('p', { class: 'record__value' }, record.value),
          el(
            'p',
            { class: 'record__holder' },
            record.member ? memberName(league, record.member) : 'Unclaimed',
            record.year ? el('span', {}, ` · ${record.year}`) : null
          ),
          record.note ? el('p', { class: 'record__note' }, record.note) : null
        )
      )
    )
  );
}

/* -------------------------------------------------------------------------
   Gallery 08 — Memory wall
   ------------------------------------------------------------------------- */

export function renderMemoryWall(container, league) {
  const memories = league.memoryWall ?? [];
  if (!memories.length) {
    render(container, emptyExhibit('The wall is bare. Quotes, screenshots and rule changes all belong here.'));
    return;
  }

  render(
    container,
    el(
      'ul',
      { class: 'memory-wall' },
      memories.map((memory, index) =>
        el(
          'li',
          { class: `memory memory--${memory.kind}`, style: `--tilt:${((index % 4) - 1.5) * 0.9}deg` },
          memory.media
            ? el('img', {
                class: 'memory__image',
                src: memory.media.src,
                alt: memory.media.alt,
                loading: 'lazy',
                decoding: 'async'
              })
            : null,
          el(memory.kind === 'quote' ? 'blockquote' : 'p', { class: 'memory__body' }, memory.body),
          el(
            'p',
            { class: 'memory__meta' },
            memory.attribution ? el('cite', {}, memory.attribution) : null,
            memory.year ? el('span', {}, String(memory.year)) : null
          )
        )
      )
    )
  );
}
