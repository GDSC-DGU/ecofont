# Requirements Document: Eco-Font Project

## Intent Analysis

- **User Request**: TTF 폰트를 업로드하면 AI가 잉크 절약형 에코폰트로 변환하는 웹 플랫폼 MVP 구축
- **Request Type**: New Project (Brownfield — 프론트엔드 부분 구현 완료, 백엔드/AI 미구현)
- **Scope Estimate**: System-wide (Frontend + Backend + AI Engine + Infrastructure)
- **Complexity Estimate**: Complex (멀티 컴포넌트, AI 알고리즘, 다국어 지원, GCP 인프라)

---

## Functional Requirements

### FR-1: 폰트 업로드
- 사용자는 `.ttf` 파일을 드래그앤드롭 또는 파일 선택으로 업로드할 수 있다
- 한 번에 1개 파일만 허용
- `.ttf` 확장자 외 파일은 에러 메시지 표시 후 거부
- 최대 파일 크기: 10MB

### FR-2: 에코폰트 변환
- 업로드된 TTF 파일을 FontTools로 글리프 벡터 추출
- SSIM 기반 손실 함수로 잉크 절약형 구조로 최적화
- 변환된 결과를 TTF 파일로 생성하여 GCS에 저장 (1일 후 자동 삭제)

### FR-3: 잉크 절약률 / 탄소 저감량 계산
- 300 DPI 기준 원본 대비 변환 글리프 벡터 면적 비교로 잉크 절약률 산출
- 절감된 잉크량 × CO2 환산 계수로 탄소 저감량 산출
- 잉크 절약률 20% 미달이어도 변환 결과를 사용자에게 반환 (거부하지 않음)

### FR-4: OCR 가독성 검증 (내부 검증 전용)
- OCR 파이프라인(Tesseract / EasyOCR / PaddleOCR)은 **AI 모델 성능 검증 도구**로만 사용
- 실 서비스 사용자 플로우에서 OCR 검증을 수행하지 않음
- 변환 전후 OCR 인식률 95% 기준은 모델 품질 지표로만 활용

### FR-5: 결과 화면
- 잉크 절약률, 탄소 저감량 수치 표시
- 원본 / 변환 폰트 나란히 미리보기 비교
- 변환된 에코폰트 TTF 다운로드 버튼 제공

### FR-6: 에러 처리
- 변환 실패 시 (서버 오류, 타임아웃 등) 에러 메시지만 화면에 표시
- 재시도 버튼 없음 — 사용자가 직접 다시 업로드

### FR-7: 로딩 UI
- 변환 중 콜드 스타트 안내 포함 로딩 오버레이 표시

---

## Non-Functional Requirements

### NFR-1: 성능
- 백엔드 콜드 스타트 허용 (Cloud Run 최소 인스턴스 0) — 로딩 UI로 안내
- 단일 TTF 파일 변환 시간: 명시적 SLA 없음 (MVP)

### NFR-2: 보안
- Security Baseline Extension: **비활성화** (MVP 수준, PoC 적합)
- GCS 저장 파일 1일 후 자동 삭제 (저작권 보호)
- 파일명 중복 처리 방식: **미결정** (UUID vs 덮어쓰기 — 구현 시 결정)

### NFR-3: 확장성
- 단일 사용자 기준 MVP, 동시 처리량 요구사항 없음

### NFR-4: 테스트
- Property-Based Testing Extension: **비활성화** (MVP 일정 우선)
- 테스트 코드 미작성 (기존 결정 유지)

### NFR-5: 배포
- Frontend: Vercel
- Backend / AI 엔진: GCP Cloud Run (컨테이너)
- IaC: Terraform (hashicorp/google ~> 5.0)

### NFR-6: API 호출 방식
- Frontend ↔ Backend API 방식: **미결정** (동기 REST / 비동기 폴링 / WebSocket 중 구현 시 결정)

---

## Business Constraints

- Google Cloud 기술 최소 1개 이상 사용 (Cloud Run + GCS로 충족)
- 무료 티어 및 오픈소스 우선
- 1달 이내 MVP 릴리즈
- 팀 구성: 대학생 4인

---

## Success Metrics

| 지표 | 목표 |
|------|------|
| 잉크 절약률 | 평균 20% 이상 (미달 시에도 결과 반환) |
| OCR 인식률 | 95% 이상 (모델 검증 지표, 실 서비스 미적용) |
| TTF 업로드 → 다운로드 | E2E 플로우 동작 |

---

## 미결정 사항 (구현 단계에서 결정)

| 항목 | 비고 |
|------|------|
| GCS 파일명 중복 처리 | UUID 부여 vs 덮어쓰기 |
| Frontend ↔ Backend API 방식 | 동기 REST / 비동기 폴링 / WebSocket |
