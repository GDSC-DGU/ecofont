# Build Instructions — Unit 1a (Frontend)

## Prerequisites

- **Runtime**: Node.js 18+
- **Package Manager**: pnpm (workspace 루트 기준)
- **Framework**: Next.js 16.2.4 + TypeScript 5 + vanilla-extract
- **환경변수**: 현재 Unit 1a는 mock 함수만 사용하므로 외부 환경변수 불필요

## Build Steps

### 1. 의존성 설치

```bash
# 프로젝트 루트에서 실행
cd /path/to/ecofont
pnpm install
```

### 2. 타입 검사

```bash
cd apps/frontend
pnpm exec tsc --noEmit
```

### 3. 린트 검사

```bash
cd apps/frontend
pnpm lint
```

### 4. 프로덕션 빌드

```bash
cd apps/frontend
pnpm build
```

### 5. 빌드 성공 확인

- **예상 출력**: `Route (app)` 테이블에 `/`, `/result` 경로 표시
- **빌드 결과물**: `apps/frontend/.next/`
- **허용되는 경고**: vanilla-extract CSS 관련 경고는 무시 가능

## 로컬 개발 서버 실행

```bash
cd apps/frontend
pnpm dev
# http://localhost:3000 접속
```

## 트러블슈팅

### 타입 에러: `ConversionContext` 관련
- `src/context/ConversionContext.tsx`가 정상 생성됐는지 확인
- `useConversion()`이 `ConversionProvider` 내부에서 사용되는지 확인

### vanilla-extract 빌드 에러
- `next.config.ts`에 `@vanilla-extract/next-plugin` 설정 확인
- `.css.ts` 파일에 런타임 값(변수) 직접 사용 여부 점검

### FontFace API 에러 (빌드 시 SSR 환경)
- `useFontFaceLoader`는 `"use client"` 훅이므로 서버에서 실행되지 않음
- `FontComparison` 컴포넌트에 `"use client"` 지시어 확인
