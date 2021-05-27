resource "google_compute_instance" "docker" {
  count = 1

  name         = "nj-api"
  machine_type = var.machine_type
  zone         = var.region_zone
  tags         = var.app_tags

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2004-focal-v20210510"
    }
  }

  network_interface {
    network = "default"

    access_config {
      # Ephemeral
    }
  }

  metadata = {
    ssh-keys = "root:${file(var.public_key_path)}"
  }


  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "root"
      host        = self.network_interface.0.access_config.0.nat_ip
      private_key = file(var.private_key_path)
      agent       = false
    }

    inline = [
      "sudo curl -sSL https://get.docker.com/ | sh",
      "sudo usermod -aG docker `echo $USER`"
    ]
  }

  service_account {
    scopes = ["https://www.googleapis.com/auth/compute.readonly"]
  }
}

resource "null_resource" "docker" {
  depends_on = [google_compute_instance.docker]

  connection {
    type        = "ssh"
    user        = "root"
    host        = google_compute_instance.docker.0.network_interface.0.access_config.0.nat_ip
    private_key = file(var.private_key_path)
    agent       = false
  }

  provisioner "file" {
    source = var.gcp_cred_path
    destination = "/home/gcp.json"
  }

  provisioner "remote-exec" {
    inline = [
      "docker run -d -v /home/gcp.json:/usr/gcp.json --env GCP_PROJECT_ID=${var.project_name} --env GOOGLE_APPLICATION_CREDENTIALS=/usr/gcp.json -p 80:3000 ${var.image}"
    ]
  }
}

resource "google_compute_firewall" "default" {
  name    = "nj-api-www-firewall"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = var.app_tags
}
