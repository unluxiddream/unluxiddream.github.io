/** About 페이지 데이터 형식. 각 언어 폴더의 about.astro 상단에서 이 형식으로 내용을 작성합니다. */
export interface AboutData {
  /** 소개 문단 (배열 한 칸 = 한 문단) */
  intro: string[];
  labels: {
    fields: string;
    education: string;
    discography: string;
    projects: string;
    activities: string;
    portfolio: string;
    contact: string;
    viewWork: string;
    viewTab: string;
  };
  /** to = 클릭 시 이동할 사이트 내부 경로 (예: 'music/?filter=vocal' → Music & Audio의 「보컬」 필터가 켜진 상태) */
  fields: { label: string; to?: string }[];
  education: string[];
  /** workId = Works 폴더의 작품 id(파일명). 있으면 제목이 그 작업물 페이지로 연결됩니다. */
  discography: { year: string; title: string; format: string; note?: string; workId?: string }[];
  /** url = 클릭 시 열릴 외부 링크 (새 탭) */
  projects: { year: string; title: string; url?: string }[];
  activities: { year: string; title: string; url?: string }[];
  portfolio: {
    genre: string;
    /** {title} 은 workId 작품의 현재 언어 제목(md의 title_kr/en/jp/cn)으로 자동 치환됩니다 */
    title?: string;
    release?: string;
    credits?: string;
    /** Works 폴더의 작품 id(=파일명 기반 slug). 존재하면 상세 페이지로 링크됩니다. */
    workId?: string;
    /** 개별 작품 대신 연결할 사이트 내부 경로 (예: 'visual/?filter=albumart') */
    to?: string;
  }[];
}
