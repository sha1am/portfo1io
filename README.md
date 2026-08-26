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
| Coding-profile counts | `codingProfiles` in `data/content.js` |
| Navigation items | `navigationItems` in `data/content.js` |

### A note on the coding-profile counts

These are maintained by hand and deliberately so. LeetCode's GraphQL API sends
no CORS headers, so a browser request from this site is blocked before it ever
reaches the server; Codeforces and StrataScratch expose no usable public
endpoint for solved counts. A previous version of this site shipped a fetch that
failed on every page load and silently fell back to hardcoded numbers. Fetching
them live would need a small server-side proxy.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes `dist/` to GitHub Pages. `vercel.json` is included for Vercel
deployments.

---

Built by Shadab Alam.
