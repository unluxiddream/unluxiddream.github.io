import type { LangKey } from '../config/site';

export type Dict = Record<LangKey, string>;

/**
 * UI 문구 사전. 새 문구는 여기에 추가하고 <T k="키" /> 로 사용합니다.
 * (작품 제목은 md의 title_kr / title_en / title_jp / title_cn 에서 가져옵니다)
 */
export const UI = {
  'sort.label': { ko: '정렬', en: 'Sort', jp: '並び替え', cn: '排序' },
  'sort.newest': { ko: '최신순', en: 'Newest', jp: '新しい順', cn: '从新到旧' },
  'sort.oldest': { ko: '오래된순', en: 'Oldest', jp: '古い順', cn: '从旧到新' },
  'sort.az': { ko: '가나다순', en: 'Title A–Z', jp: '名前順', cn: '名称升序' },
  'sort.za': { ko: '가나다 역순', en: 'Title Z–A', jp: '名前の逆順', cn: '名称降序' },

  'list.empty': {
    ko: '아직 등록된 작업물이 없습니다.',
    en: 'No works here yet.',
    jp: 'まだ作品がありません。',
    cn: '暂无作品。',
  },

  'filter.all': { ko: '전체', en: 'All', jp: 'すべて', cn: '全部' },
  'filter.label': { ko: '참여 분야', en: 'Filter by role', jp: '担当で絞り込み', cn: '按担任筛选' },
  'filter.empty': {
    ko: '이 분야의 작업물은 아직 없습니다.',
    en: 'No works in this category yet.',
    jp: 'この分野の作品はまだありません。',
    cn: '该分类暂无作品。',
  },

  'meta.release': { ko: '공개일', en: 'Released', jp: '公開日', cn: '发布日期' },
  'meta.created': { ko: '작업일', en: 'Created', jp: '制作日', cn: '创作日期' },
  'meta.roles': { ko: '참여', en: 'Roles', jp: '担当', cn: '担任' },
  'meta.genre': { ko: '장르', en: 'Genre', jp: 'ジャンル', cn: '类型' },
  'meta.projects': { ko: '프로젝트', en: 'Project', jp: 'プロジェクト', cn: '项目' },
  'meta.type': { ko: '유형', en: 'Type', jp: '種別', cn: '类型' },
  'detail.back': { ko: '목록으로', en: 'Back to list', jp: '一覧へ戻る', cn: '返回列表' },
  'detail.github': { ko: 'GitHub에서 보기', en: 'View on GitHub', jp: 'GitHubで見る', cn: '在 GitHub 查看' },
  'detail.sheet': { ko: '악보 구매', en: 'Buy Sheet Music', jp: '楽譜を購入', cn: '购买乐谱' },
  'detail.watch': { ko: 'YouTube에서 보기', en: 'Watch on YouTube', jp: 'YouTubeで見る', cn: '在 YouTube 观看' },

  'home.role': { ko: '작곡가 · 멀티 아티스트', en: 'Composer · Multi-Artist', jp: '作曲家 · マルチアーティスト', cn: '作曲家 · 全能创作者' },
  'home.lead': {
    ko: '언어와 파동으로 전해지는 세계.',
    en: 'A world resonating through words and waves.',
    jp: '言葉と波動で伝わる世界。',
    cn: '借由言语与波动传递的世界。',
  },
  'home.viewall': { ko: '전체 보기', en: 'View all', jp: 'すべて見る', cn: '查看全部' },
  'home.cta.about': { ko: '프로필 보기', en: 'Read profile', jp: 'プロフィールを見る', cn: '查看简介' },
  'home.cta.works': { ko: '작업물 보기', en: 'Explore works', jp: '作品を見る', cn: '浏览作品' },
  'home.main': { ko: '메인', en: 'Main', jp: 'メイン', cn: '主业' },

  'disc.compose': { ko: '작곡', en: 'Composition', jp: '作曲', cn: '作曲' },
  'disc.vocal': { ko: '보컬', en: 'Vocals', jp: 'ボーカル', cn: '演唱' },
  'disc.arrange': { ko: '편곡', en: 'Arrangement', jp: '編曲', cn: '编曲' },
  'disc.lyrics': { ko: '작사', en: 'Lyrics', jp: '作詞', cn: '作词' },
  'disc.mix': { ko: '믹스 · 마스터링', en: 'Mixing · Mastering', jp: 'ミックス · マスタリング', cn: '混音 · 母带' },
  'disc.artwork': { ko: '아트워크', en: 'Artwork', jp: 'アートワーク', cn: '美术' },
  'disc.video': { ko: '영상', en: 'Video', jp: '映像', cn: '视频' },
  'disc.publish': { ko: '판본 제작', en: 'Publication', jp: '版下制作', cn: '出版制作' },
  // Home 「II. Works」 칸의 소제목 (없는 항목은 소제목 없이 표시됨)
  'disc.compose.sub': { ko: '클래식, 대중음악, 뮤지컬 등', en: 'Classical, Pop, Musical & more', jp: 'クラシック、ポップス、ミュージカルなど', cn: '古典、流行音乐、音乐剧等' },
  'disc.vocal.sub': { ko: '대중음악(한국어/일본어/영어), 뮤지컬, 동인음악 등', en: 'Pop (Korean / Japanese / English), Musical, Doujin music & more', jp: 'ポップス（韓国語／日本語／英語）、ミュージカル、同人音楽など', cn: '流行音乐（韩语／日语／英语）、音乐剧、同人音乐等' },
  'disc.arrange.sub': { ko: '오케스트레이션, 일렉트로닉 등', en: 'Orchestration, Electronic & more', jp: 'オーケストレーション、エレクトロニックなど', cn: '管弦乐配器、电子音乐等' },
  'disc.lyrics.sub': { ko: '한국어, 일본어', en: 'Korean, Japanese', jp: '韓国語、日本語', cn: '韩语、日语' },
  'disc.artwork.sub': { ko: '캐릭터 일러스트, 앨범 아트워크, 캘리그라피, 타이포그래피, 총괄 디자인 등', en: 'Character illustration, Album artwork, Calligraphy, Typography, Art direction & more', jp: 'キャラクターイラスト、アルバムアートワーク、カリグラフィー、タイポグラフィ、総合デザインなど', cn: '角色插画、专辑美术、书法、字体设计、整体设计等' },
  'disc.video.sub': { ko: '뮤직 비디오, 리릭 비디오 등', en: 'Music videos, Lyric videos & more', jp: 'ミュージックビデオ、リリックビデオなど', cn: '音乐视频、歌词视频等' },
  'disc.publish.sub': { ko: '사보, 매거진 등', en: 'Score engraving, Magazines & more', jp: '浄書、マガジンなど', cn: '打谱、杂志等' },

  'contact.lead': {
    ko: '작곡 · 편곡 · 보컬 · 아트워크 · 영상 등 작업 의뢰와 협업 제안은 아래 메일로 연락 주세요.',
    en: 'For commissions and collaborations — composition, arrangement, vocals, artwork, video and more — please get in touch by email.',
    jp: '作曲 · 編曲 · ボーカル · アートワーク · 映像などのご依頼やコラボレーションのご提案は、下記のメールまでご連絡ください。',
    cn: '作曲 · 编曲 · 演唱 · 美术 · 视频等委托与合作提案，请通过以下邮箱联系。',
  },
  'contact.copy': { ko: '주소 복사', en: 'Copy address', jp: 'アドレスをコピー', cn: '复制地址' },
  'contact.copied': { ko: '복사했습니다', en: 'Copied', jp: 'コピーしました', cn: '已复制' },
  'contact.mail': { ko: '메일 보내기', en: 'Send email', jp: 'メールを送る', cn: '发送邮件' },
  'contact.business': { ko: '비즈니스', en: 'Business', jp: 'ビジネス', cn: '商务' },
  'contact.follow': { ko: '공식 SNS', en: 'Official SNS', jp: '公式SNS', cn: '官方社交媒体' },
  'contact.support': { ko: '후원', en: 'Support', jp: '支援', cn: '赞助' },
  'contact.email': { ko: '이메일', en: 'E-mail', jp: 'メール', cn: '邮箱' },
  'about.links': { ko: '링크', en: 'Links', jp: 'リンク', cn: '链接' },
  'about.listen': { ko: '스트리밍', en: 'Listen', jp: '配信', cn: '在线收听' },
  'about.sheet': { ko: '악보', en: 'Sheet Music', jp: '楽譜', cn: '乐谱' },
  'about.blog': { ko: '블로그', en: 'Blog', jp: 'ブログ', cn: '博客' },
  'contact.areas': { ko: '의뢰 가능 분야', en: 'Available for', jp: 'ご依頼可能な分野', cn: '可委托领域' },
  'contact.links': { ko: '링크', en: 'Links', jp: 'リンク', cn: '链接' },

  'search.title': { ko: '검색', en: 'Search', jp: '検索', cn: '搜索' },
  'search.submit': { ko: '검색', en: 'Search', jp: '検索', cn: '搜索' },
  'search.scope.all': { ko: '전체', en: 'All', jp: 'すべて', cn: '全部' },
  'search.scope.title': { ko: '제목', en: 'Title', jp: 'タイトル', cn: '标题' },
  'search.scope.genre': { ko: '장르', en: 'Genre', jp: 'ジャンル', cn: '类型' },
  'search.scope.role': { ko: '참여', en: 'Role', jp: '担当', cn: '担任' },
  'search.placeholder': { ko: '제목, 장르, 참여 분야로 검색', en: 'Search by title, genre or role', jp: 'タイトル・ジャンル・担当で検索', cn: '按标题、类型或担任搜索' },
  'search.prompt': { ko: '검색어를 입력해 주세요.', en: 'Type something to search.', jp: '検索ワードを入力してください。', cn: '请输入搜索内容。' },
  'search.empty': { ko: '검색 결과가 없습니다.', en: 'No results found.', jp: '該当する作品がありません。', cn: '没有找到相关作品。' },

  'footer.notice': {
    ko: '본 사이트는 포트폴리오 열람을 위한 비상업적 개인 사이트입니다.',
    en: 'This is a non-commercial personal website intended solely as a portfolio.',
    jp: '本サイトはポートフォリオ閲覧を目的とした非営利の個人サイトです。',
    cn: '本网站为仅用于展示作品集的非商业性个人网站。',
  },

  'nf.title': { ko: '페이지를 찾을 수 없습니다.', en: 'Page not found.', jp: 'ページが見つかりません。', cn: '找不到页面。' },
  'nf.home': { ko: '홈으로', en: 'Go home', jp: 'ホームへ', cn: '返回首页' },
} satisfies Record<string, Dict>;

export type UIKey = keyof typeof UI;

/** frontmatter roles 값(한국어) → 언어별 표기. 사전에 없는 값은 원문 그대로 표시됩니다. */
export const ROLE_NAMES: Record<string, Dict> = {
  작곡: { ko: '작곡', en: 'Composition', jp: '作曲', cn: '作曲' },
  '공동 작곡': { ko: '공동 작곡', en: 'Co-composition', jp: '共同作曲', cn: '联合作曲' },
  편곡: { ko: '편곡', en: 'Arrangement', jp: '編曲', cn: '编曲' },
  작사: { ko: '작사', en: 'Lyrics', jp: '作詞', cn: '作词' },
  '공동 작사': { ko: '공동 작사', en: 'Co-lyrics', jp: '共同作詞', cn: '联合作词' },
  보컬: { ko: '보컬', en: 'Vocals', jp: 'ボーカル', cn: '演唱' },
  '메인 보컬': { ko: '메인 보컬', en: 'Lead Vocals', jp: 'メインボーカル', cn: '主唱' },
  '코러스 보컬': { ko: '코러스 보컬', en: 'Chorus Vocals', jp: 'コーラス', cn: '和声' },
  코러스: { ko: '코러스', en: 'Chorus', jp: 'コーラス', cn: '和声' },
  믹스: { ko: '믹스', en: 'Mixing', jp: 'ミックス', cn: '混音' },
  마스터링: { ko: '마스터링', en: 'Mastering', jp: 'マスタリング', cn: '母带处理' },
  일러스트: { ko: '일러스트', en: 'Illustration', jp: 'イラスト', cn: '插画' },
  디자인: { ko: '디자인', en: 'Design', jp: 'デザイン', cn: '设计' },
  아트워크: { ko: '아트워크', en: 'Artwork', jp: 'アートワーク', cn: '美术' },
  캘리그라피: { ko: '캘리그라피', en: 'Calligraphy', jp: 'カリグラフィー', cn: '书法' },
  영상: { ko: '영상', en: 'Video', jp: '映像', cn: '视频' },
  '피아노 실연': { ko: '피아노 실연', en: 'Piano Performance', jp: 'ピアノ演奏', cn: '钢琴演奏' },
  사보: { ko: '사보', en: 'Score Engraving', jp: '浄書', cn: '打谱' },
  판본: { ko: '판본', en: 'Publication', jp: '版下', cn: '出版' },
  '앨범 아트워크': { ko: '앨범 아트워크', en: 'Album Artwork', jp: 'アルバムアートワーク', cn: '专辑美术' },
  타이포그래피: { ko: '타이포그래피', en: 'Typography', jp: 'タイポグラフィ', cn: '字体设计' },
  '가사 번역': { ko: '가사 번역', en: 'Lyrics Translation', jp: '訳詞', cn: '歌词翻译' },
  '악보 제작': { ko: '악보 제작', en: 'Score Engraving', jp: '楽譜制作', cn: '乐谱制作' },
  악보: { ko: '악보', en: 'Score', jp: '楽譜', cn: '乐谱' },
  매거진: { ko: '매거진', en: 'Magazine', jp: 'マガジン', cn: '杂志' },
  '판본 제작': { ko: '판본 제작', en: 'Publication', jp: '版下制作', cn: '出版制作' },
  편집: { ko: '편집', en: 'Editing', jp: '編集', cn: '编辑' },
  기획: { ko: '기획', en: 'Planning', jp: '企画', cn: '策划' },
  개발: { ko: '개발', en: 'Development', jp: '開発', cn: '开发' },
  번역: { ko: '번역', en: 'Translation', jp: '翻訳', cn: '翻译' },
  '한국어 번역': { ko: '한국어 번역', en: 'Korean Translation', jp: '韓国語翻訳', cn: '韩语翻译' },
  '일본어 번역': { ko: '일본어 번역', en: 'Japanese Translation', jp: '日本語翻訳', cn: '日语翻译' },
};

export function roleDict(role: string): Dict {
  return ROLE_NAMES[role] ?? { ko: role, en: role, jp: role, cn: role };
}
