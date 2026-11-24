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

**UnluD | 루드 | ルード | 恩路德** — composer and multi-artist.

This repository holds the source of my official portfolio site: composition, vocals, arrangement, lyrics, mixing & mastering, live performance, artwork, video, publication, and development work, all in one place.

🔗 **Live site:** [unluxiddream.com](https://unluxiddream.com)

![UnluXidDream](public/og-image.png)

---

## Features

### Content
- **Four languages.** The site is available in Korean (default), English, Japanese, and Chinese. Titles and interface text switch instantly, and the About page has a dedicated version for each language.
- **Works by discipline.** Works are split into three tabs: *Music*, *Visual*, and *Other Works*.
  - Each tab has role filters, such as composition, vocals, performance, illustration, score engraving, translation, and development.
  - Each tab can be sorted by date or title.
- **Vocal tone & voice.** Vocal works can be tagged by tone (Low / Mid / High) and voice (chest / head / falsetto). These tags appear only on the work page and in a sub-filter that opens under *Vocals*, so the cards stay clean.
- **News.** A list of updates with category filters (Info / Release / Live & Event). It has two more features:
  - Pinned posts stay at the top.
  - "Related" cards link a post to the works or posts it mentions.
- **Clickable credits.** Every role, tone, and voice tag on a work page links to the matching filtered list.

### Writing in Obsidian
- **Obsidian-powered content.** Every work and news post is a Markdown note in an Obsidian vault. Write it in Obsidian, push, and it's live.
- **Obsidian syntax works on the site.** These all render as expected:
  - `[[wikilinks]]`, including aliases and `|display text`
  - `![[image.png|300]]` image sizing
  - `#tags`
- **Automatic covers.** A cover can be a vault image, a YouTube link (the thumbnail is used), or any web page (its preview image is used).

### Discovery
- **Search & discovery.**
  - Site-wide search by title (in any language), genre, or role.
  - Sitemap, `robots.txt`, an RSS feed for News, and structured data for search engines.
  - Link-preview images for sharing.

### Design
- **Dark / light themes.** Crimson accents in dark mode, gold in light mode.
- **Index tags on each cover.**
  - Work type: *Original*, *Cover*, *Participation*, *Commission*
  - *Score*, when sheet music is available
  - Project tags: *LuDiA*, *LeXidN*

## Tech stack

| | |
|---|---|
| Framework | [Astro](https://astro.build) 7 (static output) |
| Content | Markdown + YAML frontmatter, managed in [Obsidian](https://obsidian.md) |
| Markdown | remark: `remark-breaks` + small custom plugins for Obsidian embeds, wikilinks, and `#tags` |
| Styling | Plain CSS with design tokens, no framework |
| Fonts | Noto Serif (headings) / Noto Sans (body), incl. KR · JP · SC |
| Hosting | GitHub Pages via GitHub Actions, custom domain |

## Project structure

```
.
├─ Official_UnluD/              # Obsidian vault (content)
│  ├─ Works/                    # one Markdown file per work      → /works/<file-name>/
│  ├─ News/                     # one Markdown file per news post → /news/<file-name>/
│  └─ Attachments/              # images used in notes (served at /images/)
├─ public/                      # favicon, link-preview image, CNAME, static files
├─ src/
│  ├─ assets/images/            # profile image (optimized at build time)
│  ├─ components/               # cards, header, filters, search, …
│  ├─ config/site.ts            # site settings: links, tags, filters, news types
│  ├─ content.config.ts         # frontmatter schema for Works and News
│  ├─ lib/                      # data helpers, i18n strings, remark plugins
│  ├─ pages/                    # routes: home, tabs, news, About ×4, contact, rss.xml
│  └─ styles/global.css         # all styles and theme tokens
├─ .github/workflows/deploy.yml
└─ astro.config.mjs
```

## Adding a work

Create a Markdown file in `Official_UnluD/Works/`. The file name becomes the URL.

```yaml
---
title: 오케스트라를 위한 신화(神化)        # original title (required)
title_en: "'Shinhwa' for Orchestra"     # title_kr / title_jp / title_cn work the same way
aliases: [신화]                          # optional: other names for [[links]]
release_date: "20260108"                # YYYYMMDD (quote it)
categories: [Music, Illust, Video]      # decides which tab(s) it appears in
work_type: Original                     # Original | Cover | Participation | Commission
projects: [Project LuDiA]
roles: [작곡, 편곡, 믹스, 마스터링, 일러스트, 영상]
vocal_tone: [Mid, High]                 # optional: Low | Mid | High
vocal_voice: [Chest, Head]              # optional: Chest | Head | Falsetto
genres: Orchestra
youtube_link: https://youtu.be/...
streaming_url: https://...
cover: "[[shinhwa.webp]]"               # optional: falls back to the YouTube thumbnail
featured: true                          # show on the home page
---
Body text, YouTube embeds, credits…
```

## Adding a news post

Create a Markdown file in `Official_UnluD/News/`.

```yaml
---
title: 상명대학교 2026 문예인의 밤 '만개' 전시 안내
title_en: ...
release_date: "20260928"
news_type: [Info]                       # Info | Release | LiveEvent
projects: [Project LuDiA]
pin: 0                                  # optional: pinned to the top (0, 1, 2 … from the top)
cover: "[[poster.webp]]"                # optional: shown as a square thumbnail
doc_link:                               # optional: shown as "Related" cards
  - "[[yuuwaeru]]"
---
Body text…
```

For both works and news, files whose names start with `_` are ignored, and `draft: true` hides a note from the site.

## Local development

Requires **Node.js 22.23+**.

```bash
npm install
npm run dev       # dev server at http://localhost:4321
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run check     # type check
```

If changes to Markdown plugins don't show up in the dev server, stop it and clear the content cache:

```bash
rm -rf .astro node_modules/.astro && npm run dev
```

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages through [`withastro/action`](https://github.com/withastro/action) (see `.github/workflows/deploy.yml`).

One-time setup:

1. **Settings → Pages → Source:** GitHub Actions
2. **Settings → Pages → Custom domain:** enter the domain, then enable **Enforce HTTPS**
3. Keep `SITE` in `astro.config.mjs` and `public/CNAME` in sync with the domain. The sitemap, `robots.txt`, RSS feed, and link previews are all generated from it.

## Copyright

© UnluXidDream. All rights reserved.

The music, illustrations, videos, photographs, and writing featured on this site are my own creative works and may not be reused without permission. If you'd like to reuse any part of the source code, please get in touch through the site's Contact page.
