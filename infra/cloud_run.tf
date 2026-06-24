resource "google_cloud_run_v2_service" "backend" {
  name     = "ecofont-backend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"
  # deletion_protection 은 google provider 6.x+ 전용 → ~> 5.0 핀에서는 생략 (5.x 미지원)

  template {
    service_account                  = google_service_account.backend.email
    timeout                          = "1200s" # 20분 — SSIM 최적화(Unit 3) 여유
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
          memory = "4Gi" # SSIM 최적화 OOM 방어 (메모리 상향 비용은 미미)
        }
        cpu_idle          = false
        startup_cpu_boost = false
      }

      env {
        name  = "GCS_ASSET_BUCKET"
        value = google_storage_bucket.assets.name
      }
      env {
        name  = "MAX_FILE_SIZE_BYTES"
        value = "52428800" # 50MB
      }
      env {
        name  = "CORS_ALLOW_ORIGINS"
        value = var.cors_allow_origins
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
        failure_threshold     = 6
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

  depends_on = [
    google_artifact_registry_repository.ecofont,
    google_storage_bucket_iam_member.backend_assets,
  ]

  # 이미지 배포는 CI(GitHub Actions의 gcloud run deploy)가 담당 → Terraform이
  # git SHA 태그를 var.backend_image(고정값)로 되돌리지 않도록 image 변경 무시.
  # client/client_version은 gcloud deploy가 찍는 메타 → 무시하지 않으면 apply마다 드리프트.
  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      client,
      client_version,
    ]
  }
}

# 공개 호출 허용 (인증 미적용, NFR-U2-SEC-4)
resource "google_cloud_run_v2_service_iam_member" "public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
