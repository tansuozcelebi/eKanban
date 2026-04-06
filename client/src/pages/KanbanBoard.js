import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

function KanbanBoard() {
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editCard, setEditCard] = useState(null);

  const loadCards = useCallback(() => {
    api.getKanbanCards().then(setCards).catch(() => {});
  }, []);

  useEffect(() => { loadCards(); }, [loadCards]);

  const filtered = filter === 'all' ? cards : cards.filter((c) => c.status === filter);

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kanban kartını silmek istediğinize emin misiniz?')) return;
    await api.deleteKanbanCard(id);
    loadCards();
  };

  const handleEdit = (card) => {
    setEditCard(card);
    setShowModal(true);
  };

  const statusCounts = {
    all: cards.length,
    critical: cards.filter((c) => c.status === 'critical').length,
    warning: cards.filter((c) => c.status === 'warning').length,
    ok: cards.filter((c) => c.status === 'ok').length,
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Kanban Panosu</h2>
          <p>Stok seviye takibi ve kanban kartları</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditCard(null); setShowModal(true); }}>
          + Yeni Kart
        </button>
      </div>

      <div className="filters">
        {[
          ['all', `Tümü (${statusCounts.all})`],
          ['critical', `Kritik (${statusCounts.critical})`],
          ['warning', `Uyarı (${statusCounts.warning})`],
          ['ok', `Normal (${statusCounts.ok})`],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {filtered.map((card) => (
          <div key={card.id} className={`kanban-card ${card.status}`}>
            <div className="card-header">
              <span className="stock-code">{card.stockCode}</span>
              <span className={`status-badge ${card.status}`}>
                {card.status === 'critical' ? 'KRİTİK' : card.status === 'warning' ? 'UYARI' : 'NORMAL'}
              </span>
            </div>
            <div className="stock-name">{card.stockName}</div>
            <span className="warehouse-tag">{card.warehouseName}</span>

            <div className="card-details" style={{ marginTop: '14px' }}>
              <div className="detail-item">
                <span className="detail-label">Mevcut Stok</span>
                <span className="detail-value">{card.currentStock} {card.unit}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Min / Maks</span>
                <span className="detail-value">{card.minLevel} / {card.maxLevel}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sipariş Noktası</span>
                <span className="detail-value">{card.reorderPoint} {card.unit}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Doluluk</span>
                <span className="detail-value">
                  {Math.round((card.currentStock / card.maxLevel) * 100)}%
                </span>
              </div>
            </div>

            <div className="progress-bar" style={{ marginTop: '12px' }}>
              <div
                className={`fill ${card.status}`}
                style={{ width: `${Math.min((card.currentStock / card.maxLevel) * 100, 100)}%` }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
              <button className="btn btn-primary btn-sm" onClick={() => handleEdit(card)}>Düzenle</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(card.id)}>Sil</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CardModal
          card={editCard}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); loadCards(); }}
        />
      )}
    </div>
  );
}

function CardModal({ card, onClose, onSave }) {
  const [form, setForm] = useState(
    card || {
      stockCode: '', stockName: '', warehouseId: 1, warehouseName: 'Ana Depo',
      minLevel: 0, maxLevel: 0, reorderPoint: 0, currentStock: 0, unit: 'AD',
    }
  );

  const warehouseOptions = [
    { id: 1, name: 'Ana Depo' },
    { id: 2, name: 'Hammadde Deposu' },
    { id: 3, name: 'Mamul Deposu' },
    { id: 4, name: 'Yarı Mamul Deposu' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      minLevel: Number(form.minLevel),
      maxLevel: Number(form.maxLevel),
      reorderPoint: Number(form.reorderPoint),
      currentStock: Number(form.currentStock),
      warehouseId: Number(form.warehouseId),
    };
    if (card) {
      await api.updateKanbanCard(card.id, data);
    } else {
      await api.createKanbanCard(data);
    }
    onSave();
  };

  const handleWarehouseChange = (e) => {
    const wh = warehouseOptions.find((w) => w.id === Number(e.target.value));
    setForm({ ...form, warehouseId: wh.id, warehouseName: wh.name });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{card ? 'Kanban Kartı Düzenle' : 'Yeni Kanban Kartı'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Stok Kodu</label>
              <input
                value={form.stockCode}
                onChange={(e) => setForm({ ...form, stockCode: e.target.value })}
                placeholder="HM-001"
                required
              />
            </div>
            <div className="form-group">
              <label>Birim</label>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <option value="AD">AD (Adet)</option>
                <option value="KG">KG (Kilogram)</option>
                <option value="MT">MT (Metre)</option>
                <option value="LT">LT (Litre)</option>
                <option value="M2">M2 (Metrekare)</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Stok Adı</label>
            <input
              value={form.stockName}
              onChange={(e) => setForm({ ...form, stockName: e.target.value })}
              placeholder="Malzeme adı"
              required
            />
          </div>
          <div className="form-group">
            <label>Depo</label>
            <select value={form.warehouseId} onChange={handleWarehouseChange}>
              {warehouseOptions.map((wh) => (
                <option key={wh.id} value={wh.id}>{wh.name}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Minimum Seviye</label>
              <input type="number" value={form.minLevel} onChange={(e) => setForm({ ...form, minLevel: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Maksimum Seviye</label>
              <input type="number" value={form.maxLevel} onChange={(e) => setForm({ ...form, maxLevel: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Sipariş Noktası</label>
              <input type="number" value={form.reorderPoint} onChange={(e) => setForm({ ...form, reorderPoint: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Mevcut Stok</label>
              <input type="number" value={form.currentStock} onChange={(e) => setForm({ ...form, currentStock: e.target.value })} required />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn" style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }} onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="btn btn-primary">
              {card ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default KanbanBoard;
