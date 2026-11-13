import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { WORKS_DIR } from './config/site';

/** Obsidian에서 값을 비워두면 null이 들어오므로 null/빈 문자열을 모두 undefined로 정리 */
const optStr = z
  .union([z.string(), z.number(), z.null()])
  .optional()
  .transform((v) => (v === null || v === undefined || String(v).trim() === '' ? undefined : String(v).trim()));

/** cover: [[파일.png]] 를 따옴표 없이 쓰면 YAML이 이중 배열로 읽으므로 "[[파일.png]]" 문자열로 복원 */
const coverStr = z.preprocess((v) => {
  if (Array.isArray(v)) {
    const flat = (v as unknown[]).flat(Infinity).filter((x) => typeof x === 'string') as string[];
    return flat.length ? `[[${flat[0]}]]` : undefined;
  }
  return v;
}, optStr);

const strList = z
  .union([z.array(z.union([z.string(), z.null()])), z.string(), z.null()])
  .optional()
  .transform((v) => {
    if (!v) return [] as string[];
    const arr = Array.isArray(v) ? v : [v];
    return arr.filter((x): x is string => typeof x === 'string' && x.trim() !== '').map((x) => x.trim());
  });

const works = defineCollection({
  // 파일명이 _ 로 시작하는 md는 무시됩니다 (메모·초안용)
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: WORKS_DIR }),
  schema: z.looseObject({
    title: z.union([z.string(), z.number()]).transform(String),
    subtitle: optStr,
    title_kr: optStr,
    title_en: optStr,
    title_jp: optStr,
    title_cn: optStr,
    featured: z.boolean().nullable().optional().transform((v) => v === true),
    draft: z.boolean().nullable().optional().transform((v) => v === true),
    creation_date: optStr,
    release_date: optStr,
    categories: strList,
    work_type: z
      .enum(['Original', 'Cover', 'Participation', 'Commission'])
      .nullable()
      .optional()
      .transform((v) => v ?? undefined),
    projects: strList,
    roles: strList,
    genres: strList,
    youtube_link: optStr,
    streaming_url: optStr,
    /** 악보 판매 페이지 (있으면 커버에 Score 태그 + 상세 페이지 「악보 구매」 버튼) */
    sheet_url: optStr,
    /** 개발물: 배포 페이지 (상세 페이지 DOWNLOAD 버튼) */
    community_url: optStr,
    /** 개발물: 소스 저장소 (상세 페이지 「GitHub에서 보기」 버튼) */
    github_url: optStr,
    cover: coverStr,
  }),
});

export const collections = { works };
