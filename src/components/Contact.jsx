export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <h2>Contact</h2>
      <div className="section-body">
        <p>
          I am open to backend engineering, systems development, and software engineering roles,
          available for remote, hybrid, or on-site opportunities.
          Whether you are a recruiter, hiring manager, or fellow engineer, feel free to reach out.
        </p>
        <div className="contact-links">
          <a href="mailto:baris.ozdemir.se@gmail.com">
            baris.ozdemir.se@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/-barisozdemir-/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href="https://github.com/0xbarss" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
      <footer className="footer">© {new Date().getFullYear()} Barış Özdemir</footer>
    </section>
  )
}
