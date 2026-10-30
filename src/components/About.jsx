import p from '../data/personal.json'
import { useLang } from '../i18n/LangContext.jsx'

export default function About() {
  const { t, l } = useLang()
  const e = p.education
  const rows = [
    l(p.openTo) && [t('about.lookingFor'), l(p.openTo)],
    e.school && [t('about.education'), [e.school, e.degree, e.graduated].filter(Boolean).join(', ')],
    p.primaryLanguages && [t('about.languages'), p.primaryLanguages],
    p.location && [t('about.location'), p.location],
    l(p.workMode) && [t('about.workMode'), l(p.workMode)],
    l(p.relocation) && [t('about.relocation'), l(p.relocation)],
    l(p.english) && [t('about.english'), l(p.english)],
    [t('about.available'), l(p.availability) || t('about.ready'), true],
  ].filter(Boolean)

  return (
    <section id="about" className="section">
      <h2>{t('about.title')}</h2>
      <div className="about-layout">
        <div className="section-body">
          {p.about.map((para) => (
            <p key={para.en}>{l(para)}</p>
          ))}
        </div>
        <div className="snapshot-card">
          <div className="snapshot-header">
            <span className="snapshot-badge">{t('about.badge')}</span>
            <span className="snapshot-title">{t('about.glance')}</span>
          </div>
          <ul className="snapshot-list">
            {rows.map(([label, value, highlight]) => (
              <li key={label}>
                <span className="snapshot-label">{label}</span>
                <span className={highlight ? 'snapshot-value status-available' : 'snapshot-value'}>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
