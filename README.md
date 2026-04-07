# eKanban — Hydraulic Tank Manufacturing Lean eKanban

> **Mikro ERP entegrasyonu ile hidrolik tank üretimi için yalın eKanban yönetim sistemi.**
> Lean eKanban management system for hydraulic tank manufacturing with Mikro ERP integration.

---

## İçindekiler / Table of Contents

- [Genel Bakış / Overview](#genel-bakış--overview)
- [Özellikler / Features](#özellikler--features)
- [Teknoloji / Technology Stack](#teknoloji--technology-stack)
- [Kurulum / Setup](#kurulum--setup)
- [Yapılandırma / Configuration](#yapılandırma--configuration)
- [API Endpointleri / API Endpoints](#api-endpointleri--api-endpoints)
- [Proje Yapısı / Project Structure](#proje-yapısı--project-structure)

---

## Genel Bakış / Overview

Bu uygulama, Mikro ERP sistemindeki operasyon listelerini ve depo bazlı stok seviyelerini kullanarak hidrolik tank üretim süreçlerini kanban panosu üzerinden yönetir.

This application manages hydraulic tank manufacturing processes through a Kanban board, using operation lists and warehouse-based stock levels from the Mikro ERP system.

---

## Özellikler / Features

- **Dashboard** — Kanban kart durumu, uyarılar, depo listesi ve son operasyonlar / Kanban card status, alerts, warehouse list and recent operations
- **Kanban Panosu / Kanban Board** — Min/maks seviye, sipariş noktası ve otomatik durum takibi / Min/max level, reorder point and automatic status tracking
- **Stok Seviyeleri / Stock Levels** — Mikro ERP'den çekilen depo bazlı stok durumu ve arama / Warehouse-based stock status pulled from Mikro ERP with search
- **Operasyonlar / Operations** — Üretim operasyon listeleri ve iş emirleri takibi / Production operation lists and work order tracking

---

## Teknoloji / Technology Stack

| Katman / Layer | Teknoloji / Technology |
|---|---|
| **Backend** | Node.js, Express |
| **Veritabanı / Database** | Mikro ERP SQL Server (mssql) |
| **Frontend** | React, React Router |
| **Tablolar / DB Tables** | STOKLAR, STOK_HAREKETLERI, DEPOLAR, URETIM |

---

## Kurulum / Setup

```bash
# 1. Bağımlılıkları yükle / Install dependencies
npm run install:all

# 2. Ortam değişkenlerini yapılandır / Configure environment variables
cp server/.env.example server/.env
# server/.env dosyasını düzenleyin / Edit server/.env

# 3. Geliştirme modunda çalıştır / Run in development mode
npm run dev
```

> **Not / Note:** Mikro ERP veritabanı bağlantısı olmadan uygulama otomatik olarak demo verilerle çalışır.
> The application automatically falls back to demo data when the Mikro ERP database is unavailable.

---

## Yapılandırma / Configuration

`server/.env` dosyasında Mikro ERP SQL Server bağlantı bilgilerini ayarlayın:

```env
# Mikro ERP SQL Server Connection
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your_password
DB_NAME=MikroDB_V16

# Server
PORT=5000
```

---

## API Endpointleri / API Endpoints

| Endpoint | Açıklama / Description |
|---|---|
| `GET /api/health` | Sunucu durumu / Server health check |
| `GET /api/stock` | Tüm stok seviyeleri / All stock levels |
| `GET /api/stock/warehouse/:id` | Depo bazlı stok / Warehouse-based stock |
| `GET /api/stock/search?q=` | Stok arama / Stock search |
| `GET /api/warehouses` | Depo listesi / Warehouse list |
| `GET /api/operations` | Operasyon listeleri / Operation lists |
| `GET /api/operations/work-orders` | İş emirleri / Work orders |
| `GET /api/kanban` | Kanban kartları / Kanban cards |
| `POST /api/kanban` | Yeni kanban kartı / Create kanban card |
| `PUT /api/kanban/:id` | Kanban kartı güncelle / Update kanban card |
| `DELETE /api/kanban/:id` | Kanban kartı sil / Delete kanban card |

---

## Proje Yapısı / Project Structure

```
eKanban/
├── client/                      # React frontend
│   ├── public/
│   └── src/
│       ├── App.js               # Ana uygulama / Main app
│       ├── pages/
│       │   ├── Dashboard.js     # Ana panel / Main dashboard
│       │   ├── KanbanBoard.js   # Kanban panosu / Kanban board
│       │   ├── Operations.js    # Operasyonlar / Operations
│       │   └── StockLevels.js   # Stok seviyeleri / Stock levels
│       └── services/
│           └── api.js           # API istemcisi / API client
├── server/                      # Express backend
│   └── src/
│       ├── index.js             # Sunucu girişi / Server entry
│       ├── config/
│       │   ├── database.js      # SQL Server bağlantısı / SQL Server connection
│       │   └── mikroQueries.js  # Mikro ERP sorguları / Mikro ERP queries
│       ├── middleware/
│       │   └── dbFallback.js    # Demo veri yedek / Demo data fallback
│       └── routes/
│           ├── kanban.js        # Kanban API
│           ├── stock.js         # Stok API / Stock API
│           ├── operations.js    # Operasyon API / Operations API
│           └── warehouses.js    # Depo API / Warehouse API
├── package.json                 # Kök bağımlılıklar / Root dependencies
└── README.md
```

---

## npm Komutları / npm Scripts

| Komut / Command | Açıklama / Description |
|---|---|
| `npm run dev` | Sunucu + istemci geliştirme modu / Server + client dev mode |
| `npm run server` | Sadece sunucu / Server only |
| `npm run client` | Sadece istemci / Client only |
| `npm run install:all` | Tüm bağımlılıkları yükle / Install all dependencies |
| `npm run build` | İstemci production build / Client production build |
