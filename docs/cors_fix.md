# Socket.IO CORS 오류 해결 가이드

**문제 상황**:
프론트엔드(`https://echoes-of-history.vercel.app`)에서 백엔드(`https://echoes-of-history.onrender.com`)로 Socket.IO 연결을 시도할 때, 백엔드 서버가 해당 도메인에서의 접근을 허용하지 않아 CORS 오류가 발생했습니다.

**해결 방법**:
Render에 배포된 **백엔드 서버 코드**(`server.js` 또는 `index.js`)를 수정하여 프론트엔드 도메인을 허용해야 합니다.

## 백엔드 코드 수정 (Node.js + Socket.IO)

Socket.IO 서버를 초기화하는 부분에 `cors` 옵션을 추가하세요.

```javascript
const { Server } = require("socket.io");

const io = new Server(httpServer, {
  cors: {
    // 허용할 프론트엔드 도메인 목록
    origin: [
      "https://echoes-of-history.vercel.app", // Vercel 배포 주소
      "http://localhost:5173", // 로컬 개발 주소
      "http://localhost:3000", // (필요시) 기타 로컬 주소
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
```

## 적용 절차

1.  로컬에서 백엔드 코드를 위와 같이 수정합니다.
2.  수정된 코드를 GitHub(또는 사용 중인 저장소)에 푸시합니다.
3.  Render가 변경 사항을 감지하고 백엔드를 다시 배포할 때까지 기다립니다.
4.  배포가 완료되면 프론트엔드에서 새로고침하여 연결을 확인합니다.
