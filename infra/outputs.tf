output "backend_url" {
  description = "Cloud Run 백엔드 URL"
  value       = google_cloud_run_v2_service.backend.uri
}

output "asset_bucket" {
  description = "GCS asset 버킷 이름 (생성 결과물 저장·서빙)"
  value       = google_storage_bucket.assets.name
}

output "artifact_registry_repo" {
  description = "Artifact Registry repository URL prefix (이미지 push 대상)"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.ecofont.repository_id}"
}

output "service_account_email" {
  description = "백엔드 Cloud Run Service Account 이메일"
  value       = google_service_account.backend.email
}

output "github_wif_provider" {
  description = "GitHub Actions auth에 넣을 Workload Identity Provider 전체 경로 (repo 변수 GCP_WIF_PROVIDER)"
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "github_deployer_sa" {
  description = "GitHub Actions가 impersonate할 배포 SA 이메일 (repo 변수 GCP_DEPLOYER_SA)"
  value       = google_service_account.github_deployer.email
}
