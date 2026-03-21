# Cài đặt nhanh

## 1. Clone repository

```bash
git clone <repo-url> odoo-template
cd odoo-template
```

## 2. Tạo file `.env`

Mỗi service có file `.env.example` làm mẫu. Copy và chỉnh sửa:

```bash
# Odoo
cp odoo/.env.example odoo/.env

# PostgreSQL
cp postgres/.env.example postgres/.env
```

::: tip Lần đầu triển khai
Đảm bảo `ODOO_INIT=base` trong `odoo/.env` để khởi tạo database. Sau lần chạy đầu tiên, comment hoặc xóa dòng này.
:::

## 3. Khởi chạy

```bash
docker compose up -d --build
```

Thứ tự khởi động được Docker Compose quản lý tự động:

```
PostgreSQL (healthy) → MinIO (healthy) → minio-init (tạo bucket)
                     → ChromaDB (healthy)
                                        → Odoo → Nginx
```

## 4. Truy cập

| Dịch vụ | URL |
|---------|-----|
| Odoo | `http://localhost` |
| PgAdmin | `http://localhost:5050` |
| MinIO Console | Chỉ truy cập nội bộ (port 9001) |

## 5. Khởi tạo database lần đầu

Nếu database chưa được tạo, set biến môi trường trong `odoo/.env`:

```ini
ODOO_INIT=base
```

Sau khi Odoo khởi tạo xong, **comment hoặc xóa** dòng `ODOO_INIT` để tránh re-init mỗi lần restart:

```ini
# ODOO_INIT=base
```

## Các lệnh hữu ích

```bash
# Xem log
docker compose logs -f odoo

# Restart một service
docker compose restart odoo

# Rebuild và restart
docker compose up -d --build odoo

# Dừng toàn bộ
docker compose down

# Dừng và xóa volumes
docker compose down -v
```

## Cập nhật module

```bash
# Set biến ODOO_UPDATE trong odoo/.env
# Ví dụ: cập nhật module s3_attachment
ODOO_UPDATE=s3_attachment
```

Sau đó restart Odoo:

```bash
docker compose restart odoo
```
