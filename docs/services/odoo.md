# Odoo

Odoo 19.0 ERP — service chính của stack.

## Dockerfile

```dockerfile
FROM odoo:19.0

USER root
RUN apt-get update \
 && apt-get install -y --no-install-recommends gettext-base gosu \
 && rm -rf /var/lib/apt/lists/*
RUN pip3 install --no-cache-dir --break-system-packages boto3
```

**Packages bổ sung:**
- `gettext-base` — cung cấp `envsubst` để render config template
- `gosu` — drop quyền root → user `odoo` tại runtime
- `boto3` — AWS S3 client cho module `s3_attachment`

## Entrypoint

Entrypoint thực hiện các bước:

1. **S3 Init** — Chờ MinIO sẵn sàng, tạo bucket nếu chưa có (30 retries)
2. **Defaults** — Set giá trị mặc định cho tất cả biến môi trường
3. **Render config** — `envsubst` thay thế `$VAR` trong `odoo.conf.template` → `odoo.conf`
4. **Permissions** — `chown -R odoo:odoo` thư mục data
5. **Runtime flags** — Thêm `--init`, `--update`, `--dev` nếu có
6. **Drop privileges** — `exec gosu odoo odoo --config=...`

## Config Template

File `odoo.conf` là template với các biến `$VAR` được thay thế tại runtime. Điều này cho phép cấu hình hoàn toàn qua biến môi trường.

Ví dụ:
```ini
db_host = $DB_HOST        # → postgres
db_user = $DB_USER        # → odoo
workers = $WORKERS        # → 0
```

## Volumes

| Host | Container | Mục đích |
|------|-----------|---------|
| `./odoo/data` | `/var/lib/odoo` | Filestore, sessions, addons |
| `./odoo/addons` | `/mnt/extra-addons` | Custom addons |
| `./odoo/log` | `/var/log/odoo` | Log files |

## Custom Addons

### S3 Attachment Storage

Module `s3_attachment` tự động lưu attachment lên MinIO S3:

- **Upload**: Ghi cả local + S3
- **Download**: Kiểm tra local cache → nếu miss, tải từ S3
- **Delete**: Xóa cả S3 + local
- **MIME detection**: Tự động detect content-type

Module override 4 methods của `ir.attachment`:
- `_file_read()` — fetch từ S3 nếu không có local
- `_file_write()` — upload lên S3 sau khi ghi local
- `_file_delete()` — xóa trên S3
- `_to_http_stream()` — đảm bảo file có local trước khi stream

### Thêm addon mới

Đặt addon vào thư mục `odoo/addons/`:

```
odoo/addons/
├── s3_attachment/
└── my_custom_module/
    ├── __init__.py
    ├── __manifest__.py
    └── models/
```

Sau đó init hoặc update:

```ini
# Lần đầu
ODOO_INIT=my_custom_module

# Cập nhật
ODOO_UPDATE=my_custom_module
```

## Dev Mode

Bật hot-reload cho development:

```ini
ODOO_DEV=reload,qweb,xml
```
