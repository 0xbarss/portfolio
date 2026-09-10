import { useEffect, useRef, useState, useCallback } from 'react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { parseOwnerRepo, resolveMedia } from '../lib/github.js'
import ProjectShowcase from './ProjectShowcase.jsx'

// Cached across the session so reopening a project doesn't refetch it.
const manifestCache = new Map()
const readmeCache = new Map()

export default function ProjectModal({ project, onClose }) {
  const { owner, repo } = parseOwnerRepo(project.url)
  const branch = project.branch || 'main'
  const ctx = { owner, repo, branch }
  const cacheKey = `${owner}/${repo}`

  // view: 'loading' | 'showcase' | 'readme'
  const [view, setView] = useState('loading')
  const [manifest, setManifest] = useState(null)
  const [readmeStatus, setReadmeStatus] = useState('idle') // idle|loading|done|empty|error
  const [readmeHtml, setReadmeHtml] = useState('')
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const fetchReadme = useCallback(async () => {
    const cached = readmeCache.get(cacheKey)
    if (cached) {
      setReadmeStatus(cached.status)
      setReadmeHtml(cached.html)
      return
    }

    setReadmeStatus('loading')

    // 1. Try GitHub API first (pre-rendered HTML)
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: { Accept: 'application/vnd.github.html+json' },
      })
      if (res.status === 404) {
        readmeCache.set(cacheKey, { status: 'empty', html: '' })
        setReadmeStatus('empty')
        return
      }
      if (res.ok) {
        const raw = await res.text()
        const clean = DOMPurify.sanitize(raw)
        readmeCache.set(cacheKey, { status: 'done', html: clean })
        setReadmeStatus('done')
        setReadmeHtml(clean)
        return
      }
    } catch {
      // Fall through to raw markdown fallback
    }

    // 2. Fallback: fetch raw markdown from raw.githubusercontent.com (no rate limit)
    try {
      const rawRes = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`
      )
      if (rawRes.status === 404) {
        readmeCache.set(cacheKey, { status: 'empty', html: '' })
        setReadmeStatus('empty')
        return
      }
      if (rawRes.ok) {
        const rawText = await rawRes.text()
        const parsed = await marked.parse(rawText)
        const clean = DOMPurify.sanitize(parsed)
        readmeCache.set(cacheKey, { status: 'done', html: clean })
        setReadmeStatus('done')
        setReadmeHtml(clean)
        return
      }
    } catch {
      // Both failed
    }

    readmeCache.set(cacheKey, { status: 'error', html: '' })
    setReadmeStatus('error')
  }, [cacheKey, owner, repo, branch])

  // Try the curated .portfolio manifest dynamically from GitHub first; fall back to the README.
  useEffect(() => {
    let cancelled = false

    const cached = manifestCache.get(cacheKey)
    if (cached !== undefined) {
      if (cached) {
        setManifest(cached)
        setView('showcase')
      } else {
        setView('readme')
        fetchReadme()
      }
      return
    }

    fetch(resolveMedia('portfolio.json', ctx))
      .then(async (res) => {
        if (cancelled) return
        if (!res.ok) {
          manifestCache.set(cacheKey, null)
          setView('readme')
          fetchReadme()
          return
        }
        const json = await res.json()
        manifestCache.set(cacheKey, json)
        setView('showcase')
        setManifest(json)
      })
      .catch(() => {
        if (!cancelled) {
          manifestCache.set(cacheKey, null)
          setView('readme')
          fetchReadme()
        }
      })

    return () => {
      cancelled = true
    }
  }, [cacheKey, fetchReadme])

  const handleShowReadme = () => {
    setView('readme')
    if (readmeStatus === 'idle') {
      fetchReadme()
    }
  }

  const hasManifest = manifestCache.get(cacheKey) != null

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modal-window"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} details`}
      >
        <div className="modal-titlebar">
          <span className="modal-titlebar-file">
            {view === 'readme' ? `${repo}/README.md` : repo}
          </span>
          <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-meta">
            {project.stack?.length > 0 && (
              <div className="modal-stack">
                {project.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            )}
            <a className="modal-github-link" href={project.url} target="_blank" rel="noreferrer">
              Open on GitHub
            </a>
          </div>

          {project.description && (
            <div className="modal-lead">
              <p>{project.description}</p>
            </div>
          )}

          {view === 'loading' && <p className="modal-status">Loading…</p>}

          {view === 'showcase' && manifest && (
            <ProjectShowcase
              manifest={manifest}
              ctx={ctx}
              onShowReadme={handleShowReadme}
            />
          )}

          {view === 'readme' && (
            <>
              {readmeStatus === 'loading' && <p className="modal-status">Fetching README…</p>}
              {readmeStatus === 'error' && (
                <p className="modal-status">
                  Could not load the README right now. You can{' '}
                  <a href={project.url} target="_blank" rel="noreferrer">
                    open it directly on GitHub
                  </a>
                  .
                </p>
              )}
              {readmeStatus === 'empty' && (
                <p className="modal-status">This repo does not have a README yet.</p>
              )}
              {readmeStatus === 'done' && (
                <div className="readme-content" dangerouslySetInnerHTML={{ __html: readmeHtml }} />
              )}
              {hasManifest && (
                <button className="showcase-readme-toggle" onClick={() => setView('showcase')}>
                  Back to overview
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
