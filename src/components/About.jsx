export default function About() {
  return (
    <section id="about" className="section">
      <h2>About</h2>
      <div className="about-layout">
        <div className="section-body">
          <p>
            I am a software engineer graduated from İzmir University of Economics.
            My work centers on backend engineering, distributed systems, and
            performance-critical software.
          </p>
          <p>
            In practice, that means designing backend APIs that remain fast under heavy traffic,
            structuring databases for reliability, and building services in languages like Rust,
            C, and Python. I turn complex product requirements into clean, maintainable systems
            that engineering teams can easily build upon.
          </p>
          <p>
            I learn best by understanding how technologies work beneath the surface.
            When working with a new protocol, database, or tool, I study its internal
            mechanics so I can make sound architectural choices and diagnose issues quickly
            in production.
          </p>
        </div>

        <div className="snapshot-card">
          <div className="snapshot-header">
            <span className="snapshot-badge">SNAPSHOT</span>
            <span className="snapshot-title">Profile Highlights</span>
          </div>
          <ul className="snapshot-list">
            <li>
              <span className="snapshot-label">Education</span>
              <span className="snapshot-value">İzmir University of Economics</span>
            </li>
            <li>
              <span className="snapshot-label">Specialization</span>
              <span className="snapshot-value">Backend &amp; Systems Engineering</span>
            </li>
            <li>
              <span className="snapshot-label">Primary Languages</span>
              <span className="snapshot-value">Rust, C, Python, TypeScript</span>
            </li>
            <li>
              <span className="snapshot-label">Location</span>
              <span className="snapshot-value">İzmir, Türkiye</span>
            </li>
            <li>
              <span className="snapshot-label">Work Mode</span>
              <span className="snapshot-value">Remote, Hybrid, or On-site</span>
            </li>
            <li>
              <span className="snapshot-label">Availability</span>
              <span className="snapshot-value status-available">Ready for roles</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
