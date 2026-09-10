export function parseOwnerRepo(githubUrl) {
  const { pathname } = new URL(githubUrl)
  const [owner, repo] = pathname.split('/').filter(Boolean)
  return { owner, repo }
}

// Resolves a bare filename living inside .portfolio/ (e.g. "cover.png")
// to its raw GitHub URL. Leaves anything that's already a full URL alone,
// so manifest authors can also link to media hosted elsewhere.
export function resolveMedia(value, { owner, repo, branch }) {
  if (!value) return value
  if (/^https?:\/\//i.test(value)) return value
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/.portfolio/${value}`
}
