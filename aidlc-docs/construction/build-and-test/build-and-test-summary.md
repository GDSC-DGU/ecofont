# Build and Test Summary — Unit 1a

## Build 정보

- **빌드 도구**: Next.js 16.2.4 (`pnpm build`)
- **타입 검사**: TypeScript 5 (`tsc --noEmit`)
- **빌드 결과물**: `apps/frontend/.next/`
- **상태**: 지침 생성 완료 — 실행 필요

## 테스트 전략 요약

| 테스트 유형 | 방식 | 상태 |
|-----------|------|------|
| 단위 테스트 | 수동 검증 항목 명세 (자동화 프레임워크 미설정) | 수동 실행 필요 |
| 통합 테스트 | 브라우저 수동 시나리오 3개 | 수동 실행 필요 |
| 성능 테스트 | N/A (mock UI, 네트워크 없음) | — |
| E2E 테스트 | Playwright 명세 작성 완료 (실행 환경 미설정) | 향후 적용 |

## Week 2 완료 기준 체크리스트

- [ ] `pnpm build` 성공 (타입 에러 없음)
- [ ] `pnpm dev` 후 `/` 페이지 정상 렌더링
- [ ] `.ttf` 파일 업로드 → 1.5초 후 `/result` 이동
- [ ] `FontComparison` 패널에 업로드한 폰트로 텍스트 렌더링
- [ ] 입력 박스 타이핑 → 양쪽 패널 실시간 반영
- [ ] 빈 입력 시 회색 placeholder 텍스트 표시
- [ ] "다이어트 TTF 다운로드" 버튼 활성화 및 파일 다운로드
- [ ] `/result` 직접 접속 시 `/`로 리다이렉트

## 생성된 파일 목록

- `build-instructions.md`
- `unit-test-instructions.md`
- `integration-test-instructions.md`
- `build-and-test-summary.md`

## 다음 단계

Unit 1a 완료 후 나머지 유닛(Unit 1b, 2, 3, 4)의 Construction Phase 진행.
Unit 2(Backend) 완료 이후 Unit 1b(Frontend API 연동)에서 mock → 실 API 교체 예정.
