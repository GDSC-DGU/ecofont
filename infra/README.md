# Infrastructure (Terraform)

Eco-Font GCP 리소스 정의. 출처: `aidlc-docs/construction/unit-2/infrastructure-design.md`.

## 리소스 요약

| 리소스 | 파일 |
|--------|------|
| Provider + state backend | `main.tf` |
| Artifact Registry (Docker) | `artifact_registry.tf` |
| GCS input/output 버킷 + Lifecycle 1일 | `storage.tf` |
| Service Account + IAM (최소 권한) | `iam.tf` |
| Cloud Run v2 service | `cloud_run.tf` |

## 사전 준비 (1회)

```bash
# 1. GCP 프로젝트 생성 + 빌링 연결 (gcloud 또는 콘솔)
gcloud projects create <PROJECT_ID>
gcloud config set project <PROJECT_ID>
gcloud billing projects link <PROJECT_ID> --billing-account=<BILLING_ACCOUNT>

# 2. 필수 API 활성화
gcloud services enable \
  run.googleapis.com storage.googleapis.com \
  artifactregistry.googleapis.com iam.googleapis.com \
  iamcredentials.googleapis.com cloudresourcemanager.googleapis.com \
  serviceusage.googleapis.com

# 3. Terraform 상태 버킷 수동 생성 (부트스트랩)
gsutil mb -l asia-northeast3 -b on gs://ecofont-terraform-state
gsutil versioning set on gs://ecofont-terraform-state
```

## 배포

```bash
# tfvars 작성
cp terraform.tfvars.example terraform.tfvars
# project_id, backend_image 채우기

# 첫 배포 전: 컨테이너 이미지 빌드/푸시
gcloud auth configure-docker asia-northeast3-docker.pkg.dev
docker build -t asia-northeast3-docker.pkg.dev/<PROJECT_ID>/ecofont/backend:0.1.0 ../apps/backend
docker push asia-northeast3-docker.pkg.dev/<PROJECT_ID>/ecofont/backend:0.1.0

# Terraform
terraform init
terraform plan  -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

## 출력값

- `backend_url`: Cloud Run 서비스 URL (Frontend 환경변수로 설정)
- `input_bucket` / `output_bucket`: GCS 버킷 이름 (디버깅용)
- `artifact_registry_repo`: 이미지 푸시 대상 URL prefix
- `service_account_email`: Cloud Run SA 이메일

## NFR 매핑

| NFR-U2-* | Terraform 위치 |
|----------|----------------|
| REL-2 max_instances=1 | `cloud_run.tf:scaling.max_instance_count` |
| REL-3 concurrency=1 | `cloud_run.tf:max_instance_request_concurrency` |
| PERF-4 memory ≤2Gi | `cloud_run.tf:resources.limits.memory` |
| SEC-1 버킷 비공개 | `storage.tf:public_access_prevention="enforced"` |
| SEC-2 SA 최소 권한 | `iam.tf` 버킷 레벨 바인딩 |
| COST-1/2 instances 0~1 | `cloud_run.tf:scaling` |
| COST-4 GCS Lifecycle | `storage.tf:lifecycle_rule.condition.age=1` |
| OPS-1 /health probe | `cloud_run.tf:startup_probe/liveness_probe` |

## 평상시(idle) 비용

본 인프라는 짧은 집중 개발 + idle 기간을 가정 → **idle 시 거의 $0** 설계:

| 리소스 | idle 시 비용 |
|--------|--------------|
| Cloud Run | **$0** — `min_instances=0`, 요청 없으면 인스턴스 부재 |
| GCS input/output 버킷 | ~$0 — Lifecycle 1일 자동 삭제로 파일 누적 없음 |
| Artifact Registry | ~$0.07/이미지/월 — 이미지 1~2개 유지 시 무시 가능 (cleanup 정책은 후속 과제) |
| IAM·SA | $0 |
| Cloud Logging | $0 — 무료 티어 50GB/월 |

**완전 정지 옵션** (필요 시):
```bash
# Cloud Run 서비스만 제거 (이미지·버킷·SA·IAM은 유지)
terraform destroy -target=google_cloud_run_v2_service.backend
# 재개
terraform apply -var-file=terraform.tfvars
```

→ 사실 위 destroy 없이도 `min_instances=0`만으로 idle 비용 $0이라 일반적으로 불필요.

---

## CI/CD (Open-3, 구현됨)

- **Frontend** = Vercel 자동 배포 (별도 설정 없음)
- **Backend** = GitHub Actions → Cloud Run (`.github/workflows/backend-deploy.yml`)
  - 트리거: `develop`에 `apps/backend/**`·`infra/cloud_run.tf`·워크플로 변경 push (+ 수동 `workflow_dispatch`)
  - 흐름: WIF 인증 → `docker build`(linux/amd64) → Artifact Registry push(태그=git SHA) → `gcloud run deploy`
  - **인증**: Workload Identity Federation (키리스, `cicd.tf`). 장기 비밀키 없음.
  - **Terraform 분리**: `cloud_run.tf`가 `image`를 `ignore_changes` → 인프라는 Terraform, 이미지 배포는 CI 담당 (드리프트 방지)
  - **GitHub repo 변수** (비밀 아님, `terraform output`으로 확인): `GCP_WIF_PROVIDER`=`github_wif_provider`, `GCP_DEPLOYER_SA`=`github_deployer_sa`

## Open Items / 후속 의제

- **Artifact Registry cleanup 정책**: `google_artifact_registry_repository_cleanup_policy`로 keep-last-N + age-based 삭제. CI가 SHA 태그로 매 배포마다 이미지를 쌓으므로 누적 방지 필요.
