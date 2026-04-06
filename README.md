# e-Kanban | Mikro ERP Entegrasyonu

Mikro ERP sistemindeki operasyon listelerini ve depo bazlı stok seviyelerini kullanarak kanban yönetimi sağlayan web uygulaması.

## Özellikler

- **Dashboard** - Kanban kart durumu, uyarılar, depo listesi ve son operasyonlar
- **Kanban Panosu** - Min/maks seviye, sipariş noktası ve otomatik durum takibi olan kanban kartları
- **Stok Seviyeleri** - Mikro ERP'den çekilen depo bazlı stok durumu ve arama
- **Operasyonlar** - Üretim operasyon listeleri ve iş emirleri takibi

## Teknoloji

- **Backend:** Node.js, Express, mssql (Mikro ERP SQL Server bağlantısı)
- **Frontend:** React, React Router
- **Veritabanı:** Mikro ERP SQL Server (STOKLAR, STOK_HAREKETLERI, DEPOLAR, URETIM tabloları)

## Kurulum

```bash
# Bağımlılıkları yükle
npm run install:all

# Mikro ERP veritabanı ayarlarını yapılandır
cp server/.env.example server/.env
# server/.env dosyasını düzenle

# Geliştirme modunda çalıştır (sunucu + istemci)
npm run dev
```

## Yapılandırma

`server/.env` dosyasında Mikro ERP SQL Server bağlantı ayarlarını yapın:

```
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your_password
DB_NAME=MikroDB_V16
```

> Mikro ERP veritabanı bağlantısı olmadan uygulama demo verilerle çalışır.

## API Endpointleri

| Endpoint | Açıklama |
|---|---|
| `GET /api/stock` | Tüm stok seviyeleri |
| `GET /api/stock/warehouse/:id` | Depo bazlı stok |
| `GET /api/stock/search?q=` | Stok arama |
| `GET /api/warehouses` | Depo listesi |
| `GET /api/operations` | Operasyon listeleri |
| `GET /api/operations/work-orders` | İş emirleri |
| `GET /api/kanban` | Kanban kartları |
| `POST /api/kanban` | Yeni kanban kartı |
| `PUT /api/kanban/:id` | Kanban kartı güncelle |
| `DELETE /api/kanban/:id` | Kanban kartı sil |
