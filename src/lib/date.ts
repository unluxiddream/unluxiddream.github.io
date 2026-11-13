/**
 * 커스텀 날짜 문자열 파서.
 *  지원 형식 (부호 - 는 기원전/가상 연도용)
 *   20261015            → 2026-10-15
 *   20261107220100      → 2026-11-07 22:01:00   (14자리, 시분초 붙여쓰기)
 *   202611072201        → 2026-11-07 22:01      (12자리)
 *   -10241231.130030    → -1024-12-31 13:00:30  (점 뒤가 시분초)
 *  연도 자릿수는 자유 (날짜 부분의 마지막 4자리를 MMDD로 봅니다).
 */
export interface ParsedDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  /** 정렬용 숫자 키. 음수 연도도 올바르게 정렬됩니다. */
  key: number;
}

export function parseCustomDate(input: unknown): ParsedDate | null {
  if (input === null || input === undefined) return null;
  let s = String(input).trim().replace(/["']/g, '');
  if (!s) return null;

  const neg = s.startsWith('-');
  if (neg || s.startsWith('+')) s = s.slice(1);

  let datePart = s;
  let timePart = '';
  if (s.includes('.')) {
    [datePart, timePart] = s.split('.', 2);
  } else if (/^\d{14}$/.test(s)) {
    datePart = s.slice(0, 8);
    timePart = s.slice(8);
  } else if (/^\d{12}$/.test(s)) {
    datePart = s.slice(0, 8);
    timePart = s.slice(8);
  }
  if (!/^\d{5,}$/.test(datePart) || (timePart && !/^\d+$/.test(timePart))) return null;

  const yearAbs = Number(datePart.slice(0, -4));
  const month = Number(datePart.slice(-4, -2)) || 1;
  const day = Number(datePart.slice(-2)) || 1;
  const t = timePart.padEnd(6, '0');
  const hour = Number(t.slice(0, 2));
  const minute = Number(t.slice(2, 4));
  const second = Number(t.slice(4, 6));
  const year = neg ? -yearAbs : yearAbs;

  const key = year * 1e10 + month * 1e8 + day * 1e6 + hour * 1e4 + minute * 100 + second;
  return { year, month, day, hour, minute, second, key };
}

export function formatDate(d: ParsedDate | null): string {
  if (!d) return '';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.year}.${p(d.month)}.${p(d.day)}`;
}
