import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'

export default defineConfig({
  title: 'Odoo Template',
  description: 'Tài liệu triển khai Odoo với Docker — production-ready',
  lang: 'vi-VN',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  markdown: {
    config: (md) => {
      md.use(mathjax3)
    },
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Hướng dẫn', link: '/guide/', activeMatch: '/guide/' },
      { text: 'Cấu hình', link: '/config/', activeMatch: '/config/' },
      { text: 'Dịch vụ', link: '/services/odoo', activeMatch: '/services/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Bắt đầu',
          items: [
            { text: 'Giới thiệu', link: '/guide/' },
            { text: 'Cài đặt nhanh', link: '/guide/quickstart' },
            { text: 'Kiến trúc hệ thống', link: '/guide/architecture' },
          ],
        },
      ],
      '/config/': [
        {
          text: 'Cấu hình',
          items: [
            { text: 'Biến môi trường', link: '/config/' },
            { text: 'Triển khai Production', link: '/config/production' },
          ],
        },
      ],
      '/services/': [
        {
          text: 'Dịch vụ',
          items: [
            { text: 'Odoo', link: '/services/odoo' },
            { text: 'PostgreSQL', link: '/services/postgres' },
            { text: 'Nginx', link: '/services/nginx' },
            { text: 'MinIO (S3)', link: '/services/minio' },
            { text: 'ChromaDB', link: '/services/chromadb' },
            { text: 'PgAdmin', link: '/services/pgadmin' },
            { text: 'Odoo MCP', link: '/services/odoo-mcp' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
      label: 'Mục lục',
    },

    lastUpdated: {
      text: 'Cập nhật lần cuối',
    },

    docFooter: {
      prev: 'Trang trước',
      next: 'Trang sau',
    },
  },
})
