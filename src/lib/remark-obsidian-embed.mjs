/**
 * Obsidian 임베드 문법 `![[파일명.png]]`, `![[파일명.png|300]]` 을
 * 일반 이미지 노드(`/images/파일명.png`)로 바꿔 주는 아주 작은 remark 플러그인.
 * 이미지 파일은 Obsidian 볼트의 Attachments 폴더에 두면 됩니다 (빌드 때 /images/ 로 복사).
 *
 * 또, 일반 마크다운 이미지 `![](public/파일.png)` 처럼 public 폴더 기준으로 적은 경로는
 * 사이트 주소(`/파일.png`)로 바꿔 줍니다. (README 내용을 그대로 붙여 넣어도 깨지지 않도록)
 */
const PUBLIC_PATH = /^(?:\.\/)?public\//;
const EMBED = /!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g;
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

export default function remarkObsidianEmbed(options = {}) {
  const base = (options.base ?? '/').replace(/\/?$/, '/');

  const transform = (node) => {
    if (node.type === 'image' && PUBLIC_PATH.test(node.url)) node.url = base + node.url.replace(PUBLIC_PATH, '');
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
        next.push({
          type: 'image',
          url: `${base}images/${encodeURI(fileName)}`,
          alt: m[2] && !/^\d+(x\d+)?$/.test(m[2]) ? m[2] : fileName,
        });
        last = m.index + m[0].length;
      }
      if (last < value.length) next.push({ type: 'text', value: value.slice(last) });
    }
    node.children = next;
  };

  return (tree) => transform(tree);
}
