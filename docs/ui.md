[EoH Reforged] UI/UX 통합 기획서

1. 페이지 구조 및 흐름 (Page Flow)
   이 게임은 **Single Page Application (SPA)**입니다. 페이지 이동 없이 오버레이와 모달로 화면이 전환됩니다.
   1.1. 뷰(View) 계층 구조
   인트로 (Landing View): 타이틀 화면, 로그인(Supabase Auth), 서버 선택.
   메인 게임 (Game View): 3D 맵 + HUD (플레이 시간의 99%).
   오버레이 (Overlays):
   결재판 (Sanction Modal): 행동 승인.
   사이드 패널 (Side Panel): 내정/외교/채팅.
   세계 연감 (Almanac Modal): 랭킹, 통계.
2. 상세 레이아웃 (Detailed Layout)
   2.1. 인트로 화면 (Landing View)
   배경: 3D Hex 맵이 천천히 회전하는 모습 (흐림 처리).
   중앙 정렬:
   로고: "Echoes of History" (고운바탕체, 거대한 사이즈).
   슬로건: "당신의 말이 역사가 된다." (타자기로 쳐지는 애니메이션).
   버튼: [Google로 시작하기] (심플한 흰색 버튼).
   하단: 저작권 및 버전 정보.
   2.2. 메인 게임 화면 (Game HUD)
   가장 중요한 화면입니다. **반응형(Responsive)**으로 설계합니다.
   A. 상단 자원 바 (Resource Bar)
   위치: 최상단 고정 (fixed top-0).
   스타일: Glassmorphism (반투명 검정 + 블러).
   PC (높이 64px):
   좌측: 국가 깃발 + 국가명 + 권위 등급(텍스트).
   중앙: 자원 7종 아이콘과 수치가 넓게 펼쳐짐.
   우측: 턴(년도) 표시 + 설정(기어 아이콘).
   Mobile (높이 56px):
   좌측: 국가 깃발만 표시.
   중앙: 가로 스크롤 영역(overflow-x: auto). 자원 아이콘들이 한 줄로 나열됨.
   우측: 턴 표시.
   B. 하단 뉴스 티커 (News Ticker)
   위치: 화면 하단 (fixed bottom-0 또는 모바일 탭 바 바로 위).
   스타일: 얇은 검은색 띠 (h-8, bg-black/80).
   기능: 텍스트가 오른쪽에서 왼쪽으로 흐름 (marquee 효과).
   "[속보] A국, B국에 선전포고... [경제] 북부 철광석 가격 폭등..."
   C. 우측 패널 (Interaction Panel) - 핵심
   PC: 화면 우측에 붙박이로 고정 (w-96, h-full).
   Mobile: 하단 네비게이션의 버튼을 누르면 올라오는 바텀 시트(Bottom Sheet). (h-[70dvh]).
   탭(Tab) 구성: 상단에 탭 버튼 2개 배치.
   집무실 (Action): 건설, 징병, 연구 등 시스템 버튼 모음.
   알현실 (Council): AI 참모, 타국 사절과의 채팅 화면.
   D. 하단 네비게이션 (Mobile Only)
   위치: 최하단 고정 (fixed bottom-0).
   높이: 60px + Safe Area.
   구성: 4등분 버튼.
   [집무]: 집무실 패널 열기.
   [알현]: 채팅 패널 열기.
   [연감]: 랭킹/통계 모달 열기.
   [지도]: 패널을 모두 닫고 맵만 보기.
3. 컴포넌트 디자인 가이드 (Component Design)
   3.1. 육각형 타일 메뉴 (Radial Menu)
   타일을 클릭했을 때 뜨는 컨텍스트 메뉴입니다.
   형태: 클릭한 타일을 중심으로 아이콘 4~5개가 둥글게 펼쳐짐.
   아이콘:
   🔨 (건설)
   ⚔️ (이동/공격)
   ℹ️ (정보)
   동작: 빈 곳을 클릭하면 사라짐.
   3.2. 결재판 모달 (Sanction Modal)
   가장 공을 들여야 하는 UI입니다.
   배경: 누런 종이 텍스처 (bg-[#F1EBE4]). 가장자리가 약간 낡은 느낌 추천.
   그림자: 매우 강하게 (drop-shadow-2xl) 주어 화면에서 붕 떠 보이게 함.
   타이포: 제목은 무조건 명조체(고운바탕) 사용.
   내용 배치:
   [헤더] 안건 제목 ("농장 건설 승인안").
   [본문] AI 코멘트 (손글씨 느낌 폰트).
   [데이터] 소모 자원 (빨간색) / 기대 효과 (초록색) 리스트.
   [푸터] 도장 버튼. 클릭 시 scale 애니메이션과 함께 붉은 인주 자국이 남아야 함.
   3.3. 채팅 말풍선
   나 (User):
   배경: 짙은 남색 (bg-slate-800).
   텍스트: 흰색.
   정렬: 우측.
   AI / 타인:
   배경: 종이색 (bg-[#F1EBE4]).
   텍스트: 검정 잉크색 (text-slate-900).
   정렬: 좌측. (프로필 사진 포함).
   시스템 알림: 중앙 정렬, 작은 글씨, 회색.
4. 스타일 가이드 (Style Guide)
   Tailwind CSS 기준으로 작성된 디자인 토큰입니다.
   4.1. 컬러 팔레트 (Theme Colors)
   Primary (배경): bg-slate-950 (거의 검정에 가까운 남색).
   Surface (유리): bg-slate-900/80 + backdrop-blur-md.
   Surface (종이): bg-stone-100 (따뜻한 회색/베이지).
   Accent (골드): text-amber-400 (권위, 황제, 중요 자원).
   Accent (위험): text-rose-500 (전쟁, 비용 소모, 거절).
   Accent (안전): text-emerald-500 (동맹, 이득, 수락).
   4.2. 폰트 (Typography)
   Main Font (시스템): Pretendard Variable (가독성).
   Serif Font (서사): Gowun Batang (구글 폰트).
   Size:
   모달 제목: text-2xl font-serif font-bold
   패널 제목: text-lg font-bold
   본문: text-base
   설명/캡션: text-sm text-gray-400
   4.3. 효과 (Effects)
   유리 효과 (Glass):
   code
   CSS
   .glass-panel {
   @apply bg-slate-900/80 backdrop-blur-md border border-white/10;
   }
   종이 그림자 (Paper Shadow):
   code
   CSS
   .paper-shadow {
   box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5);
   }
5. 1인 개발을 위한 CSS 꿀팁
   모바일 높이 문제 (100dvh):
   모바일 브라우저 주소창 때문에 100vh를 쓰면 스크롤이 생깁니다.
   항상 h-[100dvh] (Dynamic Viewport Height)를 사용하세요.
   안전 영역 (Safe Area):
   아이폰 노치나 하단 바에 버튼이 가리지 않게 패딩을 주세요.
   pb-[env(safe-area-inset-bottom)]
   Z-Index 관리:
   Map: z-0
   HUD (자원바): z-10
   Panel (채팅): z-20
   Modal (결재판): z-50 (가장 위)
