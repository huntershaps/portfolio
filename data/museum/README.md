# Museum data

Everything the Museum shows comes from this folder. Nothing in `museum.html` or
the JavaScript needs to change to add a league, a season, an award or a memory.

```
schema.js    the shape of every record (JSDoc — your editor will check it)
leagues.js   the content itself
derive.js    anything that can be calculated: title counts, totals, standings order
```

## The sample-data notice

`leagues.js` currently exports `collection.provenance = 'sample'`, which puts a
standing notice at the top of the page saying the content is invented. **Leave it
that way until the leagues below are real.** Once they are:

```js
export const collection = {
  // ...
  provenance: 'live'
};
```

The notice removes itself.

## Adding a season

Append to the league's `seasons` array. Order does not matter — the archive
sorts newest-first, and the entrance recalculates its totals.

```js
{
  year: 2026,
  champion: 'rook',          // a member id, not a name
  runnerUp: 'mara',
  regularSeasonCrown: 'wren',
  toiletBowl: 'juno',
  headline: 'One line. This is the exhibit label.',
  recap: 'A short paragraph. Optional.',
  finalScore: { champion: 141.2, runnerUp: 138.8 },
  standings: [
    { member: 'rook', w: 11, l: 3, pf: 1688.1, pa: 1402.4 }
    // Partial standings are fine — the table says how many rows are missing.
  ]
}
```

Every `champion` / `member` field is a **member id** from the same league's
`members` array. An id that does not resolve renders as the raw id rather than
blank, so typos are visible immediately.

## Adding a league

Append to `leagues`. Only `id`, `name`, `shortName`, `sport`, `platform`,
`founded`, `teams`, `accent`, `monogram`, `motto`, `about`, `members` and
`seasons` are required — every other gallery is optional and shows an
"empty exhibit" placard until it has content.

`accent` is a CSS colour and becomes that league's identity throughout the page.

Each league is reachable directly at `/museum?league=<id>`.

## The other galleries

| Field        | Gallery              | Notes                                                        |
| ------------ | -------------------- | ------------------------------------------------------------ |
| `hallOfFame` | Hall of Fame         | Grouped by `honor`. A new `honor` string creates a new wing.  |
| `awards`     | Trophy case          | `tone: 'honour' \| 'infamy'` drives the colour. Filterable.   |
| `moments`    | Legendary moments    | Supports `media: [{ type: 'image', src, alt, caption }]`.     |
| `rivalries`  | Rivalries            | `heat` (0–100) drives the meter; `record` drives the bar.     |
| `records`    | Record book          | `kind: 'peak' \| 'trough'`. `value` is a pre-formatted string. |
| `memoryWall` | Memory wall          | `kind: 'quote' \| 'note' \| 'artifact'`, plus optional image. |

Nothing is hard-coded to the categories above. Adding a Hall of Fame `honor` of
`'Longest-Suffering'` or a record labelled `'Most consecutive autodrafts'` needs
no code change.

## Images

Put them under `assets/images/museum/` and reference them with a path relative
to the site root, e.g. `./assets/images/museum/2023-final.png`. Always write an
`alt` — the museum reads badly without one.

## Importing real history

League data can be pulled from ESPN and Yahoo, but neither is anonymous:

- **ESPN** private leagues and any prior season need the `SWID` and `espn_s2`
  cookies from a logged-in browser session.
- **Yahoo** requires a registered developer app for OAuth2, even for public
  leagues.

Both have to be supplied by the league owner. Until then, this folder is the
source of truth.
