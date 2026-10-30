import p from '../data/personal.json'
import { useLang } from '../i18n/LangContext.jsx'

export default function Stack() {
  const { t, l } = useLang()
  const { intro, groups } = p.stack
  return (
    <section id="stack" className="section">
      <h2>{t('stack.title')}</h2>
      <div className="section-body">
        <p>{l(intro)}</p>
      </div>
      <div className="stack-cards">
        {groups.map((g) => (
          <div className="stack-card" key={g.icon}>
            <div className="stack-card-header">
              <span className="stack-card-icon" aria-hidden="true">{g.icon}</span>
              <h3>{l(g.category)}</h3>
            </div>
            <div className="stack-card-pills">
              {g.items.map((item) => (
                <span className={item.core ? 'stack-pill stack-pill--core' : 'stack-pill'} key={item.name}>
                  <span className="stack-color-dot" style={{ backgroundColor: item.dot }} aria-hidden="true" />
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
