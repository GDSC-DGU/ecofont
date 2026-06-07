variable "project_id" {
  description = "GCP 프로젝트 ID"
  type        = string
}

variable "region" {
  description = "GCP 리전 (기본: 서울)"
  type        = string
  default     = "asia-northeast3"
}

variable "backend_image" {
  description = "Cloud Run에 배포할 컨테이너 이미지 URL (Artifact Registry)"
  type        = string
  # 예: "asia-northeast3-docker.pkg.dev/<project_id>/ecofont/backend:0.1.0"
}
