# Jun's Blog

간단하고 직관적인 사용자 경험을 제공하는 React 기반 블로그 애플리케이션입니다.  
회원가입·로그인, 게시글 작성·수정·삭제, 댓글 작성·수정·삭제, 좋아요 토글, 사용자 프로필 조회 등 핵심 기능을 포함하고 있습니다.

### [사이트 바로가기](https://juns-blog-front.vercel.app/)

---

## 주요 기능

- **회원가입 / 로그인**  
  – 일반 계정 기반 인증 및 Kakao OAuth 로그인 지원

- **게시글 CRUD**  
  – 게시글 작성 (CreatePost)  
  – 게시글 목록 조회, 무한 스크롤 & 정렬 (PostListPage)  
  – 게시글 상세 조회, 이미지 포함 (PostDetailPage)  
  – 게시글 수정 (EditePost)  
  – 게시글 삭제 (PostDetailPage)

- **댓글 기능**  
  – 댓글 생성·조회·수정·삭제

- **좋아요 토글**  
  – 로그인 유저 대상 좋아요 상태 관리 및 카운트

- **사용자 프로필 페이지**  
  – 작성 글·댓글·좋아요 목록 조회  
  – 비밀번호 변경 / 회원 탈퇴

- **풍부한 텍스트 에디터**  
  – Quill 기반 WYSIWYG 에디터

- **모달 컴포넌트**  
  – ReactModal 라이브러리 기반 모달

- **레이아웃 & 네비게이션**  
  – 공통 레이아웃(DefaultLayout) 및 반응형 헤더(Header)

---

## 기술 스택

- **프레임워크 / 라이브러리**: React 18, React Router v6
- **상태 관리**: Redux Toolkit
- **HTTP 클라이언트**: Axios
- **에디터**: react-quill-new (Quill)
- **모달**: react-modal
- **OAuth**: Kakao OAuth (KakaoLoginButton)
- **CSS**: CSS Modules
- **번들러 / 개발 서버**: Vite

---

## 프로젝트 구조

```
toktokLog_front/
├── src/
│   ├── apis/           # API 통신 관련 모듈
│   │   ├── postApi.js      # 게시글 관련 API
│   │   ├── userApi.js      # 사용자 관련 API
│   │   └── commentApi.js   # 댓글 관련 API
│   │
│   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── Header.jsx          # 네비게이션 헤더
│   │   ├── header.module.css
│   │   ├── Modal.jsx           # 모달 컴포넌트
│   │   ├── Modal.module.css
│   │   ├── PostCard.jsx        # 게시글 카드
│   │   ├── postcard.module.css
│   │   ├── LikeButton.jsx      # 좋아요 버튼
│   │   ├── likebutton.module.css
│   │   ├── Comments.jsx        # 댓글 컴포넌트
│   │   ├── comments.module.css
│   │   ├── KakaoLoginButton.jsx # 카카오 로그인 버튼
│   │   ├── QuillEditor.jsx     # 텍스트 에디터
│   │   └── QuillEditor.css
│   │
│   ├── pages/          # 페이지 컴포넌트
│   │   ├── PostListPage.jsx        # 게시글 목록
│   │   ├── postlistpage.module.css
│   │   ├── PostDetailPage.jsx      # 게시글 상세
│   │   ├── postdetailpage.module.css
│   │   ├── CreatePost.jsx          # 게시글 작성
│   │   ├── createpost.module.css
│   │   ├── EditePost.jsx           # 게시글 수정
│   │   ├── editepost.module.css
│   │   ├── LoginPage.jsx           # 로그인
│   │   ├── RegisterPage.jsx        # 회원가입
│   │   ├── registerpage.module.css
│   │   ├── UserPage.jsx            # 사용자 프로필
│   │   ├── userpage.module.css
│   │   ├── UserInfoUpdate.jsx      # 사용자 정보 수정
│   │   ├── userinfoupdate.module.css
│   │   └── KakaoCallbackPage.jsx   # 카카오 로그인 콜백
│   │
│   ├── common/         # 공통 컴포넌트 및 스타일
│   ├── assets/         # 이미지, 폰트 등 정적 파일
│   ├── router/         # 라우팅 설정
│   ├── store/          # Redux 상태 관리
│   ├── utils/          # 유틸리티 함수
│   └── main.jsx        # 애플리케이션 진입점
│
├── public/             # 정적 파일
├── .vscode/           # VS Code 설정
├── node_modules/      # 의존성 패키지
├── .gitignore        # Git 제외 파일 목록
├── .prettierrc       # Prettier 설정
├── .prettierignore   # Prettier 제외 파일 목록
├── eslint.config.js  # ESLint 설정
├── index.html        # HTML 템플릿
├── package.json      # 프로젝트 설정 및 의존성
├── package-lock.json # 의존성 잠금 파일
├── README.md         # 프로젝트 문서
└── vite.config.js    # Vite 설정
```

---
