import p from '../data/personal.json'
import { useLang } from '../i18n/LangContext.jsx'

export default function Contact() {
  const { t, l } = useLang()
  return (
    <section id="contact" className="section contact">
      <h2>{t('contact.title')}</h2>
      <div className="section-body">
        <p>{t('contact.text').replace('{openTo}', l(p.openTo))}</p>
        <div className="contact-links">
          {p.contact.email && <a href={`mailto:${p.contact.email}`}>{p.contact.email}</a>}
          {p.contact.linkedin && <a href={p.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          <a href={`https://github.com/${p.github}`} target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
      <footer className="footer">© {new Date().getFullYear()} {p.name}</footer>
    </section>
  )
}
