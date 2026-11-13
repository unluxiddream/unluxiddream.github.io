---
aliases:
title: UnluXidDream 공식 포트폴리오 웹사이트
subtitle: (Astro, Obsidian, GitHub Pages)
title_kr: UnluXidDream 공식 포트폴리오 웹사이트
title_en: UnluXidDream Official Portfolio Website
title_jp: UnluXidDream 公式ポートフォリオサイト
title_cn: UnluXidDream 官方作品集网站
featured: false
creation_date: "20261108021800"
release_date: "20261113"
categories:
  - Web Development
work_type:
projects:
roles:
  - 기획
  - 개발
  - 디자인
youtube_link:
streaming_url:
sheet_url:
cover: "[[development_officialunlud.webp]]"
genres: Web Page
github_url: https://github.com/unluxiddream/unluxiddream.github.io
---
# UnluXidDream — Official Portfolio

**UnluD | 루드 | ルード** — composer and multi-artist.

This repository holds the source of my official portfolio site: composition, vocals, arrangement, lyrics, mixing & mastering, artwork, video, and publication work, all in one place.

🔗 **Live site:** [unluxiddream.com](https://unluxiddream.com)

![UnluXidDream](public/og-image.png)

---

## Features

- **Four languages** — Korean (default), English, Japanese, and Chinese. Work titles switch instantly; the About page has a dedicated version per language.
- **Works by discipline** — *Music & Audio*, *Visual & Video*, and *Other Works* tabs, each with role filters (composition, vocals, illustration, score engraving, translation, …) and sorting.
- **Site-wide search** — by title (in any language), genre, or role.
- **Dark / light themes** — crimson accents in dark mode, gold in light mode.
- **Obsidian-powered content** — every work is a Markdown note in an Obsidian vault. Write it in Obsidian, push, and it's live.
- **Automatic covers** — a work's cover can be a local image, a YouTube link (the thumbnail is used), or any web page (its preview image is used).
- **Index tags** — *Original*, *Cover*, *Participation*, *Commission*, *Score*, and project tags (*LuDiA*, *LeXidN*) on each cover.

## Tech stack

| | |
|---|---|
| Framework | [Astro](https://astro.build) 7 (static output) |
| Content | Markdown + YAML frontmatter, managed in [Obsidian](https://obsidian.md) |
| Markdown | remark (`remark-breaks`, plus a small plugin for Obsidian `![[image]]` embeds) |
| Styling | Plain CSS with design tokens — no framework |
| Fonts | Noto Serif (headings) / Noto Sans (body), incl. KR · JP · SC |
| Hosting | GitHub Pages via GitHub Actions |

## Project structure

```
.
├─ Official_UnluD/            # Obsidian vault (content)
│  ├─ Works/                  # one Markdown file per work
│  └─ Attachments/            # images used by works (served at /images/)
├─ public/                    # favicon, link-preview image, static files
├─ src/
│  ├─ assets/images/          # profile images (optimized at build time)
│  ├─ components/             # cards, header, filters, search, …
│  ├─ config/site.ts          # site settings: links, tags, filters, tab mapping
│  ├─ lib/i18n.ts             # UI strings in four languages
│  ├─ pages/                  # routes (home, tabs, About ×4, contact, works)
│  └─ styles/global.css       # all styles and theme tokens
├─ .github/workflows/deploy.yml
└─ astro.config.mjs
```

## Adding a work

Create a Markdown file in `Official_UnluD/Works/`. The file name becomes the URL (`/works/<file-name>/`).

```yaml
---
title: 오케스트라를 위한 신화(神化)        # original title (required)
title_en: "'Shinhwa' for Orchestra"     # title_kr / title_jp / title_cn work the same way
release_date: "20260108"                # YYYYMMDD (quote it)
categories: [Music, Illust, Video]      # decides which tab(s) it appears in
work_type: Original                     # Original | Cover | Participation | Commission
projects: [Project LuDiA]
roles: [작곡, 편곡, 믹스, 마스터링, 일러스트, 영상]
genres: Orchestra
youtube_link: https://youtu.be/...
streaming_url: https://...
cover: "[[shinhwa.webp]]"               # optional — falls back to the YouTube thumbnail
featured: true                          # show on the home page
---
Body text, YouTube embeds, credits…
```

Files whose names start with `_` are ignored, and `draft: true` hides a work from the site.

## Local development

Requires **Node.js 22.23+**.

```bash
npm install
npm run dev       # dev server at http://localhost:4321
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run check     # type check
```

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages through [`withastro/action`](https://github.com/withastro/action) (see `.github/workflows/deploy.yml`).

One-time setup:

1. **Settings → Pages → Source:** GitHub Actions
2. **Settings → Pages → Custom domain:** enter the domain, then enable **Enforce HTTPS**
3. Keep `SITE` in `astro.config.mjs` and `public/CNAME` in sync with the domain — the sitemap, `robots.txt`, and link previews are generated from it.

## Copyright

© UnluXidDream. All rights reserved.

The music, illustrations, videos, photographs, and writing featured on this site are my own creative works and may not be reused without permission. If you'd like to reuse any part of the source code, please get in touch through the site's Contact page.
