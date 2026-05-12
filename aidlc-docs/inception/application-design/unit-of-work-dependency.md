# Unit of Work Dependency

## 개발 순서

```
Phase 1 (병렬 동시 시작)
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Unit 1a    │   │   Unit 2    │   │   Unit 3    │
│ Frontend UI │   │   Backend   │   │  AI Engine  │
└──────┬──────┘   └──────┬──────┘   └──────┬──────┘
       │                 │                  │
       │          Phase 2 (Unit 2 완료 후)  │
       │                 │                  │
       └────────► Unit 1b (Frontend API 연동) ◄────┘
                         │
                      Unit 4
                  (Infrastructure)
                 (Unit 2·3 확정 후)
```

## 의존 관계 매트릭스

| 유닛 | 선행 조건 | 이유 |
|------|-----------|------|
| Unit 1a | 없음 | mock 기반으로 독립 개발 가능 |
| Unit 2 | 없음 | Backend는 AI Engine과 독립적으로 인터페이스 정의 후 개발 |
| Unit 3 | 없음 | AI 로직은 Backend와 독립적으로 개발 가능 |
| Unit 1b | Unit 2 완료 | 실제 API 엔드포인트 필요 |
| Unit 4 | Unit 2, Unit 3 설계 확정 | Cloud Run 컨테이너 이미지 경로, 환경변수 확정 필요 |

## 유닛 간 인터페이스

| 송신 | 수신 | 데이터 | 방식 |
|------|------|--------|------|
| Unit 1b (Frontend) | Unit 2 (Backend) | TTF 파일 (multipart/form-data) | REST API |
| Unit 1b (Frontend) | Unit 2 (Backend) | 변환 결과 (잉크절약률, 탄소저감량, 다운로드URL) | REST 응답 |
| Unit 2 (Backend) | Unit 3 (AI Engine) | 글리프 벡터 데이터 | TBD (함수 호출 vs HTTP) |
| Unit 2 (Backend) | GCS | TTF 파일 업로드/다운로드 | GCP SDK |
| Unit 4 (Infrastructure) | Cloud Run | 컨테이너 배포 환경 | Terraform |
| Unit 4 (Infrastructure) | GCS | 버킷 + Lifecycle 정책 | Terraform |

## 병렬 개발 가능 구간

| 구간 | 병렬 가능 유닛 | 조건 |
|------|----------------|------|
| Phase 1 | Unit 1a, Unit 2, Unit 3 | 동시 시작 가능 — 상호 의존 없음 |
| Phase 2 | Unit 1b, Unit 4 | Unit 2 완료 후 Unit 1b 시작, Unit 2·3 확정 후 Unit 4 착수 |
