# MinIO (S3)

MinIO cung cấp S3-compatible object storage cho Odoo filestore.

## Buckets

Container `minio-init` tự động tạo 2 bucket khi khởi động:

| Bucket | Quyền truy cập | Mục đích |
|--------|----------------|---------|
| `odoo` | Public (anonymous download) | Filestore — images, attachments |
| `odoo-configs` | Private | Config files nhạy cảm |

## Tích hợp với Odoo

Module `s3_attachment` trong Odoo tự động:

1. **Upload** attachment lên bucket `odoo`
2. **Cache local** copy tại `/var/lib/odoo/filestore/`
3. **Serve** qua Nginx tại `/s3-media/` (bypass Odoo Python)

## Ports

| Port | Mục đích | Expose |
|------|---------|--------|
| 9000 | S3 API | Internal only |
| 9001 | Web Console | Internal only |

Cả 2 port chỉ truy cập nội bộ trong Docker network. Để truy cập console từ bên ngoài, thêm port mapping vào `docker-compose.yaml`:

```yaml
minio:
  ports:
    - "9001:9001"  # Console
```

## Biến môi trường

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `MINIO_ROOT_USER` | `minioadmin` | Admin username |
| `MINIO_ROOT_PASSWORD` | `minioadmin` | Admin password |
| `S3_BUCKET` | `odoo` | Tên bucket chính |

## Data

Data lưu tại `minio/data/` (bind mount). Backup bằng cách copy thư mục này hoặc dùng `mc mirror`.
