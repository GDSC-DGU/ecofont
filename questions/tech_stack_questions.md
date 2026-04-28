# Tech Stack 결정 질문

답변 후 채팅에서 "질문에 답변했어. 파일 다시 읽고 tech_stack.md 업데이트해줘"라고 말해줘.

---

## Q1. 프론트엔드 프레임워크

A) React (SPA, 단순하고 빠름)
B) Next.js (SSR 지원, 하지만 이 프로젝트엔 과할 수 있음)

[Answer]:B

---

## Q2. 프론트엔드 호스팅

A) Firebase Hosting (GCP 계열, 무료 티어)
B) Vercel (무료 티어, React/Next.js 최적화)
C) Netlify (무료 티어, 범용)

[Answer]:B

---

## Q3. 백엔드 호스팅

A) Cloud Run (GCP, 무료 티어, 컨테이너 기반)
B) AWS Lambda (서버리스, 무료 티어)
C) Railway (심플한 배포, 무료 티어 제한적)

[Answer]:A

---

## Q4. Vector DB

A) Pinecone (관리형, 무료 티어 있음)
B) ChromaDB (오픈소스, 백엔드에 자체 호스팅)

[Answer]:A

---

## Q5. 파일 스토리지 (업로드된 .ttf 임시 저장)

A) GCS - Google Cloud Storage (GCP 계열)
B) Cloudflare R2 (무료 티어 넉넉함, GCP 무관)
C) S3 (AWS, 무료 티어 1년)

[Answer]:A

---

## Q6. 테스트 프레임워크

A) pytest (Python 표준, 백엔드 테스트)
B) pytest + Vitest (백엔드 pytest, 프론트엔드 Vitest)
C) pytest + Jest (백엔드 pytest, 프론트엔드 Jest)
D) 테스트 코드 미작성

[Answer]:D
