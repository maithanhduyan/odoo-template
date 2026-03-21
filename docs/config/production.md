# Triển khai Production

Hướng dẫn cấu hình cho môi trường production.

## Checklist

- [ ] Đổi tất cả mật khẩu mặc định
- [ ] Bật SSL/TLS cho Nginx
- [ ] Set `WORKERS` > 0
- [ ] Tắt `LIST_DB` và `ENABLE_DB_MANAGER`
- [ ] Đổi `ADMIN_PASSWD`
- [ ] Cấu hình backup
- [ ] Cấu hình SMTP

## 1. Mật khẩu

Đổi **tất cả** mật khẩu mặc định trong các file `.env`:

```ini
# odoo/.env
ADMIN_PASSWD=<strong-password>
DB_PASSWORD=<strong-password>
S3_ACCESS_KEY=<strong-key>
S3_SECRET_KEY=<strong-secret>

# postgres/.env
POSTGRES_PASSWORD=<strong-password>
```

::: danger
**Không bao giờ** sử dụng mật khẩu mặc định (`admin`, `odoo`, `minioadmin`) trên production.
:::

## 2. Workers

Single-process mode (`WORKERS=0`) chỉ phù hợp cho development. Trên production, tính số worker theo công thức:

$$
\text{workers} = 2 \times \text{CPU cores} + 1
$$

Ví dụ với 4 CPU cores:

```ini
# odoo/.env
WORKERS=9
MAX_CRON_THREADS=2
LIMIT_MEMORY_HARD=2684354560
LIMIT_MEMORY_SOFT=2147483648
```

::: tip
Khi `WORKERS > 0`, Nginx tự động route WebSocket qua port `8072` thay vì `8069`.
:::

## 3. SSL/TLS

### Với certificate có sẵn

Mount certificate vào `nginx/ssl/` và uncomment cấu hình SSL trong `nginx/nginx.conf`:

```nginx
listen 443 ssl;
ssl_certificate /etc/nginx/ssl/origin.pem;
ssl_certificate_key /etc/nginx/ssl/origin.key;
ssl_protocols       TLSv1.2 TLSv1.3;
ssl_ciphers         HIGH:!aNULL:!MD5;
```

### Với Cloudflare

Sử dụng Origin Certificate từ Cloudflare, đặt vào `nginx/ssl/`:

```
nginx/ssl/
├── origin.pem    # Certificate
└── origin.key    # Private key
```

## 4. Bảo mật Database

```ini
# odoo/.env
LIST_DB=False
DBFILTER=^odoo$

# docker-compose.yaml environment
ENABLE_DB_MANAGER=false
```

## 5. SMTP

```ini
# odoo/.env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-password
SMTP_SSL=True
EMAIL_FROM=noreply@yourdomain.com
```

## 6. PostgreSQL tuning

Chỉnh `postgres/conf/postgresql.conf` theo RAM server:

| Tham số | 4 GB RAM | 8 GB RAM | 16 GB RAM |
|---------|----------|----------|-----------|
| `shared_buffers` | 1 GB | 2 GB | 4 GB |
| `effective_cache_size` | 3 GB | 6 GB | 12 GB |
| `work_mem` | 16 MB | 32 MB | 64 MB |
| `maintenance_work_mem` | 256 MB | 512 MB | 1 GB |
| `max_connections` | 100 | 200 | 300 |

## 7. Logging cho Production

```ini
# odoo/.env
LOG_LEVEL=warn
LOG_HANDLER=:WARNING
LOG_FILE=
```

Giữ `LOG_FILE` trống để log ra stdout — Docker tự quản lý log rotation:

```yaml
# docker-compose.yaml - thêm vào mỗi service
logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"
```

## 8. Backup

### Database

```bash
# Backup
docker exec postgres pg_dump -U odoo odoo | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore
gunzip -c backup_20260322.sql.gz | docker exec -i postgres psql -U odoo odoo
```

### Filestore (MinIO)

```bash
# Sử dụng mc (MinIO Client)
mc alias set local http://localhost:9000 minioadmin minioadmin
mc mirror local/odoo ./backup/minio/
```
