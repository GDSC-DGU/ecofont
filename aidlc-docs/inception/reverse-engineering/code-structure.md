# Code Structure

## Build System
- **Type**: pnpm workspace (모노레포)
- **Configuration**: 루트 `pnpm-workspace.yaml`, 각 앱별 `package.json`

## Project Structure

```
ecofont/                          # 모노레포 루트
├── apps/
│   └── frontend/                 # Next.js 16 앱 (구현 완료)
│       └── src/
│           ├── app/              # App Router 페이지
│           │   ├── page.tsx      # 메인 (업로드) 페이지
│           │   └── result/
│           │       └── page.tsx  # 결과 페이지
│           ├── components/
│           │   ├── upload/       # 업로드 관련 컴포넌트
│           │   ├── result/       # 결과 관련 컴포넌트
│           │   ├── loading/      # 로딩 관련 컴포넌트
│           │   └── common/       # 공통 컴포넌트
│           ├── hooks/            # 커스텀 훅
│           ├── constants/        # 상수 (UI 텍스트)
│           └── styles/           # 전역 스타일
├── docs/                         # 프로젝트 문서
└── aidlc-docs/                   # AI-DLC 산출물
```

## Existing Files Inventory

### Pages
- `apps/frontend/src/app/page.tsx` - 메인 업로드 페이지 (FileUpload + UploadGuide 렌더링)
- `apps/frontend/src/app/result/page.tsx` - 결과 페이지 (ResultMetrics + FontComparison + DownloadResult)

### Upload Components
- `apps/frontend/src/components/upload/FileUpload/index.tsx` - TTF 파일 업로드 UI (드래그앤드롭, 파일 선택, 에러 표시)
- `apps/frontend/src/components/upload/StartConversionButton/index.tsx` - 변환 시작 버튼 (LoadingOverlay 트리거)
- `apps/frontend/src/components/upload/UploadGuide/index.tsx` - 업로드 3단계 가이드 UI

### Result Components
- `apps/frontend/src/components/result/ResultMetrics/index.tsx` - 잉크 절약률/탄소 저감량 수치 표시 (현재 하드코딩)
- `apps/frontend/src/components/result/FontComparison/index.tsx` - 원본/변환 폰트 미리보기 비교
- `apps/frontend/src/components/result/DownloadResult/index.tsx` - 다이어트 TTF 다운로드 버튼 (현재 disabled)

### Loading Components
- `apps/frontend/src/components/loading/LoadingOverlay/index.tsx` - 전체 화면 로딩 오버레이
- `apps/frontend/src/components/loading/LoadingPanel/index.tsx` - 로딩 패널 UI

### Common Components
- `apps/frontend/src/components/common/Header/index.tsx` - 공통 헤더

### Hooks
- `apps/frontend/src/hooks/useTtfFileUpload.ts` - TTF 파일 업로드 상태/검증 로직 (단일 파일, TTF 확장자 검증, drag&drop 지원)

### Constants
- `apps/frontend/src/constants/copy.ts` - 모든 UI 텍스트 상수 (브랜드명, 업로드/결과 페이지 문구)

### Styles
- `apps/frontend/src/styles/global.css.ts` - 전역 스타일 (vanilla-extract)
- `apps/frontend/src/styles/theme.css.ts` - 테마 토큰

## Design Patterns

### CSS-in-TS (vanilla-extract)
- **Location**: 모든 컴포넌트 (`*.css.ts` 파일)
- **Purpose**: 타입 안전한 zero-runtime CSS
- **Implementation**: 각 컴포넌트 디렉토리에 `ComponentName.css.ts` 파일 병치

### Custom Hook 패턴
- **Location**: `src/hooks/useTtfFileUpload.ts`
- **Purpose**: UI 컴포넌트에서 파일 업로드 상태/검증 로직 분리
- **Implementation**: React useState + useRef 조합

### 상수 중앙화 (copy.ts)
- **Location**: `src/constants/copy.ts`
- **Purpose**: UI 텍스트를 단일 파일에서 관리 (i18n 준비)

## Critical Dependencies

### next@16.2.4
- **Usage**: App Router, SSR/SSG
- **Purpose**: 메인 프레임워크

### @vanilla-extract/css@1.17.4
- **Usage**: 모든 컴포넌트 스타일
- **Purpose**: zero-runtime CSS-in-TS

### react@19.2.4
- **Usage**: 전체 UI
- **Purpose**: UI 라이브러리
