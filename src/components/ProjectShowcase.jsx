import { useState, useEffect, useCallback, useRef } from 'react'
import { resolveMedia } from '../lib/github.js'

function TextBlock({ body }) {
  return <p className="block-text">{body}</p>
}

function ImageBlock({ src, caption, ctx }) {
  return (
    <figure className="block-image">
      <img src={resolveMedia(src, ctx)} alt={caption || ''} loading="lazy" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

function GalleryBlock({ images, ctx, onOpen }) {
  const urls = images.map((src) => resolveMedia(src, ctx))
  return (
    <div className="block-gallery">
      {urls.map((url, i) => (
        <button
          key={url}
          className="gallery-thumb"
          onClick={() => onOpen(urls, i)}
          aria-label="Open image full size"
        >
          <img src={url} alt="" loading="lazy" />
        </button>
      ))}
    </div>
  )
}

function Lightbox({ images, index, onClose, onNavigate }) {
  const [closing, setClosing] = useState(false)
  const touchStart = useRef(null)
  const hasMultiple = images.length > 1

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(onClose, 160)
  }, [onClose])

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose()
      else if (e.key === 'ArrowLeft' && hasMultiple) onNavigate(-1)
      else if (e.key === 'ArrowRight' && hasMultiple) onNavigate(1)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [handleClose, onNavigate, hasMultiple])

  const handleTouchStart = (e) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null

    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      if (hasMultiple) onNavigate(dx > 0 ? -1 : 1)
    } else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) {
      handleClose()
    }
  }

  return (
    <div
      className={`lightbox ${closing ? 'lightbox-closing' : ''}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={handleClose}
        aria-label="Kapat"
      >
        ✕
      </button>

      {hasMultiple && (
        <button
          type="button"
          className="lightbox-nav lightbox-prev"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(-1)
          }}
          aria-label="Önceki görsel"
        >
          ‹
        </button>
      )}

      <img key={index} className="lightbox-img" src={images[index]} alt="" />

      {hasMultiple && (
        <button
          type="button"
          className="lightbox-nav lightbox-next"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(1)
          }}
          aria-label="Sonraki görsel"
        >
          ›
        </button>
      )}

      {hasMultiple && (
        <div className="lightbox-counter">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

function VideoBlock({ src, ctx }) {
  return (
    <video className="block-video" src={resolveMedia(src, ctx)} controls playsInline />
  )
}

function EmbedBlock({ url, label }) {
  if (!/^https:\/\//i.test(url)) return null
  return (
    <div className="block-embed">
      {label && <p className="block-embed-label">{label}</p>}
      <iframe
        src={url}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        referrerPolicy="no-referrer"
        title={label || 'Embedded content'}
      />
    </div>
  )
}

export default function ProjectShowcase({ manifest, ctx, onShowReadme }) {
  const [lightbox, setLightbox] = useState(null) // { images, index } | null

  const openLightbox = useCallback((images, index) => {
    setLightbox({ images, index })
  }, [])

  const navigateLightbox = useCallback((delta) => {
    setLightbox((prev) => {
      if (!prev) return prev
      const total = prev.images.length
      const nextIndex = (prev.index + delta + total) % total
      return { ...prev, index: nextIndex }
    })
  }, [])

  return (
    <div className="showcase">
      {manifest.cover && (
        <img
          className="showcase-cover"
          src={resolveMedia(manifest.cover, ctx)}
          alt=""
          loading="lazy"
        />
      )}

      {manifest.tagline && <p className="showcase-tagline">{manifest.tagline}</p>}

      {manifest.highlights?.length > 0 && (
        <ul className="showcase-highlights">
          {manifest.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}

      {manifest.blocks?.map((block, i) => {
        switch (block.type) {
          case 'text':
            return <TextBlock key={i} {...block} />
          case 'image':
            return <ImageBlock key={i} {...block} ctx={ctx} />
          case 'gallery':
            return (
              <GalleryBlock key={i} {...block} ctx={ctx} onOpen={openLightbox} />
            )
          case 'video':
            return <VideoBlock key={i} {...block} ctx={ctx} />
          case 'embed':
            return <EmbedBlock key={i} {...block} />
          default:
            return null
        }
      })}

      {manifest.links?.length > 0 && (
        <div className="showcase-links">
          {manifest.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      )}

      <button className="showcase-readme-toggle" onClick={onShowReadme}>
        View the README instead
      </button>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={navigateLightbox}
        />
      )}
    </div>
  )
}
