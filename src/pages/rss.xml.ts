import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { getNews } from '../lib/news';

/**
 * News RSS 피드 (/rss.xml). 네이버 서치어드바이저 「RSS 제출」, 피드 구독 앱에서 사용.
 * 제목은 한국어(title_kr → title), 설명은 본문 앞부분을 글자만 뽑아 사용합니다.
 * pin 으로 고정한 소식도 피드에서는 날짜순(최신이 위)으로 나옵니다.
 */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** 마크다운 본문 → 요약용 일반 글자 */
function excerpt(md = '', max = 200): string {
  const text = md
    .replace(/<[^>]+>/g, ' ') // HTML (iframe 등)
    .replace(/!\[\[[^\]]*\]\]/g, ' ') // Obsidian 이미지
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 이미지
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g, (_, a: string, b?: string) => b ?? a.split('/').pop()!) // [[문서|글자]]
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // [글자](주소)
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*(?:---+|\*\*\*+)\s*$/gm, ' ')
    .replace(/[*_`>~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

/** 날짜 → RFC 822 (한국 시간 기준) */
function rfc822(d: { year: number; month: number; day: number; hour: number; minute: number; second: number }): string {
  const utc = Date.UTC(d.year, d.month - 1, d.day, d.hour, d.minute, d.second) - 9 * 3600 * 1000;
  return new Date(utc).toUTCString();
}

export const GET: APIRoute = async ({ site }) => {
  const base = new URL(import.meta.env.BASE_URL, site);
  const list = (await getNews()).filter((n) => n.date).sort((a, b) => b.sortKey - a.sortKey);
  const items = list
    .map((n) => {
      const link = new URL(n.href, site).href;
      const title = n.data.title_kr || n.data.title;
      return [
        '    <item>',
        `      <title>${esc(title)}</title>`,
        `      <link>${esc(link)}</link>`,
        `      <guid isPermaLink="true">${esc(link)}</guid>`,
        `      <pubDate>${rfc822(n.date!)}</pubDate>`,
        ...n.types.map((t) => `      <category>${esc(t.label)}</category>`),
        `      <description>${esc(excerpt(n.entry.body))}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} News</title>
    <link>${esc(new URL('news/', base).href)}</link>
    <atom:link href="${esc(new URL('rss.xml', base).href)}" rel="self" type="application/rss+xml" />
    <description>${esc(`${SITE.name} (${SITE.alias}) 공식 소식`)}</description>
    <language>ko</language>
    ${list[0] ? `<lastBuildDate>${rfc822(list[0].date!)}</lastBuildDate>` : ''}
${items}
  </channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
