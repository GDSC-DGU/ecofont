# Application Design Plan

## 설계 범위
- Frontend 연동 완성 (기존 컴포넌트 → API 연결)
- Backend (FastAPI) 신규 설계
- AI Engine (SSIM + OCR) 신규 설계
- Infrastructure (Terraform + GCP) 신규 설계

---

## 설계 질문

아래 질문에 [Answer]: 태그에 답변을 채워주세요.

---

## Question 1
Backend(FastAPI)와 AI Engine(SSIM + OCR)을 어떻게 배포할 건가요?

A) 하나의 Cloud Run 서비스로 통합 (FastAPI 안에 AI 로직 포함)
B) 별도 Cloud Run 서비스로 분리 (Backend ↔ AI Engine HTTP 통신)
X) Other (please describe after [Answer]: tag below)

[Answer]: 보류

---

## Question 2
Frontend → Backend API 호출 방식을 결정할게요. (requirements에서 보류된 항목)
Cloud Run 콜드 스타트가 있으므로 동기 방식이면 타임아웃 리스크가 있어요.

A) 단순 동기 REST (POST /convert, 변환 완료까지 대기) — 구현 단순, 타임아웃 리스크
B) 비동기 폴링 (POST /convert → job_id 반환, GET /status/{job_id} 주기적 조회)
X) Other (please describe after [Answer]: tag below)

[Answer]: 보류

---

## Question 3
변환된 TTF 파일 다운로드 방식은?

A) Backend가 GCS Signed URL 발급 → Frontend가 직접 GCS에서 다운로드
B) Backend가 GCS에서 파일을 읽어 스트리밍으로 응답 (Frontend는 Backend를 통해 다운로드)
X) Other (please describe after [Answer]: tag below)

[Answer]: 보류

---

## Question 4
Backend 내부 레이어 구조는?

A) Flat 구조 (router → 로직 직접 작성) — MVP에 적합, 단순
B) Layered 구조 (router → service → repository) — 확장성 좋음, 보일러플레이트 많음
X) Other (please describe after [Answer]: tag below)

[Answer]: 보류

---

## Plan Checklist (답변 완료 후 실행)

- [ ] components.md 생성 (컴포넌트 정의 및 책임)
- [ ] component-methods.md 생성 (메서드 시그니처)
- [ ] services.md 생성 (서비스 레이어 정의)
- [ ] component-dependency.md 생성 (의존 관계)
- [ ] application-design.md 통합 문서 생성
