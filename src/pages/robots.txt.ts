import type { APIRoute } from 'astro';

/** robots.txt — 모든 검색엔진 허용 + sitemap 위치 안내. 사이트 주소는 astro.config.mjs 의 SITE 를 따름 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(`${import.meta.env.BASE_URL.replace(/\/$/, '')}/sitemap-index.xml`, site);
  const body = ['User-agent: *', 'Allow: /', 'Disallow: /search/', '', `Sitemap: ${sitemap.href}`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
