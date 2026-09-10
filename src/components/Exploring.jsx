const threads = [
  {
    badge: 'MEM',
    title: 'Memory management & allocators',
    desc: 'Writing low-overhead memory routines to maximize execution speed and reduce infrastructure costs.',
    tags: ['Custom allocators', 'Cache alignment', 'Zero-copy'],
  },
  {
    badge: 'NET',
    title: 'Network programming with raw sockets',
    desc: 'Building custom communication channels directly on network protocols for ultra-low latency.',
    tags: ['POSIX sockets', 'TCP / UDP', 'Sub-ms latency'],
  },
  {
    badge: 'VM',
    title: 'Virtual machines & emulator internals',
    desc: 'Understanding how instruction sets, compilers, and execution loops run at the hardware boundary.',
    tags: ['Bytecode loops', 'Register state', 'Dispatch tables'],
  },
  {
    badge: 'HW',
    title: 'Embedded & bare-metal systems',
    desc: 'Developing software close to physical hardware under strict memory and processing constraints.',
    tags: ['Microcontrollers', 'Memory-mapped I/O', 'Low power'],
  },
]

export default function Exploring() {
  return (
    <section id="exploring" className="section exploring">
      <h2>Currently exploring</h2>
      <div className="section-body">
        <p>
          Beyond day-to-day backend services, I spend time exploring low-level systems programming
          in C and Rust. Understanding how computers operate at the hardware and operating system
          level helps me write safer, more efficient software across the entire stack:
        </p>
      </div>

      <div className="exploring-grid">
        {threads.map((t) => (
          <div className="exploring-card" key={t.title}>
            <div className="exploring-card-top">
              <span className="exploring-badge">{t.badge}</span>
              <h3 className="exploring-title">{t.title}</h3>
            </div>
            <p className="exploring-desc">{t.desc}</p>
            <div className="exploring-tags">
              {t.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
