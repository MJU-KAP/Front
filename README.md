# 🚀 Project Name

Next Plan에 대한 프론트엔드 작업 레포지토리입니다.

---

### 🛠 Tech Stack

현재 프로젝트에서 사용 중인 주요 기술 스택입니다.

- Framework: React 19
- Build Tool: Vite
- Language: TypeScript
- Package Manager: pnpm
- Styling: Tailwind CSS v4 (@tailwindcss/postcss)

---

### 🌿 Branch Strategy

작업은 이슈 단위로 진행하며, 브랜치 명명 규칙은 다음과 같습니다.

- 형식: `FO_이슈번호`
- 예시: `FO_1`, `FO_12`

---

### 💬 Commit Convention

일관된 히스토리 관리를 위해 아래 규칙에 따라 커밋 메시지를 작성합니다.

| Type | Description |
| :--- | :--- |
| feat | 새로운 기능 추가 |
| fix | 버그 및 오류 수정 |
| design | UI 스타일링 및 CSS 작업 |
| refactor | 코드 리팩토링 (기능 변화 없음) |
| docs | 문서 수정 (README 등) |
| chore | 빌드 설정, 패키지 관리 등 |
| test | 테스트 코드 작성 및 수정 |

> 작성 예시: `feat: 메인 페이지 레이아웃 구현`

---

### 📂 Project Structure

```text
src/
├── assets/          # 이미지, 폰트 등 정적 파일
├── components/      # 공용 컴포넌트 (Button, Input 등)
├── hooks/           # 커스텀 훅
├── pages/           # 페이지 단위 컴포넌트
├── store/           # 전역 상태 관리 (Zustand 등)
├── styles/          # 글로벌 스타일 및 CSS 변수
├── types/           # TypeScript 타입 정의
└── utils/           # 공통 유틸 함수
```

---

### 👥 Role Distribution

| 이름 | 역할 | 담당 업무 |
| :--- | :--- | :--- |
| 백병재 | **FE Lead** | 메인, 카카오 로그인, 결과, api 훅 |
| 이태규 | **FE** | 마이페이지, 회원가입, 추가정보 입력, 공용 컴포넌트 |
| 조경석 | **PM** | 브랜치 병합 및 코드 검수 |

---