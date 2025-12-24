Build image

docker compose build

Chạy database

docker compose up -d sqlserver minio

Chạy migrate database (EF Core)

docker compose run --rm migrate

Start backend API

docker compose up -d backend

Dừng hệ thống

docker compose down
