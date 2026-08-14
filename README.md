# Hunter Shapiro — Portfolio

A dependency-light static site served by a small Node HTTP server. No build step:
the HTML, CSS and ES modules in this repository are what the browser receives.

## Running locally

```bash
npm install
```

```bash
npm start
```

Then open <http://localhost:8000>.

## Pages

| Route      | File          | What it is                                                     |
| ---------- | ------------- | -------------------------------------------------------------- |
| `/`        | `index.html`  | The portfolio itself                                             |
| `/museum`  | `museum.html` | Museum of Fantasy Sports — an interactive league history archive |

Clean URLs are resolved in `server.js`. Add a page by dropping in `newpage.html`
— extensionless URLs fall through to `<name>.html` automatically — and add an
entry to `ROUTES` if you want a URL that does not match the filename.

## Layout

```
assets/          fonts, images, video, résumé
data/museum/     the Museum's content, as plain ES modules (see its README)
javascript/
  index.js         homepage entry point
  museum.js        museum entry point
  lib/             shared behaviour used by both pages
styles/
  tokens.css       design tokens: colour, type scale, spacing, motion
  base.css         resets, typography, focus, shared utilities
  chrome.css       site chrome: skip link, rail navigation, footer
  home.css         homepage sections
  museum.css       museum sections
```

Stylesheets are linked individually rather than chained with `@import` so the
browser can fetch them in parallel.

## Contact form

`POST /send-email` is handled in `server.js` with nodemailer.

- With SMTP credentials in `.env`, mail is delivered to `CONTACT_TO`.
- Without them, the server opens an [Ethereal](https://ethereal.email) test
  inbox and the form surfaces a preview link — nothing is actually delivered.

Copy `.env.example` to `.env` to configure it. `.env` is gitignored.

## Notes

- Project videos are tracked with Git LFS; run `git lfs pull` to fetch them.
  `mahou_preview.mp4` is 2.6 MB. `recrd_demo.mp4` is 42 MB and is the one worth
  compressing next — the Mahou clip went from a 52 MB QuickTime file, which
  browsers other than Safari would not play at all, to this.
- Both sit behind click-to-play posters, so the page stays fast and stays
  presentable whether or not LFS has been fetched.
- The Museum ships with clearly-labelled **sample data**. See
  [`data/museum/README.md`](data/museum/README.md) for the shape of the real thing.
