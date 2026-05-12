# Component Methods

> 상세 비즈니스 로직은 Construction 단계 Functional Design에서 정의됨

## Backend

### ConversionController
```python
POST /convert
  input:  file: UploadFile (TTF, max 10MB)
  output: ConversionResult
    - ink_saving_rate: float  # 잉크 절약률 (%)
    - carbon_saving: float    # 탄소 저감량 (g)
    - download_url: str       # GCS 다운로드 URL
    - error: str | None
```

### FontParsingService
```python
def parse_glyphs(ttf_bytes: bytes) -> GlyphData
  # FontTools로 TTF 파싱, 글리프 벡터 추출
  output: GlyphData (글리프 이름, 벡터 좌표 목록)

def calculate_ink_area(glyph_data: GlyphData) -> float
  # 300 DPI 기준 벡터 면적 계산
```

### MetricsCalculationService
```python
def calculate_ink_saving_rate(original: float, optimized: float) -> float
  # (original - optimized) / original * 100

def calculate_carbon_saving(ink_saving_ml: float) -> float
  # ink_saving_ml × CO2 환산 계수 (TBD: 논문 근거 수치 확정 필요)
```

### StorageService
```python
def upload_ttf(file_bytes: bytes, filename: str) -> str
  # GCS 업로드, 저장 경로 반환
  # TBD: 파일명 중복 처리 (UUID vs 덮어쓰기)

def generate_download_url(gcs_path: str) -> str
  # Signed URL 생성 (기본값) 또는 스트리밍 엔드포인트 반환
  # TBD: Q3 결정 후 확정
```

### AIEngineClient
```python
def optimize_font(glyph_data: GlyphData) -> OptimizedGlyphData
  # SSIM 최적화 엔진 호출
  # TBD: 함수 직접 호출 vs HTTP 요청 — Q1 결정 후 확정
```

---

## AI Engine

### OptimizationEngine
```python
def optimize(glyph_data: GlyphData) -> OptimizedGlyphData
  # SSIM 손실 함수 최소화, 글리프 구조 최적화

def generate_ttf(optimized: OptimizedGlyphData, original_ttf: bytes) -> bytes
  # 최적화된 글리프로 새 TTF 파일 생성
```

### OCRValidationPipeline (내부 전용)
```python
def validate(original_ttf: bytes, optimized_ttf: bytes) -> float
  # OCR 인식률 비교 (변환 전후), 모델 검증용
  # return: OCR 인식률 (%)
```

---

## Frontend

### ConversionTriggerComponent
```typescript
handleConvert(file: File): Promise<ConversionResult>
  // Backend POST /convert 호출
  // TBD: 동기 대기 vs 폴링 — Q2 결정 후 확정

handleError(error: Error): void
  // 에러 메시지 표시 (재시도 버튼 없음)
```

### DownloadComponent
```typescript
handleDownload(downloadUrl: string): void
  // Signed URL 또는 스트리밍 엔드포인트로 파일 다운로드
  // TBD: Q3 결정 후 확정
```
