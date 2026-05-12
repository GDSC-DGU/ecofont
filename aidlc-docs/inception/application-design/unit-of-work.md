# Unit of Work: Eco-Font Project

## 유닛 구성 (5개)

**개발 순서**:
- Phase 1 (병렬): Unit 1a + Unit 2 + Unit 3
- Phase 2 (순차): Unit 1b (Unit 2 완료 후), Unit 4 (Unit 2·3 확정 후)

---

## Unit 1a: Frontend UI 완성

- **목적**: 실데이터 연동 없이 UI 완성도를 높이고 mock 기반으로 전체 플로우 확인
- **디렉토리**: `apps/frontend/`
- **담당**: 이정선, 류동현
- **상태**: 기존 코드 수정

### 포함 작업
- `ConversionTriggerComponent` — mock API 호출 및 로딩 오버레이 동작 확인
- `ResultDisplayComponent` — mock 잉크 절약률/탄소 저감량 데이터 연결
- `DownloadComponent` — disabled 상태 해제, mock URL로 다운로드 흐름 확인
- 에러 상태 UI 완성 (FR-6)
- 로딩 오버레이 UI 완성 (FR-7)

### 세부 태스크 (task_assignment)

| Task | 담당 | Week |
|------|------|------|
| 파일 업로드 UI (.ttf, 10MB 제한) | 이정선 | 1 |
| 콜드 스타트 로딩 UI (스피너·안내 문구) | 류동현 | 1 |
| 원본/변환 비교 미리보기 렌더링 (mock) | 이정선 | 2 |
| 잉크 절약률·탄소 저감량 대시보드 (mock) | 이정선 | 3 |
| 에러 상태 UI (변환 실패 메시지) | 이정선 | 3 |

### 완료 기준
- mock 데이터 기반으로 업로드 → 변환 중 → 결과 표시 → 다운로드 전체 UI 플로우 동작
- API 연동 없이 독립적으로 실행 가능

---

## Unit 1b: Frontend API 연동

- **목적**: Backend API 완성 후 실데이터로 교체, E2E 플로우 완성
- **디렉토리**: `apps/frontend/`
- **담당**: 이정선, 류동현
- **선행 조건**: Unit 2 (Backend) 완료
- **상태**: Unit 1a 위에 API 연동 추가

### 포함 작업
- `ConversionTriggerComponent` — 실제 `POST /convert` API 호출로 교체
- `ResultDisplayComponent` — 실제 응답 데이터(잉크 절약률, 탄소 저감량) 연결
- `DownloadComponent` — 실제 다운로드 URL 활성화
- API 에러 처리 (타임아웃, 서버 오류 → FR-6)
- TBD: API 호출 방식 (동기 REST vs 폴링) — Construction 확정

### 세부 태스크 (task_assignment)

| Task | 담당 | Week |
|------|------|------|
| 백엔드 API 연동 (POST /convert) | 이정선 | 3 |
| 잉크 절약률·탄소 저감량 실데이터 연결 | 이정선 | 3 |
| 변환된 .ttf 파일 다운로드 기능 | 류동현 | 3 |
| UI 최종 점검, 엣지 케이스 처리 | 이정선 | 4 |
| Vercel 배포 세팅 | 류동현 | 4 |
| 전체 E2E 테스트 | 류동현 | 4 |

### 완료 기준
- 실제 Backend API와 연동하여 E2E 플로우 동작
- 에러 케이스 처리 완료

---

## Unit 2: Backend / Font Processing

- **목적**: 폰트 변환 API 서버 구축
- **디렉토리**: `apps/backend/`
- **담당**: 이소은
- **상태**: 신규

### 포함 작업
- FastAPI 프로젝트 초기화
- `ConversionController` — `POST /convert` 엔드포인트
- `FontParsingService` — FontTools TTF 파싱, 글리프 벡터 추출
- `MetricsCalculationService` — 잉크 절약률(300 DPI 벡터 면적 비교), 탄소 저감량 계산
- `StorageService` — GCS 업로드, Signed URL 생성 (기본값, TBD Q3)
- `AIEngineClient` — AI Engine 호출 인터페이스 (TBD Q1: 함수 호출 vs HTTP)
- TBD: Backend 레이어 구조 (Flat vs Layered) — Construction 확정

### 세부 태스크 (task_assignment)

| Task | 담당 | Week |
|------|------|------|
| FastAPI 서버 세팅 및 GCS 연동 | 이소은 | 1 |
| .ttf 파싱 (FontTools 글리프 벡터 추출) | 이소은 | 2 |
| Docker 이미지 빌드 및 GCR 푸시 | 이소은 | 2 |
| 잉크 절약률 계산 (300 DPI 기준 벡터 면적 비교) | 이소은 | 3 |
| 탄소 저감량 계산 (절약된 잉크량 × CO2 환산 계수) | 이소은 | 3 |
| 백엔드-AI 파이프라인 통합 | 이소은 | 3 |

### 완료 기준
- `POST /convert` 엔드포인트가 TTF 파일을 받아 변환 결과 + 다운로드 URL 반환
- GCS 업로드/다운로드 동작 확인

---

## Unit 3: AI Engine

- **목적**: SSIM 기반 에코폰트 변환 엔진 구축
- **디렉토리**: `apps/ai-engine/`
- **담당**: 이우제 (OptimizationEngine), 류동현 (OCRValidationPipeline)
- **상태**: 신규

### 포함 작업
- `OptimizationEngine` — SSIM 손실 함수 기반 글리프 벡터 최적화, 변환 TTF 생성
- `OCRValidationPipeline` — 변환 전후 OCR 인식률 비교 (내부 검증 전용, 실 서비스 미노출)
  - Tesseract / EasyOCR / PaddleOCR 중 선택
- TBD: 배포 방식 (단독 Cloud Run vs Backend 통합) — Construction 확정

### 세부 태스크 (task_assignment)

| Task | 담당 | Week |
|------|------|------|
| SSIM 기반 최적화 엔진 설계 및 프로토타입 | 이우제 | 1 |
| SSIM 기반 최적화 엔진 구현 (손실 함수 최소화) | 이우제 | 2 |
| OCR 모델 조사 및 선정 (Tesseract / EasyOCR / PaddleOCR) | 류동현 | 2 |
| OCR 인식 지원 소수 민족 언어 범위 파악 | 류동현 | 2 |
| 에코폰트 외곽선 Generation 구현 | 이우제 | 3 |
| OCR 기반 가독성 검증 파이프라인 구현 | 류동현 | 3 |
| 전체 AI 파이프라인 통합 | 이우제 | 3 |
| AI 파이프라인 성능 점검, 잉크 절약률 20% 검증 | 이우제 | 4 |

### 완료 기준
- 입력 글리프 데이터 → 최적화된 글리프 데이터 변환 동작
- OCR 검증: 변환 전후 인식률 95% 이상 (모델 품질 지표)

---

## Unit 4: Infrastructure

- **목적**: GCP 리소스 프로비저닝 (Terraform IaC)
- **디렉토리**: `infra/`
- **담당**: 이소은
- **상태**: 신규
- **TBD**: Backend와 통합 여부 — Construction 확정

### 포함 작업
- Cloud Run 서비스 프로비저닝 (Backend, AI Engine — 분리/통합 TBD)
- GCS 버킷 생성 + Lifecycle 정책 (1일 자동 삭제)
- IAM 설정 (Cloud Run → GCS 접근 권한)
- Terraform provider: `hashicorp/google ~> 5.0`

### 세부 태스크 (task_assignment)

| Task | 담당 | Week |
|------|------|------|
| GCP 프로젝트 생성 및 API 활성화 | 이소은 | 1 |
| Terraform 상태 버킷 수동 생성 (`ecofont-terraform-state`) | 이소은 | 1 |
| Terraform 코드 작성 및 apply (Cloud Run + GCS) | 이소은 | 1 |
| Secret Manager 세팅 | 이소은 | 4 |
| Cloud Run 배포 최종 확인, Terraform 최종 apply | 이소은 | 4 |

### 완료 기준
- `terraform apply`로 Cloud Run + GCS 프로비저닝 성공
- GCS Lifecycle 1일 삭제 정책 적용 확인
