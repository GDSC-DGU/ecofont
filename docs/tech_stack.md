# Tech Stack Document: Eco-Font Project

---

## 확정된 사항

| 레이어 | 기술 | 근거 |
|--------|------|------|
| Frontend 프레임워크 | Next.js | Vercel 배포 최적화, 향후 확장 용이 |
| Frontend 호스팅 | Vercel | 무료 티어, Next.js 최적화 |
| Backend 언어/프레임워크 | Python (FastAPI) | FontTools 연계 필수 |
| Backend 호스팅 | Cloud Run (GCP) | GCP 요건 충족, 무료 티어, 컨테이너 기반 |
| Backend 콜드 스타트 | 허용 — 로딩 UI로 안내 | 최소 인스턴스 유지 비용 절감 |
| 폰트 파싱/수정 | FontTools | 오픈소스, .ttf 글리프 벡터 수정 가능 |
| 최적화 알고리즘 | SciPy / NumPy | SSIM 계산 및 손실 함수 최소화 |
| AI / 임베딩 | Vertex AI (Gemini) | GCP 요건 충족, 무료 크레딧 활용 |
| Vector DB | Pinecone | 관리형, 무료 티어. 초기 데이터셋은 Google Fonts 등 오픈소스 폰트에서 글리프 임베딩 추출 후 적재 |
| 파일 스토리지 | GCS (Google Cloud Storage) | GCP 계열, Cloud Run과 IAM 통합 용이 |
| GCS Lifecycle | 업로드 후 1일 자동 삭제 (GCS Lifecycle) | 저작권 보호 및 비용 절감. 1시간은 GCS 미지원(최소 1일) |
| 테스트 | 미작성 | 대학생 4인 / 1달 MVP 일정 상 생략 |
| IaC | Terraform (hashicorp/google provider) | GCP 리소스 코드 관리, AWS 경험 보유팀 적용 가능 |
| 모노레포 | pnpm workspaces | Frontend 패키지 관리. Python 백엔드는 venv로 별도 관리 |

**제약 조건:**
- Google Cloud 기술 최소 1개 이상 사용 필수 → Cloud Run + GCS + Vertex AI로 충족
- 무료 티어 및 오픈소스 우선 (대학생 4인, 예산 최소화)
- 1달 이내 MVP 릴리즈
