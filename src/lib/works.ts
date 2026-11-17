import { getCollection, type CollectionEntry } from 'astro:content';
import { FILTERS, LANGS, ROLE_ORDER, TAB_CATEGORIES, VOCAL_TONES, VOCAL_VOICES, type LangKey, type VocalAttr } from '../config/site';
import { formatDate, parseCustomDate, type ParsedDate } from './date';
import { withBase } from './url';

export type WorkEntry = CollectionEntry<'works'>;
export type Tab = 'music' | 'visual' | 'other';

export interface Work {
  id: string;
  entry: WorkEntry;
  data: WorkEntry['data'];
  /** 언어별 표시 제목 (title_xx 가 없으면 title) */
  titles: Record<LangKey, string>;
  release: ParsedDate | null;
  created: ParsedDate | null;
  /** 정렬 키: release_date → creation_date 순으로 사용 */
  sortKey: number;
  dateLabel: string;
  cover: string | null;
  /** 커버가 유튜브 썸네일에서 온 경우 true (해상도 폴백 처리용) */
  coverFromYoutube: boolean;
  /** 유튜브 고화질 썸네일이 없을 때 대신 쓸 중간 화질 썸네일 */
  coverFallback: string | null;
  youtubeId: string | null;
  /** 장르 목록 (md에 한 줄 문자열로 적어도, 목록으로 적어도 항상 배열) */
  genres: string[];
  /** 보컬 톤 key (VOCAL_TONES 순서) */
  vocalTones: VocalAttr[];
  /** 발성 key (VOCAL_VOICES 순서) */
  vocalVoices: VocalAttr[];
  tabs: Tab[];
  href: string;
}

export function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m =
    url.match(/youtu\.be\/([\w-]{11})/) ||
    url.match(/[?&]v=([\w-]{11})/) ||
    url.match(/youtube(?:-nocookie)?\.com\/(?:embed|shorts|live)\/([\w-]{11})/);
  return m ? m[1] : null;
}

/** 본문에서 첫 번째 이미지를 찾습니다: ![](url) / <img src> / ![[file.png]] */
function firstBodyImage(body = ''): string | null {
  const candidates: { idx: number; url: string }[] = [];
  const md = body.match(/!\[[^\]]*\]\(\s*<?([^)\s>]+)>?/);
  if (md?.index !== undefined) candidates.push({ idx: md.index, url: md[1] });
  const html = body.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (html?.index !== undefined) candidates.push({ idx: html.index, url: html[1] });
  const wiki = body.match(/!\[\[([^\]|]+\.(?:png|jpe?g|gif|webp|avif|svg))(?:\|[^\]]*)?\]\]/i);
  if (wiki?.index !== undefined) candidates.push({ idx: wiki.index, url: `/images/${wiki[1].split('/').pop()}` });
  candidates.sort((a, b) => a.idx - b.idx);
  return candidates[0]?.url ?? null;
}

function resolveImage(src: string): string {
  // Obsidian 위키링크: [[파일.png]] / ![[파일.png|별칭]] / [[폴더/파일.png]] → /images/파일.png
  const wiki = src.match(/^!?\[\[([^\]|]+)(?:\|[^\]]*)?\]\]$/);
  if (wiki) src = wiki[1].trim().split('/').pop()!;
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  // 파일명만 적은 경우 public/images/ 에 있다고 간주
  if (!src.startsWith('/') && !src.includes('/')) return withBase(`images/${encodeURI(src)}`);
  return withBase(src);
}

const IMAGE_URL = /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i;
const isHttp = (s: string) => /^https?:\/\//i.test(s);
const ytThumb = (id: string, q: 'maxresdefault' | 'hqdefault') => `https://i.ytimg.com/vi/${id}/${q}.jpg`;

/**
 * 일반 웹페이지 링크(니코니코, SoundCloud, 블로그 글 등)의 대표 이미지(og:image)를 빌드 시 가져옵니다.
 * 링크가 이미지 자체라면 그대로 사용. 실패하면 null (→ 다음 우선순위로 넘어감).
 * 같은 링크는 한 번만 요청합니다.
 */
const pageImageCache = new Map<string, Promise<string | null>>();
function pageImage(url: string): Promise<string | null> {
  let job = pageImageCache.get(url);
  if (!job) {
    job = (async () => {
      try {
        const res = await fetch(url, {
          redirect: 'follow',
          signal: AbortSignal.timeout(8000),
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; StaticSiteBuilder/1.0)',
            Accept: 'text/html,application/xhtml+xml,image/*;q=0.8',
          },
        });
        if (!res.ok) return null;
        const type = res.headers.get('content-type') ?? '';
        if (type.startsWith('image/')) return url;
        if (!type.includes('html')) return null;
        const html = (await res.text()).slice(0, 500_000);
        const tag = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)(?::src)?["'][^>]*>/i)?.[0];
        const content = tag?.match(/content=["']([^"']+)["']/i)?.[1];
        return content ? new URL(content.replace(/&amp;/g, '&'), res.url || url).href : null;
      } catch {
        return null;
      }
    })();
    pageImageCache.set(url, job);
  }
  return job;
}

/** 문자열 / 배열 / 비어 있음 어떤 형태든 문자열 배열로 정리 */
function toList(v: unknown): string[] {
  if (v === null || v === undefined) return [];
  const arr = Array.isArray(v) ? v.flat(Infinity) : [v];
  return arr.filter((x) => typeof x === 'string' || typeof x === 'number').map((x) => String(x).trim()).filter(Boolean);
}

/**
 * 작품이 보일 탭 결정
 *  1) categories 값 (TAB_CATEGORIES 매핑, 매핑에 없는 값은 Other Works)
 *  2) roles 값이 어떤 탭의 필터 버튼(FILTERS)에 해당하면 그 탭에도 표시
 *     예: categories 가 Music 뿐이어도 roles 에 「사보」가 있으면 Other Works 「사보」에도 보임
 */
function tabsOf(categories: string[], roles: string[] = []): Tab[] {
  const tabs = new Set<Tab>();
  for (const c of categories.map((x) => x.toLowerCase())) {
    if ((TAB_CATEGORIES.music as readonly string[]).includes(c)) tabs.add('music');
    else if ((TAB_CATEGORIES.visual as readonly string[]).includes(c)) tabs.add('visual');
    else tabs.add('other');
  }
  // categories 탭이 먼저 오도록(상세 페이지의 「목록으로」가 첫 탭으로 돌아감) roles 탭은 뒤에 추가
  for (const tab of Object.keys(FILTERS) as Tab[]) {
    if (FILTERS[tab].some((f) => f.key !== 'etc' && f.match.some((m) => roles.includes(m)))) tabs.add(tab);
  }
  if (tabs.size === 0) tabs.add('other');
  return [...tabs];
}

/** md 의 vocal_tone / vocal_voice 값을 정의 목록(순서 유지)으로 변환. 목록에 없는 값은 무시 */
function vocalAttrs(values: string[], defs: VocalAttr[]): VocalAttr[] {
  const given = values.map((v) => v.trim().toLowerCase());
  return defs.filter((def) => def.match.some((m) => given.includes(m.toLowerCase())));
}

export interface CoverInfo {
  cover: string | null;
  /** 커버가 유튜브 썸네일에서 온 경우 true (해상도 폴백 처리용) */
  fromYoutube: boolean;
  /** 유튜브 고화질 썸네일이 없을 때 대신 쓸 중간 화질 썸네일 */
  fallback: string | null;
}

/**
 * md 의 cover 값 하나를 이미지 주소로 변환 (작업물 · News 공용)
 *  이미지([[ ]]·파일명·이미지 URL) / 유튜브 링크(썸네일) / 일반 웹페이지 링크(og:image)
 */
export async function coverFromValue(value: string | undefined, id: string): Promise<CoverInfo> {
  const none: CoverInfo = { cover: null, fromYoutube: false, fallback: null };
  if (!value) return none;
  const yt = isHttp(value) ? youtubeId(value) : null;
  if (yt) return { cover: ytThumb(yt, 'maxresdefault'), fromYoutube: true, fallback: ytThumb(yt, 'hqdefault') };
  if (!isHttp(value) || IMAGE_URL.test(value)) return { ...none, cover: resolveImage(value) };
  const first = !pageImageCache.has(value);
  const cover = await pageImage(value);
  if (!cover && first) console.warn(`[cover] ${id}: cover 링크에서 이미지를 찾지 못했습니다 → ${value}`);
  return { ...none, cover };
}

export async function toWork(entry: WorkEntry): Promise<Work> {
  const d = entry.data;
  const titles = Object.fromEntries(
    LANGS.map((l) => [l.key, (d[`title_${l.field}` as keyof typeof d] as string | undefined) || d.title]),
  ) as Record<LangKey, string>;

  const release = parseCustomDate(d.release_date);
  const created = parseCustomDate(d.creation_date);
  const yt = youtubeId(d.youtube_link);

  let cover: string | null = null;
  let coverFromYoutube = false;
  let coverFallback: string | null = null;
  const useYoutube = (id: string) => {
    cover = ytThumb(id, 'maxresdefault');
    coverFallback = ytThumb(id, 'hqdefault');
    coverFromYoutube = true;
  };

  // 1) cover 값: 이미지([[ ]]·파일명·이미지 URL) / 유튜브 링크 / 일반 웹페이지 링크
  const fromCover = await coverFromValue(d.cover, entry.id);
  if (fromCover.cover) ({ cover, fromYoutube: coverFromYoutube, fallback: coverFallback } = fromCover);
  // 2) youtube_link 썸네일  3) 본문 첫 이미지
  if (!cover && yt) useYoutube(yt);
  if (!cover) {
    const img = firstBodyImage(entry.body);
    if (img) cover = resolveImage(img);
  }

  return {
    id: entry.id,
    entry,
    data: d,
    titles,
    release,
    created,
    sortKey: (release ?? created)?.key ?? Number.MIN_SAFE_INTEGER,
    dateLabel: formatDate(release ?? created),
    cover,
    coverFromYoutube,
    coverFallback,
    youtubeId: yt,
    genres: toList((d as { genres?: unknown }).genres),
    vocalTones: vocalAttrs(d.vocal_tone, VOCAL_TONES),
    vocalVoices: vocalAttrs(d.vocal_voice, VOCAL_VOICES),
    tabs: tabsOf(d.categories, d.roles),
    href: withBase(`works/${entry.id}/`),
  };
}

/** 공개 작품 전체 (draft 제외), 최신순 */
export async function getWorks(): Promise<Work[]> {
  const entries = await getCollection('works', ({ data }) => !data.draft);
  const works = await Promise.all(entries.map(toWork));
  return works.sort((a, b) => b.sortKey - a.sortKey);
}

export async function getWorksByTab(tab: Tab): Promise<Work[]> {
  return (await getWorks()).filter((w) => w.tabs.includes(tab));
}

/** 탭 필터 버튼 중 이 작품이 해당하는 key 목록 (roles 기준) */
export function filterKeysFor(work: Work, tab: Tab): string[] {
  const defs = FILTERS[tab];
  const roles = work.data.roles;
  const keys = defs.filter((f) => f.key !== 'etc' && f.match.some((m) => roles.includes(m))).map((f) => f.key);
  if (keys.length === 0 && defs.some((f) => f.key === 'etc')) keys.push('etc');
  return keys;
}

/** 역할이 해당하는 필터 버튼 주소 (예: 「편곡」 → 'music/?filter=arrange'). 해당 버튼이 없으면 null */
export function roleFilterPath(role: string): string | null {
  for (const tab of Object.keys(FILTERS) as Tab[]) {
    const f = FILTERS[tab].find((x) => x.key !== 'etc' && x.match.includes(role));
    if (f) return `${tab}/?filter=${f.key}`;
  }
  return null;
}

/** roles 를 ROLE_ORDER 순서로 정렬 (목록에 없는 값은 맨 뒤, 입력 순서 유지) */
export function sortRoles(roles: string[]): string[] {
  const rank = (r: string) => {
    const i = ROLE_ORDER.indexOf(r);
    return i === -1 ? ROLE_ORDER.length : i;
  };
  return roles
    .map((r, i) => ({ r, i }))
    .sort((a, b) => rank(a.r) - rank(b.r) || a.i - b.i)
    .map((x) => x.r);
}
