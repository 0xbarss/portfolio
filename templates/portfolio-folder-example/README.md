# The `.portfolio/` folder convention

Drop a `.portfolio/` folder in the root of any of your pinned repos and the
site will detect it automatically. If a repository does not have one, its
README is displayed instead, so nothing breaks for repositories you have not
customized yet.

```
your-repo/
├── src/...
├── README.md
└── .portfolio/
    ├── portfolio.json   <- required: the manifest below
    ├── cover.png         <- referenced by "cover"
    ├── architecture.png  <- referenced by an "image" block
    ├── shot-1.png ...    <- referenced by a "gallery" block
    └── demo.mp4          <- referenced by a "video" block
```

Copy `portfolio.json` from this folder as a starting point.

## Manifest fields

| Field        | Type            | Notes                                             |
| ------------ | --------------- | -------------------------------------------------- |
| `tagline`    | string          | Shown right under the project name.                |
| `cover`      | filename        | An image inside `.portfolio/`, shown as a banner.  |
| `highlights` | string[]        | Short, concise facts rather than full paragraphs.  |
| `links`      | `{label,url}[]` | Demo, write-up, or documentation links.            |
| `blocks`     | array           | Body content in sequential order. See below.       |

## Block types

- `{ "type": "text", "body": "..." }`: A paragraph of plain text rendered safely.
- `{ "type": "image", "src": "file.png", "caption": "..." }`: One full-width image with an optional caption.
- `{ "type": "gallery", "images": ["a.png", "b.png"] }`: A row of thumbnails; clicking one opens it full size.
- `{ "type": "video", "src": "file.mp4" }`: A local clip from `.portfolio/` or a direct URL to an `.mp4` or `.webm` file. For YouTube or Vimeo, use `embed` instead.
- `{ "type": "embed", "url": "https://...", "label": "..." }`: An iframe for interactive demos or video embeds. Sandboxed, requiring HTTPS.

Any `src` that is a relative filename (like `"cover.png"`) resolves against your repository's default branch automatically. You do not need to write raw GitHub URLs manually.

## Why a separate folder instead of only parsing the README

A README is written for engineers reading the code, keeping things terse and implementation-focused. A showcase manifest is aimed at visitors evaluating architecture, engineering decisions, and context. Keeping them distinct lets you present both perspectives without compromise.
