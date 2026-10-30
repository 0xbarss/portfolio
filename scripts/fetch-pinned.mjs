// Builds src/data/pinned.json from your GitHub account. That file is generated
// and git-ignored: repositories live on GitHub, not in this repo.
//
// Only ever uses your PINNED repositories, never your full repo list:
//   1. With GITHUB_TOKEN: GitHub's GraphQL API (most reliable; CI has one).
//   2. Without a token: reads the pinned section of your public profile page.
// For each repo it also reads .portfolio/portfolio.json (if present) to get a
// plain-English tagline and highlights.
//
// Usage: [GITHUB_TOKEN=...] node scripts/fetch-pinned.mjs [username]

import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const personal = JSON.parse(readFileSync(new URL('../src/data/personal.json', import.meta.url), 'utf-8'))
const username =
  process.argv[2] || process.env.GITHUB_REPOSITORY_OWNER || personal.github
const token = process.env.GITHUB_TOKEN
const outPath = new URL('../src/data/pinned.json', import.meta.url)
const LIMIT = 6

function finish(projects) {
  writeFileSync(outPath, JSON.stringify(projects, null, 2) + '\n')
  console.log(`Wrote ${projects.length} repos to src/data/pinned.json`)
}

function keepExistingOrEmpty(reason) {
  console.warn(`${reason} Keeping existing pinned.json if present.`)
  if (!existsSync(outPath)) writeFileSync(outPath, '[]\n')
  process.exit(0)
}

async function viaGraphQL() {
  const query = `query ($login: String!) { user(login: $login) { pinnedItems(first: ${LIMIT}, types: [REPOSITORY]) { nodes { ... on Repository {
    name description url owner { login } defaultBranchRef { name } primaryLanguage { name }
    languages(first: 4, orderBy: { field: SIZE, direction: DESC }) { nodes { name } } } } } } }`
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login: username } }),
  })
  if (!res.ok) throw new Error(`GraphQL ${res.status}`)
  const { data, errors } = await res.json()
  if (errors) throw new Error(JSON.stringify(errors))
  return data.user.pinnedItems.nodes.map((r) => ({
    owner: r.owner.login,
    name: r.name,
    description: (r.description || '').trim(),
    url: r.url,
    branch: r.defaultBranchRef?.name ?? 'main',
    stack: r.languages?.nodes?.map((l) => l.name) ?? (r.primaryLanguage ? [r.primaryLanguage.name] : []),
  }))
}

function decode(t) {
  return t
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

// Reads the "Pinned" cards from https://github.com/<user>
async function viaProfilePage() {
  const res = await fetch(`https://github.com/${username}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (portfolio build script)' },
  })
  if (!res.ok) throw new Error(`profile page ${res.status}`)
  const html = await res.text()
  const cards = html.split('pinned-item-list-item').slice(1)
  const seen = new Set()
  const repos = []
  for (const card of cards) {
    const link = card.match(/PINNED_REPO[\s\S]*?href="\/([^"\/]+)\/([^"\/]+)"/)
    if (!link) continue
    const [, owner, name] = link
    if (seen.has(`${owner}/${name}`)) continue
    seen.add(`${owner}/${name}`)
    const desc = card.match(/pinned-item-desc[^>]*>([\s\S]*?)<\/p>/)
    const lang = card.match(/itemprop="programmingLanguage">([^<]+)</)
    repos.push({
      owner,
      name,
      description: desc ? decode(desc[1]) : '',
      url: `https://github.com/${owner}/${name}`,
      branch: 'main',
      stack: lang ? [decode(lang[1])] : [],
    })
  }
  if (repos.length === 0) throw new Error('no pinned repositories found on the profile page')
  return repos.slice(0, LIMIT)
}

async function readManifest(repo) {
  for (const branch of [...new Set([repo.branch, 'main', 'master'])]) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${branch}/.portfolio/portfolio.json`,
      )
      if (res.ok) return { manifest: await res.json(), branch }
    } catch {
      // try next branch
    }
  }
  return null
}

let repos
try {
  repos = token ? await viaGraphQL() : await viaProfilePage()
} catch (err) {
  try {
    if (!token) throw err
    console.warn(`GraphQL failed (${err.message}); trying the profile page.`)
    repos = await viaProfilePage()
  } catch (err2) {
    keepExistingOrEmpty(`Could not read pinned repositories (${err2.message}).`)
  }
}

// Text is stored as { en, tr } pairs, like personal.json. The manifest's own
// tagline/highlights are the English text; "translations": { "tr": {...} } is optional,
// and Turkish falls back to the English text when it is missing.
const pair = (en, tr) => {
  if (en && typeof en === 'object' && !Array.isArray(en)) return en
  return { en, tr: tr ?? en }
}

const projects = []
for (const repo of repos) {
  const found = await readManifest(repo)
  const m = found?.manifest
  const tr = m?.translations?.tr
  const tagline = m?.tagline
  projects.push({
    owner: repo.owner,
    name: repo.name,
    url: repo.url,
    branch: found?.branch ?? repo.branch,
    stack: repo.stack,
    description: pair(tagline || repo.description, tagline ? tr?.tagline : undefined),
    technical: tagline && repo.description ? pair(repo.description) : undefined,
    built: Array.isArray(m?.highlights) ? m.highlights : undefined,
    hasShowcase: Boolean(m),
  })
}
finish(projects)
