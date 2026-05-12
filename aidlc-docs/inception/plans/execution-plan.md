# Execution Plan: Eco-Font Project

## Detailed Analysis Summary

### Transformation Scope
- **Transformation Type**: 시스템 전체 구축 (Brownfield — 프론트엔드 부분 구현, 백엔드/AI 신규 구축)
- **Primary Changes**: Backend(FastAPI) 신규, AI Engine(SSIM+OCR) 신규, Infrastructure(Terraform+GCP) 신규, Frontend API 연동
- **Related Components**: apps/frontend (연동 완성), apps/backend (신규), apps/ai-engine (신규), infrastructure/ (신규)

### Change Impact Assessment
- **User-facing changes**: Yes — 결과 화면 실데이터 연동, 다운로드 버튼 활성화
- **Structural changes**: Yes — Backend, AI Engine, Infrastructure 신규 추가
- **Data model changes**: Yes — 변환 결과 응답 모델, GCS 파일 관리
- **API changes**: Yes — Frontend ↔ Backend REST API 신규
- **NFR impact**: Yes — Cloud Run 콜드 스타트, GCS Lifecycle 설정

### Component Relationships

```
apps/frontend
    └── REST API --> apps/backend
                        └── calls --> apps/ai-engine
                        └── stores --> GCS (Cloud Storage)
                        └── reads  --> GCS (Cloud Storage)

infrastructure/ (Terraform)
    └── provisions --> Cloud Run (backend)
    └── provisions --> Cloud Run (ai-engine)
    └── provisions --> GCS
```

### Risk Assessment
- **Risk Level**: High
- **근거**: 시스템 전체 신규 구축, AI 알고리즘 불확실성, 1달 MVP 데드라인, GCP 인프라 구성
- **Rollback Complexity**: Moderate (Terraform destroy 가능)
- **Testing Complexity**: Complex (AI 변환 결과 검증, E2E 플로우)

---

## Workflow Visualization

```
INCEPTION PHASE
  [완료] Workspace Detection
  [완료] Reverse Engineering
  [완료] Requirements Analysis
  [건너뜀] User Stories       <- 요구사항 명확, task_assignment로 대체
  [완료] Workflow Planning
  [실행] Application Design   <- 신규 컴포넌트(Backend, AI, Infra) 설계 필요
  [실행] Units Generation     <- 4개 유닛으로 분해 필요

CONSTRUCTION PHASE (유닛별 반복)
  [실행] Functional Design    <- 비즈니스 로직, 데이터 모델 신규
  [실행] NFR Requirements     <- Cloud Run, GCS, 성능 고려 필요
  [실행] NFR Design           <- NFR 패턴 반영 필요
  [실행] Infrastructure Design <- GCP 리소스 매핑 필요
  [실행] Code Generation      <- 항상 실행
  [실행] Build and Test       <- 항상 실행

OPERATIONS PHASE
  [보류] Operations           <- Placeholder
```

---

## Phases to Execute

### INCEPTION PHASE
- [x] Workspace Detection (완료)
- [x] Reverse Engineering (완료)
- [x] Requirements Analysis (완료)
- [ ] User Stories — **SKIP**
  - **근거**: 단일 사용자 유형, 요구사항 명확, task_assignment.md로 이미 업무 분배 완료
- [x] Workflow Planning (진행 중)
- [ ] Application Design — **EXECUTE**
  - **근거**: Backend(FastAPI), AI Engine, Infrastructure 3개 신규 컴포넌트 설계 필요
- [ ] Units Generation — **EXECUTE**
  - **근거**: 4개 독립 유닛(Frontend연동, Backend, AI, Infra)으로 분해하여 팀원별 병렬 작업

### CONSTRUCTION PHASE (유닛별)

| 단계 | 결정 | 근거 |
|------|------|------|
| Functional Design | EXECUTE | 신규 데이터 모델, 변환 비즈니스 로직 |
| NFR Requirements | EXECUTE | Cloud Run 콜드스타트, GCS Lifecycle 등 |
| NFR Design | EXECUTE | NFR Requirements 실행 시 필수 |
| Infrastructure Design | EXECUTE | GCP 리소스 매핑, Terraform 작성 |
| Code Generation | EXECUTE (항상) | — |
| Build and Test | EXECUTE (항상) | — |

### OPERATIONS PHASE
- [ ] Operations — PLACEHOLDER

---

## 유닛 구성 (Units Generation 예고)

| 유닛 | 담당 | 주요 내용 |
|------|------|-----------|
| Unit 1: Frontend 연동 | 이정선, 류동현 | API 연동, 결과 실데이터, 다운로드 활성화 |
| Unit 2: Backend / Font Processing | 이소은 | FastAPI, FontTools, 잉크절약률/탄소 계산 |
| Unit 3: AI Engine | 이우제, 류동현 | SSIM 최적화, OCR 검증 파이프라인(내부) |
| Unit 4: Infrastructure | 이소은 | Terraform, Cloud Run, GCS |

---

## Package Update Sequence

```
1. Infrastructure (Unit 4) — Cloud Run, GCS 먼저 프로비저닝
2. Backend (Unit 2)        — GCS 의존, AI Engine 연동
3. AI Engine (Unit 3)      — Backend가 호출
4. Frontend 연동 (Unit 1)  — Backend API 완성 후 연동
```

> 병렬 가능: Unit 2, 3, 4는 설계 단계에서 동시 진행 가능. 코드 생성은 위 순서 권장.

---

## Success Criteria
- **Primary Goal**: TTF 업로드 → 에코폰트 변환 → 다운로드 E2E 플로우 동작
- **Key Deliverables**: FastAPI 백엔드, SSIM AI 엔진, Terraform 인프라, Frontend API 연동
- **Quality Gates**:
  - 잉크 절약률 평균 20% 이상
  - Cloud Run 배포 동작 확인
  - E2E 로컬 테스트 통과
