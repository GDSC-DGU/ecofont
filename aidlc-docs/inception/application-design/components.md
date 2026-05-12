# Components

## Frontend (apps/frontend) — 기존 구현 + API 연동 완성

### FileUploadComponent
- **Purpose**: TTF 파일 선택 및 업로드 UI
- **Responsibilities**: 파일 검증 (TTF, 단일 파일), drag&drop, 에러 표시
- **Status**: 구현 완료

### ConversionTriggerComponent
- **Purpose**: 변환 시작 요청 및 로딩 상태 관리
- **Responsibilities**: Backend API 호출, 로딩 오버레이 표시, 에러 처리
- **Status**: 부분 구현 (API 연동 필요)
- **TBD**: API 호출 방식 (동기 REST vs 폴링) — Q2 보류

### ResultDisplayComponent
- **Purpose**: 변환 결과 표시
- **Responsibilities**: 잉크 절약률/탄소 저감량 수치 표시, 원본/변환 폰트 비교 미리보기
- **Status**: 구현 완료 (하드코딩 → 실데이터 연동 필요)

### DownloadComponent
- **Purpose**: 변환된 TTF 파일 다운로드
- **Responsibilities**: 다운로드 URL 수신 및 파일 다운로드 트리거
- **Status**: 구현 완료 (disabled → 활성화 필요)
- **TBD**: 다운로드 방식 (Signed URL vs 스트리밍) — Q3 보류

---

## Backend (apps/backend) — 신규

### ConversionController
- **Purpose**: 폰트 변환 요청 수신 및 응답
- **Responsibilities**: POST /convert 엔드포인트, 요청 검증, 응답 반환
- **TBD**: Layered vs Flat 구조 — Q4 보류 (MVP 기본값: Flat)

### FontParsingService
- **Purpose**: TTF 파일에서 글리프 벡터 추출
- **Responsibilities**: FontTools를 사용한 TTF 파싱, 글리프 데이터 추출

### MetricsCalculationService
- **Purpose**: 잉크 절약률 및 탄소 저감량 계산
- **Responsibilities**: 300 DPI 기준 벡터 면적 비교, CO2 환산 계수 적용

### StorageService
- **Purpose**: GCS 파일 업로드/다운로드 관리
- **Responsibilities**: TTF 파일 GCS 저장, 다운로드 URL 생성 (Signed URL 기본값)

### AIEngineClient
- **Purpose**: AI 엔진 호출 인터페이스
- **Responsibilities**: SSIM 최적화 엔진 요청/응답 처리
- **TBD**: 같은 프로세스 내 호출 vs HTTP 클라이언트 — Q1 보류

---

## AI Engine (apps/ai-engine) — 신규

### OptimizationEngine
- **Purpose**: SSIM 기반 에코폰트 변환 핵심 알고리즘
- **Responsibilities**: 글리프 벡터 최적화, 손실 함수 최소화, 변환 TTF 생성
- **담당**: 이우제

### OCRValidationPipeline
- **Purpose**: 변환 모델 성능 검증 도구 (내부 전용, 실 서비스 미사용)
- **Responsibilities**: 변환 전후 OCR 인식률 비교, 모델 품질 지표 산출
- **담당**: 류동현

---

## Infrastructure (Terraform) — 신규

### CloudRunProvisioner
- **Purpose**: GCP Cloud Run 서비스 프로비저닝
- **Responsibilities**: Backend/AI Engine 컨테이너 배포 환경 구성
- **TBD**: 통합 vs 분리 Cloud Run — Q1 보류

### GCSProvisioner
- **Purpose**: GCP Cloud Storage 버킷 프로비저닝
- **Responsibilities**: TTF 파일 저장소 생성, Lifecycle 정책 설정 (1일 자동 삭제)
