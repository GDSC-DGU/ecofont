resource "google_artifact_registry_repository" "ecofont" {
  location      = var.region
  repository_id = "ecofont"
  format        = "DOCKER"
  description   = "Eco-Font container images"
}
