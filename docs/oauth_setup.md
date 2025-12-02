# Supabase Google OAuth 설정 가이드

**Echoes of History**에서 Google 로그인을 활성화하려면 Google Cloud Console과 Supabase 대시보드 모두에서 Google OAuth를 구성해야 합니다.

## 1단계: Google Cloud Console 설정

1.  [Google Cloud Console](https://console.cloud.google.com/)로 이동합니다.
2.  **새 프로젝트 만들기** (또는 기존 프로젝트 선택).
3.  **OAuth 동의 화면 구성**:
    - **API 및 서비스 > OAuth 동의 화면**으로 이동합니다.
    - **외부 (External)**를 선택합니다 (내부 테스트용 G-Suite 사용자가 아닌 경우).
    - 필수 입력란(앱 이름, 사용자 지원 이메일, 개발자 연락처 정보)을 채웁니다.
    - **저장 후 계속**을 클릭합니다.
4.  **자격 증명 만들기**:
    - **API 및 서비스 > 사용자 인증 정보**로 이동합니다.
    - **사용자 인증 정보 만들기** -> **OAuth 클라이언트 ID**를 클릭합니다.
    - 애플리케이션 유형: **웹 애플리케이션**.
    - 이름: `Echoes of History` (또는 원하는 이름).
    - **승인된 자바스크립트 원본**:
      - 로컬 개발 URL 추가: `http://localhost:5173` (또는 사용 중인 포트).
      - 배포된 프로덕션 URL이 있다면 추가합니다.
    - **승인된 리디렉션 URI**:
      - 여기에 **Supabase Callback URL**이 필요합니다.
      - **Supabase 대시보드 > Authentication > Providers > Google**로 이동하여 이 URL을 찾습니다 (`https://<project-ref>.supabase.co/auth/v1/callback` 형식).
      - Supabase에서 복사하여 여기에 붙여넣습니다.
    - **만들기**를 클릭합니다.
5.  **자격 증명 복사**:
    - **클라이언트 ID**와 **클라이언트 보안 비밀(Secret)**을 복사합니다.

## 2단계: Supabase 대시보드 설정

1.  [Supabase 대시보드](https://supabase.com/dashboard)로 이동합니다.
2.  프로젝트를 선택합니다.
3.  **Authentication > Providers**로 이동합니다.
4.  **Google**을 선택합니다.
5.  Google Sign-In을 **활성화(Enable)**합니다.
6.  Google Cloud Console에서 복사한 **클라이언트 ID**와 **클라이언트 보안 비밀**을 붙여넣습니다.
7.  **Redirect URLs (중요)**:
    - 기본적으로 Supabase는 `localhost:3000`을 Site URL로 잡는 경우가 많습니다.
    - **URL Configuration** 섹션에서 **Redirect URLs**에 `http://localhost:5173` (Vite 기본 포트)을 반드시 추가해야 합니다.
    - 이것을 추가하지 않으면 로그인 후 `localhost:3000`으로 이동하여 페이지가 뜨지 않을 수 있습니다.
8.  **Save**를 클릭합니다.

## 3단계: 환경 변수

프로젝트 루트의 `.env` 파일에 올바른 Supabase 키가 있는지 확인하세요:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

## 검증

1.  로컬 개발 서버를 재시작합니다 (`npm run dev`).
2.  랜딩 화면에서 "Google 계정으로 시작하기" 버튼을 클릭합니다.
3.  Google 로그인 페이지로 리디렉션되어야 합니다.
4.  로그인 후, 게임으로 다시 리디렉션되며 "국가 생성" 화면(신규 유저) 또는 게임 HUD(기존 유저)가 나타나야 합니다.
