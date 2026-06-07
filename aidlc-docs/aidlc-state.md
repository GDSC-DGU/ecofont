# AI-DLC State Tracking

## Project Information
- **Project Type**: Brownfield
- **Start Date**: 2026-05-12T00:00:00Z
- **Last Updated**: 2026-06-07T12:00:00Z
- **Current Stage**: CONSTRUCTION / Unit 2 NFR Requirements (승인 대기)

## Workspace State
- **Existing Code**: Yes
- **Reverse Engineering Needed**: Yes (완료, 산출물은 토큰 효율을 위해 archive)
- **Workspace Root**: /Users/toni/Documents/ecofont

## Code Location Rules
- **Application Code**: Workspace root (NEVER in aidlc-docs/)
- **Documentation**: aidlc-docs/ only

## Extension Configuration

| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | No | Requirements Analysis |
| Property-Based Testing | No | Requirements Analysis |

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
- [x] Functional Design — Unit 2 v2 (Q1=A, Q2=B, Q3=A, Q4=C) 승인 완료
- [~] NFR Requirements — Unit 2 초안 완료, 승인 대기
- [ ] NFR Design (EXECUTE, 유닛별)
- [ ] Infrastructure Design (EXECUTE, 유닛별)
- [ ] Code Generation (EXECUTE, 항상)
- [ ] Build and Test (EXECUTE, 항상)

### OPERATIONS PHASE
- [ ] Operations (PLACEHOLDER)

## Current Status
- **Lifecycle Phase**: CONSTRUCTION
- **Current Stage**: Unit 2 (Backend) — NFR Requirements 초안 완료
- **Next Stage**: 변경 요청 처리 또는 Unit 2 NFR Design 진행
- **Status**: 사용자 승인 대기 (2-옵션: 변경 요청 / 다음 단계 진행)
- **확정 결정 (Functional Design v2)**: Q1=통합(InProcess), Q2=비동기 폴링, Q3=Signed URL 24h, Q4=Hexagonal+Light DDD
- **NFR Requirements 핵심 기준**: cold start ≤20s, GET /jobs p95 <200ms, max_instances=1, concurrency=1, 이미지 ≤800MB, JSON 구조화 로깅
- **Open Items**: Open-1(잉크 산출법), Open-2(CO2 계수), Open-3(CI/CD), Open-4(uv vs poetry), Open-5(베이스 이미지)
- **작업 브랜치**: `docs/unit-2-functional-design` (develop에서 분기, 미커밋)
- **커밋 계획**: NFR Requirements까지 한 번에 커밋 (사용자 요청)
