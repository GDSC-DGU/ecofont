# Services

## ConversionService (Backend 핵심 오케스트레이션)

**Purpose**: 폰트 변환 전체 플로우 조율

**Flow**:
```
1. TTF 파일 수신
2. GCS에 원본 파일 업로드 (StorageService)
3. FontParsingService로 글리프 벡터 추출
4. AIEngineClient로 SSIM 최적화 실행
5. 최적화된 글리프로 TTF 재생성
6. GCS에 변환 파일 업로드 (StorageService)
7. MetricsCalculationService로 잉크 절약률/탄소 저감량 계산
8. 다운로드 URL + 수치 반환
```

**TBD**:
- AI Engine 호출 방식 (함수 호출 vs HTTP) — Q1 보류
- 동기 처리 vs 비동기 Job 방식 — Q2 보류

---

## StorageService (GCS 파일 관리)

**Purpose**: GCS 업로드/다운로드 URL 생성 중앙화

**책임**:
- 원본 TTF 업로드
- 변환 TTF 업로드
- Signed URL 생성 (기본값, TBD Q3)
- GCS Lifecycle: 1일 자동 삭제 (Terraform 설정)

---

## (선택) JobQueueService — Q2 결정 후

**Purpose**: 비동기 폴링 방식 선택 시 Job 상태 관리

**책임**:
- Job 생성 및 ID 발급
- 상태 업데이트 (pending → processing → done/failed)
- 결과 저장 및 조회

> Q2에서 A(동기) 선택 시 이 서비스는 불필요
