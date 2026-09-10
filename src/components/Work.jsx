import { useState } from 'react'
import pinned from '../data/pinned.json'
import ProjectModal from './ProjectModal.jsx'

export default function Work() {
  const [active, setActive] = useState(null)

  if (!pinned || pinned.length === 0) {
    return null
  }

  return (
    <section id="work" className="section">
      <h2>Work</h2>
      <div className="section-body">
        <p>
          Featured projects demonstrating system design, concurrency, and application logic.
          Click any project card to view its documentation and details:
        </p>
      </div>

      <div className="work-grid">
        {pinned.map((p) => (
          <button
            key={p.name}
            type="button"
            className="project-card"
            onClick={() => setActive(p)}
          >
            <div className="project-card-header">
              <div className="project-title-wrap">
                <span className="project-icon" aria-hidden="true">
                  ⌥
                </span>
                <span className="project-title">{p.name}</span>
                {p.hasShowcase && (
                  <span className="showcase-badge" title="Has interactive showcase">
                    Showcase
                  </span>
                )}
              </div>
              <span className="project-branch">{p.branch || 'main'}</span>
            </div>

            {p.description && (
              <p className="project-desc">{p.description}</p>
            )}

            <div className="project-card-footer">
              {p.stack?.length > 0 && (
                <div className="project-stack">
                  {p.stack.map((s) => (
                    <span key={s} className="stack-chip">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <span className="project-inspect-btn">
                <span>View project</span>
                <span className="arrow-glyph" aria-hidden="true">
                  →
                </span>
              </span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <ProjectModal project={active} onClose={() => setActive(null)} />
      )}
    </section>
  )
}
