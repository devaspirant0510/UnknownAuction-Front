<div align="center">

# 🎯  Unknown Auction

### ⚡ 실시간 경매 플랫폼

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📋 목차

- [기술 스택](#-기술-스택)
- [환경 변수 설정](#-환경-변수-설정)
- [프론트엔드 아키텍처](#-프론트엔드-아키텍처)
- [Git 협업 방식](#-git-협업-방식)

---

## 🛠 기술 스택

### Core
| 기술 | 설명        | 버전   |
|------|-----------|------|
| ⚛️ **React** | SPA 라이브러리 | 19.x |
| 📘 **TypeScript** | 정적 타입 지원  | 5.x  |
| ⚡ **Vite** | 빌드 툴      | 5.x  |

### State Management & Data Fetching
| 기술 | 설명                      |
|------|-------------------------|
| 🔄 **React Query** | fetching & caching 상태 관리 |
| 🐻 **Zustand** | 전역 상태 관리                |
| 📡 **Axios** | HTTP 클라이언트              |
| 🔌 **WebSocket (STOMP)** | 실시간 통신                  |

### UI & Styling
| 기술 | 설명 |
|------|------|
| 🎨 **TailwindCSS** | 유틸리티 CSS 프레임워크 |
| 🧩 **shadcn/ui** | UI 컴포넌트 라이브러리 |

### Additional
| 기술 | 설명 |
|------|------|
| 🔥 **Firebase** | 푸시 알림 (FCM) |

---

## ⚙️ 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 변수들을 설정하세요.

### 🔧 기본 설정
```env
# 환경 모드 (development | production)
VITE_MODE=development

# 서버 URL
VITE_SERVER_URL=https://your-backend-api.com

# 프론트엔드 URL
VITE_FRONT_URL=https://your-frontend-url.com
```

### 🔐 OAuth & 소셜 로그인
```env
# Kakao Web Key
VITE_KAKAO_API_KEY=your_kakao_web_key
```

### 🔥 Firebase 설정
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
VITE_FIREBASE_VAPID_KEY=your_firebase_vapid_key
```


---

## 🏗 프론트엔드 아키텍처

**Feature-Sliced Design (FSD)** 아키텍처를 따릅니다.

### 📊 레이어 구조

```
┌─────────────────────────────────────────┐
│              📄 Pages                   │  최종 페이지 조합
├─────────────────────────────────────────┤
│              🧱 Widgets                 │  UI 블록 조합
├─────────────────────────────────────────┤
│              🧰 Features                │  비즈니스 기능
├─────────────────────────────────────────┤
│              🧩 Entities                │  비즈니스 엔티티
├─────────────────────────────────────────┤
│              🔧 Shared                  │  공통 코드
└─────────────────────────────────────────┘
```

### 레이어별 상세 설명

<details>
<summary><strong>🔧 Shared</strong> - 전체 앱에서 재사용되는 공통 코드</summary>

| 세그먼트 | 설명 | 예시 |
|---------|------|------|
| **ui** | 공통 UI Kit | Button, TextField, Modal |
| **lib** | 유틸리티 함수 | formatDate, debounce |
| **api** | API 클라이언트 | axios 인스턴스, 인증 처리 |
| **model** | - | 거의 사용 안 함 |

</details>

<details>
<summary><strong>🧩 Entities</strong> - 비즈니스 개체 정의 및 관련 로직</summary>

| 세그먼트 | 설명 | 예시 |
|---------|------|------|
| **ui** | 엔티티 UI 컴포넌트 | UserCard, ProductCard |
| **model** | 상태 및 데이터 조작 | userStore |
| **lib** | 계산 로직 | calculateDiscount |
| **api** | 엔티티 관련 API | getUserById, updateUser |

</details>

<details>
<summary><strong>🧰 Features</strong> - 실제 사용자 기능 단위</summary>

| 세그먼트 | 설명 | 예시 |
|---------|------|------|
| **ui** | 상호작용 UI | LikeButton, FollowButton |
| **model** | 비즈니스 로직 | toggleLike, changeTheme |
| **lib** | 보조 로직 | validateInput |
| **api** | 기능 관련 API | likePost, followUser |

</details>

<details>
<summary><strong>🧱 Widgets</strong> - UI 조각 조합</summary>

| 세그먼트 | 설명 | 예시 |
|---------|------|------|
| **ui** | 복합 UI 블록 | PostList, CommentSection |
| **lib** | 상호작용 처리 | useSwipeGesture |
| **model** | 인프라 스토어 | 로직 없이 저장소만 |

</details>

<details>
<summary><strong>📄 Pages</strong> - 완성된 페이지</summary>

| 세그먼트 | 설명 | 예시 |
|---------|------|------|
| **ui** | 페이지 조합 | HomePage, ProfilePage |
| **lib** | 페이지 기능 | usePageScroll |
| **api** | 데이터 로더 | SSR 프레임워크용 |

</details>

---

## 📌 Git 협업 방식

### 🌳 Git Flow 전략

```mermaid
graph LR
    A[feature] -->|PR| B[develop]
    B -->|Release| C[release/v1.0]
    C -->|Deploy| D[main]
    D -->|Hotfix| E[hotfix/v1.0.1]
    E -->|Merge| D
    E -->|Merge| B
```

#### 브랜치 전략

| 브랜치 | 용도 | 네이밍 규칙 | 설명 |
|--------|------|-------------|------|
| 🚀 **main** | 프로덕션 | `main` | 현재 운영 중인 서비스 |
| 🎁 **release** | 배포 준비 | `release-1.0.0` | 버전별 배포 관리 |
| 🚨 **hotfix** | 긴급 수정 | `hotfix/1.0.1-이슈명` | 프로덕션 긴급 버그 수정 |
| 🔧 **develop** | 개발 | `dev` | 개발 중인 최신 코드 |
| ✨ **feature** | 기능 개발 | `feature/기능명` | 새로운 기능 개발 |

### 📝 커밋 컨벤션

| Prefix | 설명 | 예시 |
|--------|------|------|
| ✨ **feat** | 새로운 기능 추가 | `feat: 실시간 채팅 기능 구현` |
| 🐛 **fix** | 버그 수정 | `fix: 로그인 토큰 만료 처리 수정` |
| 📝 **docs** | 문서 수정 | `docs: README 업데이트` |
| 💄 **style** | 코드 포맷팅 | `style: 세미콜론 추가` |
| ♻️ **refactor** | 코드 리팩토링 | `refactor: API 호출 로직 개선` |
| ✅ **test** | 테스트 코드 | `test: 유저 서비스 테스트 추가` |
| 🔧 **chore** | 빌드/설정 | `chore: package.json 업데이트` |

#### 커밋 메시지 작성 예시
```bash
feat: 실시간 경매 입찰 기능 구현

- WebSocket STOMP 연결 추가
- 입찰 UI 컴포넌트 작성
- 입찰 히스토리 조회 API 연동
```

---
