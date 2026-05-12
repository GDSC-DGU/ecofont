# Unit of Work Plan: Eco-Font Project

## 배경
Workflow Planning에서 4개 유닛으로 분해하기로 승인됨:
- Unit 1: Frontend 연동 (이정선, 류동현)
- Unit 2: Backend / Font Processing (이소은)
- Unit 3: AI Engine (이우제, 류동현)
- Unit 4: Infrastructure (이소은)

---

## 질문

아래 질문에 [Answer]: 태그에 답변을 채워주세요.

---

## Question 1
디렉토리 구조를 확인합니다. 각 유닛의 코드 위치는?

A) 아래 구조 그대로 사용
```
apps/frontend/      ← Unit 1a, 1b (기존)
apps/backend/       ← Unit 2 (신규)
apps/ai-engine/     ← Unit 3 (신규)
infra/              ← Unit 4 (신규)
```
B) 다른 구조 (Other에 기술)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 기본 구조 사용. Backend/Infrastructure 통합 여부 TBD (Construction 단계 확정)

---

## Question 2
Backend(Unit 2)와 AI Engine(Unit 3)은 Application Design Q1이 미결정 상태입니다.
유닛 설계 시 어느 관점에서 작업을 시작할까요?

A) 일단 **분리 배포** 기준으로 설계 (Unit 2 = FastAPI 서버, Unit 3 = 별도 Python 서비스) — 분리 여부는 Code Generation 직전에 최종 결정
B) 일단 **통합 단일 서비스** 기준으로 설계 (FastAPI 안에 AI 로직 포함) — 분리 필요 시 리팩토링
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 분리 배포 기준으로 설계, Code Generation 전에 최종 결정 (TBD)

---

## Question 3
유닛 개발 착수 순서를 확인합니다.

[Answer]: Frontend UI 구현 최우선. 순서: Unit 1a (Frontend UI) → Unit 2 (Backend) → Unit 3 (AI Engine) → Unit 1b (Frontend API 연동) → Unit 4 (Infrastructure)

---

## 확정된 유닛 구조 (5개)

| 유닛 | 내용 | 디렉토리 | 담당 |
|------|------|----------|------|
| Unit 1a | Frontend UI 완성 (mock 데이터 기반) | apps/frontend/ | 이정선, 류동현 |
| Unit 1b | Frontend API 연동 (Backend 완성 후) | apps/frontend/ | 이정선, 류동현 |
| Unit 2  | Backend / Font Processing | apps/backend/ | 이소은 |
| Unit 3  | AI Engine (SSIM + OCR) | apps/ai-engine/ | 이우제, 류동현 |
| Unit 4  | Infrastructure (Terraform) | infra/ | 이소은 |

**개발 순서**: Unit 1a → Unit 2 → Unit 3 → Unit 1b → Unit 4

---

## Plan Checklist (실행)

- [x] unit-of-work.md 생성 (유닛 정의, 책임, 팀 배정)
- [x] unit-of-work-dependency.md 생성 (의존 관계 매트릭스)
- [x] unit-of-work-story-map.md 생성 (기능 요구사항 → 유닛 매핑)
