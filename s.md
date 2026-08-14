````
# 페이지 공통 컨벤션

다른 사람이 파일을 위에서 아래로 읽었을 때 **데이터가 어디서 오고, 무엇이 계산되고, 누가 화면을 그리는지** 한 번에 보이게 작성한다.

스타일·네이밍은 기존 `global-rules` / `ui-components` / `data-and-api`를 따른다.

화면·폴더는 아래 트리를 기준으로 맞춘다.

---

## 최우선 규칙 — 기능은 그대로, 큰 변경은 먼저 묻는다

이 컨벤션은 **가독성과 폴더/코드 흐름을 맞추기 위한 것**이다. 동작이 바뀌면 안 된다.

- **현재 코드의 기능·동작·API 계약·URL·권한·에러/빈 화면 문구를 바꾸지 않는다.**
  필터, 무한스크롤, 로그인 모달, 리다이렉트, 쿼리 키, 캐시 무효화, 반응형 노출 조건도 포함이다.
- 하는 일: 파일 위치, 레이어 분리, 이름, 주석, presentational 분리처럼 **결과가 같은 정리**.
- **코드가 많이 바뀌는 작업은 실행하지 말고 먼저 묻는다.**
  예: 라우트 그룹 이동, `layout.tsx` 신설/분리, `page.tsx` ↔ `page.client.tsx` 책임 재배치, 훅/`lib`로 큰 로직 추출, 공용 컴포넌트 교체, 상태 기계 재작성.
- “많이 바뀐다”의 기준: **한 화면에서 여러 파일이 함께 움직이거나, diff가 동작 경로를 건드리거나, 되돌리기 부담이 큰 구조 변경**.
  JSDoc, import 순서, 같은 파일 안의 작은 컴포넌트 정리 정도는 물어보지 않고 해도 된다.
- 확신이 없으면 리팩터하지 말고, **어디를 왜 얼마나 바꿀지**를 짧게 정리해서 확인을 받는다.
- 리팩터 후에도 사용자 입장에서 같은 입력이면 같은 화면·같은 요청이 나와야 한다. 못 지키면 그 변경은 하지 않는다.

---

## 작업 원칙

- 아래 **폴더 구조**를 따른다. 새 페이지도 임의로 다른 위치에 두지 않는다.
- **같은 레이어 분리, 같은 파일 역할, 같은 읽기 순서**를 맞춘다.
- 한 파일이 “데이터 + 도메인 규칙 + JSX”를 동시에 책임지지 않게 한다.
- **JSX return 안에 `renderXxx()`처럼 화면 조각을 함수로 빼서 호출하지 않는다.** 화면은 return에 바로 그리거나, PascalCase 컴포넌트로 분리한다.
- **return까지 읽는 흐름을 가볍게 유지한다.** early return, 중간 분기, 임시 변수는 정말 필요한지 먼저 확인하고, return 위에 불필요한 로직을 쌓지 않는다.
- 어느 페이지·컴포넌트를 가더라도 **imports → 훅 → 가공/파생값 → 필요한 핸들러/가드 → return**의 큰 흐름을 최대한 동일하게 맞춘다.
- **return 내부만 봐도 화면 구조가 한눈에 보여야 한다.** 화면 조각은 return에 직접 쓰거나 의미 있는 컴포넌트로 분리한다.
- `className` 문자열은 스타일 전용 상수/파일로 빼지 않고 **사용하는 JSX에 직접 작성한다.** 색·타이포 같은 전역 디자인 토큰은 기존 `globals.css`를 따른다.
- props가 많아지면 모두 필요한지 확인한다. 여러 단계로 같은 값을 전달하는 prop drilling이면 **Context API 등 더 적절한 상태 공유 방법**을 고려한다.
- 하나의 컴포넌트는 가능하면 **하나의 기능 또는 하나의 화면 책임**만 가진다.
- 중복된 표현·상태명·레이아웃 방식은 페이지마다 다르게 만들지 말고 **프로젝트 전체에서 같은 기준으로 통일**한다.
- 페이지 접근 권한처럼 라우트 전체에 적용되는 가드는 가능하면 해당 경로의 `layout.tsx`에서 처리하고, 각 페이지에서 같은 가드를 반복하지 않는다.
- `motion.div` 등 반복되는 Framer Motion 패턴은 공통 래퍼로 묶을 수 있는지 확인한다. 단, 추상화가 오히려 구조를 숨기거나 `AnimatePresence` 동작을 깨면 합치지 않는다. 불필요한 모션 자체도 줄일 수 있는지 검토한다.
- 주석은 해당 **컴포넌트 또는 로직이 무엇을 하는지** 한두 줄로 적는다.
- 기존 화면을 맞출 때는 **동작 보존이 폴더 이상보다 우선**이다. 구조를 맞추려면 큰 이동이 필요할 경우 먼저 묻는다.

읽기 흐름:

`page.tsx` → `page.client.tsx` → `_components` → `_lib` → `src/hooks` → `src/lib`

---

## JSX — return에 함수 이름을 넣지 않는다

화면 조각을 `const renderToolbar = () => ...`로 만든 뒤 `{renderToolbar()}`로 끼워 넣지 않는다.

읽는 사람이 return만 봐도 화면 구조가 보여야 한다. 함수 호출을 따라가면 흐름이 끊긴다.

### 하지 않는다

```tsx
const renderToolbar = () => (
  <div className="flex items-center justify-between">...</div>
);

const renderList = () => {
  if (isEmpty) return <p>비어 있습니다.</p>;
  return <CommunityPostList posts={posts} />;
};

return (
  <>
    {renderToolbar()}
    {renderList()}
  </>
);
```

`renderXxx`, `getXxxJsx`, `{header()}`, IIFE `(() => { ... })()`로 JSX를 감추는 것도 같다.

### 이렇게 한다

**1. return에 바로 그린다**

```tsx
return (
  <>
    <div className="flex items-center justify-between">...</div>
    {isEmpty ? (
      <p>비어 있습니다.</p>
    ) : (
      <CommunityPostList posts={posts} />
    )}
  </>
);
```

**2. 덩어리가 크면 PascalCase 컴포넌트로 뺀다**

```tsx
<CommunitySidebarFilter ... />
<CommunityPostList ... />
```

컴포넌트는 호출이 아니라 `<Name />`로 읽힌다. `renderName()`과 다르다.

### 허용하는 것

- 로딩/에러/404/빈 목록처럼 **서로 배타적인 화면**은 early return이 return 구조를 더 단순하게 만들 때만 가드로 사용한다
- 본문 안의 **선택 조각**(코멘트, 배너, 구분선)만 `isXxx` / `showXxx`에 이름을 붙이고, return JSX에 `? : null`로 둔다
- `items.map((item) => <Card key={item.id} ... />)` 처럼 리스트 콜백. 이건 함수로 화면 섹션을 숨기는 것이 아니다
- null/undefined 폴백은 `??` (`editPost?.title ?? ''`, `{description ?? null}`)

가드 예시 (허용). 아래처럼 early return이 화면 흐름을 명확하게 만드는 경우에는 사용한다. 단, 모든 상태를 관성적으로 early return으로 만들지는 않는다.

```tsx
if (isPending) {
  return (
    <div className="w-full">
      <ListSkeleton />
    </div>
  );
}

if (isError) {
  return (
    <div className="w-full">
      <ErrorState message={errorMessage} onRetry={handleRetry} />
    </div>
  );
}

if (isEmpty) {
  return (
    <div className="w-full">
      <EmptyState />
    </div>
  );
}

return (
  <div className="w-full">
    <ul>{items.map((item) => <Card key={item.id} item={item} />)}</ul>
  </div>
);
```

같은 className이 반복되어도 `const PanelBody = ({ children }) => <div className="w-full">{children}</div>`로 묶지 않는다. return에 `div`를 그대로 쓴다.

기존 코드에 `renderXxx()`가 있어도, 풀어서 여러 파일로 나누는 작업이 커지면 먼저 묻는다. 같은 파일 return 안으로 인라인하는 정도는 해도 된다.

---

## 1. 폴더 구조 (이 트리를 따른다)

괄호 폴더 `(auth)`, `(main)`, `(browse)`, `(customer)`는 **URL에 붙지 않는 route group**이다.

`mover/`는 괄호가 없다. 기사님 전용 화면은 URL에 `/mover`가 붙는다. `(customer)`와 다르다.

`(browse)`는 **필수가 아니다.** 목록·상세가 탭바처럼 같은 셸을 이미 공유할 때만 쓴다. 맞추려고 기존 라우트를 `(browse)`로 옮기지 않는다.

> 이미 있는 페이지를 이 트리로 옮길 때 URL, layout 적용 범위, 탭바 유무가 바뀌면 기능 변경이다. 이동 전에 묻는다.

```
src/
├── app/
│   ├── layout.tsx                         # 앱 전체 껍데기 (html, Provider, GNB)
│   ├── globals.css                        # 전역 색·타이포·토큰
│   │
│   ├── (auth)/                            # 비로그인만 보는 영역
│   │   ├── login/
│   │   │   ├── page.tsx                   # /login 서버 엔트리 (title 등)
│   │   │   └── _components/
│   │   │       └── LoginForm.tsx          # 이메일·비밀번호·카카오 로그인 폼
│   │   └── signup/
│   │       ├── page.tsx                   # /signup 서버 엔트리
│   │       └── _components/
│   │           └── SignupForm.tsx         # 회원가입 폼
│   │
│   └── (main)/                            # 서비스 화면
│       ├── page.tsx                       # / 랜딩 서버 페이지
│       ├── _components/
│       │   ├── LandingAuthCta.tsx         # 비회원용 로그인·회원가입 버튼
│       │   └── LandingServiceCard.tsx     # 소형/가정/사무실 이사 카드
│       │
│       ├── community/                     # /community
│       │   ├── layout.tsx                 # 「커뮤니티」 타이틀 등 피처 공통 셸
│       │   ├── _components/               # 목록·상세·작성에서 같이 쓰는 UI
│       │   │   ├── CommunityTabBar.tsx    # 게시판 / 가구나눔 탭
│       │   │   ├── CommunityPostList.tsx  # 게시글 리스트
│       │   │   └── CommunityPostCard.tsx  # 리스트 한 장
│       │   ├── (browse)/                  # URL에 안 붙음. 목록+상세만 탭바 공유
│       │   │   ├── layout.tsx             # 탭바 레이아웃
│       │   │   ├── page.tsx               # 목록 서버 (searchParams → 필터 초기값)
│       │   │   ├── page.client.tsx        # 목록 화면 (필터, 무한스크롤)
│       │   │   └── [id]/                  # /community/:id 상세
│       │   │       ├── page.tsx           # 상세 서버 (metadata, postId)
│       │   │       ├── page.client.tsx    # 상세 화면 (본문, 댓글)
│       │   │       ├── _components/       # 상세 전용 UI
│       │   │       └── _lib/              # 상세 전용 훅
│       │   └── write/                     # /community/write. 탭바 없어서 (browse) 밖
│       │       ├── page.tsx               # 작성 서버 엔트리
│       │       ├── page.client.tsx        # 작성 화면
│       │       └── _components/           # 제목·본문·이미지 필드
│       │
│       ├── movers/                        # 기사님 찾기
│       │   ├── _components/               # 목록·상세 공유 UI (툴바, 카드)
│       │   ├── page.tsx                   # /movers 목록 서버
│       │   ├── page.client.tsx            # 목록 화면 (필터, 무한스크롤)
│       │   └── [id]/                      # /movers/:id 상세
│       │       ├── page.tsx
│       │       ├── page.client.tsx
│       │       ├── _components/           # CTA, 사이드바 등 상세 UI
│       │       └── _lib/                  # 지정 견적 등 상세 훅
│       │
│       ├── (customer)/                    # 일반유저 전용. URL에는 안 보임
│       │   ├── quotes/
│       │   │   ├── page.tsx               # /quotes 목록 서버 (탭 셸)
│       │   │   ├── page.client.tsx        # 탭·모달·채팅/찜 오케스트레이션. Query는 패널
│       │   │   ├── _components/           # 목록·히스토리 공유 UI + 레이아웃 상수
│       │   │   │   ├── PendingQuotesPanel.tsx    # 대기 탭 Query+목록
│       │   │   │   ├── ReceivedQuotesPanel.tsx   # 받았던 탭 Query+무한스크롤
│       │   │   │   └── CustomerQuotesEmptyState.tsx  # 피처 공용 빈 화면(탭별 문구)
│       │   │   ├── _lib/                  # 목록 전용 훅·순수 필터 (피처 한정)
│       │   │   │   ├── filterReceivedQuotesByStatus.ts
│       │   │   │   └── useReceivedQuoteGroupFilter.ts
│       │   │   ├── [quoteId]/             # /quotes/:id 상세
│       │   │   │   ├── page.tsx
│       │   │   │   ├── page.client.tsx    # 상세 채팅·확정·찜 오케스트레이션
│       │   │   │   └── _components/       # 상세 전용 UI
│       │   │   └── history/               # /quotes/history
│       │   │       ├── page.tsx
│       │   │       ├── page.client.tsx    # 이용 내역 채팅 오케스트레이션
│       │   │       └── _components/       # 이용 내역 전용 카드
│       │   ├── estimates/request/
│       │   │   ├── page.tsx               # /estimates/request 서버
│       │   │   ├── page.client.tsx        # 이사 견적 요청 스텝 화면
│       │   │   └── _components/           # 날짜·주소·이사유형 스텝
│       │   ├── reviews/
│       │   │   ├── page.tsx               # /reviews 서버
│       │   │   └── page.client.tsx        # 작성 가능·작성한 리뷰
│       │   └── profile/customer/
│       │       ├── page.tsx               # /profile/customer 프로필 등록
│       │       ├── _components/           # 등록·수정 폼, 이미지 필드
│       │       ├── _lib/                  # 프로필 업데이트·이미지 크롭 훅
│       │       └── edit/
│       │           └── page.tsx           # /profile/customer/edit 수정
│       │
│       └── mover/                         # 기사님 전용. URL에 /mover 가 붙음
│           ├── requests/
│           │   ├── page.tsx               # /mover/requests 받은 요청 목록 서버
│           │   ├── page.client.tsx        # 목록 화면
│           │   └── _components/           # 필터, 요청 카드
│           ├── quotes/
│           │   ├── page.tsx               # /mover/quotes 보낸 견적 목록 서버
│           │   ├── page.client.tsx
│           │   ├── _components/           # 보낸/거절 견적 카드
│           │   └── [quoteId]/             # /mover/quotes/:id 견적 상세
│           │       ├── page.tsx
│           │       ├── page.client.tsx
│           │       └── _components/
│           ├── mypage/
│           │   ├── page.tsx               # /mover/mypage 기사님 마이페이지 서버
│           │   └── page.client.tsx
│           └── profile/mover/
│               ├── page.tsx               # /mover/profile/mover 프로필 등록
│               ├── _components/           # 등록·수정·기본정보 폼
│               ├── edit/page.tsx          # /mover/profile/mover/edit 프로필 수정
│               └── basic/page.tsx         # /mover/profile/mover/basic 기본정보 수정
│
├── components/                            # 여러 라우트에서 재사용
│   ├── ui/                                # 디자인 시스템
│   │   ├── Skeleton/                      # 페이지·목록 로딩 스켈레톤
│   │   │   ├── QuotesPageSkeleton.tsx
│   │   │   ├── QuoteDetailPageSkeleton.tsx
│   │   │   ├── RequestsPageSkeleton.tsx
│   │   │   └── CommunityPostListSkeleton.tsx
│   │   ├── Button/Button.tsx
│   │   ├── Input/TextFieldOutlined.tsx
│   │   ├── Modal/Modal.tsx
│   │   └── Chip/ServiceChip.tsx
│   ├── quotes/                            # 고객·기사 견적에서 같이 쓰는 UI
│   │   ├── QuotesTabsShell.tsx
│   │   ├── QuoteListCard.tsx
│   │   ├── QuoteStatusChips.tsx           # 상태 칩 / 반응형 칩 행
│   │   ├── QuoteInfoRows.tsx              # 견적 정보 행·섹션
│   │   ├── QuotePriceRow.tsx              # 견적가 한 줄
│   │   ├── QuoteDetailMobileActionBar.tsx # 상세 하단 고정바 셸(CTA는 피처별)
│   │   ├── QuotesLoadMoreSentinel.tsx
│   │   └── QuotesListErrorState.tsx
│   ├── Gnb/
│   │   ├── GnbDefault.tsx                 # 로그인 후 헤더
│   │   └── GnbLanding.tsx                 # 랜딩·비회원 헤더
│   └── auth/
│       ├── AuthRouteGuard.tsx             # 로그인·역할 가드
│       └── LoginRequiredModal.tsx         # 「로그인이 필요해요」 모달
│
├── hooks/                                 # 화면용 훅 + TanStack Query
│   ├── useAuth.ts                         # 세션·유저
│   ├── useCommunity.ts                    # 게시글 목록/상세/댓글 쿼리
│   ├── useStartEstimateChat.ts            # 견적 채팅 시작 + pendingChatTargetId
│   ├── useListEntranceStagger.ts          # 첫 로딩 끝난 뒤 목록 stagger
│   ├── useLoadMoreOnView.ts               # 센티널 무한스크롤
│   └── useListboxKeyboard.ts              # 커스텀 listbox 키보드
│
├── services/                              # HTTP 호출만
│   ├── authApi.ts                         # login, signup, me, logout
│   └── communityApi.ts                    # 게시글·댓글 CRUD
│
├── types/                                 # API·도메인 타입
│   ├── auth.ts                            # 로그인 요청/응답, User
│   └── community.ts                       # Post, Comment
│
├── constants/                             # 바뀌지 않는 값
│   ├── apiPaths.ts                        # '/api/auth/login' 등 엔드포인트
│   ├── queryKeys.ts                       # 쿼리 키 모아두기
│   ├── errorCode.ts                       # 에러코드 모아두기
│   └── communityOptions.ts                # 탭, 카테고리, 정렬 옵션
│
├── lib/                                   # 순수 함수·인프라
│   ├── apiClient.ts                       # fetch 래퍼, ApiError
│   ├── authFetch.ts                       # 보호 API. 401이면 토큰 재발급
│   ├── parsePositiveInt.ts                # 라우트 id → 양의 정수 | null
│   ├── resolveTabSearchParam.ts           # searchParams 탭 값 정규화
│   ├── startEstimateChat.ts               # 견적 채팅 CTA 가드·방 body·시작 params
│   └── phoneNumber.ts                     # 전화번호 포맷·검증
│
├── providers/                             # 앱 최상단 감싸기
│   ├── QueryProvider.tsx                  # TanStack QueryClient
│   └── AuthProvider.tsx                   # 로그인 세션 제공
│
└── assets/
    └── icons/                             # SVG 아이콘
```

---

## 2. 어디에 무엇을 두나

| 위치 | 넣는 것 | 넣지 않는 것 |
| --- | --- | --- |
| `app/layout.tsx` | html, Provider, GNB | 피처 화면 |
| `app/(auth)/` | 로그인·회원가입 페이지만 | 로그인 후 서비스 화면 |
| `app/(main)/` | 서비스 화면 | 인증 전용 폼 |
| `{feature}/layout.tsx` | 하위 라우트 공통 셸 + **페이지/역할 가드처럼 해당 경로 전체에 공통인 처리** | 페이지별 Query, 필터 상태, 개별 이벤트 |
| `{feature}/_components/` | 목록·히스토리처럼 **같이** 쓰는 UI | 한 하위 라우트에만 쓰는 카드, CSS className만 담은 파일 |
| `{feature}/page.tsx` | metadata, searchParams/params 파싱, Client 마운트 | 상태, 이벤트, Query |
| `{feature}/page.client.tsx` | 탭·모달, 자식 조합, **채팅·확정·찜 등 사이드이펙트 오케스트레이션**. 필요한 로컬 상태/가드만 두고, 공통 페이지 가드는 `layout.tsx`를 우선한다. Query는 언마운트 탭이면 패널 | 도메인 계산, 카드 마크업, `renderXxx()`, 로컬 Body 래퍼 |
| `{feature}/_lib/` | 그 피처 목록·패널만 쓰는 훅·순수 필터/매핑 | 앱 전역 공용(`src/hooks`/`src/lib`로 올릴 것), JSX |
| `{feature}/[id]/_components/` | 상세 전용 UI | 목록 카드, 공용 탭바, CSS className만 담은 파일 |
| `{feature}/[id]/_lib/` | 상세 전용 훅 | 공용 Query |
| `{feature}/(browse)/` | **선택.** 목록·상세가 탭바 등 같은 셸을 이미 공유할 때만 | 셸이 다른데 맞추려고 넣는 것 |
| `write/`, `history/` 등 | 레이아웃이 다른 하위 페이지 + 그 전용 `_components/` | 목록·상세와 셸을 억지로 공유 |
| `src/components/` | 여러 라우트에서 재사용 (Button, Modal, GNB, 로그인 모달) | 고객만 쓰는 카드 |
| `src/components/layout/` | 앱 GNB 셸 | 피처 본문 패딩·상태 프레임 |
| `src/components/quotes/` | 고객·기사 견적에서 **마크업·토큰이 같은** UI (칩, 정보 행, 가격, 탭 셸, 하단바 셸) | 고객 전용·기사 전용 카드·CTA |
| `src/components/ui/Skeleton/` | 페이지·목록 로딩 스켈레톤 | 헤더처럼 그 컴포넌트에만 붙은 인라인 스켈레톤 |
| `src/hooks/` | Query + 목록 stagger·무한스크롤·listbox·견적 채팅 시작 | JSX, fetch URL, 같은 동작을 피처마다 새로 짜기 |
| `src/services/` | HTTP 호출만 | 캐시, 토스트, 라우팅 |
| `src/types/` | API·도메인 타입 | UI Props (Props는 컴포넌트 파일) |
| `src/constants/` | 옵션, 라벨, 엔드포인트, 쿼리 키, 에러코드 | 계산 로직 |
| `src/lib/` | 순수 함수, fetch 래퍼, `parsePositiveInt` | React 훅, JSX |
| `src/providers/` | 앱 최상단 Provider | 페이지 로컬 상태 |

### `(browse)`를 쓰는 기준

`(browse)`는 **선택**이다. 없어도 된다.

같은 셸(탭바·타이틀)을 목록과 상세가 **이미** 공유하고, 그 셸을 layout으로 빼야 할 때만 쓴다. 예: `community`의 탭바.

목록·상세 헤더가 다르면 `(browse)`를 만들지 않는다. 예: `/quotes`는 탭, `/quotes/:id`는 「견적 상세」 타이틀.

기존 페이지를 컨벤션 맞춘다고 `(browse)`로 옮기지 않는다. 새 피처도 공유 셸이 없으면 평탄한 폴더(`page.tsx` + `[id]/`)로 둔다.

| `(browse)`가 있는 것 (이미 공유 셸) | `(browse)` 없이 두는 것 |
| --- | --- |
| `/community` 목록 + `/community/:id` 상세 | `/community/write` (탭바 없음) |
| | `/movers` 목록 + `/movers/:id` 상세 |
| | `/quotes` 목록 + `/quotes/:id` 상세 + `/quotes/history` |
| | `/mover/quotes` 목록 + `/mover/quotes/:id` 상세 |

기존 라우트를 `(browse)`로 옮기거나 `layout.tsx`를 새로 만들면 탭바·패딩·metadata 범위가 달라질 수 있다. **새 페이지가 아니면 이동하지 않는다.**

### 파일명

- 컴포넌트: `PascalCase.tsx`
  예: `CommunityPostCard.tsx`
- 페이지·피처 전용 훅/순수 함수: `{feature}/_lib/` 또는 `{feature}/[id]/_lib/` (`use{Feature}{Concern}.ts`, `filterXxx.ts`)
- `page.tsx`, `layout.tsx`, `page.client.tsx`는 **default export**
- 그 외 컴포넌트·훅·유틸은 **named export**
- 페이지 클라이언트 파일명은 항상 `page.client.tsx`. 컴포넌트 이름은 `{Feature}PageClient`

---

## 3. 파일 읽기 순서 — 코드가 어떻게 진행되는지

독자가 아래 순서로 읽으면 페이지가 이해되어야 한다.

1. `page.tsx` — 서버에서 무엇을 받아 Client에 넘기는가
2. `page.client.tsx` — 데이터 → 파생 → (가드 전 핸들러) → 가드 → (내로잉된 핸들러) → 본문 JSX
3. `_components` — 화면 조각이 어떤 props를 받나
4. `_lib` / `src/hooks` — 사이드이펙트와 서버 상태
5. `src/services` — 실제로 어떤 API를 치나
6. `src/lib` — URL·도메인 규칙이 어떻게 계산되나

### `page.client.tsx` 내부 순서 — 가능한 같은 흐름으로 맞춘다

다른 컴포넌트로 이동해도 읽는 방식이 바뀌지 않도록 큰 순서를 통일한다.

1. imports — **가져온 것 → 훅 → 가공에 필요한 것**이 보이도록 그룹 사이를 한 줄 띄운다
2. 파일 스코프 타입 / 꼭 필요한 상수
3. Props interface
4. 컴포넌트 주석
5. 훅 (`router`, `auth`, query, mutation, `useState` 등)
6. 가공/파생값 (`useMemo`, boolean, 표시용 값)
7. 필요한 effect와 이벤트 핸들러
8. 꼭 필요한 가드만 배치
9. 성공 JSX — **return 내부만 보고도 화면 구조가 보여야 한다**
10. 페이지 전역 모달 등 부가 UI

return 위에는 읽는 사람이 화면을 보기 전에 지나가야 하는 코드가 너무 많아지지 않게 한다. early return도 필요한지 먼저 생각하고 사용한다.

`handleXxx`는 이벤트용이다. 화면 조각을 그리는 `renderXxx`를 만들지 않는다.

작성·프로필처럼 폼이 크면 `PageClient`(라우팅·권한·로딩)와 `Form`(필드 상태·제출)을 같은 파일 안에서라도 **분리**한다.
이미 한 파일에 동작이 안정적으로 있으면, 분리로 diff가 커질 때 먼저 묻는다.

수정 모드 초기값은 effect로 hydrate하지 말고, `key`로 폼을 리마운트한다.
**이미 effect hydrate로 동작 중인 폼을 `key` 방식으로 바꾸는 것은 동작 위험이 있으니 먼저 묻는다.**

---

## 4. Server / Client 분리

### `page.tsx` (Server)

- `searchParams` / `params`를 파싱해 **초기 컨텍스트**만 만든다.
- Client는 default import 한다.
  예: `import CommunityPageClient from './page.client'`
- 페이지가 무엇을 하는 화면인지 한 줄로 적는다.
- 데이터 fetch가 SEO/metadata에 필요할 때만 Server에서 호출한다. (`generateMetadata`)

### `page.client.tsx` (Client)

- `'use client'`는 상호작용·Query가 있는 파일에만 둔다.
- **default export** 한다. 예: `export default CustomerQuotesPageClient`
- 오케스트레이터다. JSX는 자식 컴포넌트 조합이 대부분이어야 한다.
- URL 동기화, 무한스크롤, 모달 오픈 같은 **페이지 정책**만 여기서 결정한다.
- 탭이 `AnimatePresence mode="wait"`처럼 **언마운트**되면 Query는 탭 패널에 둔다. 확정·로그인 모달은 탭과 같이 내려가면 안 되므로 `page.client`에 둔다.
- 견적·요청 목록/상세의 **채팅 시작·확정·찜**도 `page.client`(또는 그 전용 `_lib` 훅)에서 오케스트레이션한다. 카드/요약 UI에 `useStartEstimateChat` 등을 두지 않는다.
- return의 JSX를 `renderXxx()`로 쪼개지 않는다.

로그인·회원가입처럼 화면이 폼 하나면 `page.tsx`가 `_components/LoginForm.tsx`를 바로 렌더해도 된다. 그래도 폼 로직은 `page.tsx`에 넣지 않고 `_components`로 뺀다.

### `layout.tsx`

- 앱 루트: Provider, GNB, `globals.css`
- 피처 루트: 하위 페이지가 함께 쓰는 타이틀/셸뿐 아니라 **로그인·역할·프로필 여부처럼 해당 경로 전체에 공통인 페이지 가드**도 둔다.
- 페이지마다 같은 `AuthRouteGuard`나 권한 체크를 반복하고 있다면, 가드 범위가 동일한지 확인한 뒤 공통 `layout.tsx`로 올리는 것을 우선 고려한다.
- `(browse)/layout.tsx`: 목록·상세가 탭바 등 같은 셸을 공유할 때 사용한다.
- 가드 범위가 다른 하위 라우트까지 묶이지 않도록 `layout.tsx`의 적용 범위를 먼저 확인한다.

> 페이지 접근 권한처럼 공통 정책은 각 `page.client.tsx`에 반복하기보다 **해당 라우트의 `layout.tsx`에서 한 번 가드하는 구조**를 우선한다.

---

## 5. `page.client`는 오케스트레이터다

### 해야 하는 일

- Query 훅 호출. 탭이 언마운트되면 **그 탭 패널**에서 호출한다
- 화면용 파생값에 **이름**을 붙인다
- 핸들러에서 가드 후 액션. **채팅·확정·찜**은 여기서(또는 `_lib` 훅에서) 오케스트레이션한다
- 로딩/에러/빈 상태는 return 구조가 가장 잘 읽히는 방식으로 정리한다. **early return은 꼭 필요한 경우에만** 사용한다
- 본문은 의미 있는 자식에게 props로 위임하고, **그 조합은 return JSX에 그대로 쓴다**
- 탭 전환 애니메이션·`role="tabpanel"` 같은 페이지 셸은 `page.client`에 둔다. 반복되는 `motion.div` 설정은 공통 래퍼/variant로 뺄 수 있는지 검토하되, `AnimatePresence`의 `key`/exit 동작을 깨거나 구조를 숨기면 유지한다. Framer Motion이 꼭 필요한지도 함께 확인한다

### 하지 않는 일

- 카드 내부 마크업, 인풋 마크업을 직접 크게 그리지 않는다
- `category === 'FURNITURE_SHARE' && user?.id === post.author.id && !post.isCompleted` 같은 규칙을 JSX에 인라인하지 않는다
- “더 깔끔해 보여서” 분기·타이밍·쿼리 `enabled` 조건을 바꾸지 않는다
- `renderHeader()`, `renderList()`처럼 JSX를 함수로 숨기지 않는다

### 파생값은 반드시 이름으로 드러낸다

```tsx
const isFurnitureShare = category === 'FURNITURE_SHARE';
const isPostOwner = user?.id === post.author.id;
const title = editPost?.title ?? '';
const showListSkeleton =
  isPending || isPlaceholderData || (isRefetchingList && hasStalePosts);
```

리스트/상세의 **배타 상태**는 읽기 쉽게 정리한다. early return이 더 단순할 때는 사용하되, return까지 가는 경로를 늘리는 불필요한 가드는 만들지 않는다.

```tsx
if (isPending) {
  return <ListSkeleton />;
}

if (isError) {
  return <ErrorState message={errorMessage} onRetry={handleRetry} />;
}

if (isEmpty) {
  return <p>{emptyMessage}</p>;
}

return (
  <ul>
    {items.map((item) => (
      <Card key={item.id} item={item} />
    ))}
  </ul>
);
```

본문 안의 선택 조각만 `showXxx ? ... : null`이다.

```tsx
{showComment ? <CommentSection comment={detail.comment} /> : null}
```

핸들러의 가드도 정말 필요한지 확인한다. **가드를 추가/삭제하면 기능이 달라질 수 있으므로, 기존 동작을 유지하면서 불필요한 조건만 정리한다.**

상세처럼 성공 분기에서만 데이터가 있으면, **가드 뒤에 핸들러를 둔다.** `if (!detail) return`을 핸들러마다 반복하지 않는다.

```tsx
if (isError || !detail) {
  return <ErrorState />;
}

const handleChatClick = () => {
  startEstimateChat(toStartEstimateChatParams(detail, detail.mover.moverId));
};
```

가드 앞에 둬야 하는 핸들러 예:

```tsx
const handleLikeClick = useCallback(() => {
  if (!ensureProfileReady()) return;
  if (!post) return;
  togglePostLike(postId, !post.isLiked);
}, [...]);
```

### 네이밍

| 종류 | 규칙 | 예 |
| --- | --- | --- |
| 이벤트 핸들러 | `handleXxx` | `handleLikeClick` |
| 자식에게 넘기는 콜백 prop | `onXxx` | `onLikeClick` |
| boolean | `is` / `has` / `show` 접두사 | `isPostOwner`, `showEmpty` |
| 화면 조각 | PascalCase 컴포넌트. `renderXxx` 금지 | `<CommunityPostList />` |

---

## 6. Presentational 컴포넌트

- named export + arrow function
- Props는 `interface`를 컴포넌트 바로 위에 둔다
- 외부 `className`을 받고 `cn(..., className)`으로 마지막에 병합한다
- 기본값: `className = ''`, optional 콜백은 `?`. 없을 수 있는 값은 `??` (`editPostId ?? 0`, `isFavoritePending ?? false`)
- 데이터/콜백만 받고, fetch하지 않는다
- props는 **정말 필요한 값만** 받는다. 한 컴포넌트에 props가 과도하게 늘어나면 책임이 너무 많은지 먼저 확인한다.
- 같은 값을 여러 단계의 컴포넌트가 전달만 하고 있다면 prop drilling인지 확인하고, 범위가 적절할 때는 Context API를 고려한다.
- 단순히 props 수를 줄이기 위한 Context 남용은 하지 않는다. 가까운 부모-자식 관계라면 props가 더 명확할 수 있다.
- **채팅·확정·찜 mutation 훅을 카드/요약에 두지 않는다.** `onChatClick` / `onConfirm` / `onFavoriteClick`, `isChatPending` / `isConfirming`, 그리고 모델에 실린 `canStartChat`만 받는다
- 카드에 넘기는 mover·상태 칩용 데이터는 부모가 **이미 매핑한 모델**(`MoverCardModel` 등)로 둔다. 카드 안에서 API DTO → UI 모델 변환을 하지 않는다
- 탭 패널은 presentational이 아니다. 언마운트되는 탭의 Query·리스트 분기를 담당할 수 있다. 다만 패널도 채팅 훅을 직접 들지 않고, `page.client`에서 받은 `onChatClick` / `pendingChatQuoteId`를 카드에 넘긴다
- 조건 렌더:
  - boolean: `showEmpty ? <p>{emptyMessage}</p> : null`
  - null/undefined 폴백: `value ?? fallback`, `{node ?? null}`
  - `{count && <Badge />}` 처럼 `&&`로 JSX를 그리지 않는다. `0`이나 `''`가 화면에 나온다
- 클릭 요소는 `button` / `a` / `Link`. `div` onClick 금지
- 아이콘은 `aria-hidden`, 버튼에 `aria-label`
- 숨김 라벨은 `sr-only`
- 컴포넌트 안의 `renderRow()` / `renderIcon()`도 만들지 않는다. 반복되면 작은 컴포넌트 또는 return 안 `map`으로 둔다

한 컴포넌트는 가능하면 **하나의 기능 또는 하나의 화면 책임**만 가진다. 서로 다른 기능을 동시에 책임하면 나눈다.
**한 파일을 여러 파일로 쪼개면서 이벤트·상태가 옮겨지면 먼저 묻는다.** 마크업만 그대로 옮기는 추출은 해도 된다.

비슷한 카드·CTA라도 **패딩, 칩, 링크, 훅 위치가 다르면 합치지 않는다.**
예: 대기 견적 카드 vs 받았던 견적 카드 vs 상세 요약. 고객 상세 CTA vs 기사 상세 CTA.

- 목록 vs 카드 vs 뱃지 vs 썸네일
- 필터 사이드바 vs 셀렉트 vs 검색 필드
- CTA 분기 컴포넌트 vs 실제 버튼. 하단바 **셸**만 공용 (`QuoteDetailMobileActionBar`), 버튼 구성은 피처에 둔다

**피처 전용**이면 `{feature}/_components/`
**고객·기사처럼 여러 라우트에서 재사용**이면 `src/components/` (`src/components/quotes/` 등)
**페이지·목록 스켈레톤**이면 `src/components/ui/Skeleton/`

부모는 슬롯으로 확장한다. 자식 안에 특수 도메인을 하드코딩하지 않는다.

```tsx
<CommentList
  beforeHeader={<FurnitureShareActions />}
  headerAction={<ShareButtons />}
/>
```

컴포넌트 위에는 **이 컴포넌트가 무엇인지** 한 줄로 적는다.

```tsx
/** 커뮤니티 게시글 목록. 무한스크롤 sentinel을 포함한다. */
/** 좋아요 버튼과 댓글 입력. 모바일에서는 하단에 고정한다. */
```

---

## 7. 추출한다 / 추출하지 않는다

다른 페이지를 견적처럼 맞출 때의 기준이다. **같아 보여도 토큰·CTA·훅 위치가 다르면 합치지 않는다.**

### 추출한다

| 조건 | 위치 | 견적에서의 예 |
| --- | --- | --- |
| 고객·기사(또는 라우트 3곳 이상)가 **같은 마크업·같은 클래스**를 쓴다 | `src/components/{domain}/` | `QuoteStatusChips`, `QuoteInfoRows`, `QuotePriceRow` |
| 셸만 같고 안의 CTA는 다르다 | 셸만 공용, CTA는 피처 `_components` | `QuoteDetailMobileActionBar` |
| 목록 첫 등장 stagger, 무한스크롤, listbox 키보드가 같다 | 이미 있는 `src/hooks`를 **먼저** 쓴다 | `useListEntranceStagger`, `useLoadMoreOnView`, `useListboxKeyboard` |
| 견적·지정 채팅 시작이 같다 | `useStartEstimateChat` + `src/lib/startEstimateChat` | CTA 가드·body·`pendingChatTargetId` |
| 라우트 id·탭 쿼리 파싱이 같다 | 이미 있는 `src/lib` | `parsePositiveInt`, `resolveTabSearchParam` |
| 탭이 언마운트되면 Query | `{feature}/_components/*Panel.tsx` | `PendingQuotesPanel`, `ReceivedQuotesPanel` |
| 목록 필터 상태·순수 필터만 섹션을 길게 만든다 | `{feature}/_lib/` | `useReceivedQuoteGroupFilter`, `filterReceivedQuotesByStatus` |
| 히스토리·상세처럼 타이틀 헤더 마크업이 같다 | 피처 `_components` 한 파일. `className`으로 차이만 | `CustomerQuotesTitleHeader` |
| 같은 피처의 빈 화면 마크업이 같다 | 피처 `_components` 한 파일 + 문구/CTA props | `CustomerQuotesEmptyState` |

새 훅을 만들기 전에 위 목록에 같은 동작이 있는지 본다. `rootMargin`·트리거 조건은 기존 화면 값을 그대로 넘긴다.

### 추출하지 않는다

- className이 반복된다는 이유만으로 `PanelBody` / `HistoryBody` / `StateFrame`을 만들지 않는다. 다만 여러 화면에서 동일한 `motion.div` 애니메이션 설정이 반복되면 공통 variant/래퍼가 실제로 가독성을 높이는지 검토한다.
- 바깥 셸이 다른 래퍼를 `filled` prop 하나로 합치지 않는다. (이용 내역 배경 vs 탭 패널 본문)
- 칩·가격만 같고 패딩·CTA·링크가 다른 카드를 하나로 합치지 않는다.
- 고객 CTA와 기사 CTA를 한 컴포넌트로 합치지 않는다.
- 반복되는 `motion.div`는 공통화 가능성을 먼저 확인한다. 단, `AnimatePresence`의 직계 자식/고유 `key`/exit 타이밍이 달라지면 억지로 합치지 않는다.
- **카드/요약에 채팅·확정·찜 훅을 두지 않는다.** 오케스트레이션은 `page.client`(+ 공통 훅)다. “어디에 훅이 있었는지”를 맞추려고 카드에 훅을 다시 내리지 않는다.
- 목록에서 카드별 “연결 중…”이 필요하면 `page.client`마다 `pending*Id` + `useEffect`를 두지 말고, 공통 훅이 `pendingChatTargetId`처럼 **target id**를 노출한다 (`startEstimateChat(params, targetId)`).
- CTA 노출 같은 도메인 가드(`canStartChat` 등)는 JSX에 인라인하지 않는다. `src/lib`(예: `canStartEstimateChat`)에서 계산하고, API→카드 모델 매핑 시 필드에 실어 카드는 `quote.canStartChat`만 본다.

마크업만 옮기는 작은 추출은 물어보지 않아도 된다. 이벤트·상태·모달 타이밍이 파일 밖으로 나가면 먼저 묻는다.

---

## 8. 스타일 — className은 사용하는 곳에서 바로 읽히게

CSS/Tailwind `className`은 **별도의 class 상수나 `*Layout.ts` / `*Styles.ts` 파일로 빼지 않는다.**

return을 읽을 때 해당 요소의 스타일과 레이아웃 의도를 바로 확인할 수 있도록 JSX에 직접 작성한다.

```tsx
<div className="px-6 py-6 md:px-18 md:py-8 xl:px-16">
  ...
</div>
```

### 기준

- `SECTION_CLASS`, `CONTENT_CLASS`처럼 **className 문자열만 담는 상수는 만들지 않는다.**
- CSS className만 공유하기 위한 `*Layout.ts`, `*Styles.ts` 파일을 만들지 않는다.
- 같은 className이 반복되더라도, 단순 문자열 중복을 없애기 위해 추상화하지 않는다.
- 실제로 같은 UI 구조가 반복된다면 className을 추출하는 대신 **컴포넌트 자체를 공통화할 가치가 있는지** 판단한다.
- 색·타이포·디자인 토큰은 기존 `globals.css`의 전역 토큰을 우선한다. `bg-[#ff0000]` 같은 임의 색상은 지양한다.
- class 조합이 필요한 경우 기존 `cn()`을 사용한다.
- 기존 페이지의 브레이크포인트나 스타일 값을 컨벤션 정리 중 임의로 바꾸지 않는다.

### 반응형

- Mobile first
- Tablet: `min-[46.5rem]` (또는 기존 `tablet` 토큰이 이미 있는 곳만 유지)
- Desktop: `xl`
- 같은 페이지 안에서는 브레이크포인트 표기를 섞지 않는다
- **이미 `tablet` / `md` / `lg`가 섞여 있는 화면을 한 번에 통일하는 것은 큰 변경이다. 먼저 묻는다.**

---

## 9. 레이어별 책임

화면은 `app`, 서버 상태는 `hooks`, HTTP는 `services`, 계산은 `lib`에 둔다.

로직을 `hooks`/`lib`로 옮길 때는 **분기와 타이밍을 그대로 복사**한다. 옮기면서 조건을 정리하지 않는다.

### `src/services/`

- 함수 하나가 엔드포인트 하나
- 응답 파싱 외에 토스트·라우팅·캐시를 넣지 않는다

### `src/hooks/`

- TanStack Query/Mutation은 여기에만 둔다
- queryKey는 `src/constants/queryKeys.ts` 또는 피처별 키 모듈
- 무한스크롤 `nextPageParam`, invalidate는 훅이 캡슐화한다
- **queryKey, `enabled`, `placeholderData`, invalidate 범위를 컨벤션 맞춘다고 바꾸지 않는다.**

페이지 전용 흐름이 `page.client`·패널을 길게 만들면 그 피처의 `_lib/use{Feature}{Concern}.ts`(또는 순수 `filterXxx.ts`)로 옮긴다.
예: 가구나눔 채팅/완료 CTA, 지정 견적, 프로필 이미지 크롭, 받았던 견적 그룹 필터.
이미 페이지에 안정적으로 있으면, 훅 추출로 파일이 크게 갈라질 때 먼저 묻는다.

```ts
const {
  detailAction,
  handleFurnitureShareChatClick,
  handleCompleteConfirm,
  isCompletePending,
} = useCommunityFurnitureShareDetail({
  post,
  postId,
  user,
  openLoginModal,
  openProfileModal,
});
```

훅은 상태와 `handleXxx`를 반환한다. JSX를 반환하는 `renderXxx`를 훅에 두지 않는다.

화면 동작이 이미 있는 훅과 같으면 **새 훅을 만들지 않고 재사용**한다.

| 훅 / 유틸 | 쓸 때 |
| --- | --- |
| `useListEntranceStagger(isPending)` | 첫 스켈레톤이 끝난 뒤에만 목록 stagger |
| `useLoadMoreOnView({ hasNextPage, isFetchingNextPage, fetchNextPage })` | 센티널 무한스크롤. 기본 `rootMargin: '200px'`. 기존 값이 있으면 그 값을 넘긴다 |
| `useListboxKeyboard` | 커스텀 listbox (필터 드롭다운) |
| `useStartEstimateChat` | 견적·지정 플로우 채팅 시작. 목록 카드별 pending이면 `startEstimateChat(params, targetId)` + `pendingChatTargetId` |
| `parsePositiveInt` | 라우트 id. 실패는 `null`. 훅에는 `?? 0`, `enabled`는 `id > 0` |
| `resolveTabSearchParam` | `searchParams`의 탭 값을 단일 문자열로 |
| `canStartEstimateChat` / `toStartEstimateChatParams` / `buildEstimateChatRoomBody` | 채팅 CTA 가드·시작 params·POST body (`src/lib/startEstimateChat`) |

무한스크롤은 훅 + `QuotesLoadMoreSentinel`처럼 피처 sentinel. `useInView`를 페이지마다 다시 짜지 않는다.

### `src/lib/`

페이지/컴포넌트에 남기지 말고 순수 함수로 뺀다.

- URL ↔ 필터 컨텍스트: `parseXxxFromSearchParams`, `buildXxxHref`, `resolveTabSearchParam`
- id 파싱: `parsePositiveInt` (새 `Number(...)` / `parseInt` 헬퍼를 페이지에 두지 않는다)
- 비즈니스 분기: `resolveXxxAction`, `isXxx`
- 포맷·검증: 전화번호, 이메일, 본문 스트립

함수는 입력 → 출력만. 훅·토스트·라우터·JSX를 넣지 않는다.

```ts
export const resolveFurnitureShareDetailAction = (
  isFurnitureShare: boolean,
  isPostOwner: boolean,
  isCompleted: boolean
): FurnitureShareDetailAction | null => { ... };
```

### `src/constants/`

옵션·라벨·매직넘버·엔드포인트·에러코드.
타입 가드(`isPostSort`, `isBoardCategoryFilter`)로 URL/문자열을 좁힌 뒤 상태를 바꾼다.

### `src/types/`

API 요청/응답, 도메인 모델. UI Props interface는 컴포넌트 파일에 둔다.

사이드이펙트(API, 토스트, 라우팅)는 훅/핸들러 경계에만 둔다. 계산은 `lib`에 둔다.

---

## 10. 데이터 / 에러 / 빈 화면

목록·상세는 같은 상태 기계를 쓴다. **새 페이지에 적용할 때**의 기본값이다. 기존 화면에 없던 상태(404 문구, 재시도 버튼 등)를 컨벤션 때문에 추가하지 않는다. 추가가 필요하면 먼저 묻는다.

1. 잘못된 id/파라미터
2. 로딩 (`Spinner` + 짧은 메시지)
3. 404
4. 그 외 에러 + `다시 시도`
5. 빈 목록 (검색 vs 필터 vs 기본 메시지를 구분해 문자열로 넘긴다)
6. 본문
7. 다음 페이지 로딩 / 다음 페이지 에러

이 분기도 `renderError()`로 숨기지 않는다. **early return이 return 구조를 더 단순하게 만드는 경우에만** 사용하고, 그렇지 않으면 본문 흐름 안에서 명확하게 조건을 표현한다. 중요한 것은 return까지의 여정과 return 내부 구조가 모두 쉽게 읽히는 것이다.

`showSkeleton && !showError && showEmpty`처럼 서로 배타적인 boolean을 여러 개 만들어 한 return에 나란히 두지 않는다.

에러 메시지는 기존 문구를 유지한다. 화면에 에러 표시를 손댈 때는 `resolveApiErrorMessage(error, fallback)`로 맞추고, **fallback 문자열은 기존과 같게** 둔다.

무한스크롤은 `useLoadMoreOnView` + sentinel. 기존 `rootMargin`·트리거 조건을 바꾸지 않는다.

리스트 컴포넌트가 `loadMoreRef`, `isFetchingNextPage`, `onRetryNextPage`를 받는다.

모달은 성공 JSX 아래, 페이지 레벨에서 연다. 카드 안에 삭제 확인 모달을 가두지 않는다.
탭이 바뀌어도 열려 있어야 하는 모달(견적 확정, 로그인)은 탭 패널이 아니라 `page.client`에 둔다.
로그인 필요 모달처럼 **여러 라우트에서 쓰는 것**만 `src/components/auth/`에 둔다.

---

## 11. 주석 / 네이밍

### 주석

컴포넌트, 훅, 순수 함수, 복잡한 로직 위에는 **그것이 무엇인지 한두 줄로** 적는다. 코드가 이미 말하는 문장(`// 카테고리를 변경한다`)과 `console.log`는 남기지 않는다.

| 대상 | 적을 내용 | 예 |
| --- | --- | --- |
| 페이지·컴포넌트 | 경로·역할이 보이면 `` /** `/quotes` 대기 탭 패널. - Query+목록 */ ``처럼 짧게 | `/** 커뮤니티 게시글 상세 페이지 */` |
| 훅 | 이 훅이 다루는 상태·동작 | `/** 가구나눔 상세의 채팅·완료 CTA 상태와 핸들러 */` |
| 순수 함수 | 입력 대비 무엇을 계산하는지 | `/** 게시글 카테고리로 목록 탭 id를 구한다 */` |
| 핸들러·분기 | 한눈에 안 들어오는 로직만 짧게 | `/** 로그인·프로필이 없으면 모달을 열고 이후 액션을 중단한다 */` |

```tsx
/** 커뮤니티 게시글 목록 페이지 */
const CommunityPage = async ({ searchParams }: CommunityPageProps) => { ... };

/** 게시글 카드. 제목, 미리보기, 좋아요·댓글 수를 보여 준다. */
export const CommunityPostCard = ({ post }: CommunityPostCardProps) => { ... };
```

```ts
/** 목록 필터를 상세 이전/다음글 API 쿼리와 같은 형태로 바꾼다. */
export const postListContextToParams = (context: PostListContext): PostListParams => { ... };
```

슬롯 prop처럼 역할이 이름만으로 안 보이면 그 자리에 한 줄 설명을 둔다.

```tsx
interface CommunityCommentListProps {
  /** 본문과 댓글 헤더 사이. 가구나눔 채팅 CTA 등에 쓴다. */
  beforeHeader?: ReactNode;
}
```

### import 순서

import는 **무엇을 가져왔는지 역할이 바로 보이도록 카테고리별로 묶고, 그룹 사이를 한 줄 띄운다.**

큰 기준은 다음 순서로 맞춘다.

1. **가져온 것** — React/Next.js/외부 라이브러리, 공용 컴포넌트처럼 내가 현재 파일에서 가공하지 않고 바로 사용하는 것
2. **훅** — `useState`, `useEffect` 같은 React Hook 및 프로젝트의 `useAuth`, Query/Mutation 훅
3. **가공이 필요한 것** — `lib`, `services`, `constants`, formatter/validator, 타입 등 현재 파일의 로직에서 가공·계산에 사용하는 것
4. 상대 경로의 로컬 컴포넌트/유틸은 위 역할 기준 안에서 일관되게 배치한다

예시:

```tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button/Button';

import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

import { getPostAuthRedirectPath } from '@/lib/getPostAuthRedirectPath';
import { login } from '@/services/authApi';
import type { User } from '@/types/auth';
```

> 세부 알파벳 순서보다 **가져온 것 → 훅 → 가공이 필요한 것**이라는 읽기 흐름을 우선한다.

### 컴포넌트 이름

기능 prefix + 역할

- `CommunityPostCard`
- `CommunityWriteTitleField`
- `CustomerQuoteDetailActions`
- 페이지 클라이언트: `{Feature}PageClient`

공개 컴포넌트/훅 이름을 바꾸면 import가 많이 깨진다. **rename이 여러 파일에 퍼지면 먼저 묻는다.**

---

## 12. 새 피처를 추가할 때 / 기존 피처를 맞출 때

### 새 피처

위 폴더 틀을 복사한다.

1. `(main)/{feature}/page.tsx` + `page.client.tsx` — 목록
2. `{feature}/_components/` — 목록·상세가 같이 쓰는 카드·툴바
3. `{feature}/[id]/` — 상세 (`_components`, 필요하면 `_lib`)
4. 레이아웃이 다른 하위 페이지(작성, 히스토리)는 같은 피처 아래 별도 폴더
5. 목록·상세가 탭바처럼 **같은 셸을 실제로 공유할 때만** `layout.tsx` / `(browse)`
6. Query는 `src/hooks/use{Feature}.ts`, HTTP는 `src/services/{feature}Api.ts`
7. 타입·옵션·순수 함수는 `src/types` / `src/constants` / `src/lib`

일반유저 전용 화면은 `(customer)/` 아래에 둔다. 그룹 이름은 URL에 붙지 않는다. (`/quotes`, `/profile/customer`)

기사님 전용 화면은 `mover/` 아래에 둔다. URL에 `/mover`가 붙는다. (`/mover/requests`, `/mover/quotes`, `/mover/mypage`)

### 기존 피처

1. 지금 동작을 기준으로 삼는다. 기능 추가/수정은 이 컨벤션 작업에 섞지 않는다.
2. 작은 정리(주석, 상수 추출, 이름 붙인 파생값, `renderXxx()`를 같은 파일 return으로 인라인)부터 한다.
3. `(browse)` / layout 신설, 큰 훅 추출, 상태 로직 재작성은 **계획만 적어서 묻는다.** 기존 화면에 `(browse)`를 맞추려고 넣지 않는다.
4. 물음에는 바꿀 파일, 이유, 기능이 안 바뀌는 근거를 짧게 쓴다.

견적 페이지를 기준으로 **다른 피처도 같은 결**로 맞출 때는 아래 순서만 한다. 한 번에 카드를 합치거나 래퍼를 새로 만들지 않는다.

1. **폴더·역할** — `page.tsx`는 파싱·셸, `page.client.tsx`는 탭·모달·채팅/확정/찜 오케스트레이션. 여러 페이지에 공통인 접근 가드는 가능한 해당 경로의 `layout.tsx`로 올린다. 탭이 언마운트되면 Query는 `*Panel`.
2. **이미 있는 훅·유틸** — stagger / 무한스크롤 / listbox / id 파싱 / `useStartEstimateChat`을 새로 짜지 않는다.
3. **렌더 흐름** — return까지의 코드가 길어지지 않게 정리하고, early return은 실제로 구조가 단순해지는 경우에만 사용한다.
4. **카드는 presentational** — 채팅·확정·찜 훅 제거, `onXxx`/`isXxxPending`/`canStartChat`·매핑된 mover만. 필터·도메인 가드는 `_lib` / `src/lib` / API 매핑.
5. **공용 UI** — 고객·기사가 같은 칩·행·가격이면 `src/components/{domain}/`. CTA·카드 본체는 피처에 둔다.
6. **스타일은 JSX에서 확인** — className을 `*Layout.ts` / `*Styles.ts` / 상수로 빼지 않는다.
7. 로컬 `FooBody` / `StateFrame`은 만들지 않는다. 반복되는 `motion.div`는 공통화가 가독성을 높이는지 검토하고, Framer Motion 자체가 꼭 필요한지도 확인한다.

---

## 13. 체크리스트 (PR 전 / 생성 후)

### 기능 보존

- [ ] 사용자 입장에서 같은 입력 → 같은 화면, 같은 요청이다
- [ ] URL, 쿼리 파라미터, 권한 가드, 모달 타이밍을 바꾸지 않았다
- [ ] 로딩/에러/빈 화면 문구와 재시도 동작을 바꾸지 않았다
- [ ] queryKey, `enabled`, invalidate, 캐시 정책을 바꾸지 않았다
- [ ] 큰 구조 변경(라우트 이동, layout, 대규모 추출)은 미리 물어보고 진행했다

### 컨벤션

- [ ] 파일이 위 폴더 트리의 위치에 있다. 고객 전용 카드가 `src/components/`로 새지 않았다. 고객·기사 공용 견적 UI는 `src/components/quotes/`
- [ ] 페이지·목록 스켈레톤은 `src/components/ui/Skeleton/`에 있다
- [ ] `(browse)`는 목록·상세가 같은 셸을 이미 공유할 때만 있다. 맞추려고 새로 넣지 않았다
- [ ] `page.tsx`는 얇고, 상호작용은 `page.client.tsx`에만 있다. `page.client`는 default export다
- [ ] 탭이 언마운트되면 Query는 패널에, 확정·로그인 모달은 `page.client`에 있다
- [ ] 컴포넌트를 위에서 아래로 읽으면 가져온 것 → 훅 → 가공/파생 → 필요한 핸들러/가드 → return 흐름이 보이고, 다른 컴포넌트도 비슷한 순서를 따른다
- [ ] early return/if문은 꼭 필요한 것만 남아 있고, return까지 가는 흐름이 불필요하게 길지 않다
- [ ] return JSX에 `{renderXxx()}`가 없고, 화면은 인라인 또는 `<Component />`다. 로컬 `FooBody` 래퍼를 만들지 않았다
- [ ] JSX 본문의 선택 조각만 `isXxx` / `showXxx`로 이름이 붙어 `? : null`이다
- [ ] HTTP는 `services`, Query는 `hooks`, 계산은 `lib`, 옵션은 `constants`에 있다
- [ ] 목록 stagger / 무한스크롤 / listbox / 양의 정수 id는 기존 훅·유틸을 재사용했다
- [ ] CSS/Tailwind className을 별도 상수나 `*Layout.ts` / `*Styles.ts` 파일로 빼지 않고 JSX에서 바로 확인할 수 있다
- [ ] 카드/필드/필터 UI는 presentational이고 fetch·채팅/확정/찜 훅을 들지 않는다. 탭 패널은 Query만 가져도 되고, 사이드이펙트 오케스트레이션은 `page.client`다
- [ ] props가 과도하게 많지 않은지 확인했고, 여러 단계로 전달만 하는 값은 Context API가 더 적절한지 검토했다
- [ ] 하나의 컴포넌트가 하나의 기능/화면 책임에 집중하고 있다
- [ ] 공통 접근 가드는 페이지마다 반복하지 않고 적용 범위가 같다면 `layout.tsx`에서 처리한다
- [ ] 반복되는 `motion.div`/variant는 공통화 가능성을 검토했고, 불필요한 Framer Motion 사용은 줄였다
- [ ] 목록 카드별 채팅 pending은 `useStartEstimateChat`의 `pendingChatTargetId`를 쓰고, 페이지마다 `pending*Id`+`useEffect`를 새로 두지 않았다
- [ ] `canStartChat` 등 CTA 가드는 `src/lib`(+ API 매핑)에서 계산하고, 카드 JSX에 인라인하지 않았다
- [ ] 핸들러는 `handle*`, prop은 `on*`. `&&`로 JSX를 그리지 않는다
- [ ] 페이지·컴포넌트·훅·함수에 간단한 설명 주석이 있다
- [ ] 같은 피처의 목록/상세/작성과 레이아웃 토큰·네이밍이 같다
- [ ] 고객 전용과 기사 전용 CTA·카드를 한 컴포넌트로 합치지 않았다

---

## 먼저 물어봐야 하는 변경 vs 바로 해도 되는 변경

| 바로 해도 됨 (기능 동일) | 먼저 묻는다 (코드가 많이 바뀜) |
| --- | --- |
| JSDoc, 주석, import 순서 | `(browse)` / `layout.tsx` 추가·이동 |
| 불필요한 if/early return 정리 (동작 동일) | 훅/`lib`로 큰 로직 추출, 상태 기계 재작성 |
| 같은 파일에서 `{renderXxx()}`를 return JSX로 인라인 | `renderXxx()`를 여러 파일 컴포넌트로 나누기 |
| 마크업·props를 그대로 두는 작은 컴포넌트 추출 | 공용 컴포넌트 교체, 모달/가드 타이밍 변경 |
| 파일 안 핸들러 순서 정리 | 라우트 그룹 이동, 공개 이름 rename이 여러 파일에 전파 |
| 기존 `useLoadMoreOnView` 등으로 동일 동작 치환 | 반응형 브레이크포인트 일괄 통일 |
| | 없던 로딩/에러/빈 상태 UI 추가 |
| 동일한 `motion` variant/설정을 작은 공통화로 정리 | `AnimatePresence` 구조나 exit 타이밍이 바뀌는 motion 추상화 |
| | 로컬 래퍼(`FooBody`)를 `src/components/layout`으로 올리기 |

물을 때 형식:

1. 무엇을 왜 맞추려는지
2. 바뀔 파일 목록
3. 기능이 안 바뀌는 이유 / 바뀌 위험이 있는 지점
4. 진행해도 되는지

---

## 맞출 핵심 5가지

1. **어느 컴포넌트를 가도 읽는 순서가 비슷하다**
   가져온 것 → 훅 → 가공/파생 → 필요한 핸들러/가드 → return 순으로 읽히게 하고, return 내부만 봐도 화면 구조가 보이게 한다.
2. **하나의 컴포넌트는 하나의 책임에 집중한다**
   기능이 섞이거나 props가 과도하게 많아지면 분리 기준을 다시 보고, 여러 단계 prop drilling이면 Context API도 고려한다.
3. **공통 정책은 공통 위치에서 처리한다**
   페이지 접근 가드는 범위가 같다면 `layout.tsx`에서 처리하고, 중복된 표현·네이밍·상태 처리 방식은 프로젝트 전체에서 통일한다.
4. **return까지의 여정을 짧고 명확하게 만든다**
   if문과 early return은 관성적으로 쓰지 않고 꼭 필요한지 확인한다. CSS className은 별도 상수/파일로 숨기지 않고 JSX에서 바로 읽히게 한다.
5. **quotes 구조를 기준점으로 삼되, 억지로 복제하지 않는다**
   `quotes` 하위의 역할 분리와 읽기 흐름은 참고하되, 각 피처의 실제 책임과 동작을 유지한다. 반복되는 `motion.div`는 공통화 가능성을 검토하고 Framer Motion이 정말 필요한지도 확인한다.
````
