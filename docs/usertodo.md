# User To-Do List (개발자 가이드)

현재 프로젝트를 실행하고 테스트하기 위해 개발자님께서 해주셔야 할 작업들입니다.

## 1. Supabase 설정 (필수)

데이터베이스 연동을 위해 필요합니다.

1.  [Supabase](https://supabase.com)에 로그인하여 새 프로젝트를 생성합니다.
2.  프로젝트 설정(Settings) -> API 메뉴에서 `Project URL`과 `anon` public key를 복사합니다.
3.  프로젝트 루트의 `.env.example` 파일을 복사하여 `.env` 파일을 만듭니다.
    ```bash
    cp .env.example .env
    ```
4.  `.env` 파일에 복사한 키를 붙여넣습니다.
    ```env
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-key
    ```
5.  Supabase 대시보드의 **SQL Editor**로 이동합니다.
6.  `supabase/schema.sql` 파일의 내용을 복사하여 붙여넣고 **Run**을 클릭해 테이블을 생성합니다.

## 2. 서버 실행

AI 연동 및 멀티플레이 기능을 위해 백엔드 서버가 필요합니다.

1.  터미널을 엽니다.
2.  다음 명령어로 서버를 실행합니다.
    ```bash
    npm run server
    ```
    (현재는 기본 에코 서버만 작동합니다.)

## 3. 클라이언트 실행

웹 브라우저에서 게임을 확인합니다.

1.  새 터미널을 엽니다.
2.  다음 명령어로 클라이언트를 실행합니다.
    ```bash
    npm run dev
    ```
3.  브라우저에서 `http://localhost:5173`으로 접속합니다.

---

## 4. (선택) Gemini API 키 발급

다음 단계인 AI 연동을 미리 준비하시려면:

1.  [Google AI Studio](https://aistudio.google.com/)에서 API 키를 발급받습니다.
2.  서버 쪽 `.env` (추후 생성 예정)에 사용할 준비를 해둡니다.
