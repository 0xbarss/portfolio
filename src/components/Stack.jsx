const groups = [
  {
    category: 'Languages',
    icon: '{ }',
    items: [
      { name: 'Rust', dot: '#ce412b' },
      { name: 'C', dot: '#555555' },
      { name: 'Python', dot: '#3572A5' },
      { name: 'Java', dot: '#b07219' },
      { name: 'TypeScript', dot: '#3178c6' },
    ],
  },
  {
    category: 'Backend & Data',
    icon: 'DATA',
    items: [
      { name: 'Node.js', dot: '#339933' },
      { name: 'PostgreSQL', dot: '#4169E1' },
      { name: 'MySQL', dot: '#4479A1' },
      { name: 'SQLite', dot: '#003B57' },
      { name: 'Firebase', dot: '#FFA611' },
    ],
  },
  {
    category: 'Systems & Tools',
    icon: 'SYS',
    items: [
      { name: 'Linux', dot: '#FCC624' },
      { name: 'Bash', dot: '#4EAA25' },
      { name: 'Git', dot: '#F05032' },
      { name: 'GitHub', dot: '#18181b' },
      { name: 'Postman', dot: '#FF6C37' },
    ],
  },
]

export default function Stack() {
  return (
    <section id="stack" className="section">
      <h2>Stack</h2>
      <div className="section-body">
        <p>
          Core languages, data engines, and developer tooling I rely on to build
          reliable systems:
        </p>
      </div>

      <div className="stack-cards">
        {groups.map((g) => (
          <div className="stack-card" key={g.category}>
            <div className="stack-card-header">
              <span className="stack-card-icon" aria-hidden="true">
                {g.icon}
              </span>
              <h3>{g.category}</h3>
            </div>
            <div className="stack-card-pills">
              {g.items.map((item) => (
                <span className="stack-pill" key={item.name}>
                  <span
                    className="stack-color-dot"
                    style={{ backgroundColor: item.dot }}
                    aria-hidden="true"
                  />
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
