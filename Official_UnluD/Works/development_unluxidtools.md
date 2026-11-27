---
aliases:
title: unluxidTOOLS 음악 제작자를 위한 청감 훈련 & 실무 도구
subtitle: (React, TypeScript, Web Audio API, GitHub Pages)
title_kr: unluxidTOOLS 음악 제작자를 위한 청감 훈련 & 실무 도구
title_en: unluxidTOOLS Ear Training & Studio Utilities for Music Producers
title_jp: unluxidTOOLS 音楽制作者のための聴覚トレーニング & 制作ツール
title_cn: unluxidTOOLS 面向音乐制作人的练耳训练与制作工具
featured: false
creation_date: "20261127152927"
release_date: "20261127"
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
cover: "[[Attachments/unluxidtools_main_square_en.webp]]"
genres: Web App
github_url: https://github.com/unluxiddream/unluxiddream-musical-tools
---
# unluxidTOOLS: Ear Training & Studio Utilities

**A browser-based toolkit for music producers, designed and built by a working composer.**

unluxidTOOLS turns the listening skills producers rely on every day into short, measurable drills: hearing a frequency, placing a sound in the stereo field. It runs in any modern browser with no installation, no account, and no server. I planned, designed, and developed it myself, from the audio engine and scoring math to the visual identity and the four-language interface.

🔗 **Live site:** [tools.unluxiddream.com](https://tools.unluxiddream.com)

![[Attachments/unluxidtools_main_en.webp]]

---

## What it does

### Training tools (available now)
- **Sine Frequency Finder.** A sine tone plays for two seconds, and you pick its frequency on a 20 Hz – 20 kHz logarithmic graph. Your error is shown in cents and in Hz.
  - Five difficulty levels change only how much error is accepted (±1200 → ±200 cents). The range of possible questions never changes, so a harder level means listening more precisely, not memorizing a narrower range.
- **Pan Position Finder.** Pink noise is placed somewhere between L100 and R100, and you find where.
  - Five levels, from ±30 down to ±3 pan steps.
  - The overall level shifts slightly (±1.5 dB) on every question. You can't answer from loudness alone; you have to hear the position.

### Each training session
- Ten questions per set, with progress, score, streak, and a summary of your accuracy and average error.
- Your best and most recent results are saved for each difficulty level.
- Keyboard shortcuts (Space to replay, Enter for the next question) for fast, hands-on practice.
- Mouse, touch, and keyboard all work with the same answer controls.

### Coming next
Absolute pitch, instrument timbre, EQ band, and level-difference training, plus studio references: string positions and double stops, wind fingerings, instrument ranges and transpositions, a chord finder, a BPM ↔ ms calculator, a frequency ↔ note converter, and a loudness meter.

---

## How it's built

### Scoring that matches how we hear
The hardest part of the project was deciding what a "correct" answer should mean for a sense as subjective as hearing.

- **Frequency is handled on a logarithmic scale.** We hear 100 → 200 Hz and 5,000 → 10,000 Hz as the same distance (one octave). So the answer graph uses a log scale, questions are drawn evenly across octaves, and errors are measured in cents, not raw Hz. Drawing questions linearly would put most of them in the high range.
- **Panning reflects human perception.** We are less precise at judging position near the edges of the stereo field than in the center. So answers beyond L70 / R70 get a 1.25× wider margin. Users can turn this off.

### A custom audio engine
The sound is generated in real time with the browser's built-in **Web Audio API**. There is no audio library and no audio files.

```
source (sine / pink noise)
  → envelope     15 ms fade in / out (no clicks)
  → panner       (pan training only)
  → tool bus
  → master gain  volume slider on a dB curve
  → limiter      safety stage
  → output
```

- **Pink noise is generated in code** by filtering white noise to a −3 dB/octave slope, then normalized to −18 dBFS RMS.
- **The volume slider follows decibels**, not raw gain, so it feels natural under the hand.
- **It works on mobile, including iOS.** The engine starts on the first tap, as browsers require, and on iOS 17+ it plays even when the silent switch is on.

### Hearing safety first
On first play, users are reminded to check their volume, headphones, and the iPhone silent switch. Output is calibrated around −18 dBFS, and a limiter at the end of the chain prevents sudden loud sounds.

### Built to grow
- **One registry drives the whole site.** Home-page cards, category lists, and page routes are all generated from a single list of tools. Adding a tool means adding one line.
- **Each tool loads only when opened.** Tool code is split out of the home page, so the first load stays light however many tools are added.
- **Shared quiz engine.** A new training tool only needs three pieces: a question generator, a scoring function, and an answer control. Difficulty, sets, scoring, records, results, and shortcuts are handled by a shared framework.

### Four languages
- The site is available in **Korean, English, Japanese, and Simplified Chinese**.
- **Separate URLs per language** (`/ko/`, `/en/`, `/ja/`, `/zh/`) so search engines can index each language.
- **First visit:** the site opens in the browser's language. A language chosen from the menu is remembered.
- **Language-specific fonts** (Noto Sans KR / JP / SC) so shared Chinese characters use the correct regional glyph shapes. Line breaking is adjusted per language.
- All text is translated in-house. There is no translation widget or third-party translation library.

### Search and sharing
- **Each page has its own static HTML file.** GitHub Pages answers unknown paths with a 404, which keeps pages out of search results. So a build step writes a real HTML file for every page in every language, with its own title, description, and cross-language links (`hreflang`).
- A sitemap and `robots.txt`.
- **Link previews:** each language has its own 1200 × 630 preview image.
- A full favicon set: SVG, ICO, iOS home screen, Android icons, and a web app manifest.

---

## Design

- **Shared visual language with [unluxiddream.com](https://unluxiddream.com).**
  - No rounded corners anywhere, enforced by a global rule.
  - The forms are straight lines, squares, triangles, and diagonal cuts: angled button corners, small triangles over active tabs, swallowtail tags, and a diamond answer marker.
- **Teal identity** based on DarkCyan (#008B8B), with light and dark themes. Light is the default, and the user's choice is remembered.
- **Calm tool screens.** Motion is used in one place only: the layered sine-wave animation on the home page. The training screens stay quiet and focused on information.
- **Accessibility, checked by calculation.**
  - Every text and background pairing was measured against WCAG AA contrast (4.5:1 for body text), and colors that fell short were adjusted.
  - Right and wrong answers use icons and words as well as color.
  - Keyboard focus is clearly visible, every touch target is at least 44 px, and reduced-motion settings are respected.
- **Responsive** from 320 px phones to desktop, with no horizontal scrolling in any language.

---

## Quality

- **53 automated tests (Vitest)** cover the parts that must be exactly right:
  - log scale ↔ frequency conversion, octave and cent errors, and answer boundaries
  - how evenly questions are distributed
  - pan scoring and the edge margin
  - the volume curve, record keeping, and language detection and routing
- **Strict TypeScript and ESLint** on every build. Type checks also confirm that all four language files have the same structure.
- **Real-browser testing** with headless Chrome:
  - full quiz runs on mobile (360 px, touch) and desktop (1280 px), in light and dark themes
  - every language at 320–1280 px, checked for layout overflow and console errors

## Privacy

- **No backend.** Settings and results stay in the user's own browser (localStorage) and are never sent anywhere. Storage access is guarded, so the app keeps working where storage is blocked, as in some private browsing modes.
- **No analytics, ads, or tracking scripts.** The only external resource is Google Fonts.

---

## Tech stack

| | |
|---|---|
| App | React 19, TypeScript, Vite, React Router |
| Audio | Web Audio API (custom engine, no audio library) |
| Styling | Plain CSS + design tokens + CSS Modules, no UI framework |
| i18n | In-house typed dictionaries (ko / en / ja / zh) |
| Testing | Vitest, headless Chrome |
| Hosting | GitHub Pages via GitHub Actions, custom domain, static pre-rendering |

## Project structure

```
.
├─ public/                      # favicons, manifest, link-preview images, robots.txt
├─ scripts/prerender.mjs        # writes per-language HTML pages and sitemap.xml after build
├─ src/
│  ├─ tools/registry.ts         # the single list of tools (one line per tool)
│  ├─ tools/train/<tool>/       # tool screen + logic.ts (math) + logic.test.ts (tests)
│  ├─ quiz/                     # shared quiz engine: sets, scoring, records, results, inputs
│  ├─ audio/                    # audio engine, sound sources, first-play safety notice
│  ├─ components/               # header, menu, footer, wave hero, cards, buttons
│  ├─ pages/                    # home, category lists, tool page, about
│  ├─ i18n/                     # ko / en / ja / zh dictionaries, language detection and URLs
│  ├─ styles/                   # design tokens and base styles
│  └─ lib/                      # settings, safe storage, theme, links
└─ .github/workflows/deploy.yml
```

## Local development

```bash
npm install
npm run dev        # dev server
npm test           # tests
npm run lint       # lint
npm run typecheck  # type check
npm run build      # production build → dist/ (includes pre-rendering)
```

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages through GitHub Actions. The build:
1. Type-checks.
2. Bundles the app.
3. Writes a static HTML page for every route in every language, plus the sitemap.

A copy of the app shell is served as `404.html`, so any address still opens the app.

## Copyright

© UnluXidDream. All rights reserved.

The planning, design, and code of this site are my own work. If you'd like to reuse any part of the source code, please get in touch through the Contact page on [unluxiddream.com](https://unluxiddream.com).
