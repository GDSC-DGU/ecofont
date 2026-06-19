# Frontend Components — Unit 1a

## 신규 생성

### `src/mocks/convertFont.ts`
- **역할**: 클라이언트 측 mock 변환 함수
- **동작**: 1.5초 지연 후 원본 File을 Blob으로 반환
- **Unit 1b 교체 포인트**: 이 파일을 실 API 호출로 교체

### `src/context/ConversionContext.tsx`
- **역할**: 변환 결과 전역 상태 (ConversionResult)
- **제공**: `result`, `setResult`
- **소비**: `useConvertFont`, `FontComparison`, `DownloadResult`, `ResultPage`

### `src/app/providers.tsx`
- **역할**: Server Component인 layout.tsx에서 Client Context를 감싸는 래퍼
- **구조**: `ConversionProvider` 포함

### `src/hooks/useConvertFont.ts`
- **역할**: 변환 흐름 전체 관리
- **동작**: `convertFont(file)` 호출 → Context 저장 → `/result` 이동
- **상태**: `isLoading`, `error`

### `src/hooks/useFontFaceLoader.ts`
- **역할**: Blob/File → FontFace 등록 → 로딩 완료 여부 반환
- **인터페이스**: `useFontFaceLoader(name: string, source: Blob | null): boolean`
- **정리**: 언마운트 시 `document.fonts.delete()` + `URL.revokeObjectURL()`

---

## 기존 수정

### `src/app/layout.tsx`
- `<Providers>` 로 `<Header />` + `{children}` 감싸기

### `src/components/upload/FileUpload/index.tsx`
- `StartConversionButton`에 `file={selectedFile}` prop 추가

### `src/components/upload/StartConversionButton/index.tsx`
- Props: `file: File | null` 추가 (기존 `disabled` 제거)
- `useConvertFont` 훅 사용: 클릭 시 `convert(file)` 호출
- 에러 메시지 인라인 표시 (버튼 아래)
- `data-testid="start-conversion-button"` 추가

### `src/components/result/FontComparison/index.tsx`
- `"use client"` 추가
- `useConversion()` → `result` 읽기
- `useFontFaceLoader('eco-original', result.originalFile)` 호출
- `useFontFaceLoader('eco-converted', result.convertedBlob)` 호출
- `previewText` 상태 (`useState`, 초기값: `copy.result.comparison.sample`)
- **레이아웃 구조**:
  - 상단: `PreviewPanel` 두 개 나란히 (왼쪽: 원본 폰트, 오른쪽: 변환 폰트) — 동일한 `previewText` 렌더링
  - 하단: `<input>` 또는 `<textarea>` — 입력 시 `previewText` 업데이트 → 양쪽 패널 실시간 반영
- `PreviewPanel`에 `fontFamily` 인라인 스타일 적용
- `data-testid="font-comparison-original"`, `"font-comparison-converted"`, `"font-comparison-input"` 추가

### `src/components/result/DownloadResult/index.tsx`
- `"use client"` 추가
- `useConversion()` → `result` 읽기
- `result` 있을 때 버튼 활성화, 클릭 시 Blob URL 다운로드
- `data-testid="download-result-button"` 추가

### `src/app/result/page.tsx`
- `"use client"` 추가
- `useConversion()` → `result == null` 이면 `router.push('/')` 리다이렉트

---

## Props 변경 요약

| 컴포넌트 | 변경 전 | 변경 후 |
|---------|---------|---------|
| `StartConversionButton` | `disabled: boolean` | `file: File \| null` |
| `FileUpload` → Button | `disabled={!selectedFile}` | `file={selectedFile}` |
