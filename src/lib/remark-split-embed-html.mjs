/**
 * <iframe>(유튜브 · 쇼츠 등) 줄 바로 다음 줄에 빈 줄 없이 글을 쓰면, 마크다운 규칙상 그 글까지
 * HTML 덩어리로 묶여 줄바꿈 · 링크가 사라집니다. Obsidian 에서는 정상으로 보이므로,
 * 한 줄짜리 <iframe>/<video>/<audio> 뒤에 이어진 글을 떼어 내 일반 마크다운으로 다시 읽습니다.
 * (다른 remark 플러그인보다 먼저 실행해야 떼어 낸 글에도 줄바꿈 · [[링크]] · #태그가 적용됩니다)
 */
const HEAD = /^(\s*<(iframe|video|audio)\b[^>]*>[\s\S]*?<\/\2>)[ \t]*\r?\n([\s\S]*\S[\s\S]*)$/i;

export default function remarkSplitEmbedHtml() {
  const processor = this;
  const split = (parent) => {
    if (!parent.children) return;
    for (let i = 0; i < parent.children.length; i++) {
      const node = parent.children[i];
      if (node.type !== 'html') {
        split(node);
        continue;
      }
      const m = node.value.match(HEAD);
      if (!m) continue;
      const rest = processor.parse(m[3]).children;
      parent.children.splice(i, 1, { type: 'html', value: m[1] }, ...rest);
      i += rest.length;
    }
  };
  return (tree) => split(tree);
}
