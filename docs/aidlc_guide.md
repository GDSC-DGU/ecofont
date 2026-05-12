# Eco-Font AI-DLC 가이드

이 문서는 AI-DLC(AI-Driven Development Life Cycle)를 처음 접하는 팀원을 위한 안내서입니다.

---

## 목차

1. [AI-DLC란?](#1-ai-dlc란)
2. [기존 방식과의 차이](#2-기존-방식과의-차이)
3. [기존 docs만으로는 왜 부족했는가](#3-기존-docs만으로는-왜-부족했는가)
4. [문서 구조](#4-문서-구조)
5. [기존 docs → aidlc-docs 이동 내역](#5-기존-docs--aidlc-docs-이동-내역)
6. [현재 상태](#6-현재-상태)
7. [Construction 단계 작업 방법](#7-construction-단계-작업-방법)
8. [프롬프트 패턴 모음](#8-프롬프트-패턴-모음)

---

## 1. AI-DLC란?

AI-DLC는 AI와 함께 소프트웨어를 개발하는 구조화된 워크플로우입니다. 크게 3단계로 나뉩니다.

```
INCEPTION (기획)  →  CONSTRUCTION (설계 + 구현)  →  OPERATIONS (배포)
```

각 단계는 산출물(아티팩트)을 만들고, 사용자가 승인하면 다음 단계로 넘어갑니다.  
**Eco-Font 프로젝트는 현재 Inception 완료, Construction 진입 직전 상태입니다.**

---

## 2. 기존 방식과의 차이

### "그냥 LLM에게 물어보는 방식"의 문제

웹 브라우저에서 ChatGPT나 Claude와 채팅하며 개발하는 방식은 다음과 같은 한계가 있습니다.

| 문제 | 현상 |
|------|------|
| **세션 단절** | 대화를 새로 시작하면 이전 결정·맥락이 사라짐 |
| **결정 분산** | 어떤 결정이 왜 내려졌는지 추적이 불가능 |
| **일관성 없는 산출물** | 같은 질문을 다시 해도 다른 답이 나옴 |
| **리뷰 불가** | 팀원이 AI와의 대화 내용을 검토하거나 이어받기 어려움 |
| **코드와 설계 불일치** | 설계 없이 코드를 생성하면 이후 변경 시 전체를 다시 써야 함 |

### AI-DLC 방식의 핵심 차이

**1. 상태가 파일에 저장됩니다**  
모든 결정, 진행 상태, 대화 이력이 `aidlc-docs/` 아래 파일로 저장됩니다. 세션이 끊겨도 "aidlc-docs/aidlc-state.md 읽고 이어서 진행해줘" 한 마디면 재개됩니다.

**2. 설계가 코드보다 먼저 나옵니다**  
코드를 생성하기 전에 반드시 설계 문서(컴포넌트, 메서드, 의존 관계)가 작성되고 팀이 승인합니다. 나중에 요구사항이 바뀌면 설계만 수정하고 코드를 재생성하면 됩니다.

**3. 팀원 누구나 이어받을 수 있습니다**  
AI가 아닌 다른 팀원이 작업을 이어받아도 `aidlc-docs/`를 읽으면 현재 상태를 파악할 수 있습니다.

---

## 3. 기존 docs만으로는 왜 부족했는가

`docs/`에는 `vision_document.md`, `tech_stack.md`, `task_assignment.md` 등 좋은 문서들이 있었습니다. 하지만 AI가 코드를 생성하기 위해서는 이 문서들만으로는 부족했습니다.

| 부족했던 것 | 이유 | AI-DLC에서 해결한 방법 |
|-------------|------|----------------------|
| **구조화된 요구사항** | vision_document는 비즈니스 언어로 쓰여 AI가 기능 경계를 파악하기 어려움 | FR-1~FR-7, NFR-1~NFR-6 형식으로 재구조화 (`requirements.md`) |
| **컴포넌트 설계** | 어떤 클래스·서비스가 존재하고 서로 어떻게 통신하는지 정의되지 않음 | `components.md`, `services.md`, `component-dependency.md` 생성 |
| **작업 단위(Unit) 분해** | task_assignment의 태스크가 코드 파일 단위로 연결되지 않음 | 5개 유닛으로 분해하고 각 유닛의 책임·의존 관계 명세 (`unit-of-work.md`) |
| **진행 상태 추적** | 어느 단계까지 완료됐는지 AI가 알 수 없음 | `aidlc-state.md`로 현재 상태 상시 추적 |
| **결정 이력** | 왜 이 기술 스택을 선택했는지, 어떤 대안을 검토했는지 기록 없음 | `audit.md`에 모든 결정과 그 배경 기록 |

즉, `docs/`의 문서들은 **팀을 위한 문서**였고, `aidlc-docs/`는 **AI가 일관되게 코드를 생성하기 위한 설계 명세서**입니다.

---

## 4. 문서 구조

### `docs/` — 팀이 직접 작성한 원본 문서

| 파일 | 설명 |
|------|------|
| `vision_document.md` | 프로젝트 비전, 비즈니스 배경, 목표 |
| `tech_stack.md` | 확정된 기술 스택 |
| `infrastructure.md` | Terraform 인프라 설계 |
| `project-setup.md` | 로컬 개발 환경 세팅 가이드 |
| `task_assignment.md` | 팀원별 역할 분담 및 주차별 태스크 |
| `aidlc_guide.md` | 이 문서 |

### `aidlc-docs/` — AI-DLC 워크플로우 산출물 (AI가 생성·관리)

```
aidlc-docs/
├── aidlc-state.md          ← 현재 진행 상태 (지금 어느 단계인지)
├── audit.md                ← 모든 대화·결정 이력 로그
├── inception/
│   ├── reverse-engineering/  ← 기존 코드 분석 결과
│   ├── requirements/         ← 구조화된 요구사항 문서
│   ├── plans/                ← 각 단계 실행 계획 및 질문 파일
│   └── application-design/   ← 컴포넌트·유닛 설계
└── construction/             ← Construction 단계 산출물 (앞으로 생성됨)
    └── {unit-name}/
        ├── functional-design/
        ├── nfr-requirements/
        ├── nfr-design/
        ├── infrastructure-design/
        └── code/
```

> **규칙**: 애플리케이션 코드는 절대 `aidlc-docs/` 안에 생성하지 않습니다.  
> 코드는 `apps/frontend/`, `apps/backend/`, `apps/ai-engine/`, `infra/`에만 위치합니다.

---

## 5. 기존 docs → aidlc-docs 이동 내역

Inception 단계에서 `docs/`의 기존 문서들이 아래와 같이 aidlc-docs에 반영되었습니다.

| 원본 파일 | 반영된 위치 | 반영 내용 |
|-----------|------------|-----------|
| `vision_document.md` | `inception/requirements/requirements.md` | 비즈니스 목표 → FR-1~FR-7, NFR-1~NFR-6 형식으로 재구조화 |
| `tech_stack.md` | `inception/requirements/requirements.md` (NFR 섹션) | 확정 기술 스택 → NFR-5(배포), NFR-1(성능) 등에 반영 |
| `infrastructure.md` | `inception/application-design/components.md` (Unit 4) | Terraform 구조 → Infrastructure 유닛 설계로 반영 |
| `task_assignment.md` | `inception/application-design/unit-of-work.md` | 팀원 태스크 + 주차 계획 → 유닛별 세부 태스크(Week 컬럼)로 통합 |

> **원본 파일은 삭제하지 않습니다.** `docs/`는 팀이 직접 관리하는 공간으로 유지됩니다.

---

## 6. 현재 상태

`aidlc-docs/aidlc-state.md`에서 항상 최신 상태를 확인할 수 있습니다.

**다음 단계 (Construction)**:

| Phase | 유닛 | 담당 | 선행 조건 |
|-------|------|------|-----------|
| Phase 1 (병렬) | Unit 1a: Frontend UI 완성 | 이정선, 류동현 | 없음 |
| Phase 1 (병렬) | Unit 2: Backend | 이소은 | 없음 |
| Phase 1 (병렬) | Unit 3: AI Engine | 이우제, 류동현 | 없음 |
| Phase 2 | Unit 1b: Frontend API 연동 | 이정선, 류동현 | Unit 2 완료 |
| Phase 2 | Unit 4: Infrastructure | 이소은 | Unit 2·3 확정 |

---

## 7. Construction 단계 작업 방법

### 유닛 시작하기

담당 유닛의 Construction을 시작할 때 아래 프롬프트를 사용하세요.

```text
aidlc-docs/aidlc-state.md와 aidlc-docs/inception/application-design/unit-of-work.md를 읽고
[Unit 이름] Construction 단계를 시작해줘.
```

---

### 각 단계에서 무슨 일이 일어나는가

#### 1단계: Functional Design (기능 설계)

**무엇을 하는가**: 이 유닛이 다루는 데이터 구조와 비즈니스 로직을 상세히 설계합니다.

- 데이터 모델 정의 (예: `ConversionRequest`, `ConversionResult` 스키마)
- 각 메서드의 상세 로직 명세 (입력 → 처리 → 출력)
- 비즈니스 규칙 문서화 (예: "잉크 절약률 20% 미달이어도 결과 반환")
- API 계약 정의 (엔드포인트, 요청/응답 형식)

**결과물**: `aidlc-docs/construction/{unit}/functional-design/` 아래 설계 문서들

**팀원이 할 일**: 생성된 문서를 검토하고 누락된 비즈니스 로직이나 잘못된 데이터 모델이 있으면 수정을 요청합니다.

---

#### 2단계: NFR Requirements (비기능 요구사항 도출)

**무엇을 하는가**: 이 유닛에서 고려해야 할 성능·보안·확장성 등 비기능 요구사항을 구체화합니다.

- 성능 목표 설정 (예: Cloud Run 콜드 스타트 허용 범위)
- 보안 고려사항 (예: GCS 파일 접근 권한, TTF 파일 유효성 검사)
- 에러 처리 전략 (예: 변환 실패 시 사용자에게 어떤 응답을 줄 것인가)

**결과물**: `aidlc-docs/construction/{unit}/nfr-requirements/` 아래 요구사항 문서

**팀원이 할 일**: 현실적으로 구현 가능한 수준인지, 놓친 엣지 케이스가 있는지 검토합니다.

---

#### 3단계: NFR Design (비기능 설계)

**무엇을 하는가**: 앞 단계에서 도출한 비기능 요구사항을 실제 코드 패턴으로 어떻게 구현할지 설계합니다.

- 에러 처리 패턴 선택 (예: FastAPI의 HTTPException 활용 방식)
- 파일 업로드 크기 제한 구현 방법
- GCS 연동 시 재시도 전략

**결과물**: `aidlc-docs/construction/{unit}/nfr-design/` 아래 설계 문서

---

#### 4단계: Infrastructure Design (인프라 설계)

**무엇을 하는가**: 이 유닛이 사용하는 GCP 리소스와 배포 구조를 명세합니다.

- Cloud Run 서비스 설정 (메모리, CPU, 최소 인스턴스 수)
- GCS 버킷 접근 방식 (IAM 서비스 계정)
- 환경변수 및 Secret Manager 항목 목록

**결과물**: `aidlc-docs/construction/{unit}/infrastructure-design/` 아래 설계 문서

---

#### 5단계: Code Generation (코드 생성)

**무엇을 하는가**: 앞의 모든 설계 문서를 기반으로 실제 코드를 생성합니다. 두 파트로 나뉩니다.

- **Part 1 — 계획**: 생성할 파일 목록과 각 파일의 역할을 체크리스트로 제시합니다. 팀원이 검토 후 승인합니다.
- **Part 2 — 생성**: 승인된 계획대로 `apps/` 또는 `infra/` 경로에 코드를 생성합니다.

**팀원이 할 일**: Part 1 계획을 꼼꼼히 검토하세요. 파일 경로가 올바른지, 설계에서 명세한 항목이 모두 포함됐는지 확인합니다. 승인 후에는 코드가 실제로 생성됩니다.

---

#### 6단계: Build and Test (빌드 및 테스트)

**무엇을 하는가**: 생성된 코드를 실행하고 검증하는 방법을 안내합니다.

- 로컬 빌드 및 실행 명령어
- 수동 E2E 테스트 시나리오 (예: TTF 파일 업로드 → 변환 → 다운로드 전체 흐름)
- 주요 확인 포인트 (예: GCS에 파일이 정상 저장됐는가, 잉크 절약률이 계산됐는가)

---

### 질문 파일이 생성됐을 때

AI가 설계 중 불명확한 사항이 있으면 `[Answer]:` 태그가 있는 질문 파일을 만들고 멈춥니다.

```
1. AI가 파일 경로를 알려줍니다 (예: aidlc-docs/construction/unit-2/plans/functional-design-plan.md)
2. 파일을 열어 [Answer]: 태그 뒤에 답변을 작성합니다
3. AI에게 아래와 같이 말합니다:
```

```text
질문에 답변했어. 파일 다시 읽고 계속 진행해줘.
```

### 작업 중단 후 재개할 때

```text
aidlc-docs/aidlc-state.md를 읽고 중단된 작업을 이어서 진행해줘.
```

---

## 8. 프롬프트 패턴 모음

### 탐색 (수정 없이 확인만 할 때)

```text
문서는 수정하지 마. [이 결정]이 왜 이렇게 된 건지 설명해줘.
```

```text
아무것도 바꾸지 마. [이 변경]의 영향을 먼저 평가해줘.
```

### 설계 변경

```text
아무것도 바꾸지 마. [X] 이슈를 발견했어. 설계에서 어디를 수정해야 하는지 파악해줘.
```

```text
[설계 문서]를 [수정 내용]으로 업데이트해줘.
다른 문서와 불일치가 있는지도 확인해줘.
```

### 코드 재생성 (설계 변경 후)

```text
[유닛 이름]의 설계가 업데이트됐어. 영향받는 파일만 코드 재생성해줘.
```

### 직접 코드를 수정했을 때

```text
[파일]을 직접 수정했어. 수정 내용은 [설명]이야.
[설계 문서]를 이 내용으로 업데이트하고 불일치 없는지 확인해줘.
```
