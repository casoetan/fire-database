# NJ-DB API

Example application using the nj-db module

<!-- To Run locally -->
- Export GCP project id or add to .env
    `export GCP_PROJECT_ID=123456`

- Start the dev server (with reload on file change using nodemon)
    `npm run start-dev`

<!--To run production  -->
- Export GCP project id or add to .env
    `export GCP_PROJECT_ID=123456`

- Start the server (this builds the typescript files)
    `npm start`

<!-- Docker setupe -->
- Export GCP project id or add to .env
    `export GCP_PROJECT_ID=123456`

- Build the image
    `docker build . -t <username>/nj-db-api`

- Run the application in a container
    `docker run -p 3000:3000 -d <username>/nj-db-api`
