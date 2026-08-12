/**
 * @file The Museum's contents.
 *
 * ⚠️  EVERYTHING BELOW IS PLACEHOLDER DATA.
 *
 * The managers, seasons, records and moments are invented so the galleries can
 * be designed and tested against realistic content. None of it describes a real
 * league. `collection.provenance` is set to 'sample', which makes the museum
 * display a standing notice saying exactly that.
 *
 * To publish real history: replace the leagues below, then set
 * `provenance: 'live'` to retire the notice. See ./README.md for the workflow
 * and ./schema.js for the shape of each record.
 */

/** @type {import('./schema.js').Collection} */
export const collection = {
  title: 'Museum of Fantasy Sports',
  subtitle: 'A permanent collection of championships, humiliations, and things nobody agreed to let go of.',
  curator: 'Hunter Shapiro',
  provenance: 'sample',
  provenanceNote:
    'This is a demonstration archive. Every manager, season and record on this page is invented placeholder content, not real league history.'
};

/** @type {import('./schema.js').League[]} */
export const leagues = [
  {
    id: 'gridiron-society',
    name: 'The Gridiron Society',
    shortName: 'Gridiron',
    sport: 'Fantasy Football',
    platform: 'ESPN',
    founded: 2019,
    teams: 10,
    accent: '#d8b25e',
    monogram: 'GS',
    motto: 'Founded on a group chat. Sustained by spite.',
    about:
      'Ten managers, one $20 buy-in that nobody has ever raised, and a trophy that lives on whichever mantelpiece last earned it. The Society keeps records because somebody has to.',

    members: [
      { id: 'rook', name: 'Rook Callaghan', joined: 2019, team: 'Third & Regret' },
      { id: 'mara', name: 'Mara Ellis', joined: 2019, team: 'Ellis Island' },
      { id: 'devon', name: 'Devon Pike', joined: 2019, team: 'Pike Position' },
      { id: 'sana', name: 'Sana Okafor', joined: 2019, team: 'Okafor Nothing' },
      { id: 'bram', name: 'Bram Whitlock', joined: 2019, team: 'The Whitlock Ness Monster' },
      { id: 'juno', name: 'Juno Reyes', joined: 2019, team: 'Reyes of Sunshine' },
      { id: 'teddy', name: 'Teddy Nakamura', joined: 2020, team: 'Naka-Mordor' },
      { id: 'ines', name: 'Inés Vargas', joined: 2020, team: 'Varga Vice' },
      { id: 'cash', name: 'Cash Delacroix', joined: 2021, team: 'Cash Considerations' },
      { id: 'wren', name: 'Wren Ashby', joined: 2022, team: 'Ashby Ashby Ashby' }
    ],

    seasons: [
      {
        year: 2019,
        champion: 'mara',
        runnerUp: 'devon',
        regularSeasonCrown: 'bram',
        toiletBowl: 'juno',
        headline: 'The inaugural year, decided by four tenths of a point.',
        recap:
          'Nobody in the founding group expected the first final to matter this much. Mara clinched it on a Monday night stat correction that arrived after both managers had gone to bed.',
        finalScore: { champion: 121.4, runnerUp: 121.0 },
        standings: [
          { member: 'bram', w: 11, l: 3, pf: 1584.2, pa: 1402.6 },
          { member: 'mara', w: 10, l: 4, pf: 1571.8, pa: 1418.0 },
          { member: 'devon', w: 9, l: 5, pf: 1533.1, pa: 1451.9 },
          { member: 'sana', w: 8, l: 6, pf: 1498.7, pa: 1470.2 },
          { member: 'rook', w: 7, l: 7, pf: 1461.4, pa: 1462.8 },
          { member: 'juno', w: 3, l: 11, pf: 1247.9, pa: 1590.4 }
        ]
      },
      {
        year: 2020,
        champion: 'bram',
        runnerUp: 'mara',
        regularSeasonCrown: 'bram',
        toiletBowl: 'rook',
        headline: 'Bram wins the only wire-to-wire title in Society history.',
        recap:
          'First overall in week one, first overall in week fourteen, and insufferable for the entire calendar year in between.',
        finalScore: { champion: 148.6, runnerUp: 112.3 },
        standings: [
          { member: 'bram', w: 12, l: 2, pf: 1702.5, pa: 1388.1 },
          { member: 'mara', w: 10, l: 4, pf: 1611.3, pa: 1449.7 },
          { member: 'teddy', w: 9, l: 5, pf: 1566.0, pa: 1478.4 },
          { member: 'ines', w: 8, l: 6, pf: 1520.9, pa: 1501.2 },
          { member: 'devon', w: 6, l: 8, pf: 1444.6, pa: 1509.8 },
          { member: 'rook', w: 2, l: 12, pf: 1198.4, pa: 1655.9 }
        ]
      },
      {
        year: 2021,
        champion: 'devon',
        runnerUp: 'sana',
        regularSeasonCrown: 'sana',
        toiletBowl: 'ines',
        headline: 'A sixth seed wins it all and the playoff format is never questioned again.',
        recap:
          'Devon backed into the bracket at 6–8, then beat the top three seeds in consecutive weeks. The league voted to keep six playoff teams by a margin of one vote — his.',
        finalScore: { champion: 134.8, runnerUp: 128.2 },
        standings: [
          { member: 'sana', w: 11, l: 3, pf: 1655.4, pa: 1401.3 },
          { member: 'bram', w: 10, l: 4, pf: 1620.1, pa: 1444.0 },
          { member: 'cash', w: 9, l: 5, pf: 1588.7, pa: 1470.6 },
          { member: 'mara', w: 8, l: 6, pf: 1541.2, pa: 1499.5 },
          { member: 'devon', w: 6, l: 8, pf: 1466.9, pa: 1512.7 },
          { member: 'ines', w: 3, l: 11, pf: 1276.5, pa: 1618.8 }
        ]
      },
      {
        year: 2022,
        champion: 'sana',
        runnerUp: 'teddy',
        regularSeasonCrown: 'cash',
        toiletBowl: 'devon',
        headline: 'Sana converts the league\'s most-mocked draft into a title.',
        recap:
          'Three running backs in the first three rounds, universally ridiculed in the group chat, and then a 1,700-point season that ended the argument permanently.',
        finalScore: { champion: 159.2, runnerUp: 141.7 },
        standings: [
          { member: 'cash', w: 11, l: 3, pf: 1688.3, pa: 1412.9 },
          { member: 'sana', w: 10, l: 4, pf: 1712.6, pa: 1455.1 },
          { member: 'teddy', w: 9, l: 5, pf: 1601.4, pa: 1488.0 },
          { member: 'wren', w: 8, l: 6, pf: 1544.8, pa: 1502.3 },
          { member: 'juno', w: 6, l: 8, pf: 1470.2, pa: 1533.6 },
          { member: 'devon', w: 2, l: 12, pf: 1201.7, pa: 1690.4 }
        ]
      },
      {
        year: 2023,
        champion: 'mara',
        runnerUp: 'cash',
        regularSeasonCrown: 'mara',
        toiletBowl: 'bram',
        headline: 'Mara becomes the first two-time champion.',
        recap:
          'Four years between rings, and a title game she led from the opening Thursday slate to the final whistle.',
        finalScore: { champion: 137.9, runnerUp: 119.5 },
        standings: [
          { member: 'mara', w: 12, l: 2, pf: 1744.0, pa: 1379.5 },
          { member: 'cash', w: 10, l: 4, pf: 1633.8, pa: 1446.2 },
          { member: 'wren', w: 9, l: 5, pf: 1578.1, pa: 1477.9 },
          { member: 'rook', w: 8, l: 6, pf: 1529.4, pa: 1495.6 },
          { member: 'ines', w: 7, l: 7, pf: 1502.7, pa: 1518.3 },
          { member: 'bram', w: 3, l: 11, pf: 1288.6, pa: 1640.1 }
        ]
      },
      {
        year: 2024,
        champion: 'cash',
        runnerUp: 'rook',
        regularSeasonCrown: 'wren',
        toiletBowl: 'juno',
        headline: 'Cash finally wins one, three finals late.',
        recap:
          'Two runner-up finishes and a semi-final exit preceded this. The acceptance speech in the group chat ran to nine messages.',
        finalScore: { champion: 128.3, runnerUp: 126.9 },
        standings: [
          { member: 'wren', w: 11, l: 3, pf: 1670.9, pa: 1408.4 },
          { member: 'cash', w: 10, l: 4, pf: 1655.2, pa: 1432.7 },
          { member: 'rook', w: 9, l: 5, pf: 1611.0, pa: 1466.8 },
          { member: 'teddy', w: 8, l: 6, pf: 1560.3, pa: 1490.1 },
          { member: 'sana', w: 6, l: 8, pf: 1481.5, pa: 1521.9 },
          { member: 'juno', w: 3, l: 11, pf: 1265.8, pa: 1633.2 }
        ]
      },
      {
        year: 2025,
        champion: 'wren',
        runnerUp: 'mara',
        regularSeasonCrown: 'rook',
        toiletBowl: 'ines',
        headline: 'The newest manager takes the trophy in her fourth season.',
        recap:
          'Wren joined in 2022 as a replacement for a manager who stopped setting lineups. She has since finished top three every year.',
        finalScore: { champion: 144.1, runnerUp: 132.6 },
        standings: [
          { member: 'rook', w: 11, l: 3, pf: 1698.4, pa: 1421.0 },
          { member: 'wren', w: 10, l: 4, pf: 1681.7, pa: 1439.5 },
          { member: 'mara', w: 10, l: 4, pf: 1644.9, pa: 1452.8 },
          { member: 'cash', w: 8, l: 6, pf: 1572.2, pa: 1498.6 },
          { member: 'teddy', w: 7, l: 7, pf: 1519.6, pa: 1524.3 },
          { member: 'ines', w: 2, l: 12, pf: 1211.3, pa: 1702.7 }
        ]
      }
    ],

    hallOfFame: [
      {
        id: 'hof-mara',
        member: 'mara',
        inducted: 2023,
        honor: 'Champions',
        citation:
          'Two titles, six playoff appearances in seven seasons, and the only manager to win a final in both the league\'s first and most recent eras.',
        stat: { label: 'Championships', value: '2' }
      },
      {
        id: 'hof-bram',
        member: 'bram',
        inducted: 2022,
        honor: 'Champions',
        citation:
          'Author of the only wire-to-wire season. Also the only champion to finish last the following year, which the Society considers part of the achievement.',
        stat: { label: 'Best season', value: '12–2' }
      },
      {
        id: 'hof-sana',
        member: 'sana',
        inducted: 2024,
        honor: 'Champions',
        citation:
          'Highest single-season point total in Society history, achieved with a draft strategy every other manager publicly mocked.',
        stat: { label: 'Points, 2022', value: '1,712.6' }
      },
      {
        id: 'hof-devon',
        member: 'devon',
        inducted: 2023,
        honor: 'Builders',
        citation:
          'Wrote the constitution, runs the draft, and has never once been accused of favouring himself in a veto. Also won from the six seed.',
        stat: { label: 'Seasons as commissioner', value: '7' }
      },
      {
        id: 'hof-rook',
        member: 'rook',
        inducted: 2025,
        honor: 'Builders',
        citation:
          'Kept the spreadsheet that became this museum. Four straight top-four finishes without a title, which is its own kind of monument.',
        stat: { label: 'Playoff berths', value: '5' }
      },
      {
        id: 'hof-juno',
        member: 'juno',
        inducted: 2024,
        honor: 'Enduring Spirit',
        citation:
          'Three last-place finishes, zero missed lineups, and seven consecutive years of showing up to the draft with printed cheat sheets.',
        stat: { label: 'Lineups missed', value: '0' }
      }
    ],

    awards: [
      { id: 'aw-2019-1', year: 2019, name: 'Manager of the Year', member: 'bram', tone: 'honour', glyph: '★', note: 'Best record in the league\'s first season.' },
      { id: 'aw-2019-2', year: 2019, name: 'Toilet Bowl Champion', member: 'juno', tone: 'infamy', glyph: '⚑', note: 'Three wins, and one of them was a bye.' },
      { id: 'aw-2020-1', year: 2020, name: 'Biggest Draft Steal', member: 'teddy', tone: 'honour', glyph: '◆', note: 'Eleventh-round pick finished as a positional top five.' },
      { id: 'aw-2020-2', year: 2020, name: 'Most Points Left on the Bench', member: 'rook', tone: 'infamy', glyph: '⊘', note: '312.4 points, which would have been good for fourth place.' },
      { id: 'aw-2021-1', year: 2021, name: 'Best Trade', member: 'devon', tone: 'honour', glyph: '⇄', note: 'Turned an injured tight end into the piece that won him a title.' },
      { id: 'aw-2021-2', year: 2021, name: 'Worst Trade', member: 'ines', tone: 'infamy', glyph: '⇄', note: 'The other side of that same trade.' },
      { id: 'aw-2021-3', year: 2021, name: 'Biggest Upset', member: 'devon', tone: 'honour', glyph: '↯', note: 'Sixth seed over the one seed by 41 points.' },
      { id: 'aw-2022-1', year: 2022, name: 'Manager of the Year', member: 'sana', tone: 'honour', glyph: '★', note: 'Ignored everyone. Correctly.' },
      { id: 'aw-2022-2', year: 2022, name: 'Most Unlucky Season', member: 'juno', tone: 'infamy', glyph: '☂', note: 'Fifth in points scored, ninth in the standings.' },
      { id: 'aw-2023-1', year: 2023, name: 'League Villain', member: 'cash', tone: 'infamy', glyph: '☠', note: 'Four waiver claims made purely to block other managers.' },
      { id: 'aw-2023-2', year: 2023, name: 'Commissioner Award', member: 'devon', tone: 'honour', glyph: '⚖', note: 'Settled the scoring dispute without the league folding.' },
      { id: 'aw-2024-1', year: 2024, name: 'Manager of the Year', member: 'wren', tone: 'honour', glyph: '★', note: 'Best record in her third season, at twenty-three years old.' },
      { id: 'aw-2024-2', year: 2024, name: 'Draft Disaster', member: 'juno', tone: 'infamy', glyph: '⊘', note: 'Autodrafted. On purpose. To "prove a point".' },
      { id: 'aw-2025-1', year: 2025, name: 'Biggest Draft Steal', member: 'mara', tone: 'honour', glyph: '◆', note: 'Last pick of the draft finished as a weekly starter.' },
      { id: 'aw-2025-2', year: 2025, name: 'Toilet Bowl Champion', member: 'ines', tone: 'infamy', glyph: '⚑', note: 'Two wins, both in September.' }
    ],

    moments: [
      {
        id: 'mo-1',
        year: 2019,
        date: 'Championship Week',
        title: 'The four-tenths final',
        story:
          'Mara led by 0.4 points with one player left. Devon\'s receiver caught a pass, went out of bounds, and the stat correction came in at 1:40 the next afternoon. The screenshot of the final margin is still the group chat wallpaper.',
        tags: ['Championship', 'Stat correction', 'Founding era']
      },
      {
        id: 'mo-2',
        year: 2021,
        date: 'Semi-final',
        title: 'Devon beats the one seed with a kicker',
        story:
          'Down eleven with a single player remaining, Devon needed a kicker to score twelve. The kicker scored thirteen. Sana has not discussed it publicly since.',
        tags: ['Upset', 'Playoffs']
      },
      {
        id: 'mo-3',
        year: 2022,
        date: 'Draft night',
        title: 'The running back draft',
        story:
          'Three running backs in three rounds. Seven separate managers reacted with the same emoji. Sana said "noted" and won the championship four months later.',
        tags: ['Draft', 'Vindication']
      },
      {
        id: 'mo-4',
        year: 2023,
        date: 'Week 9',
        title: 'The veto that nearly ended the league',
        story:
          'A trade was proposed, accepted, vetoed, un-vetoed, and then re-vetoed inside eleven hours. The constitution gained an amendment. Two managers gained a rivalry.',
        tags: ['Trade', 'Governance', 'Chaos']
      },
      {
        id: 'mo-5',
        year: 2024,
        date: 'Championship Week',
        title: '1.4 points',
        story:
          'Cash won his first title by less than two points, having lost the two previous finals by a combined nine. He posted the bracket screenshot at 11:58pm and then again at 8:02am.',
        tags: ['Championship', 'Redemption']
      },
      {
        id: 'mo-6',
        year: 2025,
        date: 'Week 14',
        title: 'The newest manager clinches',
        story:
          'Wren locked up the top seed before Sunday afternoon and spent the rest of the day politely declining trade offers from managers who no longer needed anything.',
        tags: ['Regular season', 'New era']
      }
    ],

    rivalries: [
      {
        id: 'rv-1',
        members: ['mara', 'bram'],
        record: [9, 7],
        playoffMeetings: 3,
        streak: 'Mara, 2',
        heat: 94,
        story:
          'The founding rivalry. They have met in three finals, split the first two, and neither will concede that the third one counted.'
      },
      {
        id: 'rv-2',
        members: ['devon', 'sana'],
        record: [6, 10],
        playoffMeetings: 2,
        streak: 'Sana, 3',
        heat: 81,
        story:
          'Sana has the head-to-head. Devon has the semi-final where the kicker scored thirteen. They consider these equivalent.'
      },
      {
        id: 'rv-3',
        members: ['cash', 'rook'],
        record: [8, 8],
        playoffMeetings: 2,
        streak: 'Even',
        heat: 72,
        story:
          'Dead level after sixteen meetings, including a final decided by 1.4 points. Every matchup between them is now scheduled for prime time by request.'
      },
      {
        id: 'rv-4',
        members: ['juno', 'ines'],
        record: [7, 6],
        playoffMeetings: 0,
        streak: 'Juno, 1',
        heat: 45,
        story:
          'The Toilet Bowl rivalry. Contested annually, watched by nobody, discussed constantly.'
      }
    ],

    records: [
      { id: 'rc-1', label: 'Most points in a week', value: '211.6', member: 'sana', year: 2022, kind: 'peak', note: 'Week 5. Two players scored over forty.' },
      { id: 'rc-2', label: 'Fewest points in a week', value: '54.2', member: 'rook', year: 2020, kind: 'trough', note: 'Four starters on bye. Nobody has explained it.' },
      { id: 'rc-3', label: 'Largest margin of victory', value: '128.9', member: 'bram', year: 2020, kind: 'peak', note: 'Also the week he started calling himself "the standard".' },
      { id: 'rc-4', label: 'Closest victory', value: '0.4', member: 'mara', year: 2019, kind: 'peak', note: 'The inaugural championship.' },
      { id: 'rc-5', label: 'Longest winning streak', value: '11 weeks', member: 'bram', year: 2020, kind: 'peak' },
      { id: 'rc-6', label: 'Longest losing streak', value: '12 weeks', member: 'rook', year: 2020, kind: 'trough' },
      { id: 'rc-7', label: 'Best regular season', value: '12–2', member: 'mara', year: 2023, kind: 'peak', note: 'Shared with Bram, 2020.' },
      { id: 'rc-8', label: 'Most points, season', value: '1,744.0', member: 'mara', year: 2023, kind: 'peak' },
      { id: 'rc-9', label: 'Most points left on a bench', value: '312.4', member: 'rook', year: 2020, kind: 'trough' }
    ],

    memoryWall: [
      { id: 'mw-1', kind: 'quote', body: 'I am not saying the schedule is rigged. I am saying I would like to see the code.', attribution: 'Juno Reyes', year: 2022 },
      { id: 'mw-2', kind: 'note', body: 'Amendment 4: a trade may be vetoed once. Once. This is not negotiable and I am tired.', attribution: 'From the league constitution', year: 2023 },
      { id: 'mw-3', kind: 'quote', body: 'Noted.', attribution: 'Sana Okafor, on being told her draft was indefensible', year: 2022 },
      { id: 'mw-4', kind: 'note', body: 'Buy-in raised to $25. Motion failed 1–9. Motion has now failed seven years running.', attribution: 'Minutes, annual meeting', year: 2025 },
      { id: 'mw-5', kind: 'quote', body: 'Three finals. Three. I am going to talk about this at my wedding.', attribution: 'Cash Delacroix', year: 2024 },
      { id: 'mw-6', kind: 'artifact', body: 'The original trophy: a bowling trophy from a thrift shop with a sticker over the bowler. Still in use.', attribution: 'Acquired 2019', year: 2019 }
    ]
  },

  {
    id: 'hardwood-hall',
    name: 'Hardwood Hall',
    shortName: 'Hardwood',
    sport: 'Fantasy Basketball',
    platform: 'Yahoo',
    founded: 2022,
    teams: 8,
    accent: '#f1775d',
    monogram: 'HH',
    motto: 'Eight managers who could not agree on a football scoring format.',
    about:
      'A spin-off league founded by managers who wanted something to argue about between February and June. Younger, smaller, and considerably more chaotic than the Society.',

    members: [
      { id: 'teddy', name: 'Teddy Nakamura', joined: 2022, team: 'Nakamura Nine' },
      { id: 'wren', name: 'Wren Ashby', joined: 2022, team: 'Ashby Assists' },
      { id: 'cash', name: 'Cash Delacroix', joined: 2022, team: 'Cash Out' },
      { id: 'ines', name: 'Inés Vargas', joined: 2022, team: 'Varga Time' },
      { id: 'mara', name: 'Mara Ellis', joined: 2023, team: 'Ellis Elevation' },
      { id: 'juno', name: 'Juno Reyes', joined: 2023, team: 'Reyes Rebounds' }
    ],

    seasons: [
      {
        year: 2022,
        champion: 'teddy',
        runnerUp: 'wren',
        regularSeasonCrown: 'teddy',
        toiletBowl: 'ines',
        headline: 'The first Hall season, decided on a Sunday tiebreaker.',
        recap: 'Six of nine categories, all of them by a single stat.',
        standings: [
          { member: 'teddy', w: 14, l: 4, t: 0, pf: 0, pa: 0 },
          { member: 'wren', w: 12, l: 6, t: 0, pf: 0, pa: 0 },
          { member: 'cash', w: 9, l: 9, t: 0, pf: 0, pa: 0 },
          { member: 'ines', w: 4, l: 14, t: 0, pf: 0, pa: 0 }
        ]
      },
      {
        year: 2023,
        champion: 'wren',
        runnerUp: 'cash',
        regularSeasonCrown: 'wren',
        toiletBowl: 'juno',
        headline: 'Wren wins in her second year and immediately proposes a keeper format.',
        recap: 'The keeper proposal failed. The title stood.',
        standings: [
          { member: 'wren', w: 15, l: 3, t: 0, pf: 0, pa: 0 },
          { member: 'cash', w: 11, l: 7, t: 0, pf: 0, pa: 0 },
          { member: 'mara', w: 10, l: 8, t: 0, pf: 0, pa: 0 },
          { member: 'juno', w: 3, l: 15, t: 0, pf: 0, pa: 0 }
        ]
      },
      {
        year: 2024,
        champion: 'cash',
        runnerUp: 'teddy',
        toiletBowl: 'ines',
        headline: 'Cash wins a title in both leagues in the same calendar year.',
        recap: 'He has mentioned this. Repeatedly. In writing.',
        standings: [
          { member: 'cash', w: 13, l: 5, t: 0, pf: 0, pa: 0 },
          { member: 'teddy', w: 12, l: 6, t: 0, pf: 0, pa: 0 },
          { member: 'wren', w: 11, l: 7, t: 0, pf: 0, pa: 0 },
          { member: 'ines', w: 5, l: 13, t: 0, pf: 0, pa: 0 }
        ]
      },
      {
        year: 2025,
        champion: 'mara',
        runnerUp: 'wren',
        regularSeasonCrown: 'cash',
        toiletBowl: 'juno',
        headline: 'Mara completes the set with a title in both leagues.',
        recap: 'Cash has stopped mentioning 2024.',
        standings: [
          { member: 'cash', w: 14, l: 4, t: 0, pf: 0, pa: 0 },
          { member: 'mara', w: 12, l: 6, t: 0, pf: 0, pa: 0 },
          { member: 'wren', w: 12, l: 6, t: 0, pf: 0, pa: 0 },
          { member: 'juno', w: 4, l: 14, t: 0, pf: 0, pa: 0 }
        ]
      }
    ],

    hallOfFame: [
      {
        id: 'hh-hof-1',
        member: 'teddy',
        inducted: 2024,
        honor: 'Founders',
        citation: 'Started the league, won the first title, and wrote the category settings everyone still complains about.',
        stat: { label: 'Championships', value: '1' }
      },
      {
        id: 'hh-hof-2',
        member: 'wren',
        inducted: 2025,
        honor: 'Champions',
        citation: 'A title and two runner-up finishes in four seasons, with the best regular-season record in Hall history.',
        stat: { label: 'Best record', value: '15–3' }
      }
    ],

    awards: [
      { id: 'hh-aw-1', year: 2022, name: 'Manager of the Year', member: 'teddy', tone: 'honour', glyph: '★', note: 'Won the league he invented.' },
      { id: 'hh-aw-2', year: 2023, name: 'Biggest Upset', member: 'cash', tone: 'honour', glyph: '↯', note: 'Beat the top seed while missing two starters.' },
      { id: 'hh-aw-3', year: 2023, name: 'Toilet Bowl Champion', member: 'juno', tone: 'infamy', glyph: '⚑', note: 'Three wins across a nineteen-week season.' },
      { id: 'hh-aw-4', year: 2024, name: 'Best Trade', member: 'cash', tone: 'honour', glyph: '⇄', note: 'Two bench pieces for the category that won him the final.' },
      { id: 'hh-aw-5', year: 2025, name: 'League Villain', member: 'mara', tone: 'infamy', glyph: '☠', note: 'Streamed eleven players in one week to win a single category.' }
    ],

    moments: [
      {
        id: 'hh-mo-1',
        year: 2022,
        date: 'Final week',
        title: 'One rebound',
        story: 'The inaugural final came down to a single rebound in a game neither manager had a player left in. Teddy won it on a garbage-time possession at 11:47pm.',
        tags: ['Championship', 'Founding era']
      },
      {
        id: 'hh-mo-2',
        year: 2024,
        date: 'June',
        title: 'The double',
        story: 'Cash won Hardwood Hall in the spring and the Gridiron Society in the winter. He refers to this as "the double" and has requested it be capitalised.',
        tags: ['Championship', 'Cross-league']
      },
      {
        id: 'hh-mo-3',
        year: 2025,
        date: 'Week 6',
        title: 'Eleven streams, one category',
        story: 'Mara used every remaining transaction in a single week to win the blocks category by two. The league added a transaction cap the following season.',
        tags: ['Chaos', 'Governance']
      }
    ],

    rivalries: [
      {
        id: 'hh-rv-1',
        members: ['cash', 'wren'],
        record: [7, 8],
        playoffMeetings: 2,
        streak: 'Wren, 2',
        heat: 88,
        story: 'They have met in two finals and neither has won both. The 2024 and 2025 titles sit one each.'
      },
      {
        id: 'hh-rv-2',
        members: ['teddy', 'mara'],
        record: [5, 5],
        playoffMeetings: 1,
        streak: 'Even',
        heat: 63,
        story: 'The founder against the newcomer who won faster than he did.'
      }
    ],

    records: [
      { id: 'hh-rc-1', label: 'Best regular season', value: '15–3', member: 'wren', year: 2023, kind: 'peak' },
      { id: 'hh-rc-2', label: 'Worst regular season', value: '3–15', member: 'juno', year: 2023, kind: 'trough' },
      { id: 'hh-rc-3', label: 'Most categories won, week', value: '9 of 9', member: 'cash', year: 2024, kind: 'peak', note: 'A clean sweep. Once, ever.' },
      { id: 'hh-rc-4', label: 'Most transactions, week', value: '11', member: 'mara', year: 2025, kind: 'peak', note: 'Directly responsible for the transaction cap.' },
      { id: 'hh-rc-5', label: 'Longest winning streak', value: '9 weeks', member: 'wren', year: 2023, kind: 'peak' }
    ],

    memoryWall: [
      { id: 'hh-mw-1', kind: 'quote', body: 'It is called the double and I would like it capitalised.', attribution: 'Cash Delacroix', year: 2024 },
      { id: 'hh-mw-2', kind: 'note', body: 'Transaction cap introduced: 6 per week. Named informally after a manager who is still in the league.', attribution: 'Rule change', year: 2025 },
      { id: 'hh-mw-3', kind: 'quote', body: 'I invented this league and I am currently fifth.', attribution: 'Teddy Nakamura', year: 2025 }
    ]
  }
];
