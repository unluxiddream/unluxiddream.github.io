/**
 *  사이트 전역 설정 — 이 파일만 고쳐도 대부분의 정보가 바뀝니다.
 */

export const SITE = {
  name: 'UnluXidDream',
  alias: 'UnluD | 루드 | ルード | 恩路德',
  /** About 프로필 카드의 이름 위 독음 (요미가나처럼 작게). 영어는 국제음성기호(IPA) */
  reading: { ko: '언루시드 드림', en: '/ʌnˈluːsɪd driːm/', jp: 'アンルシッドドリーム', cn: '恩路西德德林' },
  email: 'unluxiddream@naver.com',
};

/**
 * 원고(md) 폴더 위치 — 프로젝트 루트 기준 상대 경로.
 * 기본값은 Obsidian 볼트 안의 Works 폴더입니다.
 */
export const WORKS_DIR = './Official_UnluD/Works';

/** News(소식) md 파일 폴더. 파일명 = 주소 (/news/<파일명>/) */
export const NEWS_DIR = './Official_UnluD/News';

/** 지원 언어. key = URL 폴더명(src/pages/<key>/about.astro), field = title_<field> */
export const LANGS = [
  { key: 'ko', field: 'kr', label: 'KR', locale: 'ko', name: '한국어' },
  { key: 'en', field: 'en', label: 'EN', locale: 'en', name: 'English' },
  { key: 'jp', field: 'jp', label: 'JP', locale: 'ja', name: '日本語' },
  { key: 'cn', field: 'cn', label: 'CN', locale: 'zh', name: '中文' },
] as const;
export type LangKey = (typeof LANGS)[number]['key'];
export const DEFAULT_LANG: LangKey = 'ko';

/**
 * categories 값 → 탭 매핑.
 * 여기에 없는 카테고리 값은 전부 Other Works 탭으로 들어갑니다.
 * (대소문자 구분 없음)
 */
export const TAB_CATEGORIES = {
  music: ['music', 'audio'],
  visual: ['illust', 'illustration', 'video', 'design', 'visual'],
} as const;

/** work_type 값 → 커버 좌측 상단 인덱스 */
export const WORK_TYPES = {
  Original: { label: 'Original', className: 'tag--original' },
  Cover: { label: 'Cover', className: 'tag--cover' },
  Participation: { label: 'Participation', className: 'tag--participation' },
  Commission: { label: 'Commission', className: 'tag--commission' },
} as const;

/** projects 값 → 커버 우측 하단 인덱스. 목록에 없는 프로젝트는 금색 기본 인덱스로 표시 */
export const PROJECTS: Record<string, { label: string; className: string }> = {
  'Project LuDiA': { label: 'LuDiA', className: 'tag--ludia' },
  LeXidN: { label: 'LeXidN', className: 'tag--lexidn' },
};

/**
 * 홈 화면 「II. Works」 영역.
 * match 에 적힌 roles 값이 붙은 작품 수를 자동으로 집계합니다.
 */
/**
 * to = 칸을 눌렀을 때 이동할 곳. 'music/?filter=compose' 처럼 탭 + 필터 버튼 key.
 * 필터 key 를 쉼표로 여러 개 적으면(예: 'mix,master') 그 버튼들이 모두 켜진 상태로 열립니다.
 */
export const DISCIPLINES: { key: string; match: string[]; to: string; main?: boolean }[] = [
  { key: 'compose', match: ['작곡', '공동 작곡'], to: 'music/?filter=compose', main: true },
  { key: 'vocal', match: ['보컬', '코러스', '메인 보컬', '코러스 보컬'], to: 'music/?filter=vocal' },
  { key: 'arrange', match: ['편곡'], to: 'music/?filter=arrange' },
  { key: 'lyrics', match: ['작사', '공동 작사'], to: 'music/?filter=lyrics' },
  { key: 'mix', match: ['믹스', '마스터링'], to: 'music/?filter=mix,master' },
  { key: 'perform', match: ['보컬 실연', '피아노 실연', '베이스 실연', '리코더 실연'], to: 'music/?filter=perform' },
  { key: 'artwork', match: ['일러스트', '디자인', '아트워크', '앨범 아트워크', '캘리그라피', '타이포그래피'], to: 'visual/?filter=illust,design,albumart,calli' },
  { key: 'video', match: ['영상'], to: 'visual/?filter=video' },
  { key: 'publish', match: ['사보', '악보', '악보 제작', '매거진', '판본', '판본 제작', '편집'], to: 'other/?filter=score,publish' },
  { key: 'dev', match: ['개발'], to: 'other/?filter=dev' },
];

/**
 * 작업물 상세 페이지 「참여」 칸의 표시 순서.
 * md의 roles 는 아무 순서로 적어도 웹에는 이 순서대로 정렬되어 보입니다.
 * 이 목록에 없는 값은 맨 뒤에, md에 적은 순서 그대로 붙습니다.
 */
export const ROLE_ORDER: string[] = [
  '작곡', '공동 작곡',
  '편곡',
  '작사', '공동 작사',
  '보컬', '메인 보컬', '코러스 보컬', '코러스',
  '보컬 실연', '피아노 실연', '베이스 실연', '리코더 실연',
  '믹스',
  '마스터링',
  '일러스트',
  '캘리그라피',
  '타이포그래피',
  '디자인',
  '앨범 아트워크', '아트워크',
  '영상',
  '사보', '악보 제작', '악보',
  '판본 제작', '판본', '매거진', '편집',
  '번역', '가사 번역', '한국어 번역', '일본어 번역',
];

type Dict = Record<LangKey, string>;

/**
 * 탭별 필터 버튼. 작품 md의 roles 값 중 match 에 있는 값이 하나라도 있으면 해당 버튼에서 보입니다.
 * key 가 'etc' 인 버튼은 「같은 탭의 다른 버튼에 하나도 해당하지 않는 작품」을 보여줍니다.
 * '전체' 버튼은 자동으로 맨 앞에 붙습니다.
 */
export const FILTERS: Record<'music' | 'visual' | 'other', { key: string; label: Dict; match: string[] }[]> = {
  music: [
    { key: 'compose', label: { ko: '작곡', en: 'Composition', jp: '作曲', cn: '作曲' }, match: ['작곡', '공동 작곡'] },
    { key: 'arrange', label: { ko: '편곡', en: 'Arrangement', jp: '編曲', cn: '编曲' }, match: ['편곡'] },
    { key: 'vocal', label: { ko: '보컬', en: 'Vocals', jp: 'ボーカル', cn: '演唱' }, match: ['보컬', '메인 보컬', '코러스 보컬', '코러스'] },
    { key: 'lyrics', label: { ko: '작사', en: 'Lyrics', jp: '作詞', cn: '作词' }, match: ['작사', '공동 작사'] },
    { key: 'mix', label: { ko: '믹스', en: 'Mixing', jp: 'ミックス', cn: '混音' }, match: ['믹스'] },
    { key: 'master', label: { ko: '마스터링', en: 'Mastering', jp: 'マスタリング', cn: '母带' }, match: ['마스터링'] },
    { key: 'perform', label: { ko: '실연', en: 'Performance', jp: 'ライブ', cn: '演奏' }, match: ['보컬 실연', '피아노 실연', '베이스 실연', '리코더 실연'] },
  ],
  visual: [
    { key: 'illust', label: { ko: '일러스트', en: 'Illustration', jp: 'イラスト', cn: '插画' }, match: ['일러스트'] },
    { key: 'design', label: { ko: '디자인', en: 'Design', jp: 'デザイン', cn: '设计' }, match: ['디자인'] },
    { key: 'albumart', label: { ko: '앨범 아트워크', en: 'Album Artwork', jp: 'アルバムアートワーク', cn: '专辑美术' }, match: ['앨범 아트워크', '아트워크'] },
    { key: 'calli', label: { ko: '캘리&타이포', en: 'Calligraphy & Type', jp: 'カリグラフィー&タイポ', cn: '书法&字体' }, match: ['캘리그라피', '타이포그래피', '캘리&타이포'] },
    { key: 'video', label: { ko: '영상', en: 'Video', jp: '映像', cn: '视频' }, match: ['영상'] },
  ],
  other: [
    { key: 'score', label: { ko: '사보', en: 'Score', jp: '浄書', cn: '打谱' }, match: ['사보', '악보', '악보 제작'] },
    { key: 'publish', label: { ko: '판본', en: 'Publication', jp: '版下', cn: '出版' }, match: ['판본', '판본 제작', '매거진', '편집'] },
    { key: 'translate', label: { ko: '번역', en: 'Translation', jp: '翻訳', cn: '翻译' }, match: ['번역', '한국어 번역', '일본어 번역', '가사 번역'] },
    { key: 'dev', label: { ko: '개발', en: 'Development', jp: '開発', cn: '开发' }, match: ['개발'] },
    { key: 'etc', label: { ko: '그 외', en: 'Others', jp: 'その他', cn: '其他' }, match: [] },
  ],
};

export interface SiteLink {
  label: string;
  url: string;
  desc?: Dict;
}

/**
 * 외부 링크. 그룹별로 표시 위치가 정해져 있습니다.
 *  Contact 페이지 : business / follow / support
 *  About 페이지   : listen / sheet / blog
 */
export const LINKS: Record<'business' | 'follow' | 'support' | 'listen' | 'sheet' | 'blog', SiteLink[]> = {
  business: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/unluxiddream' },
  ],
  follow: [
    { label: 'Instagram', url: 'https://www.instagram.com/unluxiddream/' },
    { label: 'X', url: 'https://x.com/unluxiddream' },
    { label: 'TikTok', url: 'https://www.tiktok.com/@unluxiddream' },
  ],
  support: [
    { label: 'Ko-fi', url: 'https://ko-fi.com/unluxiddream', desc: { ko: '창작 활동 후원하기', en: 'Support my work', jp: '創作活動を応援する', cn: '支持我的创作' } },
  ],
  listen: [
    { label: 'YouTube Music', url: 'https://music.youtube.com/channel/UCo8lZZwU2PbEnIBAfWScJcQ' },
    { label: 'Apple Music', url: 'https://music.apple.com/kr/artist/unluxiddream/1698204984' },
    { label: 'Spotify', url: 'https://open.spotify.com/artist/04kP0plMB8afyIAVB7KN2t' },
    { label: 'Amazon Music', url: 'https://music.amazon.com/artists/B0CC6N538W/unluxiddream' },
    { label: 'Deezer', url: 'https://www.deezer.com/en/artist/222090765' },
    { label: 'TIDAL', url: 'https://tidal.com/browse/artist/40757539' },
    { label: 'SoundCloud', url: 'https://soundcloud.com/unluxiddream' },
    { label: 'Melon', url: 'https://www.melon.com/artist/timeline.htm?artistId=3577849' },
    { label: 'Genie', url: 'https://www.genie.co.kr/detail/artistInfo?xxnm=82568272' },
    { label: 'FLO', url: 'https://www.music-flo.com/detail/artist/407614085/track' },
    { label: 'Bugs', url: 'https://music.bugs.co.kr/artist/13351699' },
    { label: 'QQ Music', url: 'https://y.qq.com/n/ryqq/singer/000X47hM3IwH9Z' },
    { label: 'KKBOX', url: 'https://kkbox.fm/eP3U5X' },
    { label: 'Boomplay', url: 'https://www.boomplay.com/artists/73820036' },
  ],
  sheet: [
    { label: 'mymusic5', url: 'https://www.mymusic5.com/unluxiddream?page=1&viewType=sheet&orderBy=createdAt', desc: { ko: '피아노 악보 판매', en: 'Sheet music store', jp: '楽譜販売', cn: '乐谱商店' } },
  ],
  blog: [
    { label: 'Naver Blog', url: 'https://blog.naver.com/unluxiddream', desc: { ko: '작업 노트 · 커버곡 노트 · 팁 아카이브', en: 'Work notes, cover notes & tips (Korean)', jp: '制作ノート・カバー曲ノート・Tips（韓国語）', cn: '创作笔记 · 翻唱笔记 · 技巧（韩语）' } },
    { label: 'Ameba Blog', url: 'https://ameblo.jp/unluxiddream', desc: { ko: '일본어 음악 소식', en: 'Music news (Japanese)', jp: '音楽のお知らせ（日本語）', cn: '音乐资讯（日语）' } },
  ],
};

/**
 * 하단 바(좌측 최하단) 아이콘 링크. 순서대로 표시됩니다.
 * icon 값은 src/components/SocialIcons.astro 에 그려 둔 아이콘 이름입니다.
 */
export const FOOTER_LINKS: { label: string; url: string; icon: 'youtube' | 'instagram' | 'x' | 'naverblog' }[] = [
  { label: 'YouTube', url: 'https://www.youtube.com/@unluxiddream', icon: 'youtube' },
  { label: 'Instagram', url: 'https://www.instagram.com/unluxiddream/', icon: 'instagram' },
  { label: 'X', url: 'https://x.com/unluxiddream', icon: 'x' },
  { label: 'Naver Blog', url: 'https://blog.naver.com/unluxiddream', icon: 'naverblog' },
];

/**
 * 보컬 톤 · 발성. 작품 md 의 vocal_tone / vocal_voice 값.
 *  - 카드에는 표시되지 않고, 작업물 상세 페이지 「참여」 아래와 Music & Audio 「보컬」 필터의 보조 필터에서만 쓰입니다.
 *  - match: md 에 적을 수 있는 값 (대소문자 무시). 첫 번째 값이 기본 표기입니다.
 *  - label: 화면에 보이는 이름
 */
export interface VocalAttr { key: string; label: Dict; match: string[] }

export const VOCAL_TONES: VocalAttr[] = [
  { key: 'low', label: { ko: 'Low', en: 'Low', jp: 'Low', cn: 'Low' }, match: ['Low', '로우', '로우톤'] },
  { key: 'mid', label: { ko: 'Mid (Default)', en: 'Mid (Default)', jp: 'Mid (Default)', cn: 'Mid (Default)' }, match: ['Mid', 'Default', '미드', '디폴트', '디폴트톤'] },
  { key: 'high', label: { ko: 'High', en: 'High', jp: 'High', cn: 'High' }, match: ['High', '하이', '하이톤'] },
];

export const VOCAL_VOICES: VocalAttr[] = [
  { key: 'chest', label: { ko: '진성', en: 'Chest', jp: '地声', cn: '真声' }, match: ['Chest', '진성'] },
  { key: 'head', label: { ko: '두성', en: 'Head', jp: 'ヘッドボイス', cn: '头声' }, match: ['Head', '두성', '헤드보이스'] },
  { key: 'falsetto', label: { ko: '가성', en: 'Falsetto', jp: '裏声', cn: '假声' }, match: ['Falsetto', '가성'] },
];

/**
 * News 분류. 소식 md 의 news_type 값 (여러 개 가능, 대소문자·기호 무시: LiveEvent = Live&Event = live event)
 *  label: 카드의 박스 · 왼쪽 카테고리 메뉴에 보이는 이름
 */
export const NEWS_TYPES: { key: string; value: string; label: string }[] = [
  { key: 'info', value: 'Info', label: 'INFO' },
  { key: 'release', value: 'Release', label: 'RELEASE' },
  { key: 'live', value: 'LiveEvent', label: 'LIVE&EVENT' },
];
