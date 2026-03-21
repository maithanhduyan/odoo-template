# Giới thiệu

**Odoo Template** là một bộ Docker Compose hoàn chỉnh để triển khai Odoo 19 với đầy đủ dịch vụ hỗ trợ, sẵn sàng cho môi trường production.

## Tại sao sử dụng template này?

- **Một lệnh duy nhất** `docker compose up -d` để khởi chạy toàn bộ stack
- **Cấu hình qua biến môi trường** — không cần sửa file config
- **Template-based config** — `odoo.conf` được render tại runtime bằng `envsubst`
- **S3 storage tích hợp** — attachment lưu trên MinIO, phục vụ trực tiếp qua Nginx
- **AI-ready** — ChromaDB vector database + MCP server cho AI agents

## Dịch vụ bao gồm

| Dịch vụ | Mô tả | Port mặc định |
|---------|--------|---------------|
| **Odoo 19** | ERP chính | 8069, 8072 |
| **PostgreSQL 18** | Database với pgvector + SSL | 5432 |
| **Nginx** | Reverse proxy + cache | 80, 443 |
| **MinIO** | S3-compatible object storage | 9000, 9001 |
| **ChromaDB** | Vector database cho AI | 8000 |
| **PgAdmin** | Quản lý database qua web | 5050 |
| **Open WebUI** | Giao diện chat LLM | — |
| **Odoo MCP** | AI agent integration | — |

## Yêu cầu

- **Docker** >= 24.0
- **Docker Compose** >= 2.20
- **RAM** >= 4 GB (khuyến nghị 8 GB cho production)
- **Disk** >= 20 GB
