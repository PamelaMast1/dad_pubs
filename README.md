# The Pub Odyssey (working title)

A site for exploring 44,736 pub visits spanning 1960&ndash;2011 &mdash; the record behind a
Guinness World Record for the most pubs visited by any person, ever.

React + Vite SPA, no backend. All data is baked into static JSON at build time and fetched by
the browser once; there's nothing to host except static files.

## Running it

```bash
npm install
npm run dev
```

Opens at http://localhost:5173 by default.

```bash
npm run build    # type-checks and builds dist/
npm run preview  # serve the production build locally
```

## Data pipeline

The source spreadsheet (`ALLPUBS.xlsx`) lives outside this repo &mdash; it's not committed. To
regenerate the site's data after an update to that file:

```bash
node scripts/build-data.mjs "C:\path\to\ALLPUBS.xlsx"
```

This writes `public/data/pubs.json`, `public/data/counties.json`, and `public/data/stats.json`,
which the app fetches at runtime. Those three files **are** committed, since they're the actual
site content and the raw source file isn't available to a fresh checkout or CI.

The script also normalises the source's ~285 inconsistent county spellings down to about 80
canonical counties/regions (for the map view) and parses the `D.M.YY` date format, where `0`
in any position means "unknown" (e.g. `0.10.60` = sometime in October 1960). A handful of rows
with a corrupted year (an extra stray digit in the original spreadsheet) are deliberately left
as "date unknown" rather than guessed at &mdash; see the comment in `parseDate()`.

Re-run the script and commit the regenerated JSON whenever the source spreadsheet changes.

## Filling in the personal content

Two things are stubbed out with clearly-marked placeholder boxes, since only family can supply
them:

- **Bio & fun facts** &mdash; `src/pages/About.tsx` and the two `<Tbc>` blocks at the bottom of
  `src/pages/Facts.tsx` and `src/pages/Home.tsx`. Replace the `<Tbc>` wrapped content directly.
- **Photos** &mdash; drop image files into `public/photos/`, then list them in
  `src/data/photos.ts`. The gallery at `/photos` picks them up automatically.

## Known data quirks

- 6 rows have a county label that's actually a London street name (a data-entry slip in the
  original spreadsheet) and aren't plotted on the map, though they still appear in Explore.
- The `xlsx` npm package (used only by the one-off `build-data.mjs` script, never shipped to the
  site) has an unpatched advisory upstream. Low risk here since it only ever parses our own
  trusted file, but worth knowing if `npm audit` flags it.

## Deploying

No domain's been picked yet. Once one is, any static host works (GitHub Pages, Netlify,
Vercel) &mdash; `npm run build` produces a plain `dist/` folder.
