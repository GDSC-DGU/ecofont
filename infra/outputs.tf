output "backend_url" {
  description = "Cloud Run 백엔드 URL"
  value       = google_cloud_run_v2_service.backend.uri
}

output "input_bucket" {
  description = "GCS input 버킷 이름"
  value       = google_storage_bucket.input.name
}

output "output_bucket" {
  description = "GCS output 버킷 이름"
  value       = google_storage_bucket.output.name
}

output "artifact_registry_repo" {
  description = "Artifact Registry repository URL prefix (이미지 push 대상)"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.ecofont.repository_id}"
}

output "service_account_email" {
  description = "백엔드 Cloud Run Service Account 이메일"
  value       = google_service_account.backend.email
}
