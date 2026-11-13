// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkBreaks from 'remark-breaks';
import remarkObsidianEmbed from './src/lib/remark-obsidian-embed.mjs';
import vaultAttachments from './src/integrations/vault-attachments.mjs';
import sitemap from '@astrojs/sitemap';

// ─────────────────────────────────────────────────────────────
//  배포 설정
//  SITE : 실제 배포 도메인. sitemap.xml · robots.txt · 링크 미리보기(og) 주소가 모두 여기서 만들어짐
//         (가비아 도메인 · public/CNAME 과 같은 주소로 유지)
//  BASE : 서브 경로에 배포할 때만 사용. 개인 도메인 연결 시에는 '/' 그대로
// ─────────────────────────────────────────────────────────────
const SITE = 'https://unluxiddream.com';
const BASE = '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  integrations: [
    // Obsidian 볼트의 첨부 이미지 폴더 → 사이트의 /images/ 로 제공
    vaultAttachments({ dir: './Official_UnluD/Attachments' }),
    // sitemap-index.xml + sitemap-0.xml 자동 생성
    // 이동용 페이지(/about/), 검색 결과(/search/), 404 는 검색엔진에 올릴 필요가 없어 제외
    sitemap({
      filter: (page) => !['about/', 'search/', '404/'].some((p) => new URL(page).pathname === `${BASE.replace(/\/$/, '')}/${p}`),
    }),
  ],
  markdown: {
    processor: unified({
      // remark-breaks : Obsidian처럼 한 줄 개행을 그대로 줄바꿈으로 렌더
      // remarkObsidianEmbed : ![[이미지.png]] 문법을 public/images/ 경로로 변환
      remarkPlugins: [remarkBreaks, [remarkObsidianEmbed, { base: BASE }]],
    }),
  },
});
