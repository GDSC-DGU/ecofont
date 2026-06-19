resource "google_cloud_run_v2_service" "backend" {
  name     = "ecofont-backend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"
  # deletion_protection 은 google provider 6.x+ 전용 → ~> 5.0 핀에서는 생략 (5.x 미지원)

  template {
    service_account                  = google_service_account.backend.email
    timeout                          = "600s"
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
    google_storage_bucket_iam_member.backend_input,
    google_storage_bucket_iam_member.backend_output,
  ]
}

# 공개 호출 허용 (인증 미적용, NFR-U2-SEC-4)
resource "google_cloud_run_v2_service_iam_member" "public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
