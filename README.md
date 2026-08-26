# Shadab Alam — Portfolio

A single-page portfolio built with React 18 and Webpack 5, deployed to GitHub
Pages.

**Live:** https://sha1am.github.io/portfo1io/

## Features

- **Sticky navigation** with scroll-progress bar, active-section highlighting
  driven by scroll position, and a slide-down menu below 900px.
- **Light and dark themes.** The choice is persisted in `localStorage` and
  applied by an inline script in `<head>` before first paint, so the page never
  flashes the wrong theme.
- **Design token system.** Colour, type scale, spacing, radii and motion are all
  CSS custom properties defined once in `src/features/portfolio/portfolio.css`;
  the light theme re-declares the same names.
- **Accessible by default.** Skip link, visible focus rings, labelled controls,
  Escape-to-close and scroll-lock on the mobile menu, and a full
  `prefers-reduced-motion` path that disables every animation.
- **Content-driven.** All copy, roles, projects and links live in
  `src/features/portfolio/data/content.js` — no JSX edits needed to update the
  site's content.
- **Self-updating coding stats.** LeetCode and Codeforces solved counts are
  pulled from each platform's API at build time and refreshed daily by CI.

## Getting started

```bash
npm install
npm start          # dev server on http://localhost:3000
npm run build      # production build into dist/
```

## Project structure

```
src/
├── app/                      App root and CSS reset
├── shared/
│   ├── constants/            Theme, storage keys, a11y labels
│   ├── hooks/                useTheme, useActiveSection, useScrollState, useReveal
│   └── utils/                Google Drive URL helpers
├── features/portfolio/
│   ├── PortfolioPage.js      Page composition
│   ├── portfolio.css         Design tokens + all component styles
│   ├── components/           Header, hero, timeline, cards, footer, icons
│   └── data/content.js       All site content
└── assets/images/
```

## Updating content

| What | Where |
| --- | --- |
| Résumé link | `resumeAsset` in `data/content.js` (paste any Google Drive share URL) |
| Experience, projects, skills | the matching export in `data/content.js` |
| Coding-profile counts | automatic — see below |
| Navigation items | `navigationItems` in `data/content.js` |

## Coding-profile counts

The LeetCode and Codeforces counts refresh themselves. `scripts/fetch-coding-stats.mjs`
calls each platform's API and writes `src/features/portfolio/data/coding-stats.json`,
which the bundle imports.

```bash
npm run stats     # refresh the counts locally
npm test          # unit-test the response parsers
```

**Why this runs at build time rather than in the browser.** LeetCode's GraphQL
endpoint sends no CORS headers, so a `fetch` from the deployed page is blocked
before it reaches the server — and it needs a `Referer` header, which browsers
will not let JavaScript set. An earlier version of this site shipped exactly
that request; it failed on every page load, logged an error, and fell back to
hardcoded numbers. From Node there is no such restriction.

The deploy workflow runs on a daily cron (and on demand via *Run workflow* in
the Actions tab), so the published site is never more than a day stale without
anyone touching the repo.

**Failure behaviour.** The script never fails the build and never publishes a
worse number than it started with. If a platform errors, times out, or returns
a count *lower* than the committed one — which would mean the API changed shape
or returned partial history — that platform keeps its last known value and the
build carries on.

**StrataScratch** has no public API, so its count is the one genuinely manual
number: update `PROFILE_FALLBACKS.stratascratch` in `data/content.js`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes `dist/` to GitHub Pages. `vercel.json` is included for Vercel
deployments.

---

Built by Shadab Alam.
