import projects from '../data/pinned.json'
import personal from '../data/personal.json'
import { useLang } from '../i18n/LangContext.jsx'
import LangToggle from './LangToggle.jsx'

export default function Sidebar({ activeProject, onBack }) {
  const { t } = useLang()
  const hasWork = Boolean(projects && projects.length > 0)
  const links = [
    ...(hasWork ? [{ href: '#work', label: t('nav.work') }] : []),
    { href: '#about', label: t('nav.about') },
    { href: '#stack', label: t('nav.stack') },
    { href: '#exploring', label: t('nav.exploring') },
    { href: '#contact', label: t('nav.contact') },
  ]

  const handleNavClick = (e, href) => {
    if (activeProject) {
      e.preventDefault()
      onBack?.()
      setTimeout(() => {
        document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }

  return (
    <aside className="sidebar">
      <a href="#top" className="sidebar-name" onClick={(e) => handleNavClick(e, '#top')}>
        {personal.name.split(' ').map((part, i) => (
          <span key={part}>{i > 0 && <br />}{part}</span>
        ))}
      </a>

      {activeProject && (
        <button type="button" onClick={onBack} className="sidebar-back-pill">
          <span aria-hidden="true">←</span> {t('sidebar.back')}
        </button>
      )}

      <nav className="sidebar-nav" aria-label={t('nav.aria')}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
            {link.label}
          </a>
        ))}
      </nav>
      <LangToggle />
      <div className="sidebar-foot">
        <div>{personal.location}</div>
        <a href={`https://github.com/${personal.github}`} target="_blank" rel="noreferrer" className="sidebar-gh-link">
          github.com/{personal.github}
        </a>
      </div>
    </aside>
  )
}
