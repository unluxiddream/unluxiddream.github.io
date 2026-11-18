/**
 * Obsidian 본문 링크 `[[문서]]` 를 사이트 링크로 바꾸는 remark 플러그인.
 *   [[yuuwaeru]]                  → <a href="/works/yuuwaeru/">yuuwaeru</a>
 *   [[Works/yuuwaeru|有（ゆう）]]   → <a href="/works/yuuwaeru/">有（ゆう）</a>
 *   [[문서#소제목]]                → 문서 페이지로 연결 (소제목은 무시)
 *   [[별칭]]                      → 그 별칭을 aliases 에 적어 둔 문서로 연결
 *
 * Works · News 폴더의 md 파일명과 frontmatter aliases 로 찾습니다.
 * 찾지 못한 링크(없는 문서, _ 로 시작하는 문서, draft)는 대괄호 없이 글자만 남깁니다.
 * 이미지 임베드 `![[파일.png]]` 는 remark-obsidian-embed 가 먼저 처리합니다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { slug as githubSlug } from 'github-slugger';

const LINK = /(?<!!)\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g;
const SKIP = new Set(['link', 'linkReference', 'code', 'inlineCode', 'html']);
const key = (s) => s.normalize('NFC').trim().toLowerCase();

/** 파일명 · 별칭 → 주소 표. 개발 서버에서 새 문서가 바로 반영되도록 2초마다 다시 읽음 */
function createIndex(collections, base) {
  let cache = null;
  let builtAt = 0;

  const readAliases = (file) => {
    const text = fs.readFileSync(file, 'utf8');
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    if (/^draft:\s*true\s*$/m.test(fm)) return null;
    const m = fm.match(/^aliases:[ \t]*(.*)\r?\n((?:[ \t]+-.*\r?\n?)*)/m);
    if (!m) return [];
    const inline = m[1].trim();
    const items = inline
      ? inline.replace(/^\[|\]$/g, '').split(',')
      : m[2].split('\n').map((l) => l.replace(/^\s*-\s*/, ''));
    return items.map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  };

  const walk = (dir) =>
    fs.existsSync(dir)
      ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
          const p = path.join(dir, e.name);
          return e.isDirectory() ? walk(p) : e.name.endsWith('.md') ? [p] : [];
        })
      : [];

  return () => {
    if (cache && Date.now() - builtAt < 2000) return cache;
    const map = new Map();
    for (const { dir, route } of collections) {
      for (const file of walk(dir)) {
        const name = path.basename(file, '.md');
        if (name.startsWith('_')) continue;
        const aliases = readAliases(file);
        if (aliases === null) continue;
        // Astro 의 문서 id 와 같은 규칙 (폴더 · 파일명마다 github-slugger)
        const id = path.relative(dir, file).replace(/\.md$/, '').split(path.sep).map((s) => githubSlug(s)).join('/');
        const href = `${base}${route}/${id}/`;
        for (const k of [name, ...aliases].map(key)) if (!map.has(k)) map.set(k, href);
      }
    }
    cache = map;
    builtAt = Date.now();
    return map;
  };
}

export default function remarkObsidianLinks(options = {}) {
  const base = (options.base ?? '/').replace(/\/?$/, '/');
  const index = createIndex(options.collections ?? [], base);

  const transform = (node, map) => {
    if (!node.children || SKIP.has(node.type)) return;
    const next = [];
    for (const child of node.children) {
      if (child.type !== 'text' || !child.value.includes('[[')) {
        transform(child, map);
        next.push(child);
        continue;
      }
      const value = child.value;
      let last = 0;
      for (const m of value.matchAll(LINK)) {
        const target = m[1].trim().replace(/\.md$/i, '');
        const label = (m[2] ?? target.split('/').pop()).trim();
        const href = map.get(key(target.split('/').pop())) ?? map.get(key(target));
        if (m.index > last) next.push({ type: 'text', value: value.slice(last, m.index) });
        next.push(href ? { type: 'link', url: href, children: [{ type: 'text', value: label }] } : { type: 'text', value: label });
        last = m.index + m[0].length;
      }
      if (last < value.length) next.push({ type: 'text', value: value.slice(last) });
    }
    node.children = next;
  };

  return (tree) => transform(tree, index());
}
