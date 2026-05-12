# Component Dependency

## 의존 관계 매트릭스

| 컴포넌트 | 의존 대상 | 통신 방식 |
|----------|-----------|-----------|
| Frontend | Backend ConversionController | REST API (TBD: 동기 vs 폴링) |
| ConversionController | ConversionService | 직접 호출 |
| ConversionService | FontParsingService | 직접 호출 |
| ConversionService | AIEngineClient | TBD (직접 vs HTTP) |
| ConversionService | MetricsCalculationService | 직접 호출 |
| ConversionService | StorageService | 직접 호출 |
| AIEngineClient | OptimizationEngine | TBD (Q1 결정 후) |
| StorageService | GCS | GCP SDK |
| Infrastructure | Cloud Run | Terraform |
| Infrastructure | GCS | Terraform |

## 데이터 흐름

```
사용자
  |-- [TTF 파일] --> Frontend
                      |-- [POST /convert + TTF] --> Backend
                                                      |-- [TTF bytes] --> GCS (원본 저장)
                                                      |-- [GlyphData] --> AI Engine
                                                                            |-- [OptimizedGlyphData] --> Backend
                                                      |-- [변환 TTF] --> GCS (변환본 저장)
                                                      |-- [결과] --> Frontend
  <-- [잉크절약률, 탄소저감량, 다운로드URL] -----------|
  |-- [다운로드] --> GCS (Signed URL 직접 or Backend 스트리밍, TBD)
```

## 미결정 의존 관계 (TBD)

| 항목 | 옵션 A | 옵션 B | 결정 시점 |
|------|--------|--------|-----------|
| Backend ↔ AI Engine | 같은 프로세스 (함수 호출) | 별도 Cloud Run (HTTP) | Construction |
| Frontend ↔ Backend | 동기 REST | 비동기 폴링 | Construction |
| 다운로드 | Signed URL | Backend 스트리밍 | Construction |
| Backend 구조 | Flat | Layered | Construction |
