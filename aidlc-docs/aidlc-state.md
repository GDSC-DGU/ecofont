# AI-DLC State Tracking

## Project Information

- **Project Type**: Brownfield
- **Start Date**: 2026-05-12T00:00:00Z
- **Last Updated**: 2026-06-24T11:10:00Z
- **Current Stage**: CONSTRUCTION / Unit 1a·1b·1c 완료 + Unit 2·4 배포·CI/CD 자동배포 라이브

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
- [x] Build and Test — Unit 1a (완료), Unit 1b (완료), Unit 1c (완료, `pnpm build` 성공, `pnpm tsc --noEmit` 에러 없음), Unit 2 (완료: uv.lock 생성·docker build/push·Cloud Run /health 200)
- [x] Unit 4 Infrastructure — GCP ecofont-re 프로비저닝 + terraform apply(8 리소스) + Cloud Run 배포 완료 (2026-06-24)

### OPERATIONS PHASE

- [ ] Operations (PLACEHOLDER)

## Current Status

- **Lifecycle Phase**: CONSTRUCTION
- **Current Stage**: Unit 2·4 배포 + CI/CD 자동배포 라이브 — Backend Cloud Run 운영 중
- **배포 정보**: GCP 프로젝트 `ecofont-re` (asia-northeast3) · Backend URL `https://ecofont-backend-pdixgz2hlq-du.a.run.app` (`/health` 200, Swagger `/docs`) · 이미지=git SHA(CI 자동배포) · identity placeholder AI
- **머지 완료 (develop)**:
  - Unit 1a/1b Frontend UI + API 연동(mock) — PR #14
  - Unit 1c 글로시모피즘 UI 리디자인 — PR #18 (FontList, ExportCard, Logo, ResultSummary, ttf_blob mock, @mui/icons-material)
  - Unit 2 Backend 설계+코드 — PR #8·#9·#10 / SSOT+CLAUDE.md §5.7 — PR #11
  - Unit 2 Build & Test + Unit 4 인프라 배포 — PR #19
  - CORS — PR #20 / CI/CD(WIF 키리스) — PR #21 / Swagger 보강 — PR #22
  - Artifact Registry cleanup(keep-5/30d) + Cloud Run client 드리프트 무시 — chore/ssot-and-ar-cleanup
- **CI/CD**: `develop`에 `apps/backend/**`·`infra/cloud_run.tf` push 시 GitHub Actions가 빌드→Artifact Registry(SHA 태그)→`gcloud run deploy`. 실패 시 기존 revision 유지(트래픽 안 옮겨감). 인프라=Terraform, 이미지=CI 분리(`ignore_changes`).
- **Next Stage (우선순위 순)**:
  1. **variants 계약 결정** (소은·우제·정선) — 실 API 연결 선행 조건
  2. Open-1 잉크 절약률 산출법, Open-2 CO2 계수 결정 (이소은 + 이우제)
  3. Unit 3 AI Engine 시작 (이우제·류동현) — backend 하위로 구현 예정 → 머지 시 CI 자동 재배포 + `apps/ai-engine` 전제를 backend 하위로 동기화 (rule 5.3)
  4. Unit 1b 실 API 연결 (`src/mocks/convertFont.ts` 교체) — variants 결정 + Unit 3 후
- **남은 Open Items**: variants 계약 불일치(신규, critical), Open-1 잉크 산출법, Open-2 CO2 계수, OCR 언어 범위. (Open-3 CI/CD 해결됨)
- **결정된 운영 원칙**: HTTPS 자동(NFR-U2-SEC-5), idle 시 GCP $0, CORS 허용(Vercel·localhost), CI 인증=WIF 키리스
- **현재 브랜치**: `chore/ssot-and-ar-cleanup` (SSOT 갱신 + AR cleanup, 커밋 예정)
