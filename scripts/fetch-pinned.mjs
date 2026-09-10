// Fetches your pinned repos via GitHub's GraphQL API and writes them to
// src/data/pinned.json, which the site imports at build time.
//
// GitHub's REST API has no concept of "pinned": only GraphQL exposes
// pinnedItems, and GraphQL requires an auth token even for public data.
// That's why this runs in CI (with the token as a secret) rather than
// in the browser.
//
// Usage: GITHUB_TOKEN=<token> node scripts/fetch-pinned.mjs [username]

import { readFileSync, writeFileSync } from 'node:fs'

const username =
  process.argv[2] ||
  process.env.GITHUB_REPOSITORY_OWNER ||
  process.env.GITHUB_REPOSITORY?.split('/')[0] ||
  '0xbarss'

const token = process.env.GITHUB_TOKEN

if (!token) {
  console.warn(
    'No GITHUB_TOKEN set: skipping pinned-repo refresh, keeping the ' +
      'existing src/data/pinned.json as-is.',
  )
  process.exit(0)
}

const query = `
  query ($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            defaultBranchRef { name }
            primaryLanguage { name }
            portfolioManifest: object(expression: "HEAD:.portfolio/portfolio.json") {
              oid
            }
            languages(first: 4, orderBy: { field: SIZE, direction: DESC }) {
              nodes { name }
            }
          }
        }
      }
    }
  }
`

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query, variables: { login: username } }),
})

if (!res.ok) {
  console.error('GitHub GraphQL request failed:', res.status, await res.text())
  process.exit(1)
}

const { data, errors } = await res.json()

if (errors) {
  console.error('GraphQL errors:', JSON.stringify(errors, null, 2))
  process.exit(1)
}

const pinnedPath = new URL('../src/data/pinned.json', import.meta.url)

let existingMap = {}
try {
  const existingRaw = readFileSync(pinnedPath, 'utf-8')
  const existingList = JSON.parse(existingRaw)
  if (Array.isArray(existingList)) {
    for (const p of existingList) {
      if (p?.name) existingMap[p.name] = p
    }
  }
} catch {
  // src/data/pinned.json does not exist yet or is invalid
}

const projects = data.user.pinnedItems.nodes.map((repo) => {
  const existing = existingMap[repo.name]
  const description = (repo.description && repo.description.trim()) || existing?.description || ''
  const stack = repo.languages?.nodes?.map((l) => l.name)?.length
    ? repo.languages.nodes.map((l) => l.name)
    : existing?.stack?.length
      ? existing.stack
      : repo.primaryLanguage
        ? [repo.primaryLanguage.name]
        : []

  return {
    name: repo.name,
    description,
    url: repo.url,
    branch: repo.defaultBranchRef?.name ?? existing?.branch ?? 'main',
    hasShowcase: Boolean(repo.portfolioManifest),
    stack,
  }
})

writeFileSync(
  pinnedPath,
  JSON.stringify(projects, null, 2) + '\n',
)

console.log(`Wrote ${projects.length} pinned repos to src/data/pinned.json`)
