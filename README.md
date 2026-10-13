# Hangarae FrontEnd Repository

## ✨프로젝트 소개

>

- 기간 : 2026.09.28 ~ 2026.11.16
- 인원 : Frontend 2명
- 목적 :
- 주요 기능
  - 회원가입 및 로그인
  - 교내 행사 안내 및 시각화
  - 학교 행사 및 일정 관리
  - 팀프로젝트 매칭

## 👩‍💻팀원 및 역할

|              [김유진(KimYujin22)](https://github.com/KimYujin22)               |               [이소민(somin2352)](https://github.com/somin2352)                |
| :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
| ![김유진의 프로필 사진](https://avatars.githubusercontent.com/u/163673413?v=4) | ![이소민의 프로필 사진](https://avatars.githubusercontent.com/u/164002759?v=4) |

## ⚙️기술 스택

- **언어** : React + TypeScript
- **빌드 툴** : Vite
- **스타일링** : TailwindCSS
- **라우팅** : React Router
- **상태관리** : Zustand
- **데이터 캐싱** : Tanstack Query
- **API 통신** : Axios

## 📕브랜치 정의

- 영어로 통일, 케밥케이스로 작성
- 작성 형식: 브랜치 유형/브랜치명/#이슈번호
- 작성 예시
  - feat/login-page/#5

## 📗네이밍 컨벤션

- `camelCase` : 변수, 일반함수
  - ex) isError, handleSubmit
- `UPPER_CASE_SNAKE_CASE` : 상수
  - ex) BASE_URL
- `PascalCase` : 클래스, 컴포넌트 함수, 타입, 인터페이스, 컴포넌트 파일
  - ex) CardListProps
- `kebab-case` : 파일, 폴더
  - ex) main-layout, login-page
  - 컴포넌트 파일 및 폴더만 예외로 파스칼 케이스로 작성

## 📘커밋 컨벤션

|   Feat   |               새로운 기능 추가                |
| :------: | :-------------------------------------------: |
|  BugFix  |                   버그 수정                   |
|   Docs   |                   문서 작성                   |
|  Modify  |                   코드 수정                   |
| Refactor |                   리팩토링                    |
|  Style   |                  코드 포매팅                  |
|  Design  |                  디자인 수정                  |
|  Chore   |         빌드 수정, 패키지 매니저 설정         |
|  Rename  |             파일 혹은 폴더명 수정             |
|  Remove  |              파일 혹은 폴더 삭제              |
|  Merge   | pull 과정 중 현재 commit과 병합이 일어난 경우 |
|  Build   |      새로운 라이브러리 혹은 패키지 추가       |

## 📁폴더 구조

```
📦redo-front
 ┣ 📂.github
 ┃ ┣ 📂ISSUE_TEMPLATE
 ┃ ┣ 📂workflows
 ┃ ┗ 📜PULL_REQUEST_TEMPLATE.md
 ┣ 📂public
 📦src
 ┣ 📂apis
 ┣ 📂assets
 ┃ ┣ 📂fonts
 ┃ ┣ 📂icons
 ┃ ┗ 📂images
 ┣ 📂components
 ┣ 📂layouts
 ┣ 📂pages
 ┣ 📂store
 ┣ 📂types
 ┣ 📂utils
 ┣ 📜App.css
 ┣ 📜App.tsx
 ┣ 📜index.css
 ┗ 📜main.tsx
 ┣ 📜.gitignore
 ┣ 📜eslint.config.js
 ┣ 📜index.html
 ┣ 📜package.json
 ┣ 📜pnpm-lock.yaml
 ┣ 📜postcss.config.js
 ┣ 📜README.md
 ┣ 📜tsconfig.app.json
 ┣ 📜tsconfig.json
 ┣ 📜tsconfig.node.json
 ┗ 📜vite.config.ts
```

## ▶️실행 방법

```bash
git clone 'https://github.com/REDO-Team/Front.git'

pnpm install

pnpm dev
```
