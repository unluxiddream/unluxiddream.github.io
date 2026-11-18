/**
 * Obsidian 임베드 문법 `![[파일명.png]]`, `![[파일명.png|300]]` 을
 * 일반 이미지 노드(`/images/파일명.png`)로 바꿔 주는 아주 작은 remark 플러그인.
 * 이미지 파일은 Obsidian 볼트의 Attachments 폴더에 두면 됩니다 (빌드 때 /images/ 로 복사).
 *
 * 크기 지정도 Obsidian 과 같게 반영합니다.
 *   ![[파일.png|300]]       → 폭 300px (비율 유지)
 *   ![[파일.png|300x200]]   → 300×200
 *   ![[파일.png|설명|300]]  → 대체 텍스트 「설명」 + 폭 300px
 *   ![300](주소), ![설명|300](주소) 처럼 일반 마크다운 이미지도 같은 규칙
 * 지정한 크기가 본문 폭보다 크면 본문 폭에 맞춰 줄어듭니다 (CSS max-width).
 *
 * 또, 일반 마크다운 이미지 `![](public/파일.png)` 처럼 public 폴더 기준으로 적은 경로는
 * 사이트 주소(`/파일.png`)로 바꿔 줍니다. (README 내용을 그대로 붙여 넣어도 깨지지 않도록)
 */
const PUBLIC_PATH = /^(?:\.\/)?public\//;
const EMBED = /!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g;
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i;
/** 「설명|300」 「300x200」 「설명|300x200」 → { alt, width, height } */
const SIZE = /^(?:(.*)\|)?\s*(\d+)(?:\s*x\s*(\d+))?\s*$/;

function parseSize(text = '') {
  const m = text.match(SIZE);
  if (!m) return { alt: text, width: null, height: null };
  return { alt: (m[1] ?? '').trim(), width: Number(m[2]), height: m[3] ? Number(m[3]) : null };
}

/** 크기를 인라인 스타일로 지정 (높이까지 지정하면 그 비율로 늘이거나 줄임 — Obsidian 과 동일) */
function applySize(node, width, height) {
  if (!width) return node;
  const style = height ? `width:${width}px;aspect-ratio:${width}/${height};height:auto` : `width:${width}px`;
  node.data = { ...(node.data ?? {}), hProperties: { ...(node.data?.hProperties ?? {}), style } };
  return node;
}

export default function remarkObsidianEmbed(options = {}) {
  const base = (options.base ?? '/').replace(/\/?$/, '/');

  const transform = (node) => {
    if (node.type === 'image') {
      if (PUBLIC_PATH.test(node.url)) node.url = base + node.url.replace(PUBLIC_PATH, '');
      const { alt, width, height } = parseSize(node.alt ?? '');
      if (width) applySize(Object.assign(node, { alt }), width, height);
    }
    if (!node.children) return;
    const next = [];
    for (const child of node.children) {
      if (child.type !== 'text' || !child.value.includes('![[')) {
        transform(child);
        next.push(child);
        continue;
      }
      let last = 0;
      const value = child.value;
      for (const m of value.matchAll(EMBED)) {
        const file = m[1].trim();
        if (!IMAGE_EXT.test(file)) continue;
        if (m.index > last) next.push({ type: 'text', value: value.slice(last, m.index) });
        const fileName = file.split('/').pop();
        const { alt, width, height } = parseSize(m[2] ?? '');
        next.push(applySize({ type: 'image', url: `${base}images/${encodeURI(fileName)}`, alt: alt || fileName }, width, height));
        last = m.index + m[0].length;
      }
      if (last < value.length) next.push({ type: 'text', value: value.slice(last) });
    }
    node.children = next;
  };

  return (tree) => transform(tree);
}
