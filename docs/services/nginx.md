# Nginx

Reverse proxy với caching thông minh, WebSocket routing, và bảo vệ database manager.

## Tính năng

- **Dynamic DNS** — Resolve upstream mỗi 10 giây, tránh stale IP khi container restart
- **Multi-layer cache** — Static (60d), images (7d), S3 media (30d)
- **WebSocket routing** — Tự động chọn port dựa trên worker mode
- **SSE streaming** — Unbuffered proxy cho AI chat
- **Security** — Block `/web/database/`, block `/s3-media/configs/`
- **Gzip** — Nén CSS, JS, JSON, SVG

## Caching

| Location | Cache TTL | Mô tả |
|----------|-----------|-------|
| `/web/static/` | 60 ngày | JS, CSS, fonts, icons |
| `/web/image/` | 7 ngày | Product images, avatars |
| `/web/content/` | 7 ngày | Reports, downloads |
| `/s3-media/` | 30 ngày | Filestore từ MinIO |

Cache được lưu tại `nginx/cache/` (mount volume).

Header `X-Cache-Status` cho biết trạng thái cache:
- `HIT` — Serve từ cache
- `MISS` — Fetch từ upstream, lưu cache
- `EXPIRED` — Cache hết hạn, fetch lại

## WebSocket Routing

Nginx entrypoint tự động cấu hình:

```
WORKERS=0  → WebSocket proxy đến $odoo_http  (port 8069)
WORKERS>0  → WebSocket proxy đến $odoo_ws    (port 8072)
```

## S3 Media

URL `/s3-media/*` được rewrite và proxy trực tiếp đến MinIO:

```
/s3-media/path/to/file → MinIO /odoo/path/to/file
```

Endpoint `/s3-media/configs/` bị block (return 403) để bảo vệ bucket private.

## Database Manager

Mặc định bị block:

```ini
ENABLE_DB_MANAGER=false  # → return 403
ENABLE_DB_MANAGER=true   # → proxy đến Odoo
```

## SSL

Uncomment trong `nginx/nginx.conf` và mount certificate:

```bash
nginx/ssl/
├── origin.pem    # Certificate
└── origin.key    # Private key
```

## Volumes

| Host | Container | Mục đích |
|------|-----------|---------|
| `./nginx/log` | `/var/log/nginx` | Access & error logs |
| `./nginx/ssl` | `/etc/nginx/ssl` | SSL certificates (read-only) |
| `./nginx/cache` | `/var/cache/nginx/odoo` | Proxy cache |

## Config Template

Config sử dụng `envsubst` tại runtime. Các biến được thay thế:

- `${ODOO_HOST}`, `${ODOO_PORT}`, `${ODOO_WS_PORT}`
- `${MINIO_HOST}`, `${MINIO_PORT}`
- `${DB_MANAGER_RULE}`, `${WEBSOCKET_PROXY_RULE}`
- `${NGINX_RESOLVER}` — DNS resolver từ `/etc/resolv.conf`
