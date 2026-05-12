# Component Inventory

## Application Packages

| 패키지 | 상태 | 설명 |
|--------|------|------|
| apps/frontend | 구현 중 | Next.js 16 웹 프론트엔드 |
| apps/backend | 미구현 | FastAPI 백엔드 + 폰트 처리 |
| apps/ai-engine | 미구현 | SSIM 최적화 엔진 + OCR 검증 파이프라인 |

## Infrastructure Packages

| 패키지 | 도구 | 설명 |
|--------|------|------|
| infrastructure/ (예정) | Terraform | GCP Cloud Run, GCS 프로비저닝 |

## Frontend Component Inventory

| 컴포넌트 | 위치 | 상태 |
|----------|------|------|
| FileUpload | upload/FileUpload | 완료 |
| StartConversionButton | upload/StartConversionButton | 완료 (API 미연결) |
| UploadGuide | upload/UploadGuide | 완료 |
| ResultMetrics | result/ResultMetrics | 완료 (하드코딩) |
| FontComparison | result/FontComparison | 완료 (하드코딩) |
| DownloadResult | result/DownloadResult | 완료 (disabled) |
| LoadingOverlay | loading/LoadingOverlay | 완료 |
| LoadingPanel | loading/LoadingPanel | 완료 |
| Header | common/Header | 완료 |

## Total Count
- **Total Packages**: 3 (frontend 구현, backend/AI 미구현)
- **Application**: 3
- **Infrastructure**: 0 (예정)
- **Shared**: 0
- **Test**: 0
