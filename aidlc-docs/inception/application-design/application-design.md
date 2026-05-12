# Application Design: Eco-Font Project

## 시스템 구성 요약

```
[Frontend — Vercel]          [Backend — Cloud Run]        [AI Engine — Cloud Run/통합 TBD]
  FileUploadComponent    -->   ConversionController    -->   OptimizationEngine (SSIM)
  ConversionTrigger      -->   ConversionService       -->   OCRValidationPipeline (내부)
  ResultDisplayComponent <--   FontParsingService
  DownloadComponent      <--   MetricsCalculationService
                               StorageService          <-->  GCS (Cloud Storage)
                               AIEngineClient          -->   [AI Engine]

[Infrastructure — Terraform]
  Cloud Run (Backend/AI) + GCS 프로비저닝
```

## 컴포넌트 요약

| 컴포넌트 | 위치 | 상태 | 담당 |
|----------|------|------|------|
| FileUploadComponent | Frontend | 완료 | 이정선 |
| ConversionTriggerComponent | Frontend | API 연동 필요 | 이정선/류동현 |
| ResultDisplayComponent | Frontend | 실데이터 연동 필요 | 이정선 |
| DownloadComponent | Frontend | 활성화 필요 | 류동현 |
| ConversionController | Backend | 신규 | 이소은 |
| FontParsingService | Backend | 신규 | 이소은 |
| MetricsCalculationService | Backend | 신규 | 이소은 |
| StorageService | Backend | 신규 | 이소은 |
| AIEngineClient | Backend | 신규 | 이소은 |
| OptimizationEngine | AI Engine | 신규 | 이우제 |
| OCRValidationPipeline | AI Engine | 신규 (내부 전용) | 류동현 |
| CloudRunProvisioner | Infrastructure | 신규 | 이소은 |
| GCSProvisioner | Infrastructure | 신규 | 이소은 |

## 미결정 사항 (Construction 단계 확정)

| # | 항목 | 영향 범위 |
|---|------|-----------|
| Q1 | Backend/AI Engine 배포 분리 여부 | Infrastructure, AIEngineClient |
| Q2 | API 호출 방식 (동기 vs 폴링) | ConversionTrigger, ConversionController |
| Q3 | 다운로드 방식 (Signed URL vs 스트리밍) | StorageService, DownloadComponent |
| Q4 | Backend 레이어 구조 (Flat vs Layered) | Backend 전체 구조 |

## 상세 문서 참조
- [components.md](components.md)
- [component-methods.md](component-methods.md)
- [services.md](services.md)
- [component-dependency.md](component-dependency.md)
