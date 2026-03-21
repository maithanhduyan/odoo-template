# Odoo MCP

Model Context Protocol (MCP) server — cho phép AI agents truy vấn dữ liệu Odoo qua JSON-RPC.

## Kiến trúc

```
AI Agent (VS Code, ChatGPT, ...) → MCP Protocol → Odoo MCP Server → JSON-RPC → Odoo
```

MCP server cung cấp các tools read-only để AI agents có thể:
- Truy vấn doanh thu, bán hàng
- Kiểm tra tồn kho
- Xem báo cáo tài chính
- Phân tích nhân sự, CRM

## Tools có sẵn

### Doanh thu & Bán hàng
| Tool | Mô tả |
|------|-------|
| `get_revenue_summary` | Doanh thu theo kỳ, nhóm theo ngày/tháng/quý |
| `get_top_products` | Sản phẩm bán chạy theo doanh thu hoặc số lượng |
| `get_sales_orders` | Danh sách đơn hàng chi tiết |

### Tồn kho
| Tool | Mô tả |
|------|-------|
| `get_inventory_summary` | Tồn kho theo kho hàng |
| `get_low_stock_alerts` | Cảnh báo hàng dưới reorder point |
| `get_stock_valuation` | Giá trị tồn kho |

### Tài chính
| Tool | Mô tả |
|------|-------|
| `get_profit_loss` | Báo cáo lãi/lỗ |
| `get_accounts_receivable` | Công nợ phải thu |
| `get_expense_breakdown` | Chi phí theo danh mục |

### Nhân sự
| Tool | Mô tả |
|------|-------|
| `get_employee_summary` | Thống kê nhân sự |
| `get_payroll_summary` | Chi phí lương |
| `get_attendance_summary` | Chấm công & nghỉ phép |

### CRM & Dashboard
| Tool | Mô tả |
|------|-------|
| `get_crm_pipeline` | Pipeline bán hàng theo giai đoạn |
| `get_kpi_dashboard` | Dashboard tổng hợp cho lãnh đạo |

### Generic
| Tool | Mô tả |
|------|-------|
| `search_records` | Tìm kiếm linh hoạt trên bất kỳ model |
| `get_model_fields` | Xem schema của model |

## Cấu hình

MCP server kết nối Odoo qua JSON-RPC, cấu hình trong VS Code:

```json
{
  "servers": {
    "odoo-mcp": {
      "command": "python",
      "args": ["server.py"],
      "cwd": "./odoo-mcp",
      "env": {
        "ODOO_URL": "http://localhost:8069",
        "ODOO_DB": "odoo",
        "ODOO_USERNAME": "admin",
        "ODOO_PASSWORD": "admin"
      }
    }
  }
}
```

## Dependencies

```
mcp[cli]>=1.9.0
httpx>=0.28.0
```

::: info
Tất cả tools đều READ-ONLY. MCP server không thể sửa đổi dữ liệu trên Odoo. Tiền tệ mặc định là VND.
:::
