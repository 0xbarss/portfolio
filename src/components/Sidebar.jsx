import pinned from '../data/pinned.json'

export default function Sidebar({ activeProject, onBack }) {
  const hasWork = Boolean(pinned && pinned.length > 0)
  const links = [
    { href: '#about', label: 'About' },
    { href: '#exploring', label: 'Exploring' },
    { href: '#stack', label: 'Stack' },
    ...(hasWork ? [{ href: '#work', label: 'Work' }] : []),
    { href: '#contact', label: 'Contact' },
  ]

  const handleNavClick = (e, href) => {
    if (activeProject) {
      e.preventDefault()
      onBack?.()
      setTimeout(() => {
        const id = href.replace('#', '')
        const el = document.getElementById(id)
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }

  return (
    <aside className="sidebar">
      <a
        href="#top"
        className="sidebar-name"
        onClick={(e) => handleNavClick(e, '#top')}
      >
        Barış
        <br />
        Özdemir
      </a>

      {activeProject && (
        <button
          type="button"
          onClick={onBack}
          className="sidebar-back-pill"
          title="Return to main portfolio"
        >
          <span aria-hidden="true">←</span> Back to portfolio
        </button>
      )}

      <nav className="sidebar-nav" aria-label="Section navigation">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={(e) => handleNavClick(e, l.href)}
          >
            {l.label}
          </a>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div>İzmir, Türkiye</div>
        <a
          href="https://github.com/0xbarss"
          target="_blank"
          rel="noreferrer"
          className="sidebar-gh-link"
        >
          github.com/0xbarss
        </a>
      </div>
    </aside>
  )
}
