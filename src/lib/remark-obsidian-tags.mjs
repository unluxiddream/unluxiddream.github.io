/**
 * Obsidian 본문 태그 `#태그` 를 사이트에서도 태그 모양으로 보여 주는 remark 플러그인.
 *   `#Chest #High` → <span class="hashtag">#Chest</span> <span class="hashtag">#High</span>
 *
 * Obsidian 과 같은 규칙으로 판정합니다.
 *  - `#` 앞이 줄 처음이거나 공백일 때만 (예: `C#5`, 주소의 `#` 는 태그가 아님)
 *  - `#` 바로 뒤에 공백이 없어야 함 (`# 제목` 은 제목)
 *  - 숫자만으로 된 것은 태그가 아님 (`#1`, `#2026`)
 *  - 글자·숫자·`_`·`-`·`/` 로 구성 (`#vocal/high` 같은 하위 태그 가능)
 *  - 코드(`code`), 링크 글자 안의 `#` 는 그대로 둠
 */
const TAG = /(^|\s)#([\p{L}\p{N}\p{M}_\-/]+)/gu;
const SKIP = new Set(['code', 'inlineCode', 'link', 'linkReference', 'html']);

export default function remarkObsidianTags() {
  const transform = (node) => {
    if (!node.children || SKIP.has(node.type)) return;
    const next = [];
    for (const child of node.children) {
      if (child.type !== 'text' || !child.value.includes('#')) {
        transform(child);
        next.push(child);
        continue;
      }
      const value = child.value;
      let last = 0;
      for (const m of value.matchAll(TAG)) {
        const name = m[2];
        if (/^[\p{N}_\-/]+$/u.test(name)) continue; // 숫자만 → 태그 아님
        const start = m.index + m[1].length;
        if (start > last) next.push({ type: 'text', value: value.slice(last, start) });
        next.push({
          type: 'emphasis',
          data: { hName: 'span', hProperties: { className: ['hashtag'] } },
          children: [{ type: 'text', value: `#${name}` }],
        });
        last = start + 1 + name.length;
      }
      if (last < value.length) next.push({ type: 'text', value: value.slice(last) });
    }
    node.children = next;
  };
  return (tree) => transform(tree);
}
