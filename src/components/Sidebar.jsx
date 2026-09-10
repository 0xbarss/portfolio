import pinned from '../data/pinned.json'

export default function Sidebar() {
  const hasWork = Boolean(pinned && pinned.length > 0)
  const links = [
    { href: '#about', label: 'About' },
    { href: '#exploring', label: 'Exploring' },
    { href: '#stack', label: 'Stack' },
    ...(hasWork ? [{ href: '#work', label: 'Work' }] : []),
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <aside className="sidebar">
      <a href="#top" className="sidebar-name">
        Barış
        <br />
        Özdemir
      </a>
      <nav className="sidebar-nav" aria-label="Section navigation">
        {links.map((l) => (
          <a key={l.href} href={l.href}>
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
