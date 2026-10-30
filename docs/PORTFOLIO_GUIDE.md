# Project Showcase Guide: How `.portfolio` Works

> The numbers and claims in the examples below are placeholders. Only publish figures you have measured yourself.

This guide explains how the `.portfolio` showcase convention works and how to add rich, interactive project showcases to any of your GitHub repositories.

---

## 1. Overview

By default, when visitors click on any project card in your portfolio, the site fetches and renders that repository's `README.md` directly.

However, a standard `README.md` is often written for contributors and developers reading code, which can be dense and code-heavy. If you want to present an executive showcase (visual architecture diagrams, video walkthroughs, key engineering metrics, or live interactive embeds) without altering your repository's developer-focused `README.md`, you can add a `.portfolio` folder to your repository.

### Dual-View Architecture

1. **Automatic Detection**: The portfolio site looks for `.portfolio/portfolio.json` on the repository's default branch.
2. **Showcase Mode**: If found, visitors see an interactive, media-rich showcase with a `Showcase` badge.
3. **Seamless Fallback**: If not found, the site smoothly falls back to rendering the repository's `README.md`.
4. **View Toggle**: Even on showcase-enabled projects, visitors can click **View README** inside the modal to inspect the raw repository documentation at any time.

---

## 2. Directory Structure in Your Target Repository

Add a folder named `.portfolio` at the root of your project repository:

```text
your-repo/
├── src/
├── Cargo.toml (or package.json, go.mod, etc.)
├── README.md
└── .portfolio/
    ├── portfolio.json       # Required: manifest file
    ├── cover.png            # Optional: header banner image
    ├── architecture.png     # Optional: architecture diagram
    ├── screenshot-1.png     # Optional: gallery image
    ├── screenshot-2.png     # Optional: gallery image
    └── demo.mp4             # Optional: local MP4 video
```

> **Note on Asset Paths**: Any relative filename specified in `portfolio.json` (such as `"architecture.png"`) automatically resolves to `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/.portfolio/<filename>`. You do not need to manually construct GitHub raw URLs.

---

## 3. Manifest Specification (`portfolio.json`)

The file `.portfolio/portfolio.json` defines your project showcase.

### Top-Level Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `tagline` | `string` \| `{ en, tr }` | A concise one-line summary displayed directly beneath the project title. |
| `cover` | `string` \| `object` | Relative path (e.g. `"cover.png"`), absolute URL, or object with `{ "src": "cover.png", "aspectRatio": "1200 / 630", "width": 1200, "height": 630 }`. |
| `coverAspectRatio` | `string` | Optional aspect ratio for cover image (e.g. `"1200 / 630"`, `"16 / 9"`) to prevent layout shift. |
| `highlights` | `string[]` \| `{ en, tr }[]` | Bullet-point engineering metrics, benchmarks, or key architecture achievements. |
| `links` | `object[]` | External links (the `label` can be an `{ en, tr }` pair) such as live demos, whitepapers, design docs, or blog posts. |
| `blocks` | `object[]` | Ordered body content blocks rendered sequentially in the modal. |

---

## 4. Supported Block Types

The `blocks` array allows you to compose your showcase sequentially using the following block types:

### A. Text Block (`type: "text"`)
Renders a paragraph of clean text (`body` can be an `{ en, tr }` pair) explaining design decisions, challenges, or architectural trade-offs.

```json
{
  "type": "text",
  "body": "The engine is built around a non-blocking lock-free ring buffer designed to handle <your measured throughput> ticks per second."
}
```

### B. Image Block (`type: "image"`)
Renders a full-width image with an optional caption (`caption` can be an `{ en, tr }` pair). Set `aspectRatio` (or `width` and `height`) to reserve container layout space and prevent Cumulative Layout Shift (CLS) as images stream from GitHub.

```json
{
  "type": "image",
  "src": "architecture.png",
  "caption": "Figure 1: High-level event-driven architecture and worker thread topology",
  "aspectRatio": "1100 / 640",
  "width": 1100,
  "height": 640
}
```

### C. Gallery Block (`type: "gallery"`)
Renders an interactive responsive grid of image thumbnails. Clicking any thumbnail opens a full-screen image preview.

```json
{
  "type": "gallery",
  "images": [
    "screenshot-1.png",
    "screenshot-2.png",
    "screenshot-3.png"
  ]
}
```

### D. Video Block (`type: "video"`)
Renders an HTML5 responsive video player with native controls, looping, and muted autoplay support. Supports local files in `.portfolio/` or external `.mp4`/`.webm` URLs.

```json
{
  "type": "video",
  "src": "demo.mp4"
}
```

### E. Embed Block (`type: "embed"`)
Renders a secure, sandboxed `<iframe>` for interactive web demos, live prototypes, or external video players (e.g. YouTube, Loom).

```json
{
  "type": "embed",
  "url": "https://demo.example.com",
  "label": "Interactive Sandbox"
}
```

---

## 5. Complete Real-World Example

Here is a complete, copy-pasteable `portfolio.json` example tailored for a high-performance systems or backend project:

```json
{
  "tagline": "A high-performance algorithmic trading and backtesting engine in Rust",
  "cover": "cover.png",
  "highlights": [
    "<A result you measured, with the number>",
    "<What the parallel backtester lets you do>",
    "Native Binance REST & WebSocket connectivity and MetaTrader 5 bridge",
    "<A design decision you made, and why>"
  ],
  "links": [
    {
      "label": "Architecture Spec",
      "url": "https://github.com/0xbarss/algo-trade#architecture"
    },
    {
      "label": "Benchmark Results",
      "url": "https://github.com/0xbarss/algo-trade#benchmarks"
    }
  ],
  "blocks": [
    {
      "type": "text",
      "body": "Traditional backtesting frameworks struggle with memory consumption and thread contention when scaling across multi-gigabyte order book snapshots. This system solves that problem by decoupling state execution from raw data ingestion."
    },
    {
      "type": "image",
      "src": "architecture.png",
      "caption": "Event loop separation between network ingress, risk validation, and execution threads"
    },
    {
      "type": "text",
      "body": "By leveraging lock-free ring buffers and batching network writes, tick-to-trade internal processing latency was measured at <your measured latency> on <your hardware>."
    },
    {
      "type": "gallery",
      "images": [
        "backtest-metrics.png",
        "order-book-depth.png"
      ]
    },
    {
      "type": "video",
      "src": "demo.mp4"
    }
  ]
}
```

---

## 6. English and Turkish text

The portfolio site has an EN | TR switch. Any text in your manifest can be written either as a plain string (shown in both languages) or as an `{ "en": "...", "tr": "..." }` pair (the visitor sees the one that matches their language). This is the same pattern as `src/data/personal.json` in the portfolio itself.

```json
{
  "tagline": {
    "en": "A memory manager written in C.",
    "tr": "C ile yazılmış bir bellek yöneticisi."
  },
  "highlights": [
    { "en": "Reuses freed memory", "tr": "Serbest bırakılan belleği yeniden kullanır" },
    "Boundary tag coalescing"
  ],
  "blocks": [
    {
      "type": "text",
      "body": { "en": "Why this design…", "tr": "Bu tasarımın nedeni…" }
    },
    {
      "type": "image",
      "src": "architecture.png",
      "caption": { "en": "Allocator layout", "tr": "Ayırıcı yapısı" }
    }
  ]
}
```

What this covers:

- **Translated:** `tagline`, `highlights` (each bullet may be a string or a pair, or the whole list may be `{ "en": [...], "tr": [...] }`), text block `body`, image `caption`, embed `label`, and link `label`. These appear on the project card, the "What I built" box, and the showcase page.
- **Fallback:** if a pair has no `tr`, or the text is a plain string, Turkish visitors see the English text.
- **Not translated:** file names and URLs, the repository README, and the technical summary (the repo's GitHub description). For those, write them in the language you want everyone to see.
- **No manifest at all:** the card shows the repo's GitHub description in both languages.

---

## 7. How to Add It to Any Repository (Step-by-Step)

1. Navigate to your target repository locally:
   ```bash
   cd ~/projects/your-project
   ```

2. Create the `.portfolio` directory:
   ```bash
   mkdir .portfolio
   ```

3. Create `portfolio.json`:
   Create `.portfolio/portfolio.json` using the example structure from Section 5 above.

4. Add your media files:
   Place any images or videos referenced in `portfolio.json` directly into the `.portfolio/` folder.

5. Commit and push:
   ```bash
   git add .portfolio/
   git commit -m "Add .portfolio showcase manifest and assets"
   git push origin main
   ```

6. Verification:
   Open your live portfolio website at `https://<your-username>.github.io/portfolio/`. Click on your project card to see the showcase page load dynamically, without rebuilding the site. The text on the project *cards* is read at build time, so it updates on the next deploy (the weekly rebuild, or run the workflow manually).
