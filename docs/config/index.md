# Biến môi trường

Cấu hình toàn bộ stack qua biến môi trường. Mỗi service đọc từ file `.env` riêng, kết hợp với giá trị mặc định trong `docker-compose.yaml`.

::: info Thứ tự ưu tiên
`environment` (docker-compose) > `env_file` (.env) > `Dockerfile ENV`
:::

## Odoo (`odoo/.env`)

### Server

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `PORT` | `8069` | HTTP port |
| `WS_PORT` | `8072` | WebSocket / gevent port |
| `PROXY_MODE` | `True` | Đọc header X-Forwarded từ Nginx |
| `ADMIN_PASSWD` | `admin` | Master password cho database manager |
| `ADDONS_PATH` | `/mnt/extra-addons,...` | Đường dẫn addons |
| `DATA_DIR` | `/var/lib/odoo` | Thư mục data |
| `WITHOUT_DEMO` | `True` | Không load demo data |

### Workers & Limits

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `WORKERS` | `0` | Số worker processes (0 = single-process) |
| `MAX_CRON_THREADS` | `2` | Số thread cho cron jobs |
| `LIMIT_MEMORY_HARD` | `2684354560` | Memory hard limit (2.5 GB) |
| `LIMIT_MEMORY_SOFT` | `2147483648` | Memory soft limit (2 GB) |
| `LIMIT_TIME_CPU` | `600` | CPU time limit (giây) |
| `LIMIT_TIME_REAL` | `1200` | Wall-clock time limit (giây) |
| `LIMIT_REQUEST` | `8192` | Max requests per worker trước khi recycle |

### Database

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `DB_HOST` | `postgres` | Database host |
| `DB_PORT` | `5432` | Database port |
| `DB_USER` | `odoo` | Database user |
| `DB_PASSWORD` | `odoo` | Database password |
| `DB_NAME` | `odoo` | Database name |
| `DB_MAXCONN` | `64` | Max connections |
| `DB_SSLMODE` | `prefer` | SSL mode |
| `DB_TEMPLATE` | `template0` | Template database |
| `DBFILTER` | _(trống)_ | Regex filter database |
| `LIST_DB` | `True` | Hiển thị danh sách database |

### Logging

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `LOG_LEVEL` | `info` | Log level |
| `LOG_HANDLER` | `:INFO` | Log handler pattern |
| `LOG_FILE` | _(trống)_ | File log (trống = stdout) |

### Runtime Flags

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `ODOO_INIT` | _(trống)_ | Modules để init (`-i`) |
| `ODOO_UPDATE` | _(trống)_ | Modules để update (`-u`) |
| `ODOO_DEV` | _(trống)_ | Dev mode (`reload,qweb,xml`) |

### S3 / MinIO

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `S3_ENDPOINT` | `http://minio:9000` | S3 endpoint URL |
| `S3_ACCESS_KEY` | `minioadmin` | Access key |
| `S3_SECRET_KEY` | `minioadmin` | Secret key |
| `S3_BUCKET` | `odoo` | Bucket name |
| `S3_REGION` | `us-east-1` | AWS region |

### ChromaDB

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `CHROMADB_HOST` | `chromadb` | ChromaDB host |
| `CHROMADB_PORT` | `8000` | ChromaDB port |

### SMTP

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `SMTP_HOST` | `localhost` | SMTP server |
| `SMTP_PORT` | `25` | SMTP port |
| `SMTP_USER` | _(trống)_ | SMTP username |
| `SMTP_PASSWORD` | _(trống)_ | SMTP password |
| `SMTP_SSL` | `False` | Sử dụng SSL |
| `EMAIL_FROM` | _(trống)_ | Địa chỉ gửi email |

## PostgreSQL (`postgres/.env`)

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `POSTGRES_DB` | `odoo` | Database name |
| `POSTGRES_USER` | `odoo` | Superuser name |
| `POSTGRES_PASSWORD` | `odoo` | Superuser password |
| `POSTGRES_PORT` | `5432` | Listen port |

## Nginx

Cấu hình qua `environment` trong `docker-compose.yaml`:

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `ODOO_HOST` | `odoo` | Hostname Odoo backend |
| `ODOO_PORT` | `8069` | HTTP port Odoo |
| `ODOO_WS_PORT` | `8072` | WebSocket port Odoo |
| `MINIO_HOST` | `minio` | Hostname MinIO |
| `MINIO_PORT` | `9000` | API port MinIO |
| `ENABLE_DB_MANAGER` | `false` | Cho phép `/web/database/` |
| `HTTP_PORT` | `80` | External HTTP port |
| `HTTPS_PORT` | `443` | External HTTPS port |

## PgAdmin

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `PGADMIN_DEFAULT_EMAIL` | `admin@example.com` | Email đăng nhập |
| `PGADMIN_DEFAULT_PASSWORD` | `admin` | Mật khẩu đăng nhập |
| `PGADMIN_PORT` | `5050` | Web port |

## MinIO

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `MINIO_ROOT_USER` | `minioadmin` | Admin username |
| `MINIO_ROOT_PASSWORD` | `minioadmin` | Admin password |
| `S3_BUCKET` | `odoo` | Tên bucket chính |
