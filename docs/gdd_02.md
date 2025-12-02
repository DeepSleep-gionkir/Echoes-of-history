## **[Part 2] 월드 & 경제 시스템 (World & Economy)**

이 파트는 게임의 **물리적 기반**입니다. AI의 개입을 최소화하고, **100% 자바스크립트 코드(Node.js)**로 돌아가는 견고한 규칙을 설계합니다.

---

### **2.1. 맵 구조 (The Stage: Hex Grid)**

시각적으로는 심플하지만, 내부 데이터는 효율적으로 관리되어야 합니다.

**1) 좌표계: Cube Coordinates (q, r, s)**

- 2차원 배열 `(x, y)` 대신 육각형 그리드에 최적화된 **3축 좌표계**를 사용합니다.
- **제약 조건:** `q + r + s = 0`
- **장점:** 이동 거리 계산, 범위 탐색(내 주변 2칸) 알고리즘이 매우 간단해집니다.

**2) 시각화 전략 (LOD: Level of Detail)**
웹 브라우저의 성능 부하를 줄이기 위한 렌더링 최적화입니다.

- **Zoom Out (전략 뷰):** 유닛과 건물을 숨기고, 타일의 **색상(Color)**만 렌더링합니다. (내 땅=파랑, 적 땅=빨강, 숲=초록)
- **Zoom In (전술 뷰):** 카메라가 가까워지면 비로소 3D 모델(Low-poly 성, 병사)을 띄웁니다.

**3) 전장의 안개 (Server-Side Fog of War)**

- **보안 필수:** 클라이언트에게 맵 전체 데이터를 보내면 안 됩니다(해킹 위험).
- **로직:**
  - 서버는 유저의 `시야 범위(Vision Range)` 내에 있는 타일 데이터만 JSON으로 전송합니다.
  - 가보지 않은 곳은 클라이언트에서 회색 안개(`Fog Mesh`)로 덮습니다.

---

### **2.2. 자원 시스템 (The Economy)**

AI 없이 돌아가는 **수학적 경제 모델**입니다.

**1) 기초 자원 (Hard Currency)**
DB의 `Users` 테이블에 숫자로 저장됩니다.

- **💰 골드 (Gold):** 만능 화폐. 세금으로 징수.
- **🌾 식량 (Food):** 인구 유지 및 병력 보급. 부족하면 '기근' 상태 트리거.
- **⛏️ 생산력 (Labor):** 건물/유닛 제작 속도. 인구수에 비례.
- **🔮 권위 (Authority):** 특수 자원. 외교적 선언, 파벌 제압, 비상사태 선포에 사용.

**2) 동적 시장 가격 (Dynamic Pricing Code)**
"수요와 공급"을 복잡하게 시뮬레이션하지 않고, **상태 변수(State Variable)에 따른 승수(Multiplier)**로 처리합니다.

```javascript
// server/market.js

function getResourcePrice(serverState) {
  let basePrice = 10; // 철광석 기본가

  // 변수 1: 전쟁 중이면 철값 폭등
  if (serverState.globalChaos > 50) {
    basePrice *= 2.5;
  }

  // 변수 2: 계절이 겨울이면 식량값 폭등
  if (serverState.season === "winter") {
    // (식량 로직 별도)
  }

  return basePrice;
}
```

- **효과:** 유저는 "전쟁이 터졌으니 철을 미리 사두자"는 전략적 플레이를 하게 됩니다. (AI 호출 0회)

---

### **2.3. 건설과 맥락적 효과 (Contextual Construction)**

**"서커스장을 지으면 욕먹는 상황"**을 구현하는 핵심 로직입니다.

**1) 니즈 계층 로직 (Hierarchy of Needs Logic)**
모든 건물은 고정된 효과를 주지 않고, 현재 국가 상태(`State`)를 참조하여 효과가 변합니다.

- **상태 정의:**
  - `STARVING`: 식량 < 인구수
  - `WAR`: 적군이 영토 내 존재
  - `PEACE`: 평화 상태

**2) 효과 계산 테이블 (Effect Table)**
_서커스장(Circus) 예시_

| 현재 상태    | 행복도 변화 | 치안(Order) 변화    | UI 표시 문구 (Prediction)                           |
| :----------- | :---------- | :------------------ | :-------------------------------------------------- |
| **PEACE**    | +15         | +5                  | "백성들이 환호할 것입니다."                         |
| **WAR**      | 0           | -5                  | "적군이 오는데 낭비라고 생각합니다."                |
| **STARVING** | **-20**     | **-10 (폭동 위험)** | **"경고: 굶주린 백성들이 왕의 사치에 분노합니다!"** |

**3) 결재판 UI (Sanction Panel)**
유저가 [건설] 버튼을 누르면 서버가 위 로직을 돌려 **견적서**를 보냅니다.

- **안전한 경우:** [승인] 버튼 활성화.
- **위험한 경우(STARVING):**
  - 빨간색 경고 문구 출력.
  - 버튼 이름이 **[위험을 감수하고 강행]**으로 변경됨.

---

### **2.4. 이벤트 트리거 (The Trigger System)**

수치 변화가 임계점(Threshold)을 넘었을 때만 AI나 템플릿을 호출합니다.

**1) 템플릿 우선 (Template First)**
일상적인 이벤트는 미리 작성된 문장으로 처리합니다.

- `Event: [Building_Complete]`
- _Output:_ "{CityName}에 {BuildingName} 건설이 완료되었습니다."

**2) AI 호출 조건 (AI Only on Critical)**
중요한 사건이 터졌을 때만 Gemini API를 씁니다.

- **조건:** `Happiness_Change < -15` (민심 대폭락)
- **Action:**
  1.  서버가 Gemini에게 요청: `{"context": "starving_circus", "user_name": "UserA"}`
  2.  AI 응답(JSON): `{"log": "성난 군중이 서커스장에 불을 질렀습니다! '빵이 아니면 죽음을!'이라는 구호가 들립니다."}`
  3.  **전체 알림:** 이 메시지를 서버 중요 뉴스로 띄움.

---

### **2.5. 개발 체크리스트 (To-Do)**

- [ ] **HexGrid 로직:** `q,r,s` 좌표를 `x,y` 픽셀 좌표로 변환하는 함수 구현.
- [ ] **Resource DB:** `Users` 테이블에 `gold`, `food`, `authority` 컬럼 추가.
- [ ] **Calculation Module:** `calculateEffect(building, state)` 함수를 `gameRules.js`에 작성.
- [ ] **Sanction UI:** 프론트엔드에서 서버가 보낸 견적(`proposal`) 데이터를 받아 모달창을 띄우는 컴포넌트 제작.

---
