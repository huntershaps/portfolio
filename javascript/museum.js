import { qs, el, render } from './lib/dom.js';
import { initNavigation } from './lib/nav.js';
import { initReveal } from './lib/reveal.js';
import { collection, leagues } from '../data/museum/leagues.js';
import { collectionSummary } from '../data/museum/derive.js';
import {
  renderLeagueSwitch,
  renderLeagueProfile,
  renderSeasonArchive,
  renderHallOfFame,
  renderAwards,
  renderMoments,
  renderRivalries,
  renderRecords,
  renderMemoryWall
} from './museum/galleries.js';

initNavigation();
renderProvenance();
renderEntrance();
initLeagues();
initReveal();

/* -------------------------------------------------------------------------
   The standing notice. Placeholder content is never presented as real history.
   ------------------------------------------------------------------------- */
function renderProvenance() {
  const banner = qs('#provenance');
  if (!banner) return;

  if (collection.provenance !== 'sample') {
    banner.remove();
    return;
  }

  render(
    banner,
    el('span', { class: 'provenance__tag' }, 'Demonstration archive'),
    el('span', { class: 'provenance__text' }, collection.provenanceNote)
  );
  banner.hidden = false;
}

/* -------------------------------------------------------------------------
   Entrance — the collection at a glance, all of it derived from the data.
   ------------------------------------------------------------------------- */
function renderEntrance() {
  qs('#museum-title').textContent = collection.title;
  qs('#museum-subtitle').textContent = collection.subtitle;

  const summary = collectionSummary(leagues);
  const plinths = [
    ['Leagues', summary.leagues],
    ['Seasons archived', summary.seasons],
    ['Champions crowned', summary.champions],
    ['Managers', summary.managers],
    ['Exhibits on show', summary.awards + summary.moments + summary.inductees]
  ];

  render(
    qs('#museum-stats'),
    plinths.map(([label, value]) =>
      el(
        'li',
        { class: 'plinth' },
        el('span', { class: 'plinth__value' }, String(value)),
        el('span', { class: 'plinth__label' }, label)
      )
    )
  );

  qs('#museum-since').textContent = `Collecting since ${summary.since}`;
}

/* -------------------------------------------------------------------------
   League selection drives every gallery below it.
   ------------------------------------------------------------------------- */
function initLeagues() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('league');
  const initial = leagues.find((league) => league.id === requested) ?? leagues[0];

  renderLeagueSwitch(qs('#league-switch'), leagues, initial.id, (id) => {
    const league = leagues.find((entry) => entry.id === id);
    if (!league) return;
    showLeague(league);

    // Keep the URL shareable without adding a history entry per click.
    const url = new URL(window.location.href);
    url.searchParams.set('league', league.id);
    window.history.replaceState({}, '', url);

    qs('#league-announce').textContent = `Now showing ${league.name}.`;
  });

  showLeague(initial);
}

function showLeague(league) {
  document.documentElement.style.setProperty('--league-accent', league.accent);

  renderLeagueProfile(qs('#league-profile'), league);
  renderSeasonArchive(qs('#season-rail'), qs('#season-detail'), league);
  renderHallOfFame(qs('#hall-of-fame-body'), league);
  renderAwards(qs('#award-filters'), qs('#award-grid'), league);
  renderMoments(qs('#moment-body'), league);
  renderRivalries(qs('#rivalry-body'), league);
  renderRecords(qs('#record-body'), league);
  renderMemoryWall(qs('#memory-body'), league);

  // Newly rendered content has no reveal state of its own; show it immediately
  // rather than leaving it invisible until the next scroll.
  initReveal(document.querySelector('.museum-galleries'));
}
