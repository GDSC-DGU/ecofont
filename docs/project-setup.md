# Project Setup: Eco-Font Monorepo

---

## 전체 폴더 구조

```
ecofont/                              # 모노레포 루트
├── apps/
│   ├── frontend/                     # Next.js (이정선, 류동현)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx          # 메인 업로드 페이지
│   │   │   │   └── globals.css
│   │   │   ├── components/
│   │   │   │   ├── FileUpload.tsx    # .ttf 업로드 UI
│   │   │   │   ├── FontPreview.tsx   # 원본/변환 비교 미리보기
│   │   │   │   ├── Dashboard.tsx    # 잉크 절약률·탄소 저감량
│   │   │   │   ├── DownloadButton.tsx
│   │   │   │   └── LoadingSpinner.tsx # 콜드 스타트 대기 UI
│   │   │   └── lib/
│   │   │       └── api.ts            # 백엔드 API 클라이언트
│   │   ├── public/
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   └── .env.local               # NEXT_PUBLIC_API_URL 등
│   │
│   └── backend/                      # FastAPI (이소은)
│       ├── app/
│       │   ├── main.py               # FastAPI 앱 진입점
│       │   ├── routers/
│       │   │   └── convert.py        # POST /convert 엔드포인트
│       │   ├── services/
│       │   │   ├── font_processor.py # FontTools 글리프 파싱·수정
│       │   │   ├── optimizer.py      # SSIM 기반 최적화 엔진 (이우제)
│       │   │   └── rag_pipeline.py   # RAG Retrieve + Generation (류동현, 이우제)
│       │   └── utils/
│       │       ├── gcs.py            # GCS 업로드·삭제 헬퍼
│       │       └── metrics.py        # 잉크 절약률·탄소 저감량 계산
│       ├── Dockerfile
│       ├── requirements.txt
│       ├── pyproject.toml
│       └── .env                     # GCS_BUCKET, GCP_PROJECT_ID 등
│
├── infra/                            # Terraform (이소은)
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── gcs.tf
│   ├── cloud_run.tf
│   └── iam.tf
│
├── docs/                             # 기획·설계 문서
│   ├── vision_document.md
│   ├── tech_stack.md
│   ├── infrastructure.md
│   ├── instruction.md
│   ├── task_assignment.md
│   └── project-setup.md             # 이 파일
│
├── questions/                        # AIDLC 질문 파일
│   ├── tech_stack_questions.md
│   ├── questions_ai.md
│   ├── questions_fe.md
│   └── questions_infra.md
│
├── .gitignore
├── pnpm-workspace.yaml
├── package.json                      # 루트 워크스페이스
└── README.md
```

---

## 사전 준비 (Prerequisites)

| 도구 | 버전 | 용도 |
|------|------|------|
| Node.js | 20 LTS | Frontend 런타임 |
| pnpm | 9.x | 패키지 매니저 |
| Python | 3.11 | Backend 런타임 |
| Docker | 최신 | 백엔드 컨테이너 빌드 |
| Terraform | 1.7+ | GCP 인프라 프로비저닝 |
| gcloud CLI | 최신 | GCP 인증 및 이미지 푸시 |

---

## 초기 세팅 순서

### 1. 레포 클론 및 루트 세팅

```bash
git clone <repo-url>
cd ecofont

# 루트 package.json 초기화 (pnpm 워크스페이스)
pnpm install
```

**루트 `package.json`:**
```json
{
  "name": "ecofont",
  "private": true,
  "scripts": {
    "dev:frontend": "pnpm --filter frontend dev",
    "dev:backend": "pnpm --filter backend dev",
    "build:frontend": "pnpm --filter frontend build"
  }
}
```

**`pnpm-workspace.yaml`:**
```yaml
packages:
  - "apps/frontend"
```

---

### 2. Frontend 세팅 (`apps/frontend/`)

```bash
cd apps/frontend

# Next.js 프로젝트 생성 (최초 1회)
pnpm create next-app . --typescript --tailwind --app

# 의존성 설치
pnpm install
```

**`.env.local` 작성:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**로컬 실행:**
```bash
pnpm dev   # http://localhost:3000
```

---

### 3. Backend 세팅 (`apps/backend/`)

```bash
cd apps/backend

# Python 가상환경 생성 및 활성화
python3.11 -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt
```

**`requirements.txt`:**
```
fastapi
uvicorn[standard]
fonttools
scipy
numpy
google-cloud-storage
google-cloud-aiplatform
pinecone-client
python-multipart
python-dotenv
```

**`.env` 작성:**
```env
GCS_BUCKET=<프로젝트ID>-font-upload
GCP_PROJECT_ID=<프로젝트ID>
GCP_REGION=asia-northeast3
PINECONE_API_KEY=<Secret Manager에서 주입>
```

**로컬 실행:**
```bash
uvicorn app.main:app --reload --port 8000
```

---

### 4. Infrastructure 세팅 (`infra/`)

```bash
# GCP 인증
gcloud auth application-default login

cd infra

# 상태 버킷 수동 생성 (최초 1회)
gcloud storage buckets create gs://ecofont-terraform-state \
  --location=asia-northeast3

# Terraform 초기화
terraform init

# 플랜 확인
terraform plan \
  -var="project_id=<프로젝트ID>" \
  -var="backend_image=gcr.io/<프로젝트ID>/ecofont-backend:latest" \
  -var="pinecone_api_key=<KEY>"

# 적용
terraform apply
```

---

### 5. Docker 이미지 빌드 및 GCR 푸시 (`apps/backend/`)

```bash
# GCR 인증
gcloud auth configure-docker

cd apps/backend

# 빌드
docker build -t gcr.io/<프로젝트ID>/ecofont-backend:latest .

# 푸시
docker push gcr.io/<프로젝트ID>/ecofont-backend:latest
```

**`Dockerfile`:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

---

### 6. Frontend 배포 (Vercel)

```bash
# Vercel CLI 설치
pnpm add -g vercel

cd apps/frontend
vercel --prod
```

Vercel 대시보드에서 환경변수 설정:
- `NEXT_PUBLIC_API_URL` → Cloud Run 백엔드 URL (`terraform output backend_url`로 확인)

---

## `.gitignore`

```gitignore
# Python
apps/backend/.venv/
apps/backend/__pycache__/
apps/backend/*.pyc
apps/backend/.env

# Node
apps/frontend/.next/
apps/frontend/node_modules/
apps/frontend/.env.local

# Terraform
infra/.terraform/
infra/*.tfstate
infra/*.tfstate.backup
infra/.terraform.lock.hcl

# 공통
.DS_Store
```

---

## 로컬 개발 시 전체 실행 순서

```bash
# 터미널 1 — Backend
cd apps/backend && source .venv/bin/activate && uvicorn app.main:app --reload --port 8000

# 터미널 2 — Frontend
cd apps/frontend && pnpm dev
```
