import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, critical: 0, warning: 0, ok: 0 });
  const [alerts, setAlerts] = useState([]);
  const [operations, setOperations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    api.getKanbanStats().then(setStats).catch(() => {});
    api.getKanbanAlerts().then(setAlerts).catch(() => {});
    api.getOperations().then((ops) => setOperations(ops.slice(0, 5))).catch(() => {});
    api.getWarehouses().then(setWarehouses).catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>e-Kanban sistem durumu ve Mikro ERP verileri</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card info">
          <div className="label">Toplam Kanban Kartı</div>
          <div className="value">{stats.total}</div>
        </div>
        <div className="stat-card critical">
          <div className="label">Kritik Seviye</div>
          <div className="value">{stats.critical}</div>
        </div>
        <div className="stat-card warning">
          <div className="label">Uyarı Seviyesi</div>
          <div className="value">{stats.warning}</div>
        </div>
        <div className="stat-card success">
          <div className="label">Normal Seviye</div>
          <div className="value">{stats.ok}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="section-title" style={{ marginBottom: 0 }}>Uyarılar</h3>
            <Link to="/kanban" className="btn btn-primary btn-sm">Tümünü Gör</Link>
          </div>
          {alerts.length === 0 ? (
            <div className="kanban-card ok" style={{ textAlign: 'center', padding: '24px' }}>
              Tüm stok seviyeleri normal
            </div>
          ) : (
            alerts.map((card) => (
              <div key={card.id} className={`kanban-card ${card.status}`} style={{ marginBottom: '12px' }}>
                <div className="card-header">
                  <div>
                    <span className="stock-code">{card.stockCode}</span>
                    <div className="stock-name" style={{ marginTop: '6px' }}>{card.stockName}</div>
                  </div>
                  <span className={`status-badge ${card.status}`}>
                    {card.status === 'critical' ? 'KRİTİK' : 'UYARI'}
                  </span>
                </div>
                <div className="card-details">
                  <div className="detail-item">
                    <span className="detail-label">Mevcut</span>
                    <span className="detail-value">{card.currentStock} {card.unit}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Min Seviye</span>
                    <span className="detail-value">{card.minLevel} {card.unit}</span>
                  </div>
                </div>
                <div className="progress-bar" style={{ marginTop: '12px' }}>
                  <div
                    className={`fill ${card.status}`}
                    style={{ width: `${Math.min((card.currentStock / card.maxLevel) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <div className="section">
            <h3 className="section-title">Depolar</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {warehouses.map((wh) => (
                <div key={wh.warehouseId} className="kanban-card" style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{wh.warehouseName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{wh.address}</div>
                    </div>
                    <span className="stock-code">#{wh.warehouseId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="section-title" style={{ marginBottom: 0 }}>Son Operasyonlar</h3>
              <Link to="/operations" className="btn btn-primary btn-sm">Tümünü Gör</Link>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Operasyon</th>
                  <th>Ürün</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((op) => (
                  <tr key={op.operationId}>
                    <td>{op.operationName}</td>
                    <td style={{ fontSize: '12px' }}>{op.productName}</td>
                    <td>
                      <span className={`status-badge ${
                        op.status === 'Tamamlandı' ? 'ok' : op.status === 'Devam Ediyor' ? 'warning' : 'critical'
                      }`}>
                        {op.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
