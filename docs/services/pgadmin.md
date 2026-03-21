# PgAdmin

PgAdmin 4 — giao diện web để quản lý PostgreSQL.

## Cấu hình

Server PostgreSQL được cấu hình sẵn trong `pgadmin/servers.json`:

```json
{
  "Servers": {
    "1": {
      "Name": "Odoo PostgreSQL",
      "Host": "postgres",
      "Port": 5432,
      "MaintenanceDB": "odoo",
      "Username": "odoo",
      "SSLMode": "prefer"
    }
  }
}
```

Khi đăng nhập PgAdmin lần đầu, server "Odoo PostgreSQL" đã xuất hiện sẵn — chỉ cần nhập password.

## Truy cập

- **URL**: `http://localhost:5050`
- **Email**: `admin@example.com` (mặc định)
- **Password**: `admin` (mặc định)

## Biến môi trường

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `PGADMIN_DEFAULT_EMAIL` | `admin@example.com` | Email đăng nhập |
| `PGADMIN_DEFAULT_PASSWORD` | `admin` | Mật khẩu |
| `PGADMIN_PORT` | `5050` | Web port |

::: warning Production
Đổi email và password mặc định trước khi triển khai production.
:::
