import { getCollection, type CollectionEntry } from 'astro:content';
import { LANGS, NEWS_TYPES, PROJECTS, type LangKey } from '../config/site';
import { formatDate, parseCustomDate, type ParsedDate } from './date';
import { coverFromValue, getWorks, type CoverInfo, type Work } from './works';
import { withBase } from './url';

export type NewsEntry = CollectionEntry<'news'>;

export interface News extends CoverInfo {
  id: string;
  entry: NewsEntry;
  data: NewsEntry['data'];
  /** 언어별 표시 제목 (title_xx 가 없으면 title) */
  titles: Record<LangKey, string>;
  /** release_date → creation_date */
  date: ParsedDate | null;
  /** 2026.01.31 형식 (release_date → creation_date) */
  dateLabel: string;
  sortKey: number;
  types: (typeof NEWS_TYPES)[number][];
  projects: { name: string; label: string; className: string }[];
  href: string;
}

/** 대소문자·띄어쓰기·기호 차이 무시 (LiveEvent = Live&Event = live event) */
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export async function toNews(entry: NewsEntry): Promise<News> {
  const d = entry.data;
  const titles = Object.fromEntries(
    LANGS.map((l) => [l.key, (d[`title_${l.field}` as keyof typeof d] as string | undefined) || d.title]),
  ) as Record<LangKey, string>;
  const date = parseCustomDate(d.release_date) ?? parseCustomDate(d.creation_date);
  const given = d.news_type.map(squash);
  return {
    id: entry.id,
    entry,
    data: d,
    titles,
    date,
    dateLabel: formatDate(date),
    sortKey: date?.key ?? Number.MIN_SAFE_INTEGER,
    types: NEWS_TYPES.filter((t) => given.includes(squash(t.value))),
    projects: d.projects.map((p) => ({ name: p, ...(PROJECTS[p] ?? { label: p, className: 'tag--project' }) })),
    // News 카드는 cover 값이 있을 때만 이미지 표시 (유튜브·본문 이미지로 대신 채우지 않음)
    ...(await coverFromValue(d.cover, `news/${entry.id}`)),
    href: withBase(`news/${entry.id}/`),
  };
}

/** 공개 소식 전체 (draft 제외). pin 값이 있는 소식이 맨 위(0, 1, 2 … 순), 나머지는 최신순 */
export async function getNews(): Promise<News[]> {
  const entries = await getCollection('news', ({ data }) => !data.draft);
  const list = await Promise.all(entries.map(toNews));
  const pinned = (n: News) => n.data.pin !== undefined;
  return list.sort((a, b) => {
    if (pinned(a) && pinned(b)) return a.data.pin! - b.data.pin! || b.sortKey - a.sortKey;
    if (pinned(a) !== pinned(b)) return pinned(a) ? -1 : 1;
    return b.sortKey - a.sortKey;
  });
}

export type Related = { kind: 'work'; work: Work } | { kind: 'news'; news: News };

/** 문서 이름 비교용: 폴더 경로 제외 · 소문자 · 공백 → - (Astro 의 파일 id 규칙과 맞춤) */
const docKey = (s: string) => s.split('/').pop()!.trim().toLowerCase().replace(/\s+/g, '-');

/** 파일명(id) 또는 aliases 중 하나가 이름과 같은지 */
const matches = (id: string, aliases: string[], key: string) => docKey(id) === key || aliases.some((a) => docKey(a) === key);

/** doc_link 의 [[문서]] 들을 Works → News 순서로 찾아 연결 (파일명 · aliases). 못 찾은 이름은 빌드 로그에 경고 */
export async function relatedDocs(n: News, allNews: News[]): Promise<Related[]> {
  if (!n.data.doc_link.length) return [];
  const works = await getWorks();
  const out: Related[] = [];
  for (const name of n.data.doc_link) {
    const key = docKey(name);
    const work = works.find((w) => matches(w.id, w.data.aliases, key));
    const news = work ? undefined : allNews.find((x) => x.id !== n.id && matches(x.id, x.data.aliases, key));
    if (work) out.push({ kind: 'work', work });
    else if (news) out.push({ kind: 'news', news });
    else console.warn(`[news] ${n.id}: doc_link 「${name}」 문서를 Works · News 에서 찾지 못했습니다`);
  }
  return out;
}
