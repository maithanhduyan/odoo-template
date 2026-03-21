# Kiến trúc hệ thống

## Tổng quan

```
Internet (Port 80/443)
        │
        ▼
┌──────────────────────────────────────────────┐
│  Nginx (Reverse Proxy + Cache + SSL)         │
│  ├─ Static assets    → cache 60 ngày         │
│  ├─ /web/image/      → cache 7 ngày          │
│  ├─ /s3-media/       → MinIO (cache 30 ngày) │
│  ├─ /websocket       → Odoo WS               │
│  └─ /                → Odoo HTTP              │
└──────────┬───────────────────┬───────────────┘
           │                   │
           ▼                   ▼
┌─────────────────┐   ┌──────────────┐
│  Odoo 19 (ERP)  │   │  MinIO (S3)  │
│  Port 8069/8072 │   │  Port 9000   │
└──┬──────┬───┬───┘   └──────────────┘
   │      │   │
   ▼      │   ▼
┌──────┐  │  ┌──────────┐
│ PG18 │  │  │ ChromaDB │
│ 5432 │  │  │   8000   │
└──────┘  │  └──────────┘
          ▼
   ┌─────────────┐
   │  Odoo MCP   │
   │  (AI Agent) │
   └─────────────┘
```

## Luồng dữ liệu

### Attachment (File Upload)

1. User upload file qua Odoo
2. Module `s3_attachment` ghi file lên **MinIO S3** bucket `odoo`
3. Đồng thời cache bản local tại `/var/lib/odoo/filestore/`
4. Khi cần đọc: kiểm tra local cache trước, nếu không có thì tải từ S3

### Media Serving (File Download)

1. Client request `/s3-media/path/to/file`
2. **Nginx** rewrite URL → proxy trực tiếp đến **MinIO** (bypass Odoo)
3. Nginx cache response 30 ngày
4. Các request tiếp theo serve từ Nginx cache

### WebSocket

- **Workers = 0** (development): WebSocket qua port `8069` (cùng process)
- **Workers > 0** (production): WebSocket qua port `8072` (gevent worker riêng)
- Nginx tự động route dựa trên biến `ODOO_WORKERS`

## Bảo mật

### Network Isolation

Tất cả service chạy trong Docker network `odoo-net`. Chỉ các port sau được expose ra host:

| Port | Service | Ghi chú |
|------|---------|---------|
| 80/443 | Nginx | Entry point duy nhất |
| 5432 | PostgreSQL | Tùy chọn, để debug |
| 5050 | PgAdmin | Tùy chọn, để quản lý DB |

MinIO, ChromaDB, Odoo **không** expose port ra ngoài — chỉ truy cập qua internal network.

### Privilege Management

- Odoo container start bằng `root` → `chown` thư mục → `gosu odoo` drop quyền
- PostgreSQL chạy dưới user `postgres`
- Nginx chạy dưới user `nginx`

### Database Manager

Endpoint `/web/database/` bị **block mặc định** (`ENABLE_DB_MANAGER=false`). Chỉ bật khi cần qua biến môi trường.

### SSL/TLS

- PostgreSQL: SSL certificates tự động tạo, tự gia hạn (kiểm tra mỗi 30 ngày)
- Nginx: Hỗ trợ SSL (uncomment cấu hình và mount certificate vào `nginx/ssl/`)

## Health Checks

Mỗi service có Docker healthcheck tích hợp:

| Service | Method | Interval |
|---------|--------|----------|
| PostgreSQL | `pg_isready` | 10s |
| MinIO | `mc ready local` | 10s |
| ChromaDB | TCP check port 8000 | 10s |

Service dependencies đảm bảo thứ tự khởi động đúng:

- Odoo chỉ start khi PostgreSQL **healthy**, minio-init **completed**, ChromaDB **healthy**
- Nginx chỉ start khi Odoo đã chạy
