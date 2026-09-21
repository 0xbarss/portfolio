import { useEffect, useState, useCallback, useRef } from 'react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { parseOwnerRepo, resolveMedia } from '../lib/github.js'
import ProjectShowcase from './ProjectShowcase.jsx'

// Session cache so navigating between projects doesn't refetch
const manifestCache = new Map()
const readmeCache = new Map()

export default function ProjectDetail({ project, onBack, onSelectProject, allProjects = [] }) {
  const { owner, repo } = parseOwnerRepo(project.url)
  const branch = project.branch || 'main'
  const cacheKey = `${owner}/${repo}`

  // view: 'loading' | 'showcase' | 'readme'
  const [view, setView] = useState('loading')
  const [manifest, setManifest] = useState(null)
  const [hasManifest, setHasManifest] = useState(false)
  const [readmeStatus, setReadmeStatus] = useState('idle') // idle | loading | done | empty | error
  const [readmeHtml, setReadmeHtml] = useState('')
  const topRef = useRef(null)

  // Keyboard shortcut: Escape returns to portfolio
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onBack()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onBack, project.name])

  // Fetch README from GitHub with multi-branch fallback
  const fetchReadme = useCallback(async () => {
    const cached = readmeCache.get(cacheKey)
    if (cached) {
      setReadmeStatus(cached.status)
      setReadmeHtml(cached.html)
      return
    }

    setReadmeStatus('loading')

    // 1. Try raw.githubusercontent.com across all potential branches first (fast & no rate limits)
    const branchesToTry = [...new Set([branch, 'master', 'main'])].filter(Boolean)
    for (const b of branchesToTry) {
      try {
        const rawRes = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/${b}/README.md`
        )
        if (rawRes.ok) {
          const rawText = await rawRes.text()
          if (rawText && rawText.trim().length > 0) {
            const parsed = marked.parse(rawText)
            const clean = DOMPurify.sanitize(parsed)
            readmeCache.set(cacheKey, { status: 'done', html: clean })
            setReadmeStatus('done')
            setReadmeHtml(clean)
            return
          }
        }
      } catch {
        // try next branch
      }
    }

    // 2. Fallback to GitHub HTML API (auto-detects default branch)
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: { Accept: 'application/vnd.github.html+json' },
      })
      if (res.ok) {
        const raw = await res.text()
        const clean = DOMPurify.sanitize(raw)
        readmeCache.set(cacheKey, { status: 'done', html: clean })
        setReadmeStatus('done')
        setReadmeHtml(clean)
        return
      }
      if (res.status === 404) {
        readmeCache.set(cacheKey, { status: 'empty', html: '' })
        setReadmeStatus('empty')
        return
      }
    } catch {
      // Both failed
    }

    readmeCache.set(cacheKey, { status: 'error', html: '' })
    setReadmeStatus('error')
  }, [cacheKey, owner, repo, branch])

  // Fetch manifest once on mount or when project changes
  useEffect(() => {
    let cancelled = false
    setView('loading')

    const cached = manifestCache.get(cacheKey)
    if (cached !== undefined) {
      if (cached) {
        setManifest(cached)
        setHasManifest(true)
        setView('showcase')
        // Pre-fetch README in background for instant tab switching
        fetchReadme()
      } else {
        setHasManifest(false)
        setView('readme')
        fetchReadme()
      }
      return
    }

    const manifestUrl = resolveMedia('portfolio.json', { owner, repo, branch })
    fetch(manifestUrl)
      .then(async (res) => {
        if (cancelled) return
        if (!res.ok) {
          manifestCache.set(cacheKey, null)
          setHasManifest(false)
          setView('readme')
          fetchReadme()
          return
        }
        const json = await res.json()
        manifestCache.set(cacheKey, json)
        setManifest(json)
        setHasManifest(true)
        setView('showcase')
        // Pre-fetch README in background
        fetchReadme()
      })
      .catch(() => {
        if (!cancelled) {
          manifestCache.set(cacheKey, null)
          setHasManifest(false)
          setView('readme')
          fetchReadme()
        }
      })

    return () => {
      cancelled = true
    }
  }, [cacheKey, owner, repo, branch, fetchReadme])

  // Explicit handlers for tab switching
  const handleShowShowcase = () => {
    setView('showcase')
  }

  const handleShowReadme = () => {
    setView('readme')
    if (readmeStatus !== 'done') {
      fetchReadme()
    }
  }

  // Find previous and next projects
  const currentIndex = allProjects.findIndex((p) => p.name === project.name)
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null
  const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null

  const ctx = { owner, repo, branch }

  return (
    <article className="project-detail" ref={topRef}>
      {/* Sticky Top Navigation Bar */}
      <nav className="project-detail-nav" aria-label="Project detail navigation">
        <button
          type="button"
          onClick={onBack}
          className="detail-back-btn"
          aria-label="Back to all projects"
        >
          <span className="back-arrow" aria-hidden="true">←</span>
          <span>Back to all projects</span>
          <kbd className="key-hint">Esc</kbd>
        </button>

        <div className="detail-nav-actions">
          <span className="detail-branch-pill">branch: {branch}</span>
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="detail-github-btn"
          >
            <span>GitHub</span>
            <span className="ext-icon" aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      {/* Project Case Study Header */}
      <header className="project-detail-header">
        <div className="detail-header-eyebrow">
          <span className="eyebrow-folder">projects /</span>
          <span className="eyebrow-name">{repo}</span>
        </div>

        <h1 className="detail-title">{project.name}</h1>

        {project.stack?.length > 0 && (
          <div className="detail-stack-row">
            {project.stack.map((s) => (
              <span key={s} className="stack-chip">
                {s}
              </span>
            ))}
          </div>
        )}

        {project.description && (
          <p className="detail-lead">{project.description}</p>
        )}

        {/* View Switcher Tabs (always show if manifest exists) */}
        {hasManifest && (
          <div className="detail-view-tabs" role="tablist" aria-label="Project views">
            <button
              type="button"
              role="tab"
              aria-selected={view === 'showcase'}
              className={`detail-tab-btn ${view === 'showcase' ? 'active' : ''}`}
              onClick={handleShowShowcase}
            >
              Showcase Overview
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'readme'}
              className={`detail-tab-btn ${view === 'readme' ? 'active' : ''}`}
              onClick={handleShowReadme}
            >
              Repository README
            </button>
          </div>
        )}
      </header>

      {/* Main Body Content */}
      <div className="project-detail-body">
        {view === 'loading' && (
          <div className="detail-loading-box">
            <p className="detail-status">Loading project documentation…</p>
          </div>
        )}

        {view === 'showcase' && manifest && (
          <div className="detail-showcase-view">
            <ProjectShowcase
              manifest={manifest}
              ctx={ctx}
              onShowReadme={handleShowReadme}
            />
          </div>
        )}

        {view === 'readme' && (
          <div className="detail-readme-view">
            {readmeStatus === 'loading' && (
              <div className="detail-loading-box">
                <p className="detail-status">Fetching repository README…</p>
              </div>
            )}
            {readmeStatus === 'error' && (
              <div className="detail-error-box">
                <p className="detail-status">
                  Could not load the README directly. You can inspect it on GitHub:
                </p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ marginTop: '0.75rem', display: 'inline-flex' }}
                >
                  View on GitHub ↗
                </a>
              </div>
            )}
            {readmeStatus === 'empty' && (
              <p className="detail-status">This repository does not have a README file yet.</p>
            )}
            {readmeStatus === 'done' && (
              <div
                className="readme-content detail-readme-content"
                dangerouslySetInnerHTML={{ __html: readmeHtml }}
              />
            )}
            {hasManifest && (
              <div className="detail-back-to-showcase">
                <button
                  type="button"
                  className="showcase-readme-toggle"
                  onClick={handleShowShowcase}
                >
                  ← Back to showcase overview
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation & Project Pagination */}
      <footer className="project-detail-footer">
        <div className="detail-footer-back">
          <button
            type="button"
            onClick={onBack}
            className="detail-back-btn-large"
          >
            ← Back to all projects
          </button>
        </div>

        <div className="detail-pagination">
          {prevProject && (
            <button
              type="button"
              className="pagination-btn prev"
              onClick={() => onSelectProject(prevProject)}
            >
              <span className="pagination-dir">← Previous Project</span>
              <span className="pagination-title">{prevProject.name}</span>
            </button>
          )}
          {nextProject && (
            <button
              type="button"
              className="pagination-btn next"
              onClick={() => onSelectProject(nextProject)}
            >
              <span className="pagination-dir">Next Project →</span>
              <span className="pagination-title">{nextProject.name}</span>
            </button>
          )}
        </div>
      </footer>
    </article>
  )
}
