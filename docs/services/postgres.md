# PostgreSQL

PostgreSQL 18 với pgvector, SSL tự động, và pg_stat_statements.

## Dockerfile

```dockerfile
ARG POSTGRES_VERSION=18
FROM postgres:${POSTGRES_VERSION}

RUN apt-get update && apt-get install -y \
    openssl sudo postgresql-18-pgvector \
    && rm -rf /var/lib/apt/lists/*
```

**Extensions:**
- `pgvector` — vector similarity search cho AI embeddings
- `pg_stat_statements` — query performance monitoring (tự động thêm)

## SSL Certificates

Certificates được tự động tạo khi database init lần đầu:

- **Thuật toán**: x509v3 với SAN `DNS:localhost`
- **Thời hạn**: 820 ngày (mặc định)
- **Tự gia hạn**: `wrapper.sh` kiểm tra mỗi lần container start, gia hạn nếu hết hạn trong 30 ngày

```
postgres/data/certs/
├── root.crt     # CA certificate
├── root.key     # CA private key
├── server.crt   # Server certificate
├── server.key   # Server private key
└── server.csr   # Certificate signing request
```

## Wrapper Script

`wrapper.sh` chạy trước PostgreSQL để:

1. Kiểm tra volume mount path (cho Railway)
2. Kiểm tra PGDATA path
3. Kiểm tra/gia hạn SSL certificate
4. Thêm `pg_stat_statements` vào `shared_preload_libraries`
5. Gọi Docker entrypoint chính thức

## Authentication

`pg_hba.conf` cấu hình:

| Kết nối | Method |
|---------|--------|
| Local Unix socket | `trust` |
| Localhost (127.0.0.1, ::1) | `trust` |
| Remote | `scram-sha-256` |

## Volumes

| Host | Container | Mục đích |
|------|-----------|---------|
| `./postgres/data` | `/var/lib/postgresql/data` | Database files + SSL certs |
| `./postgres/conf/postgresql.conf` | `/etc/postgresql/postgresql.conf` | Config (read-only) |
| `./postgres/conf/pg_hba.conf` | `/etc/postgresql/pg_hba.conf` | Auth config (read-only) |
| `./postgres/init.sql` | `/docker-entrypoint-initdb.d/init.sql` | Init SQL (read-only) |
| `./postgres/log` | `/var/log/postgresql` | Log files |

## Custom Init SQL

Thêm SQL cho lần init đầu tiên vào `postgres/init.sql`:

```sql
-- Ví dụ: tạo extension pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Tạo database bổ sung
-- CREATE DATABASE my_other_db;
```

::: warning
`init.sql` chỉ chạy khi database **chưa tồn tại**. Nếu `postgres/data/pgdata/` đã có data, file này bị bỏ qua.
:::

## Kết nối từ host

```bash
# psql
psql -h localhost -p 5432 -U odoo -d odoo

# Hoặc qua Docker
docker exec -it postgres psql -U odoo -d odoo
```
