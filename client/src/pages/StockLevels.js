import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function StockLevels() {
  const [stock, setStock] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStockSummary(), api.getWarehouses()])
      .then(([stockData, warehouseData]) => {
        setStock(stockData);
        setWarehouses(warehouseData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = stock.filter((item) => {
    const matchWarehouse = selectedWarehouse === 'all' || item.warehouseId === Number(selectedWarehouse);
    const matchSearch =
      !search ||
      item.stockCode.toLowerCase().includes(search.toLowerCase()) ||
      item.stockName.toLowerCase().includes(search.toLowerCase());
    return matchWarehouse && matchSearch;
  });

  // Group by stock code for summary view
  const groupedByStock = {};
  for (const item of filtered) {
    if (!groupedByStock[item.stockCode]) {
      groupedByStock[item.stockCode] = {
        stockCode: item.stockCode,
        stockName: item.stockName,
        unit: item.unit,
        mainGroup: item.mainGroup,
        warehouses: [],
        totalStock: 0,
      };
    }
    if (item.currentStock > 0) {
      groupedByStock[item.stockCode].warehouses.push({
        warehouseId: item.warehouseId,
        warehouseName: item.warehouseName,
        currentStock: item.currentStock,
      });
      groupedByStock[item.stockCode].totalStock += item.currentStock;
    }
  }
  const stockList = Object.values(groupedByStock);

  if (loading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Stok Seviyeleri</h2>
        <p>Mikro ERP depo bazlı stok durumu</p>
      </div>

      <div className="filters">
        <input
          className="search-box"
          placeholder="Stok kodu veya adı ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className={`filter-btn ${selectedWarehouse === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedWarehouse('all')}
        >
          Tüm Depolar
        </button>
        {warehouses.map((wh) => (
          <button
            key={wh.warehouseId}
            className={`filter-btn ${selectedWarehouse === String(wh.warehouseId) ? 'active' : ''}`}
            onClick={() => setSelectedWarehouse(String(wh.warehouseId))}
          >
            {wh.warehouseName}
          </button>
        ))}
      </div>

      <div className="stats-grid">
        <div className="stat-card info">
          <div className="label">Toplam Stok Kalemi</div>
          <div className="value">{stockList.length}</div>
        </div>
        <div className="stat-card success">
          <div className="label">Aktif Depo</div>
          <div className="value">{warehouses.length}</div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Stok Kodu</th>
            <th>Stok Adı</th>
            <th>Grup</th>
            <th>Birim</th>
            <th>Toplam Stok</th>
            <th>Depo Dağılımı</th>
          </tr>
        </thead>
        <tbody>
          {stockList.map((item) => (
            <tr key={item.stockCode}>
              <td><span className="stock-code">{item.stockCode}</span></td>
              <td>{item.stockName}</td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{item.mainGroup}</td>
              <td>{item.unit}</td>
              <td style={{ fontWeight: 600 }}>{item.totalStock.toLocaleString('tr-TR')}</td>
              <td>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {item.warehouses.map((wh) => (
                    <span key={wh.warehouseId} className="warehouse-tag" style={{ fontSize: '11px' }}>
                      {wh.warehouseName}: {wh.currentStock.toLocaleString('tr-TR')}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockLevels;
