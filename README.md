# 무빙 (Moving) Frontend

이사 견적 매칭 서비스 프론트엔드입니다.

고객·기사님을 위한 화면을 제공합니다.

## Team

|          [강정민](https://github.com/jeongmin00)          |          [박소정](https://github.com/sojeong0302)          |          [김나린](https://github.com/narin116)           |           [최혜성](https://github.com/gptjd0204)            |            [한고은](https://github.com/NAYA3)             |          [김상우](https://github.com/codribble)          |
| :---------------------------------------------------------: | :-------------------------------------------------------: | :--------------------------------------------------------: | :------------------------------------------------------: | :------------------------------------------------------: | :------------------------------------------------------: |
| <img src="https://github.com/jeongmin00.png" width="80"/> | <img src="https://github.com/sojeong0302.png" width="80"/> | <img src="https://github.com/narin116.png" width="80"/>  |  <img src="https://github.com/gptjd0204.png" width="80"/>   |   <img src="https://github.com/NAYA3.png" width="80"/>    | <img src="https://github.com/codribble.png" width="80"/> |
|                **채팅**<br/>**Socket.IO**                 |                  **인증/인가**<br/>**S3**                  |               **기사님 조회**<br/>**리뷰**               |              **고객/기사님**<br/>**견적 관리**               |            **커뮤니티**<br/>**tiptap 에디터**             |                **견적요청**<br/>**알림**                 |

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white)
<br/>
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)
![Kakao](https://img.shields.io/badge/Kakao-FFCD00?style=flat-square&logo=kakao&logoColor=black)
![Sentry](https://img.shields.io/badge/Sentry-362D59?style=flat-square&logo=sentry&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=flat-square&logo=storybook&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)

## Getting Started

```bash
git clone https://github.com/12-sprint-part4-project/12-moving-team3-FE.git
cd 12-moving-team3-FE
npm install
```

`.env`에 API URL, 카카오, AWS S3, Sentry 등 값을 채운 뒤:

```bash
npm run dev
```

기본 포트는 `3000`입니다.

Storybook: `npm run storybook` (포트 `6006`)

## Architecture

```text
Page(App Router) → Components → Hooks → Services → lib
```

- **Page**: 라우팅, 레이아웃 (`app/`)
- **Components**: UI 렌더링
- **Hooks**: TanStack Query 기반 데이터 패칭·상태 로직
- **Services**: API 요청 함수
- **lib**: 유틸, Zod 스키마, 소켓/SSE 클라이언트

## Folder Structure

```text
src
├── app
│   ├── (auth)      # 로그인, 회원가입
│   ├── (main)      # 고객/기사님 메인 화면
│   └── api          # Route Handler
├── components      # UI 컴포넌트
├── hooks           # 커스텀 훅
├── services        # API 요청 함수
├── lib             # 유틸, Zod 스키마, 소켓/SSE 클라이언트
├── providers       # Context Provider
├── types           # 타입 정의
├── constants
├── assets
└── storybook
public
```

## Routes

| Path                | 설명                    |
| -------------------- | ----------------------- |
| `/login`, `/signup`  | 인증                     |
| `/(customer)/*`      | 고객 견적/프로필/리뷰      |
| `/(mover)/*`         | 기사님 프로필             |
| `/movers`            | 기사님 목록               |
| `/chat`              | 채팅                     |
| `/community`         | 커뮤니티                  |
| `/favorites`         | 찜                       |

## Commit Convention

`type: 커밋 메시지`

| Type       | 설명              |
| ---------- | ----------------- |
| `feat`     | 기능 추가 ✨      |
| `fix`      | 버그 수정 🐛      |
| `refactor` | 리팩토링 ♻️       |
| `style`    | UI/스타일 수정 🎨 |
| `docs`     | 문서 수정 📝      |
| `chore`    | 설정 변경 🔨      |
| `perf`     | 성능 개선 ⚡      |
| `remove`   | 기능 삭제 🔥      |
