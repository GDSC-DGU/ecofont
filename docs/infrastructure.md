# Infrastructure Document: Eco-Font Project

IaC 도구: **Terraform** (`hashicorp/google` ~> 5.0)
모든 GCP 리소스는 Terraform으로 관리. Pinecone·Vercel은 별도 콘솔 관리.

---

## 디렉토리 구조

```
infra/
├── main.tf          # provider, backend 설정
├── variables.tf     # 입력 변수 정의
├── outputs.tf       # 주요 리소스 출력값
├── gcs.tf           # GCS 버킷 및 Lifecycle
├── cloud_run.tf     # Cloud Run 서비스
└── iam.tf           # 서비스 계정 및 IAM 권한
```

---

## 리소스 스펙 정의

### Cloud Run (백엔드)

| 항목 | 값 | 근거 |
|------|-----|------|
| CPU | 1 vCPU | FontTools + SciPy 처리 기준 |
| Memory | 1Gi | 글리프 벡터 연산 및 SSIM 계산 여유 확보 |
| Min instances | 0 | 콜드 스타트 허용, 비용 절감 우선 |
| Max instances | 3 | MVP 트래픽 기준 |
| Request timeout | 300s | 폰트 변환 최대 소요 시간 고려 |
| Concurrency | 1 | CPU 집약적 작업, 요청 당 단일 처리 |
| Region | asia-northeast3 | 서울 리전 |

### GCS 버킷 (파일 스토리지)

| 항목 | 값 | 근거 |
|------|-----|------|
| Storage class | STANDARD | 단기 임시 저장 용도 |
| Location | asia-northeast3 | Cloud Run과 동일 리전, 전송 비용 절감 |
| Lifecycle | 1일 후 자동 삭제 | 저작권 보호, GCS 최소 단위 1일 |
| Versioning | 비활성화 | 임시 파일, 버전 관리 불필요 |
| Public access | 차단 | 서비스 계정 통해서만 접근 |

### IAM 서비스 계정

| 권한 | 역할 | 대상 |
|------|------|------|
| GCS 읽기/쓰기/삭제 | `roles/storage.objectAdmin` | 폰트 파일 업로드·삭제 |

---

## Terraform 코드

### main.tf

```hcl
terraform {
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

### variables.tf

```hcl
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
  description = "Cloud Run에 배포할 Docker 이미지 URL"
  type        = string
  # 예: "gcr.io/<project_id>/ecofont-backend:latest"
}

```

### gcs.tf

```hcl
resource "google_storage_bucket" "font_upload" {
  name          = "${var.project_id}-font-upload"
  location      = var.region
  storage_class = "STANDARD"
  force_destroy = true

  public_access_prevention = "enforced"

  versioning {
    enabled = false
  }

  lifecycle_rule {
    condition {
      age = 1
    }
    action {
      type = "Delete"
    }
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "PUT", "POST"]
    response_header = ["Content-Type"]
    max_age_seconds = 3600
  }
}
```

### cloud_run.tf

```hcl
resource "google_cloud_run_v2_service" "backend" {
  name     = "ecofont-backend"
  location = var.region

  template {
    service_account = google_service_account.backend.email

    containers {
      image = var.backend_image

      resources {
        limits = {
          cpu    = "1"
          memory = "1Gi"
        }
      }

      env {
        name  = "GCS_BUCKET"
        value = google_storage_bucket.font_upload.name
      }

      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }

      env {
        name  = "GCP_REGION"
        value = var.region
      }

    }

    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }

    timeout = "300s"
  }
}

# 공개 접근 허용 (인증 없이 API 호출 가능)
resource "google_cloud_run_v2_service_iam_member" "public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
```

### iam.tf

```hcl
resource "google_service_account" "backend" {
  account_id   = "ecofont-backend-sa"
  display_name = "Eco-Font Backend Service Account"
}

resource "google_storage_bucket_iam_member" "backend_gcs" {
  bucket = google_storage_bucket.font_upload.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.backend.email}"
}

```

### outputs.tf

```hcl
output "backend_url" {
  description = "Cloud Run 백엔드 URL"
  value       = google_cloud_run_v2_service.backend.uri
}

output "gcs_bucket_name" {
  description = "GCS 버킷 이름"
  value       = google_storage_bucket.font_upload.name
}

output "service_account_email" {
  description = "백엔드 서비스 계정 이메일"
  value       = google_service_account.backend.email
}
```

---

## Terraform 외부 관리 항목

| 항목 | 관리 방법 | 이유 |
|------|-----------|------|
| Vercel 배포 | Vercel 콘솔 또는 CLI | MVP 단계, 별도 provider 불필요 |
| Docker 이미지 빌드/푸시 | 수동 또는 GitHub Actions | CI/CD 미포함 (MVP) |
| Terraform 상태 버킷 | GCP 콘솔에서 수동 1회 생성 | 부트스트랩 문제 |

---

## 초기 세팅 순서

1. GCP 프로젝트 생성 및 결제 계정 연결
2. 아래 API 활성화 (GCP 콘솔)
   - Cloud Run API
   - Cloud Storage API
3. Terraform 상태 버킷 수동 생성: `ecofont-terraform-state`
4. `terraform init`
5. `terraform plan -var="project_id=<YOUR_PROJECT_ID>" -var="backend_image=<IMAGE_URL>"`
6. `terraform apply`

---

## TODO

- [ ] CI/CD 파이프라인 연동 방식 결정 (GitHub Actions 등)
- [ ] Cloud Run concurrency 값 실측 후 조정
