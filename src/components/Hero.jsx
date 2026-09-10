export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-text">
        <p className="hero-prompt">
          $ whoami <span className="cursor-blink" aria-hidden="true">_</span>
        </p>
        <h1>Barış Özdemir</h1>
        <p className="hero-role">Software Engineer | Backend and Systems</p>
        <p className="hero-sub">
          I build reliable, high-performance software. My work focuses on backend
          services, data processing, and systems programming.
        </p>
        <div className="hero-actions">
          <a href="#work" className="btn-primary">View Projects</a>
          <a href="#contact" className="btn-secondary">Get in Touch</a>
        </div>
      </div>
    </section>
  )
}

