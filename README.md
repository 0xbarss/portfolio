# Barış Özdemir: Portfolio

Source for my personal portfolio site: [0xbarss.github.io/portfolio](https://0xbarss.github.io/portfolio/). Built with React and Vite, deployed to GitHub Pages.

## What the site does

- Switches between English and Turkish (EN | TR toggle). It starts in the visitor's browser language and remembers their choice.
- Shows my projects first, each with a plain-English summary and the full technical README.
- Reads each project's README (or an optional `.portfolio` showcase) live from GitHub.
- Pulls the project list from your GitHub account at build time (your pinned repos only: via the GraphQL API when a token is set, otherwise read from your public profile page) and rebuilds weekly. `src/data/pinned.json` is generated and git-ignored.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

## Where to edit things

| What | File |
| :--- | :--- |
| All personal details. Text that differs by language is an `{ "en": "...", "tr": "..." }` pair | `src/data/personal.json` |
| Interface wording (buttons, headings, labels) in EN and TR | `src/i18n/ui.js` |
| Plain-English project wording | each repo's `.portfolio/portfolio.json` (`tagline`, `highlights`), or its GitHub description |
| Which repos appear | pin them on GitHub; `scripts/fetch-pinned.mjs` syncs them at build |
| Stack tiers | `stack.groups` in `personal.json` (`core: true` highlights a tool) |
| Colors and fonts | `src/index.css` |
| Username used for fetching repos | `github` in `personal.json` |

Showcase setup for individual projects is in [`docs/PORTFOLIO_GUIDE.md`](docs/PORTFOLIO_GUIDE.md).

## Deploying

Pushing to `main` deploys through GitHub Actions. Set **Settings → Pages → Source** to **GitHub Actions** once.
