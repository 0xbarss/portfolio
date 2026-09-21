# Personal Engineering Portfolio

A modern, fast, and responsive software engineering portfolio built with React and Vite.

Live Profile: [github.com/0xbarss](https://github.com/0xbarss)

---

## Features

- **Modern Clean Sans Theme**: Built with Inter and JetBrains Mono typography, clean zinc borders, and electric blue accents.
- **Dynamic Project Showcases**: Fetches `.portfolio/portfolio.json` dynamically from the default branch of your repositories. If a repository has a `.portfolio` manifest, visitors can explore interactive highlights and media.
- **Resilient Documentation Viewer**: Reads repository README files directly using the GitHub API with a markdown fallback parser to prevent unauthenticated rate limiting.
- **Profile Snapshot**: Highlights education, specializations, primary languages, location, work modes (remote, hybrid, or on-site), and availability.
- **Automated Pinned Projects Sync**: Includes a build script (`scripts/fetch-pinned.mjs`) that synchronizes pinned repositories using GitHub's GraphQL API.
- **Universal Base Path**: Preconfigured with relative asset paths so the site works out of the box on both repository subpaths (`username.github.io/portfolio`) and root user domains (`username.github.io`).

---

## Quick Start (Local Development)

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production

```bash
npm run build
```

This compiles the application into the `dist/` directory.

### 4. Preview the production build locally

```bash
npm run preview
```

---

## How to Publish to GitHub Pages

### Method 1: Automated GitHub Actions (Recommended)

The project includes an automated deployment workflow at `.github/workflows/deploy.yml`.

1. **Create a GitHub repository**:
   Create a new public repository on GitHub (for example, named `portfolio` or `<username>.github.io`).

2. **Initialize git and push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: modern engineering portfolio"
   git branch -M main
   git remote add origin https://github.com/<username>/<your-repo-name>.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment > Source**, select **GitHub Actions**.

4. **Automatic Deployment**:
   - Once selected, the workflow triggers automatically on every push to `main`.
   - You can also trigger the deployment manually at any time via the "Run workflow" button in the Actions tab.
   - Within 1 to 2 minutes, your site will be live at `https://<username>.github.io/<your-repo-name>/` (or `https://<username>.github.io/` if using your root domain).

---

### Method 2: Manual Build and Deploy

If you prefer building locally and deploying the static build directly:

```bash
npm run build
npm run deploy
```

This uses the `gh-pages` package to push the contents of `dist/` directly to a `gh-pages` branch. Then set your GitHub Pages source to deploy from the `gh-pages` branch in repository settings.

---

## Project Structure

```text
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/                     # Static public assets
├── scripts/
│   └── fetch-pinned.mjs        # GitHub GraphQL fetcher for pinned repositories
├── src/
│   ├── components/
│   │   ├── About.jsx           # Bio, specialization, and Profile Snapshot card
│   │   ├── Contact.jsx         # Contact links and work mode statement
│   │   ├── Exploring.jsx       # Research areas and technical topics
│   │   ├── Hero.jsx            # Headline, role, whoami prompt, and action buttons
│   │   ├── ProjectModal.jsx    # Modal viewer with dynamic .portfolio & README fetch
│   │   ├── ProjectShowcase.jsx # Interactive showcase renderer for .portfolio manifests
│   │   ├── Sidebar.jsx         # Navigation sidebar and location info
│   │   ├── Stack.jsx           # Languages, backend engines, and developer tooling
│   │   └── Work.jsx            # Project cards rendered from pinned.json
│   ├── data/
│   │   └── pinned.json         # Static pinned repositories data
│   ├── lib/
│   │   └── github.js           # GitHub media URL resolver and repo parser
│   ├── App.css                 # Application layout, card styles, and animations
│   ├── App.jsx                 # Top-level application layout
│   ├── index.css               # Design system tokens (Inter, JetBrains Mono, colors)
│   └── main.jsx                # Application entry point
├── index.html                  # HTML entry point with Google Fonts
├── package.json                # Dependencies and scripts
├── PORTFOLIO_GUIDE.md          # Guide on adding .portfolio showcases to projects
└── vite.config.js              # Vite configuration with relative base path
```

---

## Customizing Content for Your Own Profile

1. **Personal Information and Bio**:
   - Update your name, role, and intro in [`src/components/Hero.jsx`](file:///home/bariss/Masaüstü/portfolio/src/components/Hero.jsx).
   - Update your education, summary, and snapshot details in [`src/components/About.jsx`](file:///home/bariss/Masaüstü/portfolio/src/components/About.jsx).
   - Update your name and links in [`src/components/Sidebar.jsx`](file:///home/bariss/Masaüstü/portfolio/src/components/Sidebar.jsx).

2. **Projects and Showcases**:
   - Edit [`src/data/pinned.json`](file:///home/bariss/Masaüstü/portfolio/src/data/pinned.json) with your own repositories.
   - Read [`PORTFOLIO_GUIDE.md`](file:///home/bariss/Masaüstü/portfolio/PORTFOLIO_GUIDE.md) to learn how to add interactive showcases (`.portfolio/portfolio.json`) with diagrams, videos, and metrics to any repository.
   - In [`scripts/fetch-pinned.mjs`](file:///home/bariss/Masaüstü/portfolio/scripts/fetch-pinned.mjs), change the default username to your GitHub username.
   - To refresh pinned repositories automatically from GitHub's GraphQL API, run:
     ```bash
     export GITHUB_TOKEN=your_personal_access_token
     npm run build
     ```

3. **Tech Stack**:
   - Update the categories and skills in [`src/components/Stack.jsx`](file:///home/bariss/Masaüstü/portfolio/src/components/Stack.jsx).

4. **Contact Details**:
   - Update your email and social profiles in [`src/components/Contact.jsx`](file:///home/bariss/Masaüstü/portfolio/src/components/Contact.jsx).

5. **Styling and Theme Tokens**:
   - Tweak colors, fonts, and spacing variables in [`src/index.css`](file:///home/bariss/Masaüstü/portfolio/src/index.css).

