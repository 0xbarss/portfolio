import p from '../data/personal.json'
import { useLang } from '../i18n/LangContext.jsx'

export default function Exploring() {
  const { t, l } = useLang()
  const { intro, topics } = p.exploring
  if (!topics?.length) return null
  return (
    <section id="exploring" className="section exploring">
      <h2>{t('exploring.title')}</h2>
      <div className="section-body">
        <p>{l(intro)}</p>
      </div>
      <div className="exploring-grid">
        {topics.map((topic) => (
          <div className="exploring-card" key={topic.badge}>
            <div className="exploring-card-top">
              <span className="exploring-badge">{topic.badge}</span>
              <h3 className="exploring-title">{l(topic.title)}</h3>
            </div>
            <p className="exploring-desc">{l(topic.plain)}</p>
            {l(topic.tech) && <p className="exploring-tech">{l(topic.tech)}</p>}
            <div className="exploring-tags">
              {topic.tags?.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
