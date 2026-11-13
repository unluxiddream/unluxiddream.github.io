/** base 경로를 붙인 내부 링크를 만듭니다. 외부 URL(http…)·data: 는 그대로 반환. */
export function withBase(path = ''): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:') || path.startsWith('mailto:')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}
