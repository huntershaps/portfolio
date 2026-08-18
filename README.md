# Hunter Shapiro — Portfolio

A static site with no framework and no client-side rendering. Pages are
generated from plain data files by a small Node script; what the browser
receives is what the build wrote.

## Running locally

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:8000>. `npm run dev` restarts the server whenever a
content, render or server file changes. `npm start` runs it once, and
`npm run build` writes the deployable site to `dist/`.

## Where the content lives

**Everything you will want to edit is in `content/`.** Nothing is written into
the markup by hand.

| File                  | What it holds                                                        |
| --------------------- | -------------------------------------------------------------------- |
| `content/profile.js`  | Name, headline, contact links, education, experience, skills, questions |
| `content/projects.js` | Every project, its case study, the archive, and the lab               |

Both files open with the rules they are kept to, and every field that has no
real answer is `null` with a `TODO` beside it. The renderer skips anything
empty, so an unfinished case study becomes a shorter page rather than a padded
one.

### Adding a project

Copy the skeleton at the top of `content/projects.js` into the `projects`
array. A new entry gets a case-study page at `/work/<slug>`, an entry in the
command palette, a row in the timeline if you give it a date, and a card on the
homepage if you set `featured` or `building`. Nothing else needs touching.

### The lab

`content/projects.js` exports `lab`, which is deliberately empty. The section,
its styles and its palette entry all exist and switch on the moment you add an
item — while it is empty, the section does not render at all rather than
showing a placeholder.

## Layout

```
content/          the site's content, as data — start here
scripts/render/   pure functions that turn content into HTML
  html.js           escaping and the template tag
  layout.js         the shell: head, rail, utility controls, palette, footer
  home.js           the homepage
  project.js        case-study pages
  parts.js          pieces both pages share
  site.js           the route table and the palette's command list
javascript/       browser behaviour, loaded as ES modules
  index.js          homepage entry point
  work.js           case-study entry point
  lib/              nav, reveal, media frames, palette, mode, gallery, evolution
styles/
  tokens.css        colour, type, space, shape, motion
  base.css          reset, typography, focus, buttons
  components.css    pieces shared by both page types
  chrome.css        rail, utility controls, palette, recruiter mode, footer
  home.css          homepage sections
  work.css          case-study pages
build.js          renders every route into dist/ and copies the static folders
server.js         development server; also handles the contact form
```

## Routes

| Route           | What it is                                            |
| --------------- | ----------------------------------------------------- |
| `/`             | The portfolio                                          |
| `/work/<slug>`  | One case-study page per project in `content/projects.js` |
| `/museum`       | Redirects to the Museum of Fantasy Sports case study    |
| `/fantasy`      | Proxied to the Museum of Fantasy Sports app (separate deployment) |

## Two things worth knowing

**Recruiter mode.** The toggle top-right swaps the immersive page for a dense
summary — experience, education, projects and skills in one scan. It is applied
by an inline script before first paint, so it survives a reload without the
page visibly re-laying out, and it is shareable as `?mode=recruiter`.

**The command palette.** Ctrl/Cmd+K, or `/`. Its entries are generated from the
same content files as the pages, so it cannot list something the site does not
have, and every entry goes somewhere real.

## Deployment

Netlify builds with `node build.js` and publishes `dist/`.

`build.js` copies an **allowlist** of directories rather than ignoring a list of
secrets. Publishing the repository root would put `.env` and `.git` on a public
CDN, so a new asset directory has to be added to `SHIP` deliberately. The build
fails if `.env`, `.git`, `node_modules`, server code or the source directories
end up in `dist/`.

## Contact form

`POST /send-email` is handled in `server.js` with nodemailer.

- With SMTP credentials in `.env`, mail is delivered to `CONTACT_TO`.
- Without them, the server opens an [Ethereal](https://ethereal.email) test
  inbox and the form surfaces a preview link — nothing is actually delivered.

Copy `.env.example` to `.env` to configure it. `.env` is gitignored. The static
production deploy has no backend for this, so the form works locally only.

## Media notes

- The project videos are stored in git directly — no Git LFS, so a plain
  `git clone` gives you working files. They used to be LFS-tracked at 42 MB and
  52 MB, which meant a clone without `git lfs pull` produced 133-byte pointers
  and both previews silently failed.
- `recrd_demo.mp4` is 1.1 MB (from 42 MB) and `mahou_preview.mp4` is 2.6 MB
  (from a 52 MB QuickTime file that browsers other than Safari would not play
  at all). Both were re-encoded with:

  ```bash
  ffmpeg -i in.mp4 -an -vf scale=1280:-2 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart out.mp4
  ```

  `-an` drops the audio track, which a muted looping preview never uses, and
  `+faststart` moves the index to the front so playback can begin before the
  file has finished downloading.
- Each preview starts when it scrolls into view and pauses when it leaves.
  Nothing is fetched until that first intersection, and the poster with its
  play button remains the way in when autoplay is refused or the visitor
  prefers reduced motion.
- Screenshots are committed as WebP with a PNG fallback, at the width they are
  displayed. `assets/images/archive/` holds renders of earlier published
  versions of this site, taken from the actual commits.
