# CI/CD — GitHub Actions가 Workload Identity Federation(키리스)로 GCP에 인증해
# 백엔드 이미지를 Artifact Registry에 push하고 Cloud Run 새 revision을 배포한다.
# (Open-3) 장기 비밀키 없이 OIDC 토큰 교환만 사용.

# 배포 전용 서비스 계정 — 런타임 SA(google_service_account.backend)와 분리.
resource "google_service_account" "github_deployer" {
  account_id   = "github-actions-deployer"
  display_name = "GitHub Actions CI/CD Deployer"
}

# Cloud Run revision 배포 권한
resource "google_project_iam_member" "deployer_run" {
  project = var.project_id
  role    = "roles/run.developer"
  member  = "serviceAccount:${google_service_account.github_deployer.email}"
}

# Artifact Registry 이미지 push 권한 (해당 repo 한정)
resource "google_artifact_registry_repository_iam_member" "deployer_push" {
  location   = google_artifact_registry_repository.ecofont.location
  repository = google_artifact_registry_repository.ecofont.repository_id
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.github_deployer.email}"
}

# 런타임 SA로 동작하는 서비스를 배포하려면 그 SA를 actAs 할 수 있어야 함
resource "google_service_account_iam_member" "deployer_act_as_runtime" {
  service_account_id = google_service_account.backend.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.github_deployer.email}"
}

# ── Workload Identity Federation (GitHub OIDC) ──
resource "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = "github-pool"
  display_name              = "GitHub Actions Pool"
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"
  display_name                       = "GitHub OIDC"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
  }

  # 지정한 저장소에서 온 토큰만 허용 (탈취 토큰으로 임의 repo가 인증하는 것 차단)
  attribute_condition = "assertion.repository == \"${var.github_repository}\""

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

# 해당 GitHub 저장소가 배포 SA를 impersonate 하도록 허용
resource "google_service_account_iam_member" "deployer_wif" {
  service_account_id = google_service_account.github_deployer.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repository}"
}
