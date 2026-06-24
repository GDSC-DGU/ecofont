# Unit 2: Backend — Infrastructure Design

> **단계**: CONSTRUCTION / Infrastructure Design
> **유닛**: Unit 2 (Backend) — 인프라 측면 (Unit 4 Terraform 작업의 직접 입력)
> **선행**: Functional Design v2, NFR Requirements, NFR Design (모두 승인 완료)
> **목적**: Cloud Run · GCS · IAM · Artifact Registry 최종 Terraform 스펙 확정
> **브랜치**: `docs/unit-2-nfr-design` (NFR Design과 한 PR로 묶음)

---

## 1. Scope 및 관계 정리

| 문서 | 역할 |
|------|------|
| `docs/infrastructure.md` (팀 원본) | 인프라 초안 — 1Gi/max=3/timeout=300s 등 초안 수치 보유. **수정 금지 (CLAUDE.md 규칙)** |
| 본 문서 | Construction NFR 결정 반영 후의 **final 스펙**. Code Generation 단계에서 `infra/*.tf`로 그대로 materialize |

본 문서가 `infra/` 코드의 권위 있는 출처. 차이가 있는 항목은 §6 Delta 표에서 명시.

---

## 2. 환경 가정

| 항목 | 값 |
|------|-----|
| GCP Project ID | `var.project_id` (소은님이 I-1 단계에서 결정, terraform.tfvars로 주입) |
| Region | `asia-northeast3` (서울) — 팀 원본 유지, 한국 사용자 latency 최적 |
| Terraform | `>= 1.7`, provider `hashicorp/google ~> 5.0` |
| 상태 저장소 | GCS `ecofont-terraform-state` (I-2에서 수동 생성) |
| Container Registry | **Artifact Registry** (GCR은 deprecated → 변경) |
| 환경 수 | 1개 (`prod`만, MVP) |

---

## 3. Terraform 디렉토리 구조

팀 원본의 flat 구조 유지 + 신규 리소스용 파일 추가:

```
infra/
├── main.tf                  # provider + backend
├── variables.tf             # 입력 변수
├── outputs.tf               # 출력 (Cloud Run URL, 버킷명 등)
├── artifact_registry.tf     # ★ 신규 — Docker 이미지 저장소
├── storage.tf               # GCS input + output 버킷 (★ 2개로 분리)
├── iam.tf                   # Service Account + IAM
├── cloud_run.tf             # Cloud Run 서비스
├── terraform.tfvars.example # 사용자 가이드용
└── README.md                # init/plan/apply 절차
```

`docs/infrastructure.md`의 `gcs.tf` → `storage.tf`로 이름 변경 (input/output 2개 관리 명확화).

---

## 4. 리소스 스펙 (Final)

### 4.1 Artifact Registry (신규)

| 항목 | 값 | 근거 |
|------|-----|------|
| Repository ID | `ecofont` | 단순 명명 |
| Format | DOCKER | 컨테이너 이미지 |
| Location | `asia-northeast3` | Cloud Run과 동일 리전 → pull latency 최소 |

```hcl
# artifact_registry.tf
resource "google_artifact_registry_repository" "ecofont" {
  location      = var.region
  repository_id = "ecofont"
  format        = "DOCKER"
  description   = "Eco-Font container images"
}
```

이미지 URL 패턴:
```
{region}-docker.pkg.dev/{project_id}/ecofont/backend:{tag}
```

### 4.2 Cloud Run (스펙 변경됨)

| 항목 | 값 | 근거 / 출처 |
|------|-----|-------------|
| Service name | `ecofont-backend` | 팀 원본 유지 |
| CPU | **2 vCPU** | NFR Design §3.4 — SciPy/NumPy CPU intensive |
| Memory | **2 Gi** | NFR-U2-PERF-4 (1Gi → 2Gi 상향) |
| Min instances | 0 | NFR-U2-COST-1 |
| **Max instances** | **1** | NFR-U2-REL-2 (max=3 → 1, in-memory store 정합성) |
| **Request concurrency** | **1** | NFR-U2-REL-3 (신규) |
| **Request timeout** | **600s** | NFR-U2-PERF-3 (300s → 600s, 폴링 엔드포인트는 빠르지만 마진 확보) |
| **CPU 할당 정책** | **항상 할당 (`startup_cpu_boost=false`, `cpu_idle=false`)** | 백그라운드 asyncio task 안정성 (CPU throttling 회피) |
| Ingress | `INGRESS_TRAFFIC_ALL` | NFR-U2-SEC-4 (인증 미적용, 공개) |
| Service Account | `ecofont-backend-sa` | NFR-U2-SEC-2 (최소 권한) |

```hcl
# cloud_run.tf
# NOTE: deletion_protection 인자는 google provider 6.x+ 전용 → ~> 5.0 핀에서는 미지원.
#       provider 5.x 에는 Cloud Run v2 삭제 보호 개념이 없어 인자 자체를 생략한다.
resource "google_cloud_run_v2_service" "backend" {
  name     = "ecofont-backend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.backend.email
    timeout         = "600s"
    max_instance_request_concurrency = 1

    scaling {
      min_instance_count = 0
      max_instance_count = 1
    }

    containers {
      image = var.backend_image

      resources {
        limits = {
          cpu    = "2"
          memory = "2Gi"
        }
        # 백그라운드 asyncio task 안정성: CPU 항상 할당
        cpu_idle          = false
        startup_cpu_boost = false
      }

      env {
        name  = "GCS_INPUT_BUCKET"
        value = google_storage_bucket.input.name
      }
      env {
        name  = "GCS_OUTPUT_BUCKET"
        value = google_storage_bucket.output.name
      }
      env {
        name  = "SIGNED_URL_TTL_SECONDS"
        value = "86400"
      }
      env {
        name  = "MAX_FILE_SIZE_BYTES"
        value = "10485760"
      }

      ports {
        container_port = 8080
      }

      startup_probe {
        http_get {
          path = "/health"
        }
        initial_delay_seconds = 5
        period_seconds        = 5
        failure_threshold     = 6   # 30s 윈도우
        timeout_seconds       = 3
      }

      liveness_probe {
        http_get {
          path = "/health"
        }
        period_seconds    = 30
        failure_threshold = 3
        timeout_seconds   = 3
      }
    }
  }
}

# 공개 호출 허용
resource "google_cloud_run_v2_service_iam_member" "public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
```

### 4.3 GCS 버킷 (1개 → 2개로 분리)

NFR Design §5.1, Functional Design §4.4 — input/output 분리.

| 항목 | input 버킷 | output 버킷 |
|------|------------|-------------|
| 이름 | `${project_id}-ecofont-input` | `${project_id}-ecofont-output` |
| Storage class | STANDARD | STANDARD |
| Location | `asia-northeast3` | `asia-northeast3` |
| Lifecycle | age=1 → Delete | age=1 → Delete |
| Public access | enforced (차단) | enforced (차단) |
| Uniform bucket-level access | true | true |
| Versioning | 비활성 | 비활성 |
| CORS | 불필요 (서버가 업로드) | **`GET` 허용** — 브라우저가 signed URL로 직접 다운로드 |
| force_destroy | true (MVP, 자유 재생성) | true |

```hcl
# storage.tf
locals {
  input_bucket_name  = "${var.project_id}-ecofont-input"
  output_bucket_name = "${var.project_id}-ecofont-output"
}

resource "google_storage_bucket" "input" {
  name          = local.input_bucket_name
  location      = var.region
  storage_class = "STANDARD"
  force_destroy = true

  public_access_prevention    = "enforced"
  uniform_bucket_level_access = true

  versioning { enabled = false }

  lifecycle_rule {
    condition { age = 1 }
    action    { type = "Delete" }
  }
}

resource "google_storage_bucket" "output" {
  name          = local.output_bucket_name
  location      = var.region
  storage_class = "STANDARD"
  force_destroy = true

  public_access_prevention    = "enforced"
  uniform_bucket_level_access = true

  versioning { enabled = false }

  lifecycle_rule {
    condition { age = 1 }
    action    { type = "Delete" }
  }

  # Signed URL을 통한 브라우저 다운로드 지원
  cors {
    origin          = ["*"]   # MVP — 추후 Vercel 도메인으로 좁힘
    method          = ["GET"]
    response_header = ["Content-Type", "Content-Disposition"]
    max_age_seconds = 3600
  }
}
```

### 4.4 IAM (최소 권한)

```hcl
# iam.tf
resource "google_service_account" "backend" {
  account_id   = "ecofont-backend-sa"
  display_name = "Eco-Font Backend Service Account"
}

# input 버킷: Cloud Run이 객체 생성 (업로드)
resource "google_storage_bucket_iam_member" "backend_input" {
  bucket = google_storage_bucket.input.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.backend.email}"
}

# output 버킷: Cloud Run이 객체 생성 + signed URL 발급
resource "google_storage_bucket_iam_member" "backend_output" {
  bucket = google_storage_bucket.output.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.backend.email}"
}

# Cloud Run SA가 signed URL을 발급하려면 자신을 impersonate 할 수 있어야 함
resource "google_service_account_iam_member" "backend_self_signer" {
  service_account_id = google_service_account.backend.name
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "serviceAccount:${google_service_account.backend.email}"
}
```

> ⚠️ 마지막 `serviceAccountTokenCreator`는 GCS Signed URL을 SA 키 없이 발급하기 위한 자기 자신에 대한 impersonation 권한 — 키 파일 배포 없이도 안전하게 signed URL 생성 가능 (Cloud Run SA → 자기 자신 → URL 서명).

### 4.5 main.tf / variables.tf / outputs.tf

```hcl
# main.tf
terraform {
  required_version = ">= 1.7"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    bucket = "ecofont-terraform-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
```

```hcl
# variables.tf
variable "project_id" {
  description = "GCP 프로젝트 ID"
  type        = string
}

variable "region" {
  description = "GCP 리전"
  type        = string
  default     = "asia-northeast3"
}

variable "backend_image" {
  description = "Cloud Run에 배포할 컨테이너 이미지 URL (Artifact Registry)"
  type        = string
  # 예: "asia-northeast3-docker.pkg.dev/<project_id>/ecofont/backend:0.1.0"
}
```

```hcl
# outputs.tf
output "backend_url" {
  description = "Cloud Run 백엔드 URL"
  value       = google_cloud_run_v2_service.backend.uri
}

output "input_bucket" {
  description = "GCS input 버킷"
  value       = google_storage_bucket.input.name
}

output "output_bucket" {
  description = "GCS output 버킷"
  value       = google_storage_bucket.output.name
}

output "artifact_registry_repo" {
  description = "Artifact Registry repository URL prefix"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.ecofont.repository_id}"
}

output "service_account_email" {
  description = "백엔드 SA 이메일"
  value       = google_service_account.backend.email
}
```

```hcl
# terraform.tfvars.example
project_id    = "ecofont-prod-xxxxx"
region        = "asia-northeast3"
backend_image = "asia-northeast3-docker.pkg.dev/ecofont-prod-xxxxx/ecofont/backend:0.1.0"
```

---

## 5. 활성화 필수 GCP API

I-1 (GCP 프로젝트 생성) 시 동시 활성화:

| API | 사용 목적 |
|-----|-----------|
| `run.googleapis.com` | Cloud Run |
| `storage.googleapis.com` | GCS |
| `artifactregistry.googleapis.com` | Artifact Registry |
| `iam.googleapis.com` | Service Account |
| `iamcredentials.googleapis.com` | Signed URL (SA token creator) |
| `cloudresourcemanager.googleapis.com` | 프로젝트 메타데이터 |
| `serviceusage.googleapis.com` | API 활성화 자체 |

```bash
gcloud services enable \
  run.googleapis.com storage.googleapis.com \
  artifactregistry.googleapis.com iam.googleapis.com \
  iamcredentials.googleapis.com cloudresourcemanager.googleapis.com \
  serviceusage.googleapis.com
```

---

## 6. `docs/infrastructure.md` 대비 Delta

| 항목 | docs/ 원본 | 본 문서 (최종) | 근거 |
|------|-----------|----------------|------|
| Memory | 1Gi | **2Gi** | NFR-U2-PERF-4 |
| CPU | 1 vCPU | **2 vCPU** | NFR Design §3 (CPU intensive) |
| max_instances | 3 | **1** | NFR-U2-REL-2 (in-memory store) |
| request_concurrency | 1 (수동) | **1 (명시)** | NFR-U2-REL-3 |
| timeout | 300s | **600s** | NFR-U2-PERF-3 마진 |
| CPU 할당 | (미명시) | **항상 할당 (cpu_idle=false)** | NFR Design — 백그라운드 task 안정성 |
| GCS 버킷 | 1개 (`font-upload`) | **2개 (input/output)** | Functional Design §4.4 |
| CORS | 모든 method 허용 | **output 버킷 GET만** | 최소 권한 + 다운로드 전용 |
| Container Registry | GCR | **Artifact Registry** | GCR deprecated |
| Probe (startup/liveness) | 없음 | **`/health` 사용** | NFR-U2-OPS-1 |
| Signed URL SA impersonation | 없음 | **`serviceAccountTokenCreator` self-binding** | 키 파일 없이 signed URL 발급 |

---

## 7. 배포 흐름 (수동, Open-3 결정 전)

1. **I-1**: 소은이 GCP 프로젝트 생성 + §5 API 활성화 + 빌링 연결
2. **I-2**: `gsutil mb -l asia-northeast3 -b on gs://ecofont-terraform-state` (Terraform 자체로 못 만드는 부트스트랩)
3. **컨테이너 빌드/푸시** (Code Generation 후):
   ```bash
   gcloud auth configure-docker asia-northeast3-docker.pkg.dev
   docker build -t asia-northeast3-docker.pkg.dev/$PROJECT_ID/ecofont/backend:0.1.0 apps/backend
   docker push asia-northeast3-docker.pkg.dev/$PROJECT_ID/ecofont/backend:0.1.0
   ```
4. **Terraform apply**:
   ```bash
   cd infra
   terraform init
   terraform plan  -var-file=terraform.tfvars
   terraform apply -var-file=terraform.tfvars
   ```
5. **Frontend env 업데이트**: `outputs.backend_url` 을 Vercel 환경변수에 반영

> Open-3 (CI/CD) 결정 후: 3~4를 GitHub Actions로 자동화 (이미지 빌드 → 푸시 → `terraform apply -var=backend_image=$NEW_TAG`).

---

## 8. Open Items 갱신

| ID | 상태 | 비고 |
|----|------|------|
| Open-1: 잉크 절약률 산출 방법 | 미해결 | Code Gen 전 |
| Open-2: CO2 환산 계수 | 미해결 | Code Gen 전 |
| Open-3: CI/CD 파이프라인 | 미해결 | 본 문서 §7에 수동 흐름 명시, 자동화는 별도 |
| Open-4: 의존성 도구 | ✅ 해결 (uv) | NFR Design |
| Open-5: 베이스 이미지 | ✅ 해결 (slim-bookworm) | NFR Design |

**신규 Open Item 없음**.

---

## 9. 본 단계 확정 결정 요약

| ID | 결정 |
|----|------|
| INFRA-1 | Terraform 디렉토리 = flat 구조 (모듈 분할 안 함, MVP) |
| INFRA-2 | Container Registry = **Artifact Registry** (GCR → AR) |
| INFRA-3 | GCS 버킷 = **input/output 2개 분리** |
| INFRA-4 | Cloud Run CPU = **2 vCPU**, memory = **2 Gi**, timeout = **600s** |
| INFRA-5 | CPU 항상 할당 (`cpu_idle=false`) — 백그라운드 asyncio task 안정성 |
| INFRA-6 | output 버킷 CORS = `GET` only (다운로드 전용) |
| INFRA-7 | Signed URL 발급용 SA 자기 impersonation (`serviceAccountTokenCreator`) |
| INFRA-8 | `/health` 기반 startup/liveness probe |
| INFRA-9 | 활성화 API 7개 명시 |

---

## 10. 승인 옵션

- **변경 요청**: 위 스펙·HCL·Delta 중 수정할 부분
- **다음 단계 진행**: NFR Design + Infra Design 한 PR로 묶어 커밋 + 푸시 + PR 생성. 머지 후 Unit 2 **Code Generation** 단계 진입
