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

variable "cors_allow_origins" {
  description = "CORS 허용 출처 (콤마 구분). 프론트 배포 도메인."
  type        = string
  default     = "http://localhost:3000,https://ecofont.vercel.app"
}

variable "github_repository" {
  description = "CI/CD WIF 허용 대상 GitHub 저장소 (owner/repo)"
  type        = string
  default     = "GDSC-DGU/ecofont"
}
