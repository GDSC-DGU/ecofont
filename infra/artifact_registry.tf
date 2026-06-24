resource "google_artifact_registry_repository" "ecofont" {
  location      = var.region
  repository_id = "ecofont"
  format        = "DOCKER"
  description   = "Eco-Font container images"

  # CI가 배포마다 git SHA 태그 이미지를 쌓으므로 누적 비용 방지.
  # 평가: KEEP(보호)가 DELETE보다 우선 → 최신 5개는 나이와 무관하게 항상 보존.
  cleanup_policy_dry_run = false

  cleanup_policies {
    id     = "keep-recent-5"
    action = "KEEP"
    most_recent_versions {
      keep_count = 5
    }
  }

  cleanup_policies {
    id     = "delete-older-than-30d"
    action = "DELETE"
    condition {
      older_than = "2592000s" # 30일
    }
  }
}
