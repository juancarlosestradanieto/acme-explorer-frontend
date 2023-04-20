#! /bin/sh
docker compose -p "acme-explorer-frontend" -f docker-compose.yml -f docker-compose.dev.yml --env-file ./.env up --build -d
docker exec acme-explorer-frontend-container //bin//sh -c " npm install "
docker exec acme-explorer-frontend-container //bin//sh -c " chmod 777 -R . "
