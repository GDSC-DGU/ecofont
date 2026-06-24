resource "google_service_account" "backend" {
  account_id   = "ecofont-backend-sa"
  display_name = "Eco-Font Backend Service Account"
}

# assets 버킷: Cloud Run이 결과물 쓰기(put) + 다운로드 서빙용 읽기(get)
resource "google_storage_bucket_iam_member" "backend_assets" {
  bucket = google_storage_bucket.assets.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.backend.email}"
}

# (Signed URL 폐기 → self-impersonation serviceAccountTokenCreator 권한 제거됨.
#  결과물 다운로드는 Cloud Run 프록시 서빙이라 토큰 발급이 필요 없다.)
