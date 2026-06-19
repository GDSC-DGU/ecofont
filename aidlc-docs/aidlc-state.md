# AI-DLC State Tracking

## Project Information

- **Project Type**: Brownfield
- **Start Date**: 2026-05-12T00:00:00Z
- **Last Updated**: 2026-06-07T16:00:00Z
- **Current Stage**: CONSTRUCTION / Unit 2 Code Generation (커밋 직전)

## Workspace State

- **Existing Code**: Yes
- **Reverse Engineering Needed**: Yes (완료, 산출물은 토큰 효율을 위해 archive)
- **Workspace Root**: /Users/toni/Documents/ecofont

## Code Location Rules

- **Application Code**: Workspace root (NEVER in aidlc-docs/)
- **Documentation**: aidlc-docs/ only

## Extension Configuration

| Extension              | Enabled | Decided At            |
| ---------------------- | ------- | --------------------- |
| Security Baseline      | No      | Requirements Analysis |
| Property-Based Testing | No      | Requirements Analysis |

## Execution Plan Summary

- **Total Stages**: 9 (실행 기준)
- **Stages to Execute**: Application Design, Units Generation, Functional Design, NFR Requirements, NFR Design, Infrastructure Design, Code Generation, Build and Test
- **Stages to Skip**: User Stories (요구사항 명확, task_assignment로 대체)

## Stage Progress

### INCEPTION PHASE

- [x] Workspace Detection (완료)
- [x] Reverse Engineering (완료)
- [x] Requirements Analysis (완료)
- [~] User Stories (SKIP)
- [x] Workflow Planning (완료)
- [x] Application Design (완료 — Q1~Q4 TBD, Construction 단계에서 확정)
- [x] Units Generation (완료)

### CONSTRUCTION PHASE

- [x] Functional Design — Unit 2 v2 (Q1=A, Q2=B, Q3=A, Q4=C) 승인 완료 (PR #8 merged)
- [x] NFR Requirements — Unit 2 22개 NFR-U2-\* 항목 승인 완료 (PR #8 merged)
- [x] NFR Design — Unit 2 9개 결정 승인 완료 (PR #9 merged)
- [x] Infrastructure Design — Unit 2 9개 INFRA-\* 결정 승인 완료 (PR #9 merged)
- [x] Code Generation — Unit 1a (완료), Unit 2 apps/backend + infra 코드 생성 완료, 승인 대기
- [x] Build and Test — Unit 1a (완료) / Unit 2 미실행

### OPERATIONS PHASE

- [ ] Operations (PLACEHOLDER)

## Current Status

- **Lifecycle Phase**: CONSTRUCTION
- **Current Stage**: Unit 2 (Backend) — Code Generation 완료 + Unit 3 onboarding 문서 + 후속 의제 트래킹 + CLAUDE.md 정합
- **Next Stage**: Unit 2 Build and Test (로컬 `uv sync` / docker build / 가동) 또는 Unit 3 시작 (우제)
- **Status**: 커밋·푸시·PR 직전
- **생성 산출물 (40 파일)**:
  - `apps/backend/` 30 파일 (Python 25 + pyproject.toml + Dockerfile + .dockerignore + .env.example + README)
  - `apps/ai-engine/README.md` (우제 onboarding)
  - `infra/` 9 파일 (Terraform 7 + tfvars.example + README)
- **수정 산출물**: `CLAUDE.md` (디렉토리 트리·문서 인덱스·Open Items 동기화), `apps/backend/README.md` (ai-engine 링크), `apps/backend/app/adapters/outbound/inprocess_ai_engine.py` (onboarding 참조), `infra/README.md` (idle 비용 + 후속 의제)
- **검증 통과**: Python AST parse 25/25, ruff/pyright/terraform fmt는 로컬 실행 필요
- **남은 Open Items**: Open-1 잉크 산출법 (placeholder=좌표 수 비교), Open-2 CO2 계수 (placeholder=0.005g/단위), Open-3 CI/CD, OCR 언어 범위
- **결정된 운영 원칙**: HTTPS는 Cloud Run 기본 자동 적용(NFR-U2-SEC-5), idle 시 GCP $0 (min_instances=0 + Lifecycle 1d)
- **AI Engine 의존**: `inprocess_ai_engine.py` identity placeholder — `apps/ai-engine/README.md` 가 우제 시작 시점 가이드
- **작업 브랜치**: `feat/unit-2-backend-codegen` (develop에서 분기, 미커밋) / `feat-comparison-ui` (Unit 1a, 완료)
- **Unit 1a**: Functional Design → Code Generation → Build and Test 전 구간 완료
