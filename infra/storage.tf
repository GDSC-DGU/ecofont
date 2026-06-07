locals {
  input_bucket_name  = "${var.project_id}-ecofont-input"
  output_bucket_name = "${var.project_id}-ecofont-output"
}

resource "google_storage_bucket" "input" {
  name          = local.input_bucket_name
  location      = var.region
  storage_class = "STANDARD"
  force_destroy = true

  public_access_prevention    = "enforced"
  uniform_bucket_level_access = true

  versioning {
    enabled = false
  }

  lifecycle_rule {
    condition {
      age = 1
    }
    action {
      type = "Delete"
    }
  }
}

resource "google_storage_bucket" "output" {
  name          = local.output_bucket_name
  location      = var.region
  storage_class = "STANDARD"
  force_destroy = true

  public_access_prevention    = "enforced"
  uniform_bucket_level_access = true

  versioning {
    enabled = false
  }

  lifecycle_rule {
    condition {
      age = 1
    }
    action {
      type = "Delete"
    }
  }

  # 브라우저가 Signed URL로 직접 다운로드 — MVP는 모든 origin 허용
  cors {
    origin          = ["*"]
    method          = ["GET"]
    response_header = ["Content-Type", "Content-Disposition"]
    max_age_seconds = 3600
  }
}
