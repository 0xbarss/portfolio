import projects from '../data/pinned.json'
import { useLang } from '../i18n/LangContext.jsx'

export default function Work({ onSelectProject }) {
  const { t, l } = useLang()
  if (!projects || projects.length === 0) return null

  return (
    <section id="work" className="section">
      <h2>{t('work.title')}</h2>
      <div className="section-body">
        <p>{t('work.intro')}</p>
      </div>

      <div className="work-grid">
        {projects.map((p) => {
          const description = l(p.description)
          return (
            <button
              key={p.name}
              type="button"
              className="project-card"
              onClick={() => onSelectProject?.(p)}
              aria-label={p.name}
            >
              <div className="project-card-header">
                <div className="project-title-wrap">
                  <span className="project-icon" aria-hidden="true">⌥</span>
                  <span className="project-title">{p.name}</span>
                  {p.hasShowcase && <span className="showcase-badge">{t('work.showcase')}</span>}
                </div>
              </div>

              {description && <p className="project-desc">{description}</p>}

              <div className="project-card-footer">
                {p.stack?.length > 0 && (
                  <div className="project-stack">
                    {p.stack.map((s) => (
                      <span key={s} className="stack-chip">{s}</span>
                    ))}
                  </div>
                )}
                <span className="project-inspect-btn">
                  <span>{t('work.view')}</span>
                  <span className="arrow-glyph" aria-hidden="true">→</span>
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
