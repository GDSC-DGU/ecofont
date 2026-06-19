# Unit 1a Code Generation Plan

**Unit**: Unit 1a — Frontend UI 완성 (Week 2: 원본/변환 비교 미리보기 mock 연결)  
**Workspace Root**: `apps/frontend/`  
**프로젝트 타입**: Brownfield (Next.js + TypeScript + vanilla-extract)  
**총 스텝**: 12

---

## 컨텍스트

- **구현 범위**: mock 변환 함수 + ConversionContext + 폰트 비교 UI (인터랙티브 input 포함)
- **선행 조건**: Functional Design 승인 완료
- **의존성**: 외부 패키지 추가 없음 (브라우저 내장 FontFace API 사용)

---

## 스텝 목록

### Step 1: `src/constants/copy.ts` 수정
- [x] `upload.conversionError` 문구 추가 (변환 실패 인라인 메시지)
- 파일: `apps/frontend/src/constants/copy.ts` (기존 수정)

### Step 2: `src/mocks/convertFont.ts` 생성
- [x] `convertFont(file: File): Promise<Blob>` 구현
- [x] 1.5초 지연 후 원본 File을 Blob으로 반환
- 파일: `apps/frontend/src/mocks/convertFont.ts` (신규)

### Step 3: `src/context/ConversionContext.tsx` 생성
- [x] `ConversionResult` 타입 정의
- [x] `ConversionProvider` 컴포넌트 구현
- [x] `useConversion()` 훅 구현
- 파일: `apps/frontend/src/context/ConversionContext.tsx` (신규)

### Step 4: `src/app/providers.tsx` 생성
- [x] `ConversionProvider`를 감싸는 `Providers` 클라이언트 컴포넌트 구현
- 파일: `apps/frontend/src/app/providers.tsx` (신규)

### Step 5: `src/hooks/useFontFaceLoader.ts` 생성
- [x] `useFontFaceLoader(name, source): boolean` 구현
- [x] FontFace 등록, 언마운트 시 해제 (document.fonts.delete + revokeObjectURL)
- 파일: `apps/frontend/src/hooks/useFontFaceLoader.ts` (신규)

### Step 6: `src/hooks/useConvertFont.ts` 생성
- [x] `convertFont(file)` 호출 → ConversionContext 저장 → `/result` 이동
- [x] `isLoading`, `error` 상태 관리
- 파일: `apps/frontend/src/hooks/useConvertFont.ts` (신규)

### Step 7: `src/app/layout.tsx` 수정
- [x] `<Providers>` 로 `<Header />` + `{children}` 감싸기
- 파일: `apps/frontend/src/app/layout.tsx` (기존 수정)

### Step 8: `src/components/upload/StartConversionButton/index.tsx` 수정
- [x] Props: `disabled` → `file: File | null`
- [x] `useConvertFont` 훅 연결, 클릭 시 `convert(file)` 호출
- [x] 변환 중 버튼 disabled 처리
- [x] 에러 메시지 버튼 아래 인라인 표시
- [x] `data-testid="start-conversion-button"` 추가
- 파일: `apps/frontend/src/components/upload/StartConversionButton/index.tsx` (기존 수정)

### Step 9: `src/components/upload/FileUpload/index.tsx` 수정
- [x] `StartConversionButton`에 `file={selectedFile}` prop 전달 (기존 `disabled` 제거)
- 파일: `apps/frontend/src/components/upload/FileUpload/index.tsx` (기존 수정)

### Step 10: `src/components/result/FontComparison/index.tsx` 수정
- [x] `"use client"` 추가
- [x] `useConversion()` → `result` 읽기
- [x] `useFontFaceLoader` 로 원본/변환 폰트 등록
- [x] `previewText` 상태 (초기값: `copy.result.comparison.sample`)
- [x] 상단: 두 PreviewPanel 나란히, `previewText`를 각자 폰트로 렌더링
  - 빈 문자열일 때 패널에 샘플 문구를 회색(placeholder 색상)으로 표시
- [x] 하단: `<input>` — 입력 시 `previewText` 실시간 업데이트
- [x] `data-testid` 추가 (`font-comparison-original`, `font-comparison-converted`, `font-comparison-input`)
- 파일: `apps/frontend/src/components/result/FontComparison/index.tsx` (기존 수정)

### Step 11: `src/components/result/DownloadResult/index.tsx` 수정
- [x] `"use client"` 추가
- [x] `useConversion()` → `result` 읽기, convertedBlob으로 다운로드 활성화
- [x] `data-testid="download-result-button"` 추가
- 파일: `apps/frontend/src/components/result/DownloadResult/index.tsx` (기존 수정)

### Step 12: `src/app/result/page.tsx` 수정
- [x] `"use client"` 추가
- [x] `result == null` 이면 `router.push('/')` 리다이렉트
- 파일: `apps/frontend/src/app/result/page.tsx` (기존 수정)

---

## 파일 변경 요약

| # | 파일 | 작업 |
|---|------|------|
| 1 | `src/constants/copy.ts` | 수정 |
| 2 | `src/mocks/convertFont.ts` | 신규 |
| 3 | `src/context/ConversionContext.tsx` | 신규 |
| 4 | `src/app/providers.tsx` | 신규 |
| 5 | `src/hooks/useFontFaceLoader.ts` | 신규 |
| 6 | `src/hooks/useConvertFont.ts` | 신규 |
| 7 | `src/app/layout.tsx` | 수정 |
| 8 | `src/components/upload/StartConversionButton/index.tsx` | 수정 |
| 9 | `src/components/upload/FileUpload/index.tsx` | 수정 |
| 10 | `src/components/result/FontComparison/index.tsx` | 수정 |
| 11 | `src/components/result/DownloadResult/index.tsx` | 수정 |
| 12 | `src/app/result/page.tsx` | 수정 |
