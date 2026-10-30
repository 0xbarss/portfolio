import p from '../data/personal.json'
import { useLang } from '../i18n/LangContext.jsx'

export default function Hero() {
  const { t, l } = useLang()
  return (
    <section id="top" className="hero">
      <div className="hero-text">
        <p className="hero-prompt">
          $ whoami <span className="cursor-blink" aria-hidden="true">_</span>
        </p>
        <h1>{p.name}</h1>
        <p className="hero-role">{l(p.role)}</p>
        <p className="hero-plain">{l(p.headline)}</p>
        {l(p.summary) && <p className="hero-sub">{l(p.summary)}</p>}
        <div className="hero-actions">
          <a href="#work" className="btn-primary">{t('hero.view')}</a>
          <a href="#contact" className="btn-secondary">{t('hero.contact')}</a>
        </div>
        {l(p.openTo) && <p className="hero-open">{t('hero.openTo')} {l(p.openTo)}</p>}
      </div>
    </section>
  )
}
