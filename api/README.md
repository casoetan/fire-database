# NJ-DB API

Example expressjs application using the nj-db module

Tbe application exposes endpoints to query Firebase firestore collections using
[nj-db][https://www.npmjs.com/package/@casoetan/nj-db]

## Run locally
- Export GCP project config or add to .env
    ```sh
    export GCP_PROJECT_ID=123456
    ...
    export GOOGLE_APPLICATION_CREDENTIALS=<path to gcp app settings file>
    ```

- Start the dev server (with reload on file change using nodemon)
    `npm run start-dev`

## Docker setup
- Build the image
    `docker build . -t <username>/nj-db-api`

- Run the application in a container
    `docker run --env GCP_PROJECT_ID=<project id> --env GOOGLE_APPLICATION_CREDENTIALS=~<gcp config file> -p 3000:3000 casoetan/nj-db-api`

- Using docker compose
    - Copy the `docker-compose.example.yml` file to `docker-compose.yml` 
    - Set the mount path for the gcp settings file
    - Update the environment variables
    - Run application `docker-compose up`

## Run in production
Production setup uses terraform

> Note: This wasn't been fully optimized for production, but has been setup as an example

### Steps

- Build image and push to docker hub or a private repository
    - `docker build . -t <repo-name>/<app-name>`
    - `docker push <repo-name>/<app-name>`
- Export application config for deployment (this env can bee seen in `terraform/variables.tf`)
    - Most have been set to reasonable defaults, but they may still need to be update based on your settings

- Navigate to the terraform directory and initialize the application (if this is your first time running the application)
    - `terraform init`

- Deploy the application
    ```sh
    terraform plan -out api.tplan # to plan the deployment
    ...
    terraform apply api.tplan # to deploy. This may take a while on first deployment
    ```
