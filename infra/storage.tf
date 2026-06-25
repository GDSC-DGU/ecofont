locals {
  asset_bucket_name = "${var.project_id}-ecofont-assets"
}

# 생성 결과물(후보 TTF 20개·zip·manifest·preview PNG) 저장 버킷.
# Cloud Run이 결과물을 put 하고, /v1/assets 핸들러가 get 해서 프록시 서빙한다.
resource "google_storage_bucket" "assets" {
  name          = local.asset_bucket_name
  location      = var.region
  storage_class = "STANDARD"
  force_destroy = true

  public_access_prevention    = "enforced"
  uniform_bucket_level_access = true

  versioning {
    enabled = false
  }

  # 결과물은 1일 후 자동 삭제.
  lifecycle_rule {
    condition {
      age = 1
    }
    action {
      type = "Delete"
    }
  }

  # 다운로드는 Cloud Run이 GCS object를 읽어 프록시 서빙한다(상대경로 /v1/assets/...).
  # 브라우저가 GCS에 직접 접근하지 않으므로 버킷 CORS 불필요 (Signed URL 방식 폐기).
}
