# Eco-Font Project — Claude Code 가이드

AI가 빠르게 컨텍스트를 잡고 일관되게 작업하기 위한 인덱스. 세부 내용은 docs/와 aidlc-docs/를 가리키므로 필요한 파일만 읽으면 됩니다.

---

## 1. 프로젝트 한 줄 요약

사용자가 업로드한 `.ttf` 폰트를 AI 기반 알고리즘으로 잉크 절약형 에코폰트로 변환하는 웹 플랫폼. MVP는 1달 이내, 대학생 4인 팀.

상세: `docs/vision_document.md`

---

## 2. 기술 스택 (확정)

| 레이어 | 기술 |
|--------|------|
| Frontend | Next.js (App Router, TypeScript) + vanilla-extract, Vercel |
| Backend | Python 3.11 + FastAPI, Cloud Run |
| 폰트 처리 | FontTools |
| 최적화 | SciPy / NumPy (SSIM 손실 함수 최소화) |
| 스토리지 | GCS (1일 Lifecycle 자동 삭제) |
| IaC | Terraform (`hashicorp/google ~> 5.0`) |
| 모노레포 | pnpm workspaces (프론트), venv (백엔드) |
| 테스트 | MVP 단계 생략 |

근거·제약: `docs/tech_stack.md` / 인프라 스펙: `docs/infrastructure.md`

**제약**: GCP 기술 1개 이상 필수 (Cloud Run + GCS) · 무료 티어 우선 · 단일 `.ttf` ≤ 10MB

---

## 3. 디렉토리 구조

```
ecofont/
├── apps/
│   ├── frontend/      # Next.js  ← 코드
│   └── backend/       # FastAPI — 우제 Cherokee 생성 API 이식 대기 (가이드: apps/backend/INTEGRATION.md) ← 코드
├── infra/             # Terraform (Cloud Run + GCS + Artifact Registry + IAM) ← 코드
├── docs/              # 팀 원본 문서
├── aidlc-docs/        # AI-DLC 산출물
└── .aidlc-rule-details/  # AI-DLC 워크플로우 규칙 (필요 시만 참조)
```

세팅·실행 명령어: `docs/project-setup.md`

**불변 규칙**
- 애플리케이션 코드는 **절대** `aidlc-docs/` 안에 만들지 않는다. 코드는 `apps/*` 또는 `infra/`에만.
- `docs/`는 팀이 직접 관리. 명시적 지시 없이 수정 금지.

---

## 4. 작업 흐름 (AI-DLC)

```
INCEPTION (완료) → CONSTRUCTION (Unit 1a·1b·1c·2 완료 — Unit 3·4 진행 대기) → OPERATIONS
```

- 현재 상태: `aidlc-docs/aidlc-state.md`
- 결정·대화 이력: `aidlc-docs/audit.md`
- 워크플로우 규칙 상세 (필요 시): `.aidlc-rule-details/`

### Construction 단계 (유닛별 반복)

1. Functional Design → 2. NFR Requirements → 3. NFR Design → 4. Infrastructure Design → 5. Code Generation (Plan → Generate) → 6. Build & Test

각 단계 종료 시 **사용자 승인**을 받고 다음 단계로. 승인 메시지는 "변경 요청" / "다음 단계 진행" 2-옵션.

### 유닛 분해

| Phase | 유닛 | 담당 | 선행 |
|-------|------|------|------|
| 1 (병렬) | Unit 1a: Frontend UI | 이정선, 류동현 | — |
| 1 (병렬) | Unit 2: Backend | 이소은 | — |
| 1 (병렬) | Unit 3: AI Engine | 이우제, 류동현 | — |
| 2 | Unit 1b: Frontend API 연동 | 이정선, 류동현 | Unit 2 |
| 2 | Unit 4: Infrastructure | 이소은 | Unit 2·3 |

역할·주차 계획 상세: `docs/task_assignment.md` · 컴포넌트 명세: `aidlc-docs/inception/application-design/`

---

## 5. AI 상호작용 규칙

| # | 규칙 |
|---|------|
| 5.1 | **탐색과 수정 구분.** "수정하지 마", "아무것도 바꾸지 마" → 분석만 하고 멈춘다. 수정은 명시적 지시 후. |
| 5.2 | **질문 파일 → 답변 → 재개.** 불명확한 사항은 마크다운에 `[Answer]:` 태그로 질문 작성 후 멈춘다. 답변 후 "파일 다시 읽고 계속 진행"으로 재개. |
| 5.3 | **코드 직접 수정 금지(Construction).** 설계 문서 먼저 수정 → 영향받는 코드 재생성. 직접 수정이 있었다면 사용자가 알리고 AI는 설계를 동기화. |
| 5.4 | **`audit.md`는 append/edit 전용.** 전체 덮어쓰기 금지. 타임스탬프 ISO 8601, 사용자 원문 그대로. |
| 5.5 | **단계 승인은 2-옵션.** "변경 요청" / "다음 단계 진행"만 제시. 즉흥적 메뉴 금지. |
| 5.6 | **프롬프트 묶기.** 같은 주제는 한 번에, 무관한 변경은 분리. |
| 5.7 | **SSOT 페이지(`status.html`) 갱신.** 다음 마일스톤 트리거 발생 시 같은 PR에 묶어 갱신: ① AI-DLC 단계 전환, ② 유닛 상태 변경(시작·완료·블록), ③ Open Item 해결 또는 신규 추가, ④ 마일스톤 PR 머지, ⑤ 외부 리소스 변경(배포 URL·GCP 프로젝트 ID 등). 단순 코드 수정·typo·문서 정합은 트리거 아님. 갱신 시 footer "작성 시점" 도 동시 업데이트. |

---

## 6. 자주 쓰는 프롬프트

| 의도 | 패턴 |
|------|------|
| 탐색만 | "문서 수정하지 마. [X]가 왜 이렇게 된 건지 설명해줘." |
| 영향 평가 | "아무것도 바꾸지 마. [변경]의 영향을 먼저 평가해줘." |
| 유닛 시작 | "aidlc-state.md와 unit-of-work.md 읽고 [Unit] Construction 시작해줘." |
| 질문 답변 후 재개 | "질문에 답변했어. 파일 다시 읽고 계속 진행해줘." |
| 작업 재개 | "aidlc-docs/aidlc-state.md 읽고 중단된 작업 이어서 진행해줘." |
| 설계 변경 후 코드 재생성 | "[Unit] 설계가 업데이트됐어. 영향받는 파일만 재생성해줘." |

---

## 7. 문서 인덱스 (어디에 무엇이 있는가)

**`docs/` — 팀 원본**

| 파일 | 찾는 정보 |
|------|-----------|
| `vision_document.md` | 비즈니스 목표, MVP 범위, 성공 지표, 리스크 |
| `tech_stack.md` | 확정된 기술 스택과 근거 |
| `infrastructure.md` | 팀 원본 초안 스펙 (※ 최종 코드는 `infra/`로 이전됨, Construction-stage final 스펙은 `aidlc-docs/construction/unit-2/infrastructure-design.md`) |
| `project-setup.md` | 로컬 개발 환경 세팅, Prerequisites, 배포 명령어 |
| `task_assignment.md` | 팀원 역할·태스크, 주차별 스프린트 |

**`aidlc-docs/` — AI-DLC 산출물**

| 경로 | 찾는 정보 |
|------|-----------|
| `aidlc-state.md` | 현재 단계 (항상 최신) |
| `audit.md` | 모든 결정·대화 이력 |
| `inception/requirements/requirements.md` | FR-1~7, NFR-1~6 명세 |
| `inception/application-design/` | 컴포넌트·서비스·유닛 설계, 의존 관계 |
| `construction/unit-1a/functional-design/` | Unit 1a 설계 (비즈니스 로직·규칙·엔티티·컴포넌트) |
| `construction/plans/unit-1b-code-generation-plan.md` | Unit 1b 9단계 코드 생성 플랜 |
| `construction/build-and-test/unit-1b-build-and-test-summary.md` | Unit 1b 수동 검증 체크리스트 + 실 API 교체 범위 |
| `construction/unit-1c/` | Unit 1c 글로시모피즘 UI 리디자인 산출물 |
| `construction/unit-2/functional-design.md` | Unit 2 API 계약 + Q1~Q4 결정 |
| `construction/unit-2/nfr-requirements.md` | Unit 2 NFR-U2-* 22 항목 + 측정 기준 |
| `construction/unit-2/nfr-design.md` | uv·structlog·Dockerfile 등 NFR 구현 매핑 |
| `construction/unit-2/infrastructure-design.md` | Cloud Run·GCS·IAM 최종 Terraform 스펙 + Delta 표 |

**`apps/`·`infra/` README + 루트**

| 경로 | 찾는 정보 |
|------|-----------|
| `apps/backend/README.md` | Backend 로컬 실행·컨테이너 빌드·아키텍처 요약 |
| `apps/backend/INTEGRATION.md` | 우제 Cherokee API 이식 가이드 (계약·GCS 배선·운영배선·체크리스트) |
| `infra/README.md` | Terraform 배포 절차, idle 비용, NFR 매핑, 후속 의제 |
| `status.html` | 팀 SSOT 대시보드 — 진행·결정·문서 위치 한눈에 (브라우저로 열기, 마일스톤 시 갱신 → 규칙 5.7) |

---

## 8. 미결정 사항 (Open Items)

- **Open-1**: 잉크 절약률 산출 방법 — Code Generation에서 placeholder (좌표 수 비교) 적용 중, Week 3 전 결정 필요 (이소은 + 이우제)
- **Open-2**: CO2 환산 계수 논문/보고서 근거 — placeholder 0.005 g/단위, Week 3 전 결정 (이소은)
- **Open-3**: CI/CD 파이프라인 — Vercel(FE) + GitHub Actions→GCP(BE) 자동 배포 (후속 의제)
- OCR 검증 대상 언어 범위 (류동현)

해결된 항목 (참조): Cloud Run concurrency = 1 (NFR-U2-REL-3), 의존성 도구 = uv (Open-4), 베이스 이미지 = python:3.11-slim-bookworm (Open-5).

상세: `aidlc-docs/construction/unit-2/*.md` 각 §Open Items, `docs/task_assignment.md` 하단.
