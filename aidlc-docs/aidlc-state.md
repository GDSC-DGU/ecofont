# AI-DLC State Tracking

## Project Information

- **Project Type**: Brownfield
- **Start Date**: 2026-05-12T00:00:00Z
- **Last Updated**: 2026-06-19T00:00:00Z
- **Current Stage**: CONSTRUCTION / Unit 1a·1b·1c·2 완료 — Unit 2 로컬 Build & Test + Unit 3·4 프로비저닝 대기

## Workspace State

- **Existing Code**: Yes
- **Reverse Engineering Needed**: Yes (완료, 산출물은 토큰 효율을 위해 archive)
- **Workspace Root**: /Users/jungsun/ecofont

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
- [x] Code Generation — Unit 1a (완료), Unit 1b (완료), Unit 1c 글로시모피즘 UI 리디자인 + 결과 페이지 리스트 뷰(FontList/FontListItem) + Export 이미지(html2canvas) + Logo·ResultSummary·ExportCard 컴포넌트 + LoadingOverlay 포털 수정 + Mock 구조 변경(download_url→ttf_blob) + @mui/icons-material 적용 (완료), Unit 2 apps/backend + infra 코드 생성 완료
- [x] Build and Test — Unit 1a (완료), Unit 1b (완료), Unit 1c (완료, `pnpm build` 성공, `pnpm tsc --noEmit` 에러 없음) / Unit 2 미실행

### OPERATIONS PHASE

- [ ] Operations (PLACEHOLDER)

## Current Status

- **Lifecycle Phase**: CONSTRUCTION
- **머지 완료 (develop)**:
  - Unit 1a Frontend UI — PR #14 (mock 변환 + FontFace 미리보기 + 비교 입력 UI)
  - Unit 1b Frontend API 연동 (mock 폴링) — PR #14
  - Unit 1c 글로시모피즘 UI 리디자인 — 커밋 대기 (FontList 리스트 뷰, ExportCard, Logo, ResultSummary, LoadingOverlay 포털 수정, ttf_blob mock 구조, @mui/icons-material)
  - Unit 2 Backend Functional/NFR/Infra Design + Code Generation — PR #8·#9·#10
  - 팀 SSOT 페이지(`status.html`) + CLAUDE.md §5.7 — PR #11
- **Next Stage (우선순위 순)**:
  1. Unit 1c 변경사항 커밋 → PR (이정선)
  2. Unit 2 로컬 Build & Test — `cd apps/backend && uv sync` (→ `uv.lock`) / `uv run uvicorn app.main:app --reload` smoke / `docker build` (이소은)
  3. Open-1 잉크 절약률 산출법, Open-2 CO2 계수 결정 (이소은 + 이우제)
  4. Unit 3 AI Engine 시작 (이우제·류동현) / Unit 4 GCP 프로비저닝 (이소은)
  5. Unit 3·4 완료 후 → Unit 1b 실 API 연결 (`src/mocks/convertFont.ts` 교체)
- **검증 상태**: Unit 1c `pnpm tsc --noEmit` 에러 없음, `pnpm build` 성공. Dead code(FontGrid·FontCard·ResultMetrics·DownloadResult) 삭제 완료. Python AST parse 25/25 통과. `uv.lock` 미생성 → Unit 2 로컬 Build & Test 미실행.
- **남은 Open Items**: Open-1 잉크 산출법 (placeholder=좌표 수 비교), Open-2 CO2 계수 (placeholder=0.005g/단위), Open-3 CI/CD, OCR 언어 범위
- **결정된 운영 원칙**: HTTPS는 Cloud Run 기본 자동 적용(NFR-U2-SEC-5), idle 시 GCP $0 (min_instances=0 + Lifecycle 1d)
- **AI Engine 의존**: `apps/backend/app/adapters/outbound/inprocess_ai_engine.py` identity placeholder — `apps/ai-engine/README.md` 가 우제 시작 시점 가이드
- **현재 브랜치**: `develop` (Unit 1a/1b/2 모두 머지 완료, 미커밋 변경 없음)
