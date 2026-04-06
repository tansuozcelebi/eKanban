import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function Operations() {
  const [operations, setOperations] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('operations');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getOperations(), api.getWorkOrders()])
      .then(([ops, wos]) => {
        setOperations(ops);
        setWorkOrders(wos);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getStatusClass = (status) => {
    if (status === 'Tamamlandı') return 'ok';
    if (status === 'Devam Ediyor') return 'warning';
    return 'critical';
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;

  const filteredOps = statusFilter === 'all'
    ? operations
    : operations.filter((op) => op.status === statusFilter);

  const filteredWOs = statusFilter === 'all'
    ? workOrders
    : workOrders.filter((wo) => wo.status === statusFilter);

  const statuses = ['all', 'Devam Ediyor', 'Planlandı', 'Tamamlandı'];

  return (
    <div>
      <div className="page-header">
        <h2>Operasyonlar</h2>
        <p>Mikro ERP üretim operasyonları ve iş emirleri</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card info">
          <div className="label">Toplam Operasyon</div>
          <div className="value">{operations.length}</div>
        </div>
        <div className="stat-card warning">
          <div className="label">Devam Eden</div>
          <div className="value">{operations.filter((o) => o.status === 'Devam Ediyor').length}</div>
        </div>
        <div className="stat-card success">
          <div className="label">Tamamlanan</div>
          <div className="value">{operations.filter((o) => o.status === 'Tamamlandı').length}</div>
        </div>
        <div className="stat-card critical">
          <div className="label">İş Emirleri</div>
          <div className="value">{workOrders.length}</div>
        </div>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${activeTab === 'operations' ? 'active' : ''}`}
          onClick={() => setActiveTab('operations')}
        >
          Operasyon Listesi
        </button>
        <button
          className={`filter-btn ${activeTab === 'workorders' ? 'active' : ''}`}
          onClick={() => setActiveTab('workorders')}
        >
          İş Emirleri
        </button>
        <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
        {statuses.map((s) => (
          <button
            key={s}
            className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s === 'all' ? 'Tümü' : s}
          </button>
        ))}
      </div>

      {activeTab === 'operations' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Operasyon No</th>
              <th>Operasyon</th>
              <th>Ürün Kodu</th>
              <th>Ürün Adı</th>
              <th>İş Merkezi</th>
              <th>Planlanan</th>
              <th>Tamamlanan</th>
              <th>İlerleme</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {filteredOps.map((op) => {
              const progress = op.plannedQty > 0 ? Math.round((op.completedQty / op.plannedQty) * 100) : 0;
              return (
                <tr key={op.operationId}>
                  <td><span className="stock-code">{op.operationId}</span></td>
                  <td style={{ fontWeight: 600 }}>{op.operationName}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{op.productCode}</td>
                  <td>{op.productName}</td>
                  <td>
                    <span className="warehouse-tag">{op.workCenter}</span>
                  </td>
                  <td>{op.plannedQty}</td>
                  <td>{op.completedQty}</td>
                  <td style={{ minWidth: '120px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar" style={{ flex: 1, margin: 0 }}>
                        <div
                          className={`fill ${progress >= 100 ? 'ok' : progress >= 50 ? 'warning' : 'critical'}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '36px' }}>{progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(op.status)}`}>
                      {op.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {activeTab === 'workorders' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>İş Emri No</th>
              <th>Ürün Kodu</th>
              <th>Ürün Adı</th>
              <th>Planlanan</th>
              <th>Tamamlanan</th>
              <th>Başlangıç</th>
              <th>Termin</th>
              <th>İlerleme</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {filteredWOs.map((wo) => {
              const progress = wo.plannedQty > 0 ? Math.round((wo.completedQty / wo.plannedQty) * 100) : 0;
              return (
                <tr key={wo.workOrderId}>
                  <td><span className="stock-code">{wo.workOrderNo}</span></td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{wo.productCode}</td>
                  <td style={{ fontWeight: 600 }}>{wo.productName}</td>
                  <td>{wo.plannedQty}</td>
                  <td>{wo.completedQty}</td>
                  <td style={{ fontSize: '12px' }}>{wo.startDate}</td>
                  <td style={{ fontSize: '12px' }}>{wo.dueDate}</td>
                  <td style={{ minWidth: '120px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar" style={{ flex: 1, margin: 0 }}>
                        <div
                          className={`fill ${progress >= 100 ? 'ok' : progress >= 50 ? 'warning' : 'critical'}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '36px' }}>{progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(wo.status)}`}>
                      {wo.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Operations;
