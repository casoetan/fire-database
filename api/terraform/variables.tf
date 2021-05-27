variable "region" {
  default = "us-east1"
}

variable "region_zone" {
  default = "us-east1-b"
}

variable "project_name" {
  description = "The ID of the Google Cloud project"
}

variable "gcp_cred_path" {
  description = "The Google Cloud config file path"
  default     = "~/.gcloud/nj-db.json"
}

variable "credentials_file_path" {
  description = "Path to the JSON file used to describe your account credentials"
  default     = "~/.gcloud/nj-db.json"
}

variable "public_key_path" {
  description = "Path to file containing public key"
  default     = "~/.ssh/gcloud_id_rsa.pub"
}

variable "private_key_path" {
  description = "Path to file containing private key"
  default     = "~/.ssh/gcloud_id_rsa"
}

variable "machine_type" {
  description = "Machine type"
  default     = "f1-micro"
}

variable "app_tags" {
  description = "Application tags"
  default     = ["docker-node", "http-server", "https-server"]
}

variable "image" {
  description = "Docker image to run"
  default     = "casoetan/nj-db-api"
}