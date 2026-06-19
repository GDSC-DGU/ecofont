# Build and Test Summary — Unit 1b

## Build 결과

- **빌드 도구**: Next.js 16.2.4 (`pnpm build`)
- **TypeScript**: `tsc --noEmit` 타입 에러 0
- **빌드 출력**: `Route (app) — /, /result 모두 Static 생성 성공`
- **상태**: 빌드 통과 완료

## 변경된 파일 목록

| 파일 | 변경 유형 |
|------|---------|
| `src/constants/copy.ts` | 수정 (stages 추가) |
| `src/mocks/convertFont.ts` | 교체 (폴링 시뮬레이션) |
| `src/context/ConversionContext.tsx` | 수정 (타입 확장) |
| `src/hooks/useConvertFont.ts` | 교체 (폴링 루프) |
| `src/components/loading/LoadingPanel/index.tsx` | 수정 (stage prop) |
| `src/components/loading/LoadingOverlay/index.tsx` | 수정 (stage prop) |
| `src/components/upload/StartConversionButton/index.tsx` | 수정 (stage 전달) |
| `src/components/result/DownloadResult/index.tsx` | 수정 (downloadUrl 사용) |
| `src/components/result/ResultMetrics/index.tsx` | 수정 (실제 지표 표시) |

## Week 3 수동 검증 체크리스트

`pnpm dev` 실행 후 브라우저에서 확인:

### 폴링 흐름

- [ ] TTF 파일 업로드 → "잉크 다이어트 시작" 클릭
- [ ] LoadingOverlay 표시 → 단계별 메시지 순서 확인
  - "파일을 업로드하는 중입니다" → (1s)
  - "폰트 구조를 분석하는 중입니다" → (2.5s)
  - "잉크 절약 최적화를 적용하는 중입니다" → (2.5s)
  - "결과를 마무리하는 중입니다" → (2.5s)
- [ ] 약 7~8초 후 `/result` 자동 이동

### 결과 페이지

- [ ] `ResultMetrics`: 잉크 절약률 "23.4%", 탄소 절감량 "12.5g" 표시
- [ ] `FontComparison`: 원본/변환 폰트 미리보기 정상
- [ ] 입력 박스 타이핑 → 양쪽 패널 실시간 반영
- [ ] "다이어트 TTF 다운로드" 클릭 → 파일 다운로드 (`*_eco.ttf`)
- [ ] `/result` 직접 접속 시 `/`로 리다이렉트

### 에러 케이스

- [ ] 변환 실패 시 (mock pollJob에서 failed 반환하도록 임시 수정 후 확인) → 에러 메시지 표시, 재시도 가능

## 실 API 연결 시 교체 범위 (Unit 1b 실 연결)

| 파일 | 변경 내용 |
|------|---------|
| `src/mocks/convertFont.ts` | `startConversion` → `fetch(POST /convert)`, `pollJob` → `fetch(GET /jobs/{id})` |
| `src/hooks/useConvertFont.ts` | import path `@/mocks/convertFont` → `@/api/convertFont` 1줄 |
| `.env.local` | `NEXT_PUBLIC_API_URL=https://<cloud-run-url>` 추가 |
