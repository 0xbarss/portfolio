import { useState } from 'react'
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
  return (
    <div className="block-gallery">
      {images.map((src) => {
        const url = resolveMedia(src, ctx)
        return (
          <button
            key={src}
            className="gallery-thumb"
            onClick={() => onOpen(url)}
            aria-label="Open image full size"
          >
            <img src={url} alt="" loading="lazy" />
          </button>
        )
      })}
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
  const [lightbox, setLightbox] = useState(null)

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
              <GalleryBlock key={i} {...block} ctx={ctx} onOpen={setLightbox} />
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
        <div className="lightbox" onMouseDown={() => setLightbox(null)}>
          <img src={lightbox} alt="" />
        </div>
      )}
    </div>
  )
}
