# ChromaDB

ChromaDB — vector database cho AI embeddings và semantic search.

## Cấu hình

```yaml
chromadb:
  image: chromadb/chroma:latest
  expose:
    - "8000"
  environment:
    - IS_PERSISTENT=TRUE
    - ANONYMIZED_TELEMETRY=FALSE
```

- **Persistent storage**: Data lưu tại `chromadb/data/`
- **Telemetry**: Đã tắt
- **Port 8000**: Chỉ truy cập nội bộ

## Sử dụng với Odoo

Odoo kết nối ChromaDB qua biến môi trường:

```ini
CHROMADB_HOST=chromadb
CHROMADB_PORT=8000
```

ChromaDB dùng để lưu embeddings cho các tính năng AI như:
- Semantic search trong sản phẩm, tài liệu
- RAG (Retrieval-Augmented Generation) cho chatbot
- Tìm kiếm tương tự

## Health Check

```yaml
healthcheck:
  test: ["CMD-SHELL", "bash -c 'echo > /dev/tcp/localhost/8000'"]
  interval: 10s
  timeout: 5s
  retries: 5
```

Odoo chỉ start khi ChromaDB đã healthy.
