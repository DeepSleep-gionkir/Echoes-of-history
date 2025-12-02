# [Echoes of History: Reforged] UI/UX 디자인 명세서

---

## 1. 디자인 개요 (Visual Identity)

### 1.1. 핵심 컨셉: "Tactile History (손끝에서 만지는 역사)"

본 프로젝트는 방대한 역사 데이터를 다루는 시뮬레이션 게임이나, 복잡한 스프레드시트가 아닌 **'박물관의 디지털 아카이브'**와 같은 경험을 지향한다.

- **Modern & Flat:** 3D 맵은 로우 폴리(Low-Poly) 스타일로 미니멀하게 구성하여 정보의 명확성을 높인다.
- **Material:** UI 요소는 **'유리(Glass)'**와 **'종이(Paper)'**의 질감을 사용하여 현대적인 데이터 시각화와 고전적인 역사적 분위기를 융합한다.
- **Immersive:** 텍스트 위주의 게임성을 보완하기 위해, 클릭 및 터치 시 물리적인 피드백(애니메이션, 진동)을 강조한다.

### 1.2. 화면 레이어 구조 (Z-Index Hierarchy)

깊이감을 통해 정보의 중요도를 시각적으로 구분한다.

- **Layer 0 (Background): 3D World**
  - Three.js Canvas 영역. 육각형 타일 맵과 유닛이 렌더링됨.
- **Layer 1 (HUD): Glassmorphism**
  - 상단 자원 바, 하단 뉴스 티커, 미니맵.
  - 배경을 흐리게 처리하여(Backdrop Blur) 맵과의 분리감을 줌.
- **Layer 2 (Panel): Interaction**
  - 채팅 패널, 건설 메뉴, 유닛 명령창.
- **Layer 3 (Overlay): Paper Material**
  - **최상위 중요도.** 결재판(Sanction Modal), 중요 경고 알림.
  - 불투명한 종이 질감과 그림자를 사용하여 유저의 시선을 강제로 고정함.

---

## 2. 타이포그래피 시스템 (Typography)

한국어 가독성과 역사적 분위기를 동시에 충족하는 폰트 조합을 사용한다.

### 2.1. 폰트 패밀리 (Font Family)

- **본문 / UI / 숫자:** **Pretendard (프리텐다드)**
  - 현대적인 고딕(Sans-serif) 계열.
  - 숫자 가독성이 뛰어나 자원 표기에 적합함.
  - `font-family: "Pretendard Variable", -apple-system, sans-serif;`
- **제목 / 강조 / 서사:** **Gowun Batang (고운바탕)**
  - 디지털 화면에 최적화된 명조(Serif) 계열.
  - 결재판의 제목, AI가 생성한 역사적 텍스트, 칙령 선포 등에 사용.
  - `font-family: "Gowun Batang", serif;`

### 2.2. 타이포그래피 스케일 (Scale)

- **H1 (모달 제목):** 24px (Mobile) / 32px (PC) - 고운바탕 Bold
- **H2 (패널 제목):** 20px / 24px - 프리텐다드 Bold
- **Body (본문):** 16px / 16px - 프리텐다드 Regular
- **Caption (설명/주석):** 13px / 14px - 프리텐다드 Medium (색상 대비 높임)
- **Tiny (상태값):** 11px / 12px - 프리텐다드 Bold (자원 숫자 등)

### 2.3. 한국어 렌더링 규칙

- **줄바꿈:** 단어 단위 줄바꿈을 강제하여 가독성 확보 (`word-break: keep-all`).
- **행간 (Line-height):** 본문 기준 `160%` (1.6) 설정.
- **자간 (Letter-spacing):** `-0.02em` (밀도 있는 텍스트 구성).

---

## 3. 컬러 시스템 (Color Palette)

장시간 플레이 시 눈의 피로를 줄이는 **Dark Theme**를 베이스로 하며, 전략적 정보는 색상 코드로 명확히 구분한다.

### 3.1. 기본 색상 (Base Colors)

| 용도               | Hex Code  | Tailwind Class   | 비고                            |
| :----------------- | :-------- | :--------------- | :------------------------------ |
| **Background**     | `#1A1B1E` | `bg-slate-900`   | 맵 배경색 (Deep Blue-Grey)      |
| **Panel (Glass)**  | `#25262B` | `bg-slate-800`   | Opacity 85% + Blur 12px         |
| **Paper (Modal)**  | `#F1EBE4` | `bg-stone-100`   | 낡은 종이 색상                  |
| **Text (Primary)** | `#E9ECEF` | `text-gray-200`  | 어두운 배경 위 텍스트           |
| **Text (Ink)**     | `#2D2A26` | `text-stone-800` | 종이 배경 위 텍스트 (Ink Color) |

### 3.2. 의미론적 색상 (Semantic Colors)

| 의미               | Hex Code  | Tailwind Class    | 사용 예시                     |
| :----------------- | :-------- | :---------------- | :---------------------------- |
| **Authority**      | `#FAB005` | `text-yellow-400` | 권위, 황제, 중요 자원, 골드   |
| **Ally / Safe**    | `#40C057` | `text-green-500`  | 동맹국, 이득, 건설 가능, 식량 |
| **Enemy / Danger** | `#FA5252` | `text-red-500`    | 적국, 손해, 반란 경고, 전쟁   |
| **Interact**       | `#339AF0` | `text-blue-500`   | 내 유닛, 선택된 타일, 링크    |
| **Neutral**        | `#868E96` | `text-gray-500`   | 비활성 버튼, 부가 정보        |

---

## 4. 레이아웃 및 반응형 가이드 (Layout & Responsiveness)

단일 코드베이스로 PC(Landscape)와 Mobile(Portrait)을 모두 지원하는 **반응형 전략**이다.

### 4.1. 공통 요소 (HUD)

- **Top Bar (자원 표시줄):**
  - 높이: `64px` (PC) / `56px` (Mobile)
  - 배경: Glassmorphism (Blur).
  - 동작: 모바일에서는 자원 아이콘 목록이 화면 너비를 초과할 경우 **가로 스크롤**(`overflow-x: auto`) 허용. 스크롤바는 숨김 처리.
- **Bottom Ticker (뉴스 피드):**
  - 위치: 화면 최하단(PC) / 하단 네비게이션 위(Mobile).
  - 높이: `28px`.
  - 동작: 텍스트가 우에서 좌로 흐르는 애니메이션 적용.

### 4.2. PC 레이아웃 (Widescreen > 1024px)

- **사이드 패널 (Side Panel):**
  - 위치: 우측 고정 (`position: fixed; right: 0;`).
  - 크기: 너비 `400px`, 높이 `100vh`.
  - 기능: 탭(Tab)으로 [내정] / [외교(채팅)] / [정보] 전환.
- **맵 컨트롤:**
  - 마우스 휠 줌인/아웃, 우클릭 드래그로 회전.

### 4.3. 모바일 레이아웃 (Mobile < 768px)

- **하단 네비게이션 (Bottom Nav):**
  - 높이: `60px` + `Safe Area`.
  - 구성: [내정], [외교], [지도], [메뉴] 아이콘 4등분.
- **바텀 시트 (Bottom Sheet):**
  - 동작: 하단 네비게이션 버튼 터치 시 패널이 아래에서 위로 올라옴.
  - 높이: 화면의 `60%` ~ `85%` 가변.
  - 기능: PC의 사이드 패널 기능을 그대로 수행하되, 상단에 '닫기 핸들(Handle)' 추가.
- **뷰포트 대응:**
  - 주소창에 의해 UI가 가려지지 않도록 `height: 100dvh` (Dynamic Viewport Height) 단위 사용.

---

## 5. 핵심 UI 컴포넌트 상세 (Component Specs)

### 5.1. 육각형 타일 메뉴 (Radial Menu)

모바일 터치 환경을 고려하여, 타일 클릭 시 화면을 가리지 않고 직관적인 조작을 제공한다.

- **Trigger:** 3D Hex 타일 터치/클릭 시 발생.
- **Position:** 선택된 타일의 중심점에서 `Y축 -60px` (손가락에 가려지지 않는 상단 위치).
- **Layout:** 중심점을 기준으로 반원(Fan) 형태로 4~6개의 원형 버튼 전개.
- **Button Size:** `48x48px` (Touch Target 최소 사이즈 준수).
- **Animation:** 중심에서 밖으로 퍼지는 `Scale` + `Spring` 애니메이션.

### 5.2. 결재판 모달 (The Sanction Modal)

게임의 핵심 메커니즘인 '결재' 경험을 극대화하는 UI.

- **Container:**
  - 배경: 구겨진 종이 텍스처 이미지(`bg-cover`).
  - 효과: `drop-shadow-2xl`로 화면에서 떠 있는 느낌 강조.
  - 크기: `max-w-md` (PC) / `w-[90%]` (Mobile).
- **Content Area:**
  - **Title:** "건설 승인 요청" (고운바탕, Bold, 24px).
  - **Description:** 시스템 텍스트. 자원 소모량과 효과를 아이콘 리스트로 표시.
  - **AI Opinion (Optional):**
    - 표시 조건: 중요도가 높거나, 권위 판정에 따른 특수 대사 발생 시.
    - 스타일: 손글씨체(Handwriting Font) 또는 이탤릭체, 색상은 `Ink Color`.
    - 배경: 노란색 형광펜(`bg-yellow-200/50`) 밑줄 효과.
- **Action Area:**
  - **Cancel:** 텍스트 버튼 ("반려").
  - **Confirm:** 붉은색 인주가 묻은 **도장(Stamp) 형태의 버튼**.
    - 인터랙션: 클릭 시 도장이 찍히는 소리 + 화면 진동(`vibrate`) + 도장 이미지가 커졌다 작아지는 애니메이션.

### 5.3. 채팅 및 외교 패널 (Diplomacy Panel)

- **Message Bubble:**
  - **User (Right):** `bg-blue-600`, `text-white`. 둥근 모서리(`rounded-l-lg`, `rounded-tr-lg`).
  - **NPC/AI (Left):** `bg-slate-700`, `text-gray-200`. NPC 초상화(Avatar) 포함.
  - **System (Center):** 배경 없음, `text-gray-500`, `text-xs`. (예: "--- 1024년 3월 ---")
- **Input Area:**
  - **Envoy Token:** 입력창 좌측에 남은 사절 토큰 개수 표시 (코인 아이콘).
  - **Send Button:** 텍스트 입력 시 활성화.

---

## 6. 에셋 생성 가이드 (Asset Generation Prompts)

일관된 비주얼 톤앤매너 유지를 위해 AI 이미지 생성 도구(Midjourney 등) 사용 시 아래 프롬프트를 활용한다.

### 6.1. 3D 타일 (3D Tiles)

- **Style:** Isometric, Low-poly, Blender render, Minimalist, Vivid colors.
- **Prompt Examples:**
  - _Plains:_ `Isometric low-poly hexagon tile, grassy plains, few rocks, minimal detail, soft lighting, white background, 3d game asset --v 6.0`
  - _Mountain:_ `Isometric low-poly hexagon tile, high rocky mountain, snow peak, sharp edges, minimal detail, white background --v 6.0`
  - _City:_ `Isometric low-poly hexagon tile, medieval castle, stone walls, small houses, minimal detail, white background --v 6.0`

### 6.2. UI 아이콘 (UI Icons)

- **Style:** Flat vector, Rounded corners, Slight depth, Mobile game UI style.
- **Prompt:** `Game UI icon set, gold coin stack, wheat sheaf, crossed swords, parchment scroll, science beaker, crown, minimalist vector style, dark background friendly, high contrast --v 6.0`

### 6.3. 텍스처 (Textures)

- **Paper:** `Vintage parchment paper texture, beige, worn edges, subtle grain, empty, top down view, seamless, high quality --v 6.0`
- **Stamp:** `Red royal seal stamp, square shape, asian style pattern, ink texture, grunge effect, isolated on white, vector style --v 6.0`

---

## 7. 인터랙션 및 피드백 (Interaction & Feedback)

사용자의 행동에 대한 즉각적인 피드백을 통해 조작감을 향상시킨다.

- **Hover (PC):**
  - Hex 타일 위에 마우스 오버 시, 타일 테두리가 밝게 빛남 (`brightness-125`).
  - 버튼 오버 시 `transform: translateY(-2px)` 부상 효과.
- **Active (Click/Touch):**
  - 버튼 클릭 시 `transform: scale(0.95)` 축소 효과 (눌리는 느낌).
- **Toast Message:**
  - 자원 획득/소모 시 해당 UI 위치 근처에서 숫자가 떠오르며 사라지는 효과 (`Floating Text`).
- **Sound Effect (SFX):**
  - _UI Click:_ 가벼운 '틱' 소리.
  - _Sanction:_ 묵직한 '쾅' 소리 (도장).
  - _Chat Send:_ 종이가 넘어가는 '삭' 소리.
  - _Notification:_ 맑은 '띵' 소리.

---

본 문서는 `Echoes of History: Reforged`의 개발 단계에서 UI/UX 구현의 기준점(Single Source of Truth)으로 활용된다.
