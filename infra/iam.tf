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

# output 버킷: Cloud Run이 객체 생성 + Signed URL 발급
resource "google_storage_bucket_iam_member" "backend_output" {
  bucket = google_storage_bucket.output.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.backend.email}"
}

# Cloud Run SA가 자기 자신을 impersonate 가능하게 — Signed URL을 키 파일 없이 발급
resource "google_service_account_iam_member" "backend_self_signer" {
  service_account_id = google_service_account.backend.name
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "serviceAccount:${google_service_account.backend.email}"
}
